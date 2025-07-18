import { setAttribute, getAttribute } from "./attribute.mjs";

/**
 * @typedef {Object} AttributeDefinition
 *
 * @property {string} name
 * @property {string} type
 * @property {boolean} isKey
 * @property {boolean} writable
 * @property {boolean} mandatory
 * @property {boolean} [private] should the value be shown
 * @property {string} [depends] name of an attribute we depend on
 * @property {string[]} additionalAttributes extra attributes that are present in case our attribute is set
 * @property {string} [description] human readable
 * @property {any} [default] the default value
 * @property {Function} [set] set the value
 * @property {Function} [get] get the value can be used to calculate default values
 * @property {string[]|string} [env] environment variable(s) used to provide the value
 */

const types = {
  base: { name: "base" },
  string: { name: "string" },
  number: { name: "number" },
  integer: { name: "integer" },
  boolean: { name: "boolean" },
  object: { name: "object" }
};

/**
 * Create attributes from its definition.
 * @param {Object} definitions
 * @return {Object} attributes
 */
export function prepareAttributesDefinitions(definitions) {
  for (const [name, d] of Object.entries(definitions)) {
    d.name = name;
    if (d.attributes === undefined) {
      d.type = types[d.type] || types.base;
    }
  }
  return definitions;
}

/**
 * Merge attribute definitions.
 * @param {Object} dest attribute definitions to be used also the merge target
 * @param {Object} atts attribute definitions to be used
 * @return {Object} merged definitions (dest)
 */
export function mergeAttributeDefinitions(dest, atts) {
  for (const [name, ca] of Object.entries(atts)) {
    if (ca.attributes !== undefined) {
      const bn = dest[name];

      if (bn !== undefined) {
        Object.assign(ca.attributes, bn.attributes);
      }
    }
  }

  return Object.assign(dest, atts);
}

/**
 * Copies attribute values from a source object into a destination object.
 * @param {Object} object target object to be modified
 * @param {Object} source origin of the data to be copied
 * @param {Object} definitions attribute definitions to be used
 * @param {function?} cb callback to be executed for each copied value
 */
export function setAttributes(object, source, definitions, cb) {
  for (const [name, def] of Object.entries(definitions)) {
    const value = getAttribute(source, name) ?? def.default;
    if (value !== undefined) {
      setAttribute(object, name, value);
      if (cb) {
        cb(def, name, value);
      }
    }
  }
}

/**
 * Retrive attribute values from an object.
 * @param {Object} object attribute value source
 * @param {Object} definitions
 * @return {Object} values
 */
export function getAttributes(object, definitions) {
  const result = {};

  Object.keys(definitions).forEach(name => {
    const value = getAttribute(object, name);
    if (value !== undefined) {
      result[name] = value;
    }
  });

  return result;
}
