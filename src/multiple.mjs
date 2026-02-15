import { setAttribute, getAttribute } from "./settergetter.mjs";
import { attributeIterator, toExternal } from "./attributes.mjs";
import { default_attribute } from "./common-attributes.mjs";
/**
 * Copies attribute values from a source object into a destination object.
 * @param {Object} object target object to be modified
 * @param {Object} source origin of the data to be copied
 * @param {Object} definitions attribute definitions to be used
 * @param {function?} cb callback to be executed for each copied value
 */
export function setAttributes(object, source, definitions, cb) {
  for (const [path, def] of attributeIterator(definitions)) {
    const name = path.join(".");

    let value = getAttribute(source, name);

    if (value === undefined) {
      if (
        def.default === undefined ||
        getAttribute(object, name) !== undefined
      ) {
        continue;
      }
      value = def.default;
    }

    setAttribute(object, name, value, def);

    if (cb) {
      cb(def, name, value);
    }
  }
}

/**
 * Retrive attribute values from an object.
 * @param {Object} object attribute value source
 * @param {Object} definitions
 * @param {Function} [filter]
 * @return {Object} values
 */
export function getAttributes(object, definitions, filter) {
  const result = {};

  for (const [path, def] of attributeIterator(definitions, filter)) {
    const name = path.join(".");

    const value = getAttribute(object, name, def);
    if (value !== undefined) {
      setAttribute(result, name, value, def);
    }
  }
  return result;
}

/**
 * Retrive attribute values from an object.
 * @param {Object} object attribute value source
 * @param {Object} definitions
 * @param {Function} [filter]
 * @return {Object} values
 */
export function getAttributesJSON(object, definitions, filter) {
  const result = {};

  for (const [path, def] of attributeIterator(definitions, filter)) {
    const name = path.join(".");

    let value = getAttribute(object, name, def);
    if (value !== undefined) {
      value = toExternal(value);
      if (value instanceof Set) {
        value = [...value];
      }
      setAttribute(result, def.externalName ?? name, value, default_attribute);
    }
  }
  return result;
}
