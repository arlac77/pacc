import { setAttribute, getAttribute } from "./settergetter.mjs";
import { attributeIterator } from "./attributes.mjs";

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
      if (def.default === undefined) {
        continue;
      } else {
        if (getAttribute(object, name) !== undefined) {
          continue;
        }
        value = def.default;
      }
    }

    if (def.set) {
      def.set.call(object, value, def);
    } else {
      setAttribute(object, name, value);
    }
    if (cb) {
      cb(def, name, value);
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

  for (const [path, def] of attributeIterator(definitions)) {
    const name = path.join(".");

    const value = getAttribute(object, name);
    if (value !== undefined) {
      result[name] = value;
    }
  }
  return result;
}
