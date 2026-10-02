import { toExternal, extendingAttributeIterator } from "pacc";

/**
 * extract key value paris
 * @param {object} object
 * @param {object} options
 * @param {Type} [options.type]
 * @param {function} [filter]
 * @param {boolean} [externalNames]
 * @returns {object}
 */
export function extract(object, options = {}) {
  const type = options.type ?? object.constructor;

  const result = {};

  for (const [path, attribute] of extendingAttributeIterator(
    type,
    options.filter
  )) {
    let r = result;
    let o = object;

    let name;

    for (const i in path) {
      name = path[i];
      if (path.length > i + 1) {
        if (r[name] === undefined) {
          const nextLevel = {};
          r[name] = nextLevel;
          r = nextLevel;
        } else {
          r = r[name];
        }

        if (o[name] !== undefined) {
          o = o[name];
        }
      }
    }

    let value = o[name] ?? attribute.default;

    const outName = (options.externalNames && attribute.externalName) || name;

    if (value !== undefined) {
      if(value == attribute.default && attribute.skipDefault ||
         attribute.collection && attribute.skipEmpty && value.size === 0) {
        continue;
      }

      value = toExternal(value, attribute);
      if (attribute.type.primitive) {
        r[outName] = value;
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
          if(key) {
            r[outName] = { [key]: value[key], type: value.constructor.name };
          }
        }
      }
    }
  }

  return result;
}
