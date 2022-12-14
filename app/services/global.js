import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class GlobalService extends Service {
  @tracked
  error = false;

  @tracked
  isLoading = false;

  @tracked
  lastCnpj = null;

  @tracked cnpj = null;

  @tracked cnpjData = null;
}
