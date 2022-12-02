import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

const removeNonNumbers = (str) => {
  return str.replace(/[^0-9]/gi, '');
};

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

const validateCnpj = (cnpj) => {
  if (!cnpj) return false;

  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj == '') return false;

  if (cnpj.length != 14) return false;

  if (
    cnpj == '00000000000000' ||
    cnpj == '11111111111111' ||
    cnpj == '22222222222222' ||
    cnpj == '33333333333333' ||
    cnpj == '44444444444444' ||
    cnpj == '55555555555555' ||
    cnpj == '66666666666666' ||
    cnpj == '77777777777777' ||
    cnpj == '88888888888888' ||
    cnpj == '99999999999999'
  )
    return false;

  let size = cnpj.length - 2;
  let number = cnpj.substring(0, size);
  let digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += number.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result != digits.charAt(0)) return false;

  size = size + 1;
  number = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += number.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result != digits.charAt(1)) return false;

  return true;
};

const parseCnpj = (cnpj) => {
  if (cnpj != null) {
    const newCnpj = removeNonNumbers(cnpj).substring(0, 14);
    if (newCnpj.length === 0) return null;

    const returningCpnj = [...newCnpj]
      .map((e, i) => {
        switch (i) {
          case 2:
            e = `.${e}`;
            break;
          case 5:
            e = `.${e}`;
            break;
          case 8:
            e = `/${e}`;
            break;
          case 12:
            e = `-${e}`;
            break;
        }
        return e;
      })
      .join('');
    return returningCpnj;
  }
  return null;
};

export default class CnpjDataLoaderComponent extends Component {
  @service
  router;

  @service global;

  @tracked
  cnpjData = null;

  set parsedCnpj(str) {
    this.global.cnpj = parseCnpj(str);
  }

  @action
  queryCnpj(cnpj) {
    const cleanCnpj = removeNonNumbers(cnpj);
    this.parsedCnpj = cnpj;
    this.global.lastCnpj = cleanCnpj;

    if (!validateCnpj(cnpj)) {
      this.global.error = true;
      this.global.isLoading = false;
      this.router.transitionTo('consulta-cnpj-gratis.index');
      return;
    }

    if (cleanCnpj == this.global.lastCnpj || this.global.isLoading) return;

    const url = 'https://api.nfse.io/LegalEntities/Basicinfo/taxNumber/';

    //  const fetchUrl = url + cleanCnpj;
    const fetchUrl = '/api/api.json';

    this.global.isLoading = true;
    fetch(fetchUrl)
      .then((res) => {
        this.global.lastCnpj = cleanCnpj;
        if (!res.ok) {
          this.global.isLoading = false;
          console.log('CNPJ não encontrado');
          return;
        }

        return res.json();
      })
      .then((json) => {
        const data = json.legalEntity;

        if (!data) return;
        const newData = data;
        newData.address = parseAddress(data.address);
        const date = new Date(data.openedOn);
        newData.openedOn = parseDate(date);
        newData.legalNature = parseLegalNature(data.legalNature);
        newData.economicActivities = parseEconomicActivities(
          data.economicActivities
        );
        newData.shareCapital = parseShareCapital(data.shareCapital);
        newData.partners = parsePartners(data.partners);

        this.cnpjData = newData;
        setTimeout(() => (this.global.isLoading = false), 500);
      });
  }
}
