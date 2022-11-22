import Route from '@ember/routing/route';

export default class ConsultaCnpjGratisCnpjRoute extends Route {
  async model(params) {
    const { cnpj } = params;
    return cnpj;
  }
}
