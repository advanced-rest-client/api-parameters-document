import { fixture, assert, aTimeout } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-parameters-document.js';

describe('<api-parameters-document>', function() {
  async function openedFixture() {
    return (await fixture(`<api-parameters-document queryopened pathopened></api-parameters-document>`));
  }

  async function narrowFixture() {
    return (await fixture(`<api-parameters-document narrow></api-parameters-document>`));
  }

  async function awareFixture() {
    return (await fixture(`<div>
      <api-parameters-document aware="test-model"></api-parameters-document>
      <raml-aware scope="test-model"></raml-aware>
      </div>`));
  }

  describe('Raml aware', () => {
    let element;
    let amf;
    before(async () => {
      amf = await AmfLoader.load(false);
    });

    beforeEach(async () => {
      const region = await awareFixture();
      element = region.querySelector('api-parameters-document');
      region.querySelector('raml-aware').api = amf;
      await aTimeout();
      element.baseUriParameters = AmfLoader.lookupServerVariables(amf);
      element.endpointParameters = AmfLoader.lookupPathParameters(amf, '/test-parameters/{feature}');
      element.queryParameters = AmfLoader.lookupQueryParameters(amf, '/people', 'get');
    });

    it('renders raml-aware', () => {
      const node = element.shadowRoot.querySelector('raml-aware');
      assert.ok(node);
    });

    it('sets amf value from aware', async () => {
      await aTimeout();
      assert.typeOf(element.amf, 'array');
    });
  });

  describe('Headers level', () => {
    let element;
    let amf;
    before(async () => {
      amf = await AmfLoader.load(false);
    });

    beforeEach(async () => {
      element = await openedFixture();
      element.amf = amf;
      element.baseUriParameters = AmfLoader.lookupServerVariables(amf);
      element.endpointParameters = AmfLoader.lookupPathParameters(amf, '/test-parameters/{feature}');
      element.queryParameters = AmfLoader.lookupQueryParameters(amf, '/people', 'get');
      await aTimeout();
    });

    it('sets default header level', () => {
      const urititle = element.shadowRoot.querySelector('.uri-parameters [role="heading"]');
      assert.equal(urititle.getAttribute('aria-level'), '2');
      const querytitle = element.shadowRoot.querySelector('.query-parameters [role="heading"]');
      assert.equal(querytitle.getAttribute('aria-level'), '2');
    });

    it('sets header level', async () => {
      element.headerLevel = 4;
      await aTimeout();
      const urititle = element.shadowRoot.querySelector('.uri-parameters [role="heading"]');
      assert.equal(urititle.getAttribute('aria-level'), '4');
      const querytitle = element.shadowRoot.querySelector('.query-parameters [role="heading"]');
      assert.equal(querytitle.getAttribute('aria-level'), '4');
    });
  });

  describe('compatibility mode', () => {
    it('sets compatibility on item when setting legacy', async () => {
      const element = await openedFixture();
      element.legacy = true;
      assert.isTrue(element.legacy, 'legacy is set');
      assert.isTrue(element.compatibility, 'compatibility is set');
    });

    it('returns compatibility value from item when getting legacy', async () => {
      const element = await openedFixture();
      element.compatibility = true;
      assert.isTrue(element.legacy, 'legacy is set');
    });
  });

  [
    ['Full AMF model', false],
    ['Compact AMF model', true]
  ].forEach((item) => {
    describe(item[0], () => {
      let element;
      let amf;

      describe('No data state', () => {
        it('Does not render params tables without data', async () => {
          element = await openedFixture();
          await aTimeout();
          const doc = element.shadowRoot.querySelector('api-type-document');
          assert.notOk(doc);
        });
      });

      describe('Base path parameters', () => {
        before(async () => {
          amf = await AmfLoader.load(item[1]);
        });

        beforeEach(async () => {
          element = await openedFixture();
          element.amf = amf;
          element.baseUriParameters = AmfLoader.lookupServerVariables(amf);
          await aTimeout();
        });

        it('Computes _effectivePathParameters', () => {
          assert.typeOf(element._effectivePathParameters, 'array');
          assert.lengthOf(element._effectivePathParameters, 2);
        });

        it('Renders uri parameters table', () => {
          const section = element.shadowRoot.querySelector('.uri-parameters');
          assert.ok(section);
        });

        it('Parameters are set on table', () => {
          const doc = element.shadowRoot.querySelector('.uri-parameters api-type-document');
          assert.isTrue(doc.type === element._effectivePathParameters);
        });

        it('Toggle button open the URI section', () => {
          const button = element.shadowRoot.querySelector('.uri-parameters .section-title-area');
          button.click();
          assert.isFalse(element.pathOpened);
        });
      });

      describe('Base path + endpoint path parameters', () => {
        before(async () => {
          amf = await AmfLoader.load(item[1]);
        });

        beforeEach(async () => {
          element = await openedFixture();
          element.amf = amf;
          element.baseUriParameters = AmfLoader.lookupServerVariables(amf);
          element.endpointParameters = AmfLoader.lookupPathParameters(amf, '/test-parameters/{feature}');
          await aTimeout();
        });

        it('Computes _effectivePathParameters', () => {
          assert.typeOf(element._effectivePathParameters, 'array');
        });

        it('_effectivePathParameters contains both parameters arrays', () => {
          // console.log(element.endpointParameters);
          assert.lengthOf(element._effectivePathParameters, 3);
        });

        it('Renders uri parameters table', () => {
          const section = element.shadowRoot.querySelector('.uri-parameters');
          assert.ok(section);
        });

        it('Query table is not', () => {
          const doc = element.shadowRoot.querySelector('.uri-parameters api-type-document');
          assert.isTrue(doc.type === element._effectivePathParameters);
        });
      });

      describe('Base path + endpoint path parameters + query parameters', () => {
        before(async () => {
          amf = await AmfLoader.load(item[1]);
        });

        beforeEach(async () => {
          element = await openedFixture();
          element.amf = amf;
          element.baseUriParameters = AmfLoader.lookupServerVariables(amf);
          element.endpointParameters = AmfLoader.lookupPathParameters(amf, '/test-parameters/{feature}');
          element.queryParameters = AmfLoader.lookupQueryParameters(amf, '/people', 'get');
          await aTimeout();
        });

        it('Renders query parameters table', () => {
          const section = element.shadowRoot.querySelector('.query-parameters');
          assert.ok(section);
        });

        it('Parameters are set on table', () => {
          const doc = element.shadowRoot.querySelector('.query-parameters api-type-document');
          assert.isTrue(doc.type === element.queryParameters);
        });

        it('Toggle button open the Query section', () => {
          const button = element.shadowRoot.querySelector('.query-parameters .section-title-area');
          button.click();
          assert.isFalse(element.queryOpened);
        });
      });

      describe('Narrow layout', () => {
        before(async () => {
          const data = await AmfLoader.load(item[1]);
          amf = data[0];
        });

        beforeEach(async () => {
          element = await narrowFixture();
          element.amf = amf;
          element.baseUriParameters = AmfLoader.lookupServerVariables(amf);
          element.endpointParameters = AmfLoader.lookupPathParameters(amf, '/people');
          element.queryParameters = AmfLoader.lookupQueryParameters(amf, '/people', 'get');
          await aTimeout();
        });

        it('Has narrow attribute', () => {
          assert.isTrue(element.hasAttribute('narrow'));
        });

        it('Narrow style is applied to the URI title', async () => {
          element.style.setProperty('--api-parameters-document-title-narrow-font-size', '16px');
          const title = element.shadowRoot.querySelector('.uri-parameters .table-title');
          const fontSize = getComputedStyle(title).fontSize;
          assert.equal(fontSize, '16px');
        });

        it('Narrow style is applied to the Query title', async () => {
          element.style.setProperty('--api-parameters-document-title-narrow-font-size', '16px');
          const title = element.shadowRoot.querySelector('.query-parameters .table-title');
          const fontSize = getComputedStyle(title).fontSize;
          assert.equal(fontSize, '16px');
        });
      });
    });
  });
});
