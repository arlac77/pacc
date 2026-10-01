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

    const outName = attribute.externalName ?? name;
    const value = object[name] ?? attribute.default;


    if (value !== undefined) {
      if (attribute.type.primitive) {
        if (attribute.collection) {
          if ((value.size ?? value.length) > 0) {
            r[outName] = [...value.values()];
          }
        } else {
          r[outName] = value;
        }
      } else {
        if (attribute.backpointer) {
          if (attribute.collection) {
            if ((value.size ?? value.length) > 0) {
              r[outName] = Object.fromEntries(
                [...value.values()].map(v => [v[v.constructor.key], extract(v)])
              );
            }
          } else {
            r[outName] = extract(value);
          }
        } else {
          const key = value.constructor.key;
          r[outName] = { [key]: value[key], type: value.constructor.name };
        }
      }
    }
  }

  return result;
}
