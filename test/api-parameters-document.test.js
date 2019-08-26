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

  function getEncodes(model, compact) {
    if (model instanceof Array) {
      model = model[0];
    }
    const encKey = compact ? 'doc:encodes' : 'http://a.ml/vocabularies/document#encodes';
    let def = model[encKey];
    if (def instanceof Array) {
      def = def[0];
    }
    return def;
  }

  function getServer(enc, compact) {
    const key = compact ? 'raml-http:server' : 'http://a.ml/vocabularies/http#server';
    let def = enc[key];
    if (def instanceof Array) {
      def = def[0];
    }
    return def;
  }

  function getSrvBaseVariables(srv, compact) {
    const key = compact ? 'raml-http:variable' : 'http://a.ml/vocabularies/http#variable';
    let def = srv[key];
    if (!(def instanceof Array)) {
      def = [def];
    }
    return def;
  }

  function getMethod(model, compact, endpointIndex, methodIndex) {
    const enc = getEncodes(model, compact);
    const key = compact ? 'raml-http:endpoint' : 'http://a.ml/vocabularies/http#endpoint';
    let endpoints = enc[key];
    if (!(endpoints instanceof Array)) {
      endpoints = [endpoints];
    }
    const endpoint = endpoints[endpointIndex];
    const mkey = compact ? 'hydra:supportedOperation' : 'http://www.w3.org/ns/hydra/core#supportedOperation';
    let methods = endpoint[mkey];
    if (!(methods instanceof Array)) {
      methods = [methods];
    }
    let method = methods[methodIndex];
    if (method instanceof Array) {
      method = method[0];
    }
    return method;
  }

  function getExpects(method, compact) {
    const key = compact ? 'hydra:expects' : 'http://www.w3.org/ns/hydra/core#expects';
    let result = method[key];
    if (result instanceof Array) {
      result = result[0];
    }
    return result;
  }

  function computeServerVariables(model, compact) {
    const enc = getEncodes(model, compact);
    const srv = getServer(enc, compact);
    return getSrvBaseVariables(srv, compact);
  }

  function computePathParameters(model, compact, endpointIndex, methodIndex) {
    const method = getMethod(model, compact, endpointIndex, methodIndex);
    const key = compact ? 'raml-http:parameter' : 'http://a.ml/vocabularies/http#endpoint';
    let params = method[key];
    if (!(params instanceof Array)) {
      params = [params];
    }
    return params;
  }

  function computeQueryParameters(model, compact, endpointIndex, methodIndex) {
    const method = getMethod(model, compact, endpointIndex, methodIndex);
    const expect = getExpects(method, compact);
    const key = compact ? 'raml-http:parameter' : 'http://a.ml/vocabularies/http#parameter';
    let params = expect[key];
    if (!(params instanceof Array)) {
      params = [params];
    }
    return params;
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
      element.baseUriParameters = computeServerVariables(amf, false);
      element.endpointParameters = computePathParameters(amf, false, 0, 0);
      element.queryParameters = computeQueryParameters(amf, false, 2, 0);
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
      element.baseUriParameters = computeServerVariables(amf, false);
      element.endpointParameters = computePathParameters(amf, false, 0, 0);
      element.queryParameters = computeQueryParameters(amf, false, 2, 0);
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
          element.baseUriParameters = computeServerVariables(amf, item[1]);
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
          element.baseUriParameters = computeServerVariables(amf, item[1]);
          element.endpointParameters = computePathParameters(amf, item[1], 0, 0);
          await aTimeout();
        });

        it('Computes _effectivePathParameters', () => {
          assert.typeOf(element._effectivePathParameters, 'array');
        });

        it('_effectivePathParameters contains both parameters arrays', () => {
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
          element.baseUriParameters = computeServerVariables(amf, item[1]);
          element.endpointParameters = computePathParameters(amf, item[1], 0, 0);
          element.queryParameters = computeQueryParameters(amf, item[1], 2, 0);
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
          element.baseUriParameters = computeServerVariables(amf, item[1]);
          element.endpointParameters = computePathParameters(amf, item[1], 2, 0);
          element.queryParameters = computeQueryParameters(amf, item[1], 2, 0);
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
