import { html } from 'lit-html';
import { ApiDemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@anypoint-web-components/anypoint-styles/colors.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '../api-parameters-document.js';

class ApiDemo extends ApiDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'baseUriParameters', 'endpointParameters', 'queryParameters',
    ]);
    this.renderViewControls = true;
  }

  _setBaseParams(data) {
    const srv = this._computeServer(data);
    this.baseUriParameters = this._computeServerVariables(srv);
  }

  _navChanged(e) {
    const { selected, type } = e.detail;

    if (type === 'method') {
      this.setData(selected);
    } else {
      this.hasData = false;
    }
  }

  _readParamsProperties(scheme) {
    if (!scheme) {
      return undefined;
    }
    const pKey = this._getAmfKey(this.ns.aml.vocabularies.apiContract.parameter);
    let result = this._ensureArray(scheme[pKey]);
    if (result) {
      return result;
    }
    const qKey = this._getAmfKey(this.ns.aml.vocabularies.apiContract.queryString);
    result = this._ensureArray(scheme[qKey]);
    if (result) {
      // @ts-ignore
      result = this._resolve(result[0]);
      result = this._getTypeProperties(result);
    }
    return result;
  }

  _getTypeProperties(type) {
    if (this._hasType(type, this.ns.w3.shacl.NodeShape)) {
      return this._getValueArray(type, this.ns.w3.shacl.property);
    }
    if (this._hasType(type, this.ns.aml.vocabularies.shapes.ArrayShape)) {
      const items = this._getValueArray(type, this.ns.aml.vocabularies.shapes.items);
      if (items) {
        // @ts-ignore
        return this._resolve(items[0]);
      }
    }
    return type;
  }

  setData(id) {
    const webApi = this._computeWebApi(this.amf);
    const endpoint = this._computeMethodEndpoint(webApi, id);
    this.endpointParameters = this._computeQueryParameters(endpoint);
    const method = this._computeMethodModel(webApi, id);
    const expect = this._computeExpects(method);
    const params = this._readParamsProperties(expect);
    this.queryParameters = params;
    this.hasData = !!params;
  }

  _apiListTemplate() {
    return [
      ['demo-api', 'Demo API'],
      ['SE-12752', 'Query string (SE-12752)'],
    ].map(([file, label]) => html`
      <anypoint-item data-src="${file}-compact.json">${label} - compact model</anypoint-item>
      <anypoint-item data-src="${file}.json">${label}</anypoint-item>
      `);
  }

  contentTemplate() {
    return html`
    ${this.hasData ?
      html`<api-parameters-document
        .amf="${this.amf}"
        queryOpened
        pathOpened
        .baseUriParameters="${this.baseUriParameters}"
        .endpointParameters="${this.endpointParameters}"
        .queryParameters="${this.queryParameters}"></api-parameters-document>` :
      html`<p>Select a HTTP method in the navigation to see the demo.</p>`}
    `;
  }
}
const instance = new ApiDemo();
instance.render();
