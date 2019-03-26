[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-parameters-document.svg)](https://www.npmjs.com/package/@api-components/api-parameters-document)

[![Build Status](https://travis-ci.org/api-components/api-parameters-document.svg?branch=stage)](https://travis-ci.org/api-components/api-parameters-document)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/api-components/api-parameters-document)

## &lt;api-parameters-document&gt;

Documentation component for API query and URI parameters based on AMF data model.

```html
<api-parameters-document></api-parameters-document>
```

### API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

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

### In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import '@api-components/api-parameters-document/api-parameters-document.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
    <api-parameters-document></api-parameters-document>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Installation

```sh
git clone https://github.com/api-components/api-parameters-document
cd api-url-editor
npm install
npm install -g polymer-cli
```

### Running the demo locally

```sh
polymer serve --npm
open http://127.0.0.1:<port>/demo/
```

### Running the tests
```sh
polymer test --npm
```
