import Model, { attr } from '@ember-data/model';

export default class CnpjModel extends Model {
  @attr address;
  @attr blocked;
  @attr economicActivities;
  @attr email;
  @attr federalTaxNumber;
  @attr issuedOn;
  @attr legalNature;
  @attr name;
  @attr openedOn;
  @attr partners;
  @attr phones;
  @attr responsableEntity;
  @attr shareCapital;
  @attr size;
  @attr status;
  @attr statusOn;
  @attr tradeName;
  @attr unit;
}
