import { getAttribute } from "./settergetter.mjs";
import { oneOfType } from "./types.mjs";

/**
 * Create attributes from its definition.
 * @param {Object} newDefinitions
 * @param {Object} [presentDefinitions] optional merge in attributes
 * @return {Object} attributes
 */
export function prepareAttributesDefinitions(
  newDefinitions,
  presentDefinitions
) {
  for (const [path, def] of attributeIterator(newDefinitions)) {
    if (typeof def.type === "string") {
      def.type = oneOfType(def.type);
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
 * Iterate over all attributes.
 * @param {Object} definition
 * @param {Function} filter
 * @param {string[]} path
 * @return {Iterable<[string[],object]>}
 */
export function* attributeIterator(definition, filter, path = []) {
  if (definition) {
    for (const [name, def] of Object.entries(definition)) {
      const path2 = [...path, name];
      if (typeof filter !== 'function' || filter(name, def)) {
        yield [path2, def];
      }

      yield* attributeIterator(def.attributes, filter, path2);
    }
  }
}

export const filterWritable = (name, attribute) => attribute.writable;

export function* writableAttributeIterator(definition) {
  yield* attributeIterator(definition, filterWritable);
}

export function prepareValue(value, attribute) {
  if (attribute) {
    const prepareValue = attribute.prepareValue ?? attribute.type?.prepareValue;
    if (prepareValue) {
      return prepareValue(value, attribute);
    }
  }
  return value;
}

export function mandatoryAttributesPresent(object, attributes) {
  for (const [path, attribute] of attributeIterator(
    attributes,
    (name, attribute) => attribute.mandatory
  )) {
    const name = path.join(".");
    if (getAttribute(object, name) === undefined) {
      return false;
    }
  }
  return true;
}
