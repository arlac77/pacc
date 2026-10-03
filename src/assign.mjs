import { toInternal, extendingAttributeIterator } from "pacc";

/**
 * Assign values into object
 * @param {object} object
 * @param {object} values
 * @param {object} options
 */
export function assign(object, values, options = {}) {
  nextValue: for (const [path, attribute] of extendingAttributeIterator(
    options.type ?? object.constructor,
    options.filter
  )) {
    let v = values;
    let o = object;

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

        if (v[name] === undefined) {
          continue nextValue;
        } else {
          v = v[name];
        }
      }
    }

    let value = v[name];
    if (value !== undefined) {
      o[name] = value;
    }
  }
}
