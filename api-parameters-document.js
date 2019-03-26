import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@api-components/raml-aware/raml-aware.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@api-components/api-type-document/api-type-document.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/iron-icon/iron-icon.js';
import '@advanced-rest-client/arc-icons/arc-icons.js';
import '@polymer/paper-button/paper-button.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
/**
 * `api-parameters-document`
 *
 * URI and query parameters documentation table based on
 * [AMF](https://github.com/mulesoft/amf) json/ld model.
 *
 * It rquires you to set at least one of the following properties:
 * - baseUriParameters
 * - endpointParameters
 * - queryParameters
 *
 * Otherwise it render empty block element.
 *
 * See demo for example implementation.
 *
 * ## Styling
 *
 * `<api-parameters-document>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--api-parameters-document` | Mixin applied to this elment | `{}`
 * `--api-parameters-document-title-border-color` | Border color of the title area | `#e5e5e5`
 * `--api-parameters-document-toggle-view-color` | Color of the toggle button | `--arc-toggle-view-icon-color` or `rgba(0, 0, 0, 0.74)`
 * `--toggle-button` | Theme style, mixin apllied to toggle button | `{}`
 * `--api-parameters-document-toggle-view-hover-color` | Color of the toggle button when hovering. Please, mind that hover is not available on all devices.| `--arc-toggle-view-icon-hover-color` or `rgba(0, 0, 0, 0.88)`
 * `--toggle-button-hover` | Theme style, mixin apllied to toggle button when hovered. | `{}`
 * `--api-parameters-document-title` | Mixin applied to the title element | `{}`
 * `--api-parameters-document-title-narrow` | Mixin applied to the title when in narrow layout | `{}`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 */
class ApiParametersDocument extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      @apply --api-parameters-document;
    }

    [hidden] {
      display: none !important;
    }

    .section-title-area {
      @apply --layout-horizontal;
      @apply --layout-center;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      border-bottom: 1px var(--api-parameters-document-title-border-color, #e5e5e5) solid;
    }

    .section-title-area h3 {
      @apply --layout-flex;
    }

    .toggle-button {
      outline: none;
      color: var(--api-parameters-document-toggle-view-color, var(--arc-toggle-view-icon-color, rgba(0, 0, 0, 0.74)));
      transition: color 0.25s ease-in-out;
      @apply --toggle-button;
    }

    .toggle-button:hover {
      color: var(--api-parameters-document-toggle-view-hover-color, var(--arc-toggle-view-icon-hover-color, rgba(0, 0, 0, 0.88)));
      @apply --toggle-button-hover;
    }

    .toggle-icon {
      outline: none;
      margin-left: 8px;
      transform: rotateZ(0deg);
      transition: transform 0.3s ease-in-out;
    }

    .toggle-icon.opened {
      transform: rotateZ(-180deg);
    }

    .table-title {
      @apply --arc-font-title;
      @apply --api-parameters-document-title;
    }

    :host([narrow]) .table-title {
      @apply --api-parameters-document-title-narrow;
    }
    </style>
    <template is="dom-if" if="[[aware]]">
      <raml-aware data-source="api-parameters-document" raml="{{amfModel}}" scope="[[aware]]"></raml-aware>
    </template>
    <template is="dom-if" if="[[hasPathParameters]]">
      <section class="uri-parameters">
        <div class="section-title-area" on-click="toggleUri" title="Toogle URI parameters details">
          <h3 class="table-title">URI parameters</h3>
          <div class="title-area-actions">
            <paper-button class="toggle-button">
              [[_computeToggleActionLabel(pathOpened)]]
              <iron-icon icon="arc:expand-more" class\$="[[_computeToggleIconClass(pathOpened)]]"></iron-icon>
            </paper-button>
          </div>
        </div>
        <iron-collapse opened="[[pathOpened]]">
          <api-type-document amf-model="[[amfModel]]" type="[[_effectivePathParameters]]" narrow="[[narrow]]"></api-type-document>
        </iron-collapse>
      </section>
    </template>
    <template is="dom-if" if="[[hasQueryParameters]]">
      <section class="query-parameters">
        <div class="section-title-area" on-click="toggleQuery" title="Toogle query parameters details">
          <h3 class="table-title">Query parameters</h3>
          <div class="title-area-actions">
            <paper-button class="toggle-button">
              [[_computeToggleActionLabel(queryOpened)]]
              <iron-icon icon="arc:expand-more" class\$="[[_computeToggleIconClass(queryOpened)]]"></iron-icon>
            </paper-button>
          </div>
        </div>
        <iron-collapse opened="[[queryOpened]]">
          <api-type-document amf-model="[[amfModel]]" type="[[queryParameters]]" narrow="[[narrow]]"></api-type-document>
        </iron-collapse>
      </section>
    </template>
`;
  }

  static get is() {
    return 'api-parameters-document';
  }
  static get properties() {
    return {
      /**
       * `raml-aware` scope property to use.
       */
      aware: String,
      /**
       * Generated AMF json/ld model form the API spec.
       * The element assumes the object of the first array item to be a
       * type of `"http://raml.org/vocabularies/document#Document`
       * on AMF vocabulary.
       *
       * It is only usefult for the element to resolve references.
       *
       * @type {Object|Array}
       */
      amfModel: Object,
      /**
       * Set to true to open the query parameters view.
       * Autormatically updated when the view is toggled from the UI.
       */
      queryOpened: {
        type: Boolean,
        value: false
      },
      /**
       * Set to true to open the path parameters view.
       * Autormatically updated when the view is toggled from the UI.
       */
      pathOpened: {
        type: Boolean,
        value: false
      },
      /**
       * The `http://raml.org/vocabularies/http#variable` entry
       * from API's `http://raml.org/vocabularies/http#server` model.
       *
       * @type {Array<Object>}
       */
      baseUriParameters: Array,
      /**
       * Endpoint path parameters as
       * `http://raml.org/vocabularies/http#parameter` property value of the
       * type of `http://raml.org/vocabularies/http#EndPoint`
       * @type {Array<Object>}
       */
      endpointParameters: Array,
      /**
       * Method query parameters as
       * `http://raml.org/vocabularies/http#parameter` property value of the
       * type of `http://raml.org/vocabularies/http#Request`
       * @type {Array<Object>}
       */
      queryParameters: Array,
      /**
       * Computed value, true if `queryParameters` are set.
       */
      hasQueryParameters: {
        type: Boolean,
        readOnly: true,
        computed: '_computeHasParameters(queryParameters)'
      },

      _effectivePathParameters: {
        type: Array,
        readOnly: true,
        computed: '_computeEffectivePath(baseUriParameters, endpointParameters)'
      },
      /**
       * Computed value, true if there are any path parameters to render.
       * It depends on both `baseUriParameters` and `endpointParameters`
       */
      hasPathParameters: {
        type: Boolean,
        readOnly: true,
        computed: '_computeHasParameters(_effectivePathParameters)'
      },
      /**
       * Set to render a mobile friendly view.
       */
       narrow: {
         type: Boolean,
         reflectToAttribute: true
       }
    };
  }
  /**
   * Computes boolean value if passed argument is not empty array.
   * @param {?Array} params The array to test.
   * @return {Boolean}
   */
  _computeHasParameters(params) {
    return !!(params && params.length);
  }
  /**
   * Computes combined array of base uri parameters and selected endpoint
   * parameters so the element can render single documentation table.
   *
   * @param {?Array} base Base uri parameetrs
   * @param {?Array} endpoint Endpoint's uri parameters
   * @return {Array} Combined array. Can be empty array if arguments does not
   * contain values.
   */
  _computeEffectivePath(base, endpoint) {
    let result = [];
    if (base && base.length) {
      result = result.concat(base);
    }
    if (endpoint && endpoint.length) {
      result = result.concat(endpoint);
    }
    return result;
  }

  // Computes a label for the section toggle buttons.
  _computeToggleActionLabel(opened) {
    return opened ? 'Hide' : 'Show';
  }

  // Computes class for the toggle's button icon.
  _computeToggleIconClass(opened) {
    let clazz = 'toggle-icon';
    if (opened) {
      clazz += ' opened';
    }
    return clazz;
  }
  /**
   * Toggles URI parameters view.
   * Use `pathOpened` property instead.
   */
  toggleUri() {
    this.pathOpened = !this.pathOpened;
  }
  /**
   * Toggles `queryOpened` value.
   */
  toggleQuery() {
    this.queryOpened = !this.queryOpened;
  }
}
window.customElements.define(ApiParametersDocument.is, ApiParametersDocument);