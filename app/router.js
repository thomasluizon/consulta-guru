import EmberRouter from '@ember/routing/router';
import config from 'myapp/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}
Router.map(function () {
  this.route('consulta-cnpj', function () {
    this.route('index', { path: '/' });
    this.route('cnpj', { path: ':cnpj' });
  });
});
