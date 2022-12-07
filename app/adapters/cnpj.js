import RESTAdapter from '@ember-data/adapter/rest';

export default class CnpjAdapter extends RESTAdapter {
  urlForFindRecord(cnpj) {
    const apiMode = false;

    return apiMode
      ? `https://api.nfse.io/LegalEntities/Basicinfo/taxNumber/${cnpj}`
      : '/api/api.json';
  }
}
