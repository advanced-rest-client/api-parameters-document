import { html } from 'lit-html';
import { LitElement } from 'lit-element';
import { ApiDemoPageBase } from '@advanced-rest-client/arc-demo-helper/ApiDemoPage.js';
import '@api-components/raml-aware/raml-aware.js';
import '@api-components/api-navigation/api-navigation.js';
import '../api-parameters-document.js';

import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
class DemoElement extends AmfHelperMixin(LitElement) {}

window.customElements.define('demo-element', DemoElement);
class ApiDemo extends ApiDemoPageBase {
  constructor() {
    super();
    this.initObservableProperties([
      'hasData', 'baseUriParameters', 'endpointParameters', 'queryParameters'
    ]);
    this.hasData = false;
  }

  get amf() {
    return this._amf;
  }

  set amf(value) {
    this._setObservableProperty('amf', value);
    this._setBaseParams(value);
  }

  get helper() {
    return document.getElementById('helper');
  }

  _setBaseParams(data) {
    const helper = this.helper;
    const srv = helper._computeServer(data);
    this.baseUriParameters = helper._computeServerVariables(srv);
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
      return;
    }
    const helper = this.helper;
    const pKey = helper._getAmfKey(helper.ns.aml.vocabularies.apiContract.parameter);
    let result = helper._ensureArray(scheme[pKey]);
    if (result) {
      return result;
    }
    const qKey = helper._getAmfKey(helper.ns.aml.vocabularies.apiContract.queryString);
    result = helper._ensureArray(scheme[qKey]);
    if (result) {
      result = helper._resolve(result[0]);
      result = this._getTypeProperties(result);
    }
    return result;
  }

  _getTypeProperties(type) {
    const helper = this.helper;
    if (helper._hasType(type, helper.ns.w3.shacl.NodeShape)) {
      return helper._getValueArray(type, helper.ns.w3.shacl.property);
    }
    if (helper._hasType(type, helper.ns.aml.vocabularies.shapes.ArrayShape)) {
      const items = helper._getValueArray(type, helper.ns.aml.vocabularies.shapes.items);
      if (items) {
        return helper._resolve(items[0]);
      }
    }
    return type;
  }

  setData(id) {
    const helper = this.helper;
    const webApi = helper._computeWebApi(this.amf);
    const endpoint = helper._computeMethodEndpoint(webApi, id);
    this.endpointParameters = helper._computeQueryParameters(endpoint);
    const method = helper._computeMethodModel(webApi, id);
    const expect = helper._computeExpects(method);
    const params = this._readParamsProperties(expect);
    this.queryParameters = params;
    this.hasData = !!params;
  }

  _apiListTemplate() {
    return [
      ['demo-api', 'Demo API'],
      ['SE-12752', 'Query string (SE-12752)'],
    ].map(([file, label]) => html`
      <paper-item data-src="${file}-compact.json">${label} - compact model</paper-item>
      <paper-item data-src="${file}.json">${label}</paper-item>
      `);
  }

  contentTemplate() {
    return html`
    <demo-element id="helper" .amf="${this.amf}"></demo-element>
    <raml-aware .api="${this.amf}" scope="model"></raml-aware>
    ${this.hasData ?
      html`<api-parameters-document
        aware="model"
        queryopened
        pathopened
        .baseUriParameters="${this.baseUriParameters}"
        .endpointParameters="${this.endpointParameters}"
        .queryParameters="${this.queryParameters}"></api-parameters-document>` :
      html`<p>Select a HTTP method in the navigation to see the demo.</p>`}
    `;
  }
}
const instance = new ApiDemo();
instance.render();
window._demo = instance;
