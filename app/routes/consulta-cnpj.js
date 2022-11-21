import Route from '@ember/routing/route';

export default class CnpjRoute extends Route {
  async model(params) {
    return params;
  }

  //   setupController(controller, ...args) {
  //     super.setupController(controller, ...args);
  //     if (args[0].cnpj) {
  //       controller.parsedCnpj = args[0].cnpj;
  //       if (controller.validateCnpj(controller.cnpj)) {
  //         controller.loadedCnpj = true;
  //       }
  //       controller.queryCnpj();
  //     }
  //   }
}
