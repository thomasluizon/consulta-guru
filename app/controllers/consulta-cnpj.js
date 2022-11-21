import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

const removeNonNumbers = (str) => {
  return str.replace(/[^0-9]/gi, '');
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

export default class ConsultaCnpjController extends Controller {
  @service
  router;
  @tracked cnpj = null;
  @tracked errorState = false;

  set parsedCnpj(str) {
    this.cnpj = parseCnpj(str);
  }

  validateCnpj(cnpj) {
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
  }

  @action
  handleCnpj(e) {
    this.parsedCnpj = e.target.value;
  }

  @action
  routeCnpj(cnpj, e) {
    e.preventDefault();
    console.log(cnpj);
    if (this.validateCnpj(cnpj)) {
      this.errorState = false;
      this.router.transitionTo('consulta-cnpj.index');
      setTimeout(() => {
        this.router.transitionTo('consulta-cnpj.cnpj', cnpj);
      }, 0);
    } else {
      this.errorState = true;
    }
  }
}
