import { fixture, assert, aTimeout, html } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-parameters-document.js';

/** @typedef {import('../').ApiParametersDocument} ApiParametersDocument */

describe('ApiParametersDocument', () => {
  /**
   * @returns {Promise<ApiParametersDocument>}
   */
  async function openedFixture() {
    return fixture(html`<api-parameters-document queryOpened pathOpened></api-parameters-document>`);
  }

  /**
   * @returns {Promise<ApiParametersDocument>}
   */
  async function narrowFixture() {
    return fixture(html`<api-parameters-document narrow></api-parameters-document>`);
  }

  /**
   * @param {any} amf
   * @param {any} baseParams
   * @param {any} endpointParams
   * @param {any} queryParams
   * @returns {Promise<ApiParametersDocument>}
   */
  async function modelFixture(amf, baseParams, endpointParams, queryParams) {
    return fixture(html`<api-parameters-document
      queryOpened
      pathOpened
      .amf="${amf}"
      .baseUriParameters="${baseParams}"
      .endpointParameters="${endpointParams}"
      .queryParameters="${queryParams}"
    ></api-parameters-document>`);
  }

  describe('Headers level', () => {
    let element = /** @type ApiParametersDocument */ (null);
    let amf;
    before(async () => {
      amf = await AmfLoader.load({});
    });

    beforeEach(async () => {
      element = await openedFixture();
      element.amf = amf;
      element.baseUriParameters = AmfLoader.lookupServerVariables(amf);
      element.endpointParameters = AmfLoader.lookupPathParameters(amf, '/test-parameters/{feature}');
      element.queryParameters = AmfLoader.lookupQueryParameters(amf, '/people', 'get');
      await aTimeout(0);
    });

    it('sets default header level', () => {
      const uriTitle = element.shadowRoot.querySelector('.uri-parameters [role="heading"]');
      assert.equal(uriTitle.getAttribute('aria-level'), '2');
      const queryTitle = element.shadowRoot.querySelector('.query-parameters [role="heading"]');
      assert.equal(queryTitle.getAttribute('aria-level'), '2');
    });

    it('sets header level', async () => {
      element.headerLevel = 4;
      await aTimeout(0);
      const uriTitle = element.shadowRoot.querySelector('.uri-parameters [role="heading"]');
      assert.equal(uriTitle.getAttribute('aria-level'), '4');
      const queryTitle = element.shadowRoot.querySelector('.query-parameters [role="heading"]');
      assert.equal(queryTitle.getAttribute('aria-level'), '4');
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
  ].forEach(([label, compact]) => {
    describe(String(label), () => {
      let element = /** @type ApiParametersDocument */ (null);
      let amf;

      describe('No data state', () => {
        it('Does not render params tables without data', async () => {
          element = await openedFixture();
          await aTimeout(0);
          const doc = element.shadowRoot.querySelector('api-type-document');
          assert.notOk(doc);
        });
      });

      describe('Base path parameters', () => {
        before(async () => {
          // @ts-ignore
          amf = await AmfLoader.load({ compact });
        });

        beforeEach(async () => {
          element = await openedFixture();
          element.amf = amf;
          element.baseUriParameters = AmfLoader.lookupServerVariables(amf);
          await aTimeout(0);
        });

        it('Computes _effectivePathParameters', () => {
          assert.typeOf(element._effectivePathParameters, 'array');
          assert.lengthOf(element._effectivePathParameters, 2);
        });

        it('Renders uri parameters table', () => {
          const section = element.shadowRoot.querySelector('.uri-parameters');
          assert.ok(section);
        });

        it('Parameters are set on the table', () => {
          const doc = element.shadowRoot.querySelector('.uri-parameters api-type-document');
          // @ts-ignore
          assert.isTrue(doc.type === element._effectivePathParameters);
        });

        it('Toggle button open the URI section', () => {
          const button = /** @type HTMLElement */ (element.shadowRoot.querySelector('.uri-parameters .section-title-area'));
          button.click();
          assert.isFalse(element.pathOpened);
        });
      });

      describe('Base path + endpoint path parameters', () => {
        before(async () => {
          // @ts-ignore
          amf = await AmfLoader.load({ compact });
        });

        beforeEach(async () => {
          element = await openedFixture();
          element.amf = amf;
          element.baseUriParameters = AmfLoader.lookupServerVariables(amf);
          element.endpointParameters = AmfLoader.lookupPathParameters(amf, '/test-parameters/{feature}');
          await aTimeout(0);
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
          // @ts-ignore
          assert.isTrue(doc.type === element._effectivePathParameters);
        });
      });

      describe('Base path + endpoint path parameters + query parameters', () => {
        before(async () => {
          // @ts-ignore
          amf = await AmfLoader.load({ compact });
        });

        beforeEach(async () => {
          element = await openedFixture();
          element.amf = amf;
          element.baseUriParameters = AmfLoader.lookupServerVariables(amf);
          element.endpointParameters = AmfLoader.lookupPathParameters(amf, '/test-parameters/{feature}');
          element.queryParameters = AmfLoader.lookupQueryParameters(amf, '/people', 'get');
          await aTimeout(0);
        });

        it('Renders query parameters table', () => {
          const section = element.shadowRoot.querySelector('.query-parameters');
          assert.ok(section);
        });

        it('Parameters are set on table', () => {
          const doc = element.shadowRoot.querySelector('.query-parameters api-type-document');
          // @ts-ignore
          assert.isTrue(doc.type === element.queryParameters);
        });

        it('Toggle button open the Query section', () => {
          const button = /** @type HTMLElement */ (element.shadowRoot.querySelector('.query-parameters .section-title-area'));
          button.click();
          assert.isFalse(element.queryOpened);
        });
      });

      describe('Narrow layout', () => {
        before(async () => {
          // @ts-ignore
          const data = await AmfLoader.load({ compact });
          [amf] = data;
        });

        beforeEach(async () => {
          element = await narrowFixture();
          element.amf = amf;
          element.baseUriParameters = AmfLoader.lookupServerVariables(amf);
          element.endpointParameters = AmfLoader.lookupPathParameters(amf, '/people');
          element.queryParameters = AmfLoader.lookupQueryParameters(amf, '/people', 'get');
          await aTimeout(0);
        });

        it('Has narrow attribute', () => {
          assert.isTrue(element.hasAttribute('narrow'));
        });

        it('Narrow style is applied to the URI title', async () => {
          element.style.setProperty('--api-parameters-document-title-narrow-font-size', '16px');
          const title = element.shadowRoot.querySelector('.uri-parameters .table-title');
          const { fontSize } = getComputedStyle(title);
          assert.equal(fontSize, '16px');
        });

        it('Narrow style is applied to the Query title', async () => {
          element.style.setProperty('--api-parameters-document-title-narrow-font-size', '16px');
          const title = element.shadowRoot.querySelector('.query-parameters .table-title');
          const { fontSize } = getComputedStyle(title);
          assert.equal(fontSize, '16px');
        });
      });
    });

    describe('queryString support', () => {
      let amf;
      before(async () => {
        // @ts-ignore
        const data = await AmfLoader.load({ compact, fileName: 'SE-12752' });
        [amf] = data;
      });

      let baseParameters;
      beforeEach(async () => {
        baseParameters = AmfLoader.lookupServerVariables(amf);
      });

      it('renders query parameters for a NodeShape', async () => {
        const endpointParameters = AmfLoader.lookupPathParameters(amf, '/test');
        const queryParameters = AmfLoader.lookupQueryParameters(amf, '/test', 'get');
        const element = await modelFixture(amf, baseParameters, endpointParameters, queryParameters);
        const doc = element.shadowRoot.querySelector('.query-parameters api-type-document');
        assert.ok(doc);
      });

      it('renders query parameters for an ArrayShape', async () => {
        const endpointParameters = AmfLoader.lookupPathParameters(amf, '/array');
        const queryParameters = AmfLoader.lookupQueryParameters(amf, '/array', 'get');
        const element = await modelFixture(amf, baseParameters, endpointParameters, queryParameters);
        const doc = element.shadowRoot.querySelector('.query-parameters api-type-document');
        assert.ok(doc);
      });

      it('renders query parameters for an UnionShape', async () => {
        const endpointParameters = AmfLoader.lookupPathParameters(amf, '/union');
        const queryParameters = AmfLoader.lookupQueryParameters(amf, '/union', 'get');
        const element = await modelFixture(amf, baseParameters, endpointParameters, queryParameters);
        const doc = element.shadowRoot.querySelector('.query-parameters api-type-document');
        assert.ok(doc);
      });

      it('renders query parameters for a ScalarShape', async () => {
        const endpointParameters = AmfLoader.lookupPathParameters(amf, '/scalar');
        const queryParameters = AmfLoader.lookupQueryParameters(amf, '/scalar', 'get');
        const element = await modelFixture(amf, baseParameters, endpointParameters, queryParameters);
        const doc = element.shadowRoot.querySelector('.query-parameters api-type-document');
        assert.ok(doc);
      });
    });
  });
});
