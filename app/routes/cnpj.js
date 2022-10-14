import Route from '@ember/routing/route';

export default class CnpjRoute extends Route {
  async model(params) {
    let { cnpj } = params;
    return { cnpj };
  }
}
