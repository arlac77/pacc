/**
 * @typedef {Object} AttributeDefinition
 *
 * @property {string} type
 * @property {boolean} isKey
 * @property {boolean} writable
 * @property {boolean} mandatory
 * @property {boolean} collection
 * @property {boolean} [private] should the value be shown
 * @property {string} [depends] name of an attribute we depend on
 * @property {string} [description] human readable
 * @property {any} [default] the default value
 * @property {Function} [set] set the value
 * @property {Function} [get] get the value can be used to calculate default values
 * @property {string[]|string} [env] environment variable(s) used to provide the value
 */

/**
 * Common attribute properties.
 * @type {AttributeDefinition}
 */
export const default_attribute = {
  type: "string",
  writable: false,
  mandatory: false,
  collection: false,
  private: false,
  isKey: false
};

/**
 * @type {AttributeDefinition}
 */
export { default_attribute as string_attribute };

export const string_collection_attribute = {
  ...default_attribute,
  collection: true
};

/**
 * @type {AttributeDefinition}
 */
export const name_attribute = {
  ...default_attribute,
  isKey: true
};

/**
 * @type {AttributeDefinition}
 */
export const email_attribute = {
  ...default_attribute,
  description: "email address"
};

/**
 * The description of the object content.
 * @type {AttributeDefinition}
 */
export const description_attribute = {
  ...default_attribute,
  description: "human readable description",
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export { default_attribute as type_attribute };

/**
 * @type {AttributeDefinition}
 */
export const state_attribute = {
  ...default_attribute,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const boolean_attribute_writeable_true = {
  ...default_attribute,
  type: "boolean",
  writable: true,
  default: true
};

/**
 * @type {AttributeDefinition}
 */
export const boolean_attribute_writeable_false = {
  ...default_attribute,
  type: "boolean",
  writable: true,
  default: false
};

export { boolean_attribute_writeable_false as boolean_attribute };

/**
 * @type {AttributeDefinition}
 */
export const boolean_attribute_false = {
  ...boolean_attribute_writeable_false,
  writable: false
};

/**
 * @type {AttributeDefinition}
 */
export { boolean_attribute_writeable_true as active_attribute };

/**
 * @type {AttributeDefinition}
 */
export const empty_attribute = {
  ...default_attribute,
  type: "boolean"
};

/**
 * @type {AttributeDefinition}
 */
export const uuid_attribute = {
  ...default_attribute,
  isKey: true
};

/**
 * @type {AttributeDefinition}
 */
export const secret_attribute = {
  ...default_attribute,
  private: true,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const username_attribute = {
  ...default_attribute,
  private: true,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const password_attribute = {
  ...default_attribute,
  private: true,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const token_attribute = {
  ...default_attribute,
  private: true,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const certificate_attribute = {
  ...default_attribute,
  private: true,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const private_key_attribute = {
  ...default_attribute,
  description: "private key",
  private: true,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const public_key_attribute = {
  ...default_attribute,
  description: "public key",
  private: true,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const number_attribute = { ...default_attribute, type: "number" };

/**
 * @type {AttributeDefinition}
 */
export const integer_attribute = { ...default_attribute, type: "integer" };

/**
 * @type {AttributeDefinition}
 */
export { integer_attribute as count_attribute };

/**
 * @type {AttributeDefinition}
 */
export { integer_attribute as size_attribute };

/**
 * @type {AttributeDefinition}
 */
export const url_attribute = {
  ...default_attribute,
  type: "url",
  description: "home of the object"
};

/**
 * @type {AttributeDefinition}
 */
export const hostname_attribute = {
  ...default_attribute,
  description: "hostname"
};

/**
 * @type {AttributeDefinition}
 */
export const port_attribute = {
  ...integer_attribute,
  description: "ip port"
};

/**
 * Unique id within.
 * @type {AttributeDefinition}
 */
export const id_attribute = {
  ...default_attribute,
  isKey: true,
  description: "identifier"
};

/**
 * The body text.
 * @type {AttributeDefinition}
 */
export const body_attribute = {
  ...default_attribute,
  writable: true
};

/**
 * The one line description.
 * @type {AttributeDefinition}
 */
export const title_attribute = {
  ...default_attribute,
  description: "human readable title",
  writable: true
};

/**
 * In case there are several providers able to support a given source which one sould be used ?
 * this defines the order.
 * @type {AttributeDefinition}
 */
export const priority_attribute = {
  ...default_attribute,
  type: "number",
  default: 0,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const timeout_attribute = {
  ...default_attribute,
  description: "timeout",
  type: "number",
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const language_attribute = {
  ...default_attribute,
  description: "human spoken language"
};
