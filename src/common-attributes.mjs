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
 * @property {string[]} additionalAttributes extra attributes that are present in case our attribute is set
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
  isKey: false,
  additionalAttributes: []
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
export const email_attribute = default_attribute;

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
export const type_attribute = default_attribute;

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
export const boolean_attribute = {
  ...default_attribute,
  type: "boolean",
  writable: true,
  default: false
};

/**
 * @type {AttributeDefinition}
 */
export const boolean_read_only_attribute = {
  ...default_attribute,
  type: "boolean",
  default: false
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
export const empty_attribute = { ...default_attribute, type: "boolean" };

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
export const integer_attribute = { ...default_attribute, type: "integer" };

/**
 * @type {AttributeDefinition}
 */
export const count_attribute = integer_attribute;

/**
 * @type {AttributeDefinition}
 */
export const size_attribute = integer_attribute;

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
  description: "port"
};

/**
 * Unique id within the provider.
 * @type {AttributeDefinition}
 */
export const id_attribute = {
  ...default_attribute,
  isKey: true,
  description: "internal identifier"
};

/**
 * The body text of the pull request.
 * @type {AttributeDefinition}
 */
export const body_attribute = {
  ...default_attribute,
  writable: true
};

/**
 * The one line description of the pull request.
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
export const active_attribute = {
  ...boolean_attribute,
  default: true,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const language_attribute = {
  ...default_attribute,
  description: "human spoken language"
};
