import { setAttribute, getAttribute } from "./attribute.mjs";

const types = {
  base: { name: "base" },
  string: { name: "string" },
  number: { name: "number" },
  integer: { name: "integer" },
  "unsigned-integer": { name: "unsigned-integer" },
  boolean: { name: "boolean" },
  object: { name: "object" }
};

/**
 * Create attributes from its definition.
 * @param {Object} newDefinitions
 * @param {Object|undefined} presentDefinitions optional merg in attributes
 * @return {Object} attributes
 */
export function prepareAttributesDefinitions(newDefinitions, presentDefinitions) {
  for (const [name, d] of Object.entries(newDefinitions)) {
    if (d.attributes === undefined) {
      d.type = types[d.type] || types.base;
    }
    else {
      prepareAttributesDefinitions(d.attributes);
    }
  }

  return mergeAttributeDefinitions(newDefinitions, presentDefinitions);
}

/**
 * Merge attribute definitions.
 * @param {Object} dest attribute definitions to be used also the merge target
 * @param {Object?} atts attribute definitions to be used
 * @return {Object} merged definitions (dest)
 */
function mergeAttributeDefinitions(dest, atts) {
  if (atts) {
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

  return dest;
}

/**
 * Copies attribute values from a source object into a destination object.
 * @param {Object} object target object to be modified
 * @param {Object} source origin of the data to be copied
 * @param {Object} definitions attribute definitions to be used
 * @param {function?} cb callback to be executed for each copied value
 * @param {string?} prefix name parefix
 */
export function setAttributes(object, source, definitions, cb, prefix) {
  for (let [name, def] of Object.entries(definitions)) {
    if (prefix !== undefined) {
      name = prefix + name;
    }

    if (def.attributes) {
      setAttributes(object, source, def.attributes, cb, name + ".");
      continue;
    }

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

  Object.keys(definitions).forEach(name => {
    const value = getAttribute(object, name);
    if (value !== undefined) {
      result[name] = value;
    }
  });

  return result;
}
