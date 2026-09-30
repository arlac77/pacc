import { extendingAttributeIterator } from "pacc";

/**
 * extract key value paris
 * @param {object} object 
 * @param {Type} type 
 * @param {function} filter 
 * @returns {object}
 */
export function extract(
  object,
  type = object.constructor,
  filter = attribute => !attribute.private
) {
  const result = {};

  for (const [path, attribute] of extendingAttributeIterator(type, filter)) {
    let name;
    let r = result;

    for (const i in path) {
      name = path[i];
      if (path.length > i + 1 && r[name] === undefined) {
        const nextLevel = {};
        r[name] = nextLevel;
        r = nextLevel;
      }
    }

    const value = object[name] ?? attribute.default;

    if (value !== undefined) {
      if (attribute.type.primitive) {
        if (attribute.collection) {
          if ((value.size ?? value.length) > 0) {
            r[name] = [...value.values()];
          }
        } else {
          r[name] = value;
        }
      } else {
        if (attribute.backpointer) {
          if (attribute.collection) {
            if ((value.size ?? value.length) > 0) {
              r[name] = Object.fromEntries(
                [...value.values()].map(v => [v[v.constructor.key], extract(v)])
              );
            }
          } else {
            r[name] = extract(value);
          }
        } else {
          const key = value.constructor.key;
          r[name] = { [key]: value[key], type: value.constructor.name };
        }
      }
    }
  }

  return result;
}
