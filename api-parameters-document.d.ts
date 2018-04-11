/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   api-parameters-document.html
 */

/// <reference path="../polymer/types/polymer-element.d.ts" />
/// <reference path="../polymer/types/lib/elements/dom-if.d.ts" />
/// <reference path="../raml-aware/raml-aware.d.ts" />
/// <reference path="../iron-flex-layout/iron-flex-layout.d.ts" />
/// <reference path="../api-type-document/api-type-document.d.ts" />
/// <reference path="../iron-collapse/iron-collapse.d.ts" />
/// <reference path="../iron-icon/iron-icon.d.ts" />
/// <reference path="../arc-icons/arc-icons.d.ts" />
/// <reference path="../paper-button/paper-button.d.ts" />

declare namespace ApiElements {

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
   */
  class ApiParametersDocument extends Polymer.Element {

    /**
     * `raml-aware` scope property to use.
     */
    aware: string|null|undefined;

    /**
     * Generated AMF json/ld model form the API spec.
     * The element assumes the object of the first array item to be a
     * type of `"http://raml.org/vocabularies/document#Document`
     * on AMF vocabulary.
     *
     * It is only usefult for the element to resolve references.
     */
    amfModel: object|any[]|null;

    /**
     * Set to true to open the query parameters view.
     * Autormatically updated when the view is toggled from the UI.
     */
    queryOpened: boolean|null|undefined;

    /**
     * Set to true to open the path parameters view.
     * Autormatically updated when the view is toggled from the UI.
     */
    pathOpened: boolean|null|undefined;

    /**
     * The `http://raml.org/vocabularies/http#variable` entry
     * from API's `http://raml.org/vocabularies/http#server` model.
     */
    baseUriParameters: Array<object|null>|null;

    /**
     * Endpoint path parameters as
     * `http://raml.org/vocabularies/http#parameter` property value of the
     * type of `http://raml.org/vocabularies/http#EndPoint`
     */
    endpointParameters: Array<object|null>|null;

    /**
     * Method query parameters as
     * `http://raml.org/vocabularies/http#parameter` property value of the
     * type of `http://raml.org/vocabularies/http#Request`
     */
    queryParameters: Array<object|null>|null;

    /**
     * Computed value, true if `queryParameters` are set.
     */
    readonly hasQueryParameters: boolean|null|undefined;
    readonly _effectivePathParameters: any[]|null|undefined;

    /**
     * Computed value, true if there are any path parameters to render.
     * It depends on both `baseUriParameters` and `endpointParameters`
     */
    readonly hasPathParameters: boolean|null|undefined;

    /**
     * Computes boolean value if passed argument is not empty array.
     *
     * @param params The array to test.
     */
    _computeHasParameters(params: any[]|null): Boolean|null;

    /**
     * Computes combined array of base uri parameters and selected endpoint
     * parameters so the element can render single documentation table.
     *
     * @param base Base uri parameetrs
     * @param endpoint Endpoint's uri parameters
     * @returns Combined array. Can be empty array if arguments does not
     * contain values.
     */
    _computeEffectivePath(base: any[]|null, endpoint: any[]|null): any[]|null;

    /**
     * Computes a label for the section toggle buttons.
     */
    _computeToggleActionLabel(opened: any): any;

    /**
     * Computes class for the toggle's button icon.
     */
    _computeToggleIconClass(opened: any): any;

    /**
     * Toggles URI parameters view.
     * Use `pathOpened` property instead.
     */
    toggleUri(): void;

    /**
     * Toggles `queryOpened` value.
     */
    toggleQuery(): void;
  }
}

interface HTMLElementTagNameMap {
  "api-parameters-document": ApiElements.ApiParametersDocument;
}
