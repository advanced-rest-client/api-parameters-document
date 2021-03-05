[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-parameters-document.svg)](https://www.npmjs.com/package/@api-components/api-parameters-document)

[![Build Status](https://travis-ci.org/advanced-rest-client/api-parameters-document.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/api-parameters-document)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/api-parameters-document)

## &lt;api-parameters-document&gt;

Documentation component for API query and URI parameters based on AMF data model.

## Version compatibility

This version only works with AMF model version 2 (AMF parser >= 4.0.0).
For compatibility with previous model version use `3.x.x` version of the component.

## Styling

`<api-parameters-document>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--arc-font-subhead-color` | Color of the collapsible section title | ``
`--arc-font-subhead-font-size` | Font size of the collapsible section title | ``
`--arc-font-subhead-line-height` | Line height of the collapsible section title | ``
`--arc-font-subhead-narrow-font-size` | Font size of the collapsible section title in mobile-friendly view | ``
`--arc-font-body1-font-size` |  | ``
`--arc-font-body1-font-weight` |  | ``
`--arc-font-body1-line-height` |  | ``
`--api-parameters-document-title-border-color` | Border color of the collapsible section title area | `#e5e5e5`

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

## API components

This component is a part of [API components ecosystem](https://elements.advancedrestclient.com/)
