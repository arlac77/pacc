
/**
 * Convert scalar or iterable into Array.
 * @param {any} value
 * @returns {Array<any>}
 */
export function asArray(value) {
  switch (typeof value) {
    case "undefined":
      return [];
    case "object":
      if (Array.isArray(value)) {
        return value;
      }

      if (value instanceof Iterator || value[Symbol.iterator]) {
        return [...value];
      }
  }

  return [value];
}

/**
 * @param {any} value
 * @returns {Iterable<any>}
 */
export function asIterator(value) {
  switch (typeof value) {
    case "undefined":
      return [];
    case "string":
    case "number":
    case "boolean":
    case "bigint":
      return [value];
  }

  if (value[Symbol.iterator]) {
    return value;
  }

  return asArray(value);
}
