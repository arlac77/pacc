import { toInternal, extendingAttributeIterator } from "pacc";

/**
 * Assign values into object
 * @param {object} object
 * @param {object} values
 * @param {object} options
 * @param {Type} [options.type]
 * @param {function} [filter] filer attributes
 * @param {boolean} [externalNames] use external names
 */
export function assign(object, values, options = {}) {
  for (const [path, attribute] of extendingAttributeIterator(
    options.type ?? object.constructor,
    options.filter
  )) {
    let o = object;
    let v = values;

    let name;

    for (const i in path) {
      name = path[i];
      if (path.length > i + 1) {
        if (o[name] === undefined) {
          const nextLevel = {};
          o[name] = nextLevel;
          o = nextLevel;
        } else {
          o = o[name];
        }

        v = v?.[name];
      }
    }

    let value = toInternal(v?.[name], attribute);

    if (value === undefined && attribute.default && o[name] === undefined) {
      o[name] = attribute.default;
    } else {
      if (value !== undefined) {
        o[name] = value;
      }
    }
  }
}
