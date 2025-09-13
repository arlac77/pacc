

export const baseTypes = new Set(["string", "number", "bigint", "boolean"]);

export const types = {
  base: { name: "base" },
  
  string: { name: "string", extends: "base" },
  number: {
    name: "number",
    extends: "base",
    convertValue: (value, attribute) =>
      typeof value === "string" ? parseFloat(value) : value
  },
  boolean: {
    name: "boolean",
    extends: "base",
    convertValue: (value, attribute) => (!value || value === "0" ? false : true)
  },

  integer: {
    name: "integer",
    extends: "base",
    convertValue: (value, attribute) =>
      typeof value === "string" ? parseInt(value) : value
  },
  "unsigned-integer": { name: "unsigned-integer", extends: "integer" },
  url: { name: "url", extends: "string" },
  object: { name: "object", extends: "base" }
};

/**
 * Create attributes from its definition.
 * @param {Object} newDefinitions
 * @param {Object} [presentDefinitions] optional merg in attributes
 * @return {Object} attributes
 */
export function prepareAttributesDefinitions(
  newDefinitions,
  presentDefinitions
) {
  for (const [path, def] of attributeIterator(newDefinitions)) {
    def.type = types[def.type] || types.base;
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
 * iterate over all attributes.
 * @param {Object} definition
 * @param {string[]} path
 */
export function* attributeIterator(definition, path = []) {
  if (definition) {
    for (const [name, def] of Object.entries(definition)) {
      path.push(name);

      if (def.attributes) {
        yield* attributeIterator(def.attributes, path);
      }

      yield [path, def];

      path.pop();
    }
  }
}

export function convertValue(value, attribute) {
  if (attribute?.type?.convertValue) {
    return attribute.type.convertValue(value, attribute);
  }
  return value;
}
