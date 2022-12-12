import RESTSerializer from '@ember-data/serializer/rest';

const parseShareCapital = (val) => {
  const numString = val.toString();

  return (
    numString
      .split('')
      .reverse()
      .map((e, i) => {
        if (i == 0) return e;
        return i % 3 == 0 ? e + '.' : e;
      })
      .reverse()
      .join('') + ',00'
  );
};

const parseEconomicActivities = (activitiesArr) => {
  const parsedActivitiesArr = activitiesArr.map((e) => {
    e.code = e.code
      .split('')
      .map((e, i) => {
        switch (i) {
          case 4:
            e = `-${e}`;
            break;
          case 5:
            e = `/${e}`;
            break;
        }
        return e;
      })
      .join('');
    return e;
  });

  const activitiesObj = {
    main: parsedActivitiesArr.filter((e) => e.isMain),
    secondary: parsedActivitiesArr.filter((e) => !e.isMain),
  };
  return activitiesObj;
};

const parseAddress = (address) => {
  const addressObj = {
    address_p1: `${address.streetSuffix ? address.streetSuffix + ' ' : ''}${
      address.street
    }, ${address.number}`,
    address_p2: `${address.district}, ${address.city.name} - ${address.state}`,
    address_p3: `CEP: ${address.postalCode}`,
  };

  return addressObj;
};

const parseLegalNature = (obj) => {
  return `${obj.code
    .split('')
    .map((e, i) => (i == 3 ? '-' + e : e))
    .join('')} - ${obj.description}`;
};

const parseDate = (date) => {
  return date.toISOString().substring(0, 10).split('-').reverse().join('/');
};

const parsePartners = (partners) => {
  const obj = {};

  partners.forEach((partner) => {
    if (!Object.keys(obj).includes(partner.qualification.code)) {
      const tempObj = {};
      tempObj.description = partner.qualification.description;
      tempObj.partners = [partner.name];
      obj[partner.qualification.code] = tempObj;
    } else {
      obj[partner.qualification.code].partners.push(partner.name);
    }
  });

  return obj;
};

export default class CnpjSerializer extends RESTSerializer {
  normalizeFindRecordResponse(
    store,
    primaryModelClass,
    payload,
    id,
    requestType
  ) {
    const data = payload.legalEntity;
    id = data.federalTaxNumber.match(/\d/g).join('');

    data.id = id;
    data.address = parseAddress(data.address);
    const date = new Date(data.openedOn);
    data.openedOn = parseDate(date);
    data.legalNature = parseLegalNature(data.legalNature);
    data.economicActivities = parseEconomicActivities(data.economicActivities);
    data.shareCapital = parseShareCapital(data.shareCapital);
    data.partners = parsePartners(data.partners);

    payload[primaryModelClass.modelName] = data;
    delete payload.legalEntity;

    return super.normalizeFindRecordResponse(
      store,
      primaryModelClass,
      payload,
      id,
      requestType
    );
  }
}
