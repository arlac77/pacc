const types = {
  base: { name: "base" },
  string: { name: "string" },
  number: { name: "number" },
  integer: { name: "integer" },
  "unsigned-integer": { name: "unsigned-integer" },
  boolean: { name: "boolean" },
  url: { name: "url" },
  object: { name: "object" }
};

/**
 * Create attributes from its definition.
 * @param {Object} newDefinitions
 * @param {Object|undefined} presentDefinitions optional merg in attributes
 * @return {Object} attributes
 */
export function prepareAttributesDefinitions(
  newDefinitions,
  presentDefinitions
) {
  for (const [name, d] of Object.entries(newDefinitions)) {
    if (d.attributes === undefined) {
      d.type = types[d.type] || types.base;
    } else {
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
