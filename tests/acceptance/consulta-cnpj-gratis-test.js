import { module, test } from 'qunit';
import { visit, find, waitUntil, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | consulta-cnpj-gratis', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting dynamic sub-route with correct cnpj', async function (assert) {
    await visit('/consulta-cnpj-gratis/00000000000191');

    await waitUntil(() => find('[data-test-loader]'));
    assert.ok(find('[data-test-loader]'), 'loader is rendered');

    await waitUntil(() => find('[data-test-content]'));
    assert.ok(find('[data-test-content]'), 'content is rendered');

    assert
      .dom('[data-test-federaltaxnumber]')
      .hasText(
        '00.000.000/0001-91',
        'CNPJ should be displayed correctly after rendered'
      );
  });

  test('visiting dynamic sub-route with wrong cnpj', async function (assert) {
    await visit('/consulta-cnpj-gratis/00000000000321');
    assert.deepEqual(
      currentURL(),
      '/consulta-cnpj-gratis',
      'current url is /consulta-cnpj-gratis'
    );

    assert.dom('[data-test-form]').hasClass('alert');
  });
});
