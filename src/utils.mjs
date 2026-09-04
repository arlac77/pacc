/**
 * Convert scalar or iterable into an array.
 * The value undefined will be represented as an empty array.
 * @param {Iterable<any>|Array<any>|any} value
 * @return {Array<any>} value encapsulated in an array
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

/**
 * @param {any} value
 * @returns {Iterable<any>}
 */
export function asValueIterator(value) {
  switch (typeof value) {
    case "undefined":
      return [];
    case "string":
    case "number":
    case "boolean":
    case "bigint":
      return [value];
  }

  if (typeof value.values === "function") {
    return value.values();
  }

  if (value[Symbol.iterator]) {
    return value;
  }

  return asArray(value);
}
