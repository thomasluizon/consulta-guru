import Route from '@ember/routing/route';

export default class ConsultaCnpjCnpjRoute extends Route {
  model(params) {
    const { cnpj } = params;
    return cnpj;
  }
}
