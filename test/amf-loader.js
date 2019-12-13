import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import { LitElement } from 'lit-element';

export const AmfLoader = {};

class HelperElement extends AmfHelperMixin(LitElement) {}
window.customElements.define('helper-element', HelperElement);

const helper = new HelperElement();

AmfLoader.load = async function({ fileName='demo-api', compact=false }) {
  compact = compact ? '-compact' : '';
  const file = `${fileName}${compact}.json`;
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
  return AmfLoader.readParamsProperties(exp);
};

AmfLoader.readParamsProperties = function(scheme) {
  if (!scheme) {
    return;
  }
  const pKey = helper._getAmfKey(helper.ns.aml.vocabularies.apiContract.parameter);
  let result = helper._ensureArray(scheme[pKey]);
  if (result) {
    return result;
  }
  const qKey = helper._getAmfKey(helper.ns.aml.vocabularies.apiContract.queryString);
  result = helper._ensureArray(scheme[qKey]);
  if (result) {
    result = helper._resolve(result[0]);
    result = AmfLoader.getTypeProperties(result);
  }
  return result;
}

AmfLoader.getTypeProperties = function(type) {
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
