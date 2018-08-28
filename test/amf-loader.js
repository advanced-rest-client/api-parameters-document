const AmfLoader = {};
AmfLoader.load = function(endpointIndex, methodIndex) {
  endpointIndex = endpointIndex || 0;
  const url = location.protocol + '//' + location.host +
    location.pathname.substr(0, location.pathname.lastIndexOf('/'))
    .replace('/test', '/demo') + '/demo-api.json';
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      let data;
      try {
        data = JSON.parse(e.target.response);
      } catch (e) {
        reject(e);
        return;
      }
      const enc = data[0]['http://a.ml/vocabularies/document#encodes'][0];
      const srv = enc['http://a.ml/vocabularies/http#server'][0];
      const base = srv['http://a.ml/vocabularies/http#variable'];

      const endpoint = enc['http://a.ml/vocabularies/http#endpoint'][endpointIndex];
      const method = endpoint['http://www.w3.org/ns/hydra/core#supportedOperation'][methodIndex];
      const path = endpoint['http://a.ml/vocabularies/http#parameter'];
      const expects = method['http://www.w3.org/ns/hydra/core#expects'];
      let query;
      if (expects) {
        const expect = expects[0];
        query = expect['http://a.ml/vocabularies/http#parameter'];
      }
      resolve([data, base, path, query]);
    });
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};
