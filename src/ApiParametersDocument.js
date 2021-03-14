/* eslint-disable lit-a11y/click-events-have-key-events */
/* eslint-disable class-methods-use-this */
import { LitElement, html, css } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import '@advanced-rest-client/arc-icons/arc-icon.js';
import '@api-components/api-type-document/api-type-document.js';
import '@anypoint-web-components/anypoint-collapse/anypoint-collapse.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';

/**
 * `api-parameters-document`
 *
 * URI and query parameters documentation table based on
 * [AMF](https://github.com/mulesoft/amf) json/ld model.
 *
 * It requires you to set at least one of the following properties:
 * - baseUriParameters
 * - endpointParameters
 * - queryParameters
 *
 * Otherwise it render empty block element.
 *
 * See demo for example implementation.
 */
export class ApiParametersDocument extends LitElement {
  get styles() {
    return css`:host {
      display: block;
      font-size: var(--arc-font-body1-font-size);
      font-weight: var(--arc-font-body1-font-weight);
      line-height: var(--arc-font-body1-line-height);
    }

    [hidden] {
      display: none !important;
    }

    .section-title-area {
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      border-bottom: 1px var(--api-parameters-document-title-border-color, #e5e5e5) solid;
      transition: border-bottom-color 0.15s ease-in-out;
    }

    .section-title-area[data-opened] {
      border-bottom-color: transparent;
    }

    .section-title-area .table-title {
      flex: 1;
      flex-basis: 0.000000001px;
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: var(--arc-font-subhead-font-size);
      font-weight: var(--arc-font-subhead-font-weight);
      line-height: var(--arc-font-subhead-line-height);
    }

    :host([narrow]) .table-title {
      font-size: var(--api-parameters-document-title-narrow-font-size, initial);
    }`;
  }

  render() {
    const {
      pathOpened,
      queryOpened,
      _effectivePathParameters,
      queryParameters,
      amf,
      narrow,
      compatibility,
      headerLevel,
      graph,
    } = this;
    const hasPathParameters = !!(_effectivePathParameters && _effectivePathParameters.length);
    const pathClasses = {
      'toggle-icon': true,
      opened: !!pathOpened,
    };
    const queryClasses = {
      'toggle-icon': true,
      opened: !!queryOpened,
    };
    return html`<style>${this.styles}</style>
    ${hasPathParameters ? html`<section class="uri-parameters">
      <div
        class="section-title-area"
        @click="${this.toggleUri}"
        title="Toggle URI parameters details"
        ?data-opened="${pathOpened}"
      >
        <div class="table-title" role="heading" aria-level="${headerLevel}">URI parameters</div>
        <div class="title-area-actions">
          <anypoint-button class="toggle-button" ?compatibility="${compatibility}">
            ${this._computeToggleActionLabel(pathOpened)}
            <arc-icon class="${classMap(pathClasses)}" icon="expandMore"></arc-icon>
          </anypoint-button>
        </div>
      </div>
      <anypoint-collapse .opened="${pathOpened}">
        <api-type-document
          .amf="${amf}"
          .type="${_effectivePathParameters}"
          ?compatibility="${compatibility}"
          ?narrow="${narrow}"
          ?graph="${graph}"
          noExamplesActions
        ></api-type-document>
      </anypoint-collapse>
    </section>` : ''}

    ${queryParameters ? html`<section class="query-parameters">
      <div
        class="section-title-area"
        @click="${this.toggleQuery}"
        title="Toggle query parameters details"
        ?data-opened="${queryOpened}"
      >
        <div class="table-title" role="heading" aria-level="${headerLevel}">Query parameters</div>
        <div class="title-area-actions">
          <anypoint-button class="toggle-button" ?compatibility="${compatibility}">
            ${this._computeToggleActionLabel(queryOpened)}
            <arc-icon class="${classMap(queryClasses)}" icon="expandMore"></arc-icon>
          </anypoint-button>
        </div>
      </div>
      <anypoint-collapse .opened="${queryOpened}">
        <api-type-document
          .amf="${amf}"
          .type="${queryParameters}"
          ?compatibility="${compatibility}"
          ?narrow="${narrow}"
          ?graph="${graph}"
          noExamplesActions
        ></api-type-document>
      </anypoint-collapse>
    </section>`: ''}`;
  }

  static get properties() {
    return {
      /**
       * Generated AMF json/ld model form the API spec.
       * The element assumes the object of the first array item to be a
       * type of `"http://raml.org/vocabularies/document#Document`
       * on AMF vocabulary.
       *
       * It is only useful for the element to resolve references.
       */
      amf: { type: Object },
      /**
       * Set to true to open the query parameters view.
       * Automatically updated when the view is toggled from the UI.
       */
      queryOpened: { type: Boolean },
      /**
       * Set to true to open the path parameters view.
       * Automatically updated when the view is toggled from the UI.
       */
      pathOpened: { type: Boolean },
      /**
       * The `http://raml.org/vocabularies/http#variable` entry
       * from API's `http://raml.org/vocabularies/http#server` model.
       */
      baseUriParameters: { type: Array },
      /**
       * Endpoint path parameters as
       * `http://raml.org/vocabularies/http#parameter` property value of the
       * type of `http://raml.org/vocabularies/http#EndPoint`
       */
      endpointParameters: { type: Array },
      /**
       * Method query parameters as
       * `http://raml.org/vocabularies/http#parameter` property value of the
       * type of `http://raml.org/vocabularies/http#Request`
       */
      queryParameters: { type: Array },
      /**
       * Set to render a mobile friendly view.
       */
      narrow: { type: Boolean, reflect: true },
      /**
       * @deprecated Use `compatibility` instead
       */
      legacy: { type: Boolean },
      /**
       * Enables compatibility with Anypoint components.
       */
      compatibility: { type: Boolean },
      /**
       * Type of the header in the documentation section.
       * Should be in range of 1 to 6.
       *
       * @default 2
       */
      headerLevel: { type: Number },
      /**
       * Passed to `api-type-document`. Enables internal links rendering for types.
       */
      graph: { type: Boolean },

      _effectivePathParameters: { type: Array }
    };
  }

  get legacy() {
    return this.compatibility;
  }

  set legacy(value) {
    this.compatibility = value;
  }

  get baseUriParameters() {
    return this._baseUriParameters;
  }

  set baseUriParameters(value) {
    const old = this._baseUriParameters;
    if (old === value) {
      return;
    }
    this._baseUriParameters = value;
    this._effectivePathParameters = this._computeEffectivePath(value, this.endpointParameters);
    this.requestUpdate('baseUriParameters', old);
  }

  get endpointParameters() {
    return this._endpointParameters;
  }

  set endpointParameters(value) {
    const old = this._endpointParameters;
    if (old === value) {
      return;
    }
    this._endpointParameters = value;
    this._effectivePathParameters = this._computeEffectivePath(this.baseUriParameters, value);
    this.requestUpdate('endpointParameters', old);
  }

  constructor() {
    super();
    this.headerLevel = 2;
    /**
     * @type {any[]}
     */
    this.queryParameters = undefined;
    /**
     * @type {any}
     */
    this.amf = undefined;
    this.narrow = false;
    this.graph = false;
  }

  /**
   * Computes combined array of base uri parameters and selected endpoint
   * parameters so the element can render single documentation table.
   *
   * @param {any[]} base Base uri parameters
   * @param {any[]} endpoint Endpoint's uri parameters
   * @return {any[]} Combined array. Can be empty array if arguments does not contain values.
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

  /**
   * @param {boolean} opened 
   * @returns {string} The label for the section toggle buttons.
   */
  _computeToggleActionLabel(opened) {
    return opened ? 'Hide' : 'Show';
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
