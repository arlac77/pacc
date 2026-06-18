import { types } from "./types.mjs";

/**
 * @typedef {Object} AttributeDefinition
 *
 * @property {string} name
 * @property {object} type
 * @property {boolean} isKey
 * @property {boolean} writable
 * @property {boolean} mandatory
 * @property {boolean} collection are we a collection (set, map, array, object)
 * @property {boolean} owner are we the owner of the value
 * @property {Function} [constructor] (collection) constructor
 * @property {boolean} [private] should the value be shown
 * @property {boolean} [credential] any type of credential
 * @property {boolean} [persistent] should we be stored (especially critical for credentials)
 * @property {string} [depends] name of an attribute we depend on
 * @property {string} [description] human readable
 * @property {any} [default] the default value
 * @property {Function} [set] set the value
 * @property {Function} [get] get the value can be used to calculate default values
 * @property {Function} [toInternal]
 * @property {Function} [toExternal]
 * @property {string} [externalName] attribute name used by external system
 * @property {Set<any>} [values] allowed values
 * @property {string[]|string} [env] environment variable(s) used to provide the value
 * @property {object} [additionalValues] other values to be set in case our attribute is set
 * @property {string} [separator] separator for collections
 */

/**
 * Common attribute properties.
 * @type {AttributeDefinition}
 */
export const default_attribute = {
  type: types.string,
  writable: false,
  mandatory: false,
  collection: false,
  owner: true,
  persistent: false,
  private: false,
  credential: false,
  isKey: false
};

/**
 * @type {AttributeDefinition}
 */
export const default_attribute_writable = {
  ...default_attribute,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export { default_attribute as string_attribute };

/**
 * @type {AttributeDefinition}
 */
export { default_attribute_writable as string_attribute_writable };

/**
 * @type {AttributeDefinition}
 */
export const string_collection_attribute = {
  ...default_attribute,
  separator: " ",
  collection: true
};

/**
 * @type {AttributeDefinition}
 */
export const string_collection_attribute_writable = {
  ...string_collection_attribute,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const string_set_attribute = {
  ...string_collection_attribute,
  constructor: Set
};

/**
 * @type {AttributeDefinition}
 */
export const string_set_attribute_writable = {
  ...string_set_attribute,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const name_attribute = {
  ...default_attribute,
  name: "name",
  isKey: true
};

/**
 * @type {AttributeDefinition}
 */
export const name_attribute_writable = {
  ...name_attribute,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const email_attribute = {
  ...default_attribute,
  name: "email",
  description: "email address"
};

/**
 * @type {AttributeDefinition}
 */
export const version_attribute = {
  ...default_attribute,
  name: "version",
  description: "version"
};

/**
 * @type {AttributeDefinition}
 */
export const version_attribute_writable = {
  ...version_attribute,
  writable: true
};

/**
 * The description of the object content.
 * @type {AttributeDefinition}
 */
export const description_attribute = {
  ...default_attribute_writable,
  name: "description",
  description: "human readable description"
};

export { description_attribute as description_attribute_writable };

/**
 * @type {AttributeDefinition}
 */
export const type_attribute = { ...default_attribute, name: "type" };

/**
 * @type {AttributeDefinition}
 */
export const state_attribute_writable = {
  ...default_attribute_writable,
  name: "state"
};

/**
 * @type {AttributeDefinition}
 */
export const boolean_attribute = {
  ...default_attribute,
  type: types.boolean
};

/**
 * @type {AttributeDefinition}
 */
export const boolean_attribute_writable = {
  ...default_attribute_writable,
  type: types.boolean
};

/**
 * @type {AttributeDefinition}
 */
export const boolean_attribute_writable_true = {
  ...boolean_attribute_writable,
  default: true
};

/**
 * @type {AttributeDefinition}
 */
export const boolean_attribute_writable_false = {
  ...boolean_attribute_writable,
  default: false
};

/**
 * @type {AttributeDefinition}
 */
export const boolean_attribute_false = {
  ...boolean_attribute_writable_false,
  writable: false
};

/**
 * @type {AttributeDefinition}
 */
export { boolean_attribute_writable_true as active_attribute };

/**
 * @type {AttributeDefinition}
 */
export const yesno_attribute = {
  ...boolean_attribute,
  type: types.yesno
};

export const yesno_attribute_writable = {
  ...yesno_attribute,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export { boolean_attribute as empty_attribute };

/**
 * @type {AttributeDefinition}
 */
export const uuid_attribute = {
  ...default_attribute,
  name: "uuid",
  isKey: true
};

/**
 * @type {AttributeDefinition}
 */
export const secret_attribute = {
  ...default_attribute_writable,
  private: true,
  credential: true
};

/**
 * @type {AttributeDefinition}
 */
export const secret_attribute_writable = {
  ...secret_attribute,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const username_attribute = { ...secret_attribute, name: "username" };

/**
 * @type {AttributeDefinition}
 */
export const password_attribute = { ...secret_attribute, name: "password" };

/**
 * @type {AttributeDefinition}
 */
export { secret_attribute as token_attribute };

/**
 * @type {AttributeDefinition}
 */
export { secret_attribute as certificate_attribute };

/**
 * @type {AttributeDefinition}
 */
export const private_key_attribute = {
  ...secret_attribute_writable,
  description: "private key"
};

/**
 * @type {AttributeDefinition}
 */
export const public_key_attribute = {
  ...secret_attribute_writable,
  description: "public key"
};

/**
 * @type {AttributeDefinition}
 */
export const number_attribute = { ...default_attribute, type: types.number };

/**
 * @type {AttributeDefinition}
 */
export const number_attribute_writable = {
  ...number_attribute,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const integer_attribute = { ...default_attribute, type: types.integer };

/**
 * @type {AttributeDefinition}
 */
export const integer_attribute_writable = {
  ...integer_attribute,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export { integer_attribute as count_attribute };

/**
 * @type {AttributeDefinition}
 */
export { integer_attribute_writable as count_attribute_writable };

/**
 * @type {AttributeDefinition}
 */
export { integer_attribute as size_attribute };

export const bytes_size_attribute = {
  ...default_attribute,
  type: types.byte_size
};

/**
 * @type {AttributeDefinition}
 */
export const object_attribute = { ...default_attribute, type: types.object };

/**
 * @type {AttributeDefinition}
 */
export const url_attribute = {
  ...default_attribute,
  type: types.url,
  name: "url",
  description: "home of the object"
};

/**
 * @type {AttributeDefinition}
 */
export const url_attribute_writable = {
  ...url_attribute,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const hostname_attribute = {
  ...default_attribute,
  name: "hostname",
  description: "hostname"
};

/**
 * @type {AttributeDefinition}
 */
export const port_attribute = {
  ...integer_attribute,
  name: "port",
  description: "ip port"
};

/**
 * Unique id within.
 * @type {AttributeDefinition}
 */
export const id_attribute = {
  ...default_attribute,
  isKey: true,
  name: "id",
  description: "identifier"
};

/**
 * The body text.
 * @type {AttributeDefinition}
 */
export const body_attribute_writable = {
  ...default_attribute_writable,
  name: "body"
};

/**
 * The one line description.
 * @type {AttributeDefinition}
 */
export const title_attribute_writable = {
  ...default_attribute,
  name: "title",
  description: "human readable title",
  writable: true
};

/**
 * In case there are several providers able to support a given source which one sould be used ?
 * this defines the order.
 * @type {AttributeDefinition}
 */
export const priority_attribute = {
  ...number_attribute_writable,
  name: "priority",
  default: 0
};

/**
 * Duration in seconds.
 * @type {AttributeDefinition}
 */
export const duration_attribute = {
  ...default_attribute,
  type: types.duration,
  name: "duration"
};

/**
 * @type {AttributeDefinition}
 */
export const duration_attribute_writable = {
  ...duration_attribute,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const duration_ms_attribute = {
  ...default_attribute,
  type: types.duration_ms
};

/**
 * @type {AttributeDefinition}
 */
export const timeout_attribute = {
  ...number_attribute_writable,
  name: "timeout",
  description: "timeout"
};

/**
 * @type {AttributeDefinition}
 */
export const language_attribute = {
  ...default_attribute,
  name: "language",
  description: "human spoken language"
};
