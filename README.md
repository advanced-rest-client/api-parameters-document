[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-parameters-document.svg)](https://www.npmjs.com/package/@api-components/api-parameters-document)

[![Build Status](https://travis-ci.org/advanced-rest-client/api-parameters-document.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/api-parameters-document)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/api-parameters-document)

## api-parameters-document

Documentation component for API query and URI parameters based on AMF data model.

## Version compatibility

This version only works with AMF model version 2 (AMF parser >= 4.0.0).
For compatibility with previous model version use `3.x.x` version of the component.

## Usage

### Installation

```
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

## API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)
