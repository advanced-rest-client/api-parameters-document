import { html, render } from 'lit-html';
import { LitElement } from 'lit-element';
import { ApiDemoPageBase } from '@advanced-rest-client/arc-demo-helper/ApiDemoPage.js';
import '@api-components/raml-aware/raml-aware.js';
import '@api-components/api-navigation/api-navigation.js';
import '../api-parameters-document.js';

import { AmfHelperMixin, ns } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
class DemoElement extends AmfHelperMixin(LitElement) {}

window.customElements.define('demo-element', DemoElement);
class ApiDemo extends ApiDemoPageBase {
  constructor() {
    super();
    this.hasData = false;
  }

  get hasData() {
    return this._hasData;
  }

  set hasData(value) {
    this._setObservableProperty('hasData', value);
  }

  get baseUriParameters() {
    return this._baseUriParameters;
  }

  set baseUriParameters(value) {
    this._setObservableProperty('baseUriParameters', value);
  }

  get endpointParameters() {
    return this._endpointParameters;
  }

  set endpointParameters(value) {
    this._setObservableProperty('endpointParameters', value);
  }

  get queryParameters() {
    return this._queryParameters;
  }

  set queryParameters(value) {
    this._setObservableProperty('queryParameters', value);
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

  setData(id) {
    const helper = this.helper;
    const webApi = helper._computeWebApi(this.amf);
    const endpoint = helper._computeMethodEndpoint(webApi, id);
    this.endpointParameters = helper._computeQueryParameters(endpoint);
    const method = helper._computeMethodModel(webApi, id);
    const expect = helper._computeExpects(method);
    if (!expect) {
      this.queryParameters = undefined;
      return;
    }
    const key = helper._getAmfKey(ns.raml.vocabularies.http + 'parameter');
    this.queryParameters = helper._ensureArray(expect[key]);
    this.hasData = true;
  }

  render() {
    render(html `
    ${this.headerTemplate()}
    <raml-aware .api="${this.amf}" scope="model"></raml-aware>

    <section role="main" class="centered card">
      ${this._apiNavigationTemplate()}
      ${this.hasData ?
        html`<api-parameters-document
          aware="model"
          queryopened
          pathopened
          .baseUriParameters="${this.baseUriParameters}"
          .endpointParameters="${this.endpointParameters}"
          .queryParameters="${this.queryParameters}"></api-parameters-document>` :
        html`<p>Select a HTTP method in the navigation to see the demo.</p>`}
    </section>

    <demo-element id="helper" .amf="${this.amf}"></demo-element>`, document.querySelector('#demo'));
  }
}
const instance = new ApiDemo();
instance.render();
window._demo = instance;
