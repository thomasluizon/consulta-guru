import { module, test } from 'qunit';
import { setupTest } from 'myapp/tests/helpers';

module('Unit | Route | consulta-cnpj/cnpj', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:consulta-cnpj/cnpj');
    assert.ok(route);
  });
});
