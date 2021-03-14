import { LitElement, CSSResult, TemplateResult } from 'lit-element';

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
  get styles(): CSSResult

  render(): TemplateResult;
  
  /**
   * Generated AMF json/ld model form the API spec.
   * The element assumes the object of the first array item to be a
   * type of `"http://raml.org/vocabularies/document#Document`
   * on AMF vocabulary.
   *
   * It is only useful for the element to resolve references.
   */
  amf: any;
  /**
   * Set to true to open the query parameters view.
   * Automatically updated when the view is toggled from the UI.
   * @attribute
   */
  queryOpened: boolean;
  /**
   * Set to true to open the path parameters view.
   * Automatically updated when the view is toggled from the UI.
   * @attribute
   */
  pathOpened: boolean;
  /**
   * The `http://raml.org/vocabularies/http#variable` entry
   * from API's `http://raml.org/vocabularies/http#server` model.
   */
  baseUriParameters: any[];
  /**
   * Endpoint path parameters as
   * `http://raml.org/vocabularies/http#parameter` property value of the
   * type of `http://raml.org/vocabularies/http#EndPoint`
   */
  endpointParameters: any[];
  /**
   * Method query parameters as
   * `http://raml.org/vocabularies/http#parameter` property value of the
   * type of `http://raml.org/vocabularies/http#Request`
   */
  queryParameters: any[];
  /**
   * Set to render a mobile friendly view.
   * @attribute
   */
  narrow: boolean;
  /**
   * @deprecated Use `compatibility` instead
   */
  legacy: boolean;
  /**
   * Enables compatibility with Anypoint components.
   * @attribute
   */
  compatibility: boolean;
  /**
   * Type of the header in the documentation section.
   * Should be in range of 1 to 6.
   *
   * @default 2
   * @attribute
   */
  headerLevel: number;
  /**
   * Passed to `api-type-document`. Enables internal links rendering for types.
   * @attribute
   */
  graph: boolean;

  _effectivePathParameters: any[];

  constructor();

  /**
   * Computes combined array of base uri parameters and selected endpoint
   * parameters so the element can render single documentation table.
   *
   * @param base Base uri parameters
   * @param endpoint Endpoint's uri parameters
   * @return Combined array. Can be empty array if arguments does not contain values.
   */
  _computeEffectivePath(base: any[], endpoint: any[]): any[];

  /**
   * @returns The label for the section toggle buttons.
   */
  _computeToggleActionLabel(opened: boolean): string;

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
