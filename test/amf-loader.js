import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import { LitElement } from 'lit-element';

export const AmfLoader = {};

class HelperElement extends AmfHelperMixin(LitElement) {}
window.customElements.define('helper-element', HelperElement);

const helper = new HelperElement();

AmfLoader.load = async function(compact) {
  const file = '/demo-api' + (compact ? '-compact' : '') + '.json';
  const url = location.protocol + '//' + location.host + '/base/demo/' + file;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      let data;
      try {
        data = JSON.parse(e.target.response);
        /* istanbul ignore next */
      } catch (e) {
        reject(e);
        return;
      }
      resolve(data);
    });
    /* istanbul ignore next */
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};

AmfLoader.lookupEndpoint = function(model, endpoint) {
  helper.amf = model;
  const webApi = helper._computeWebApi(model);
  return helper._computeEndpointByPath(webApi, endpoint);
};

AmfLoader.lookupOperation = function(model, endpoint, operation) {
  const endPoint = AmfLoader.lookupEndpoint(model, endpoint);
  const opKey = helper._getAmfKey(helper.ns.aml.vocabularies.apiContract.supportedOperation);
  const ops = helper._ensureArray(endPoint[opKey]);
  return ops.find((item) => helper._getValue(item, helper.ns.aml.vocabularies.apiContract.method) === operation);
};

AmfLoader.lookupExpects = function(model, endpoint, operation) {
  const op = AmfLoader.lookupOperation(model, endpoint, operation);
  return helper._computeExpects(op);
};

AmfLoader.lookupServerVariables = function(model) {
  helper.amf = model;
  const srv = helper._computeServer(model);
  return helper._computeServerVariables(srv);
};

AmfLoader.lookupPathParameters = function(model, endpoint) {
  helper.amf = model;
  const endPoint = AmfLoader.lookupEndpoint(model, endpoint);
  return helper._computeQueryParameters(endPoint);
};

AmfLoader.lookupQueryParameters = function(model, endpoint, method) {
  helper.amf = model;
  const exp = AmfLoader.lookupExpects(model, endpoint, method);
  return helper._computeQueryParameters(exp);
};
