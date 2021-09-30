# DEPRECATED

This component is being deprecated. The code base has been moved to [api-documentation](https://github.com/advanced-rest-client/api-documentation) module. This module will be archived when [PR 37](https://github.com/advanced-rest-client/api-documentation/pull/37) is merged.

-----

[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-parameters-document.svg)](https://www.npmjs.com/package/@api-components/api-parameters-document)

[![Tests and publishing](https://github.com/advanced-rest-client/api-parameters-document/actions/workflows/deployment.yml/badge.svg)](https://github.com/advanced-rest-client/api-parameters-document/actions/workflows/deployment.yml)

Documentation component for API query and URI parameters based on AMF data model.

## Version compatibility

This version only works with AMF model version 2 (AMF parser >= 4.0.0).
For compatibility with previous model version use `3.x.x` version of the component.

## Usage

### Installation

```sh
npm install --save @api-components/api-parameters-document
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@api-components/api-parameters-document/api-parameters-document.js';
    </script>
  </head>
  <body>
    <api-parameters-document></api-parameters-document>
  </body>
</html>
```

```js
import { LitElement, html } from 'lit-element';
import '@api-components/api-parameters-document/api-parameters-document.js';

class SampleElement extends PolymerElement {
  render() {
    return html`
    <api-parameters-document .amf="${this.amf}"></api-parameters-document>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

## Development

```sh
git clone https://github.com/api-components/api-parameters-document
cd api-parameters-document
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```
