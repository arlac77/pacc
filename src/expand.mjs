import { parse } from "./expression.mjs";

const maxNestingLevel = 8;

/**
 * Expand expressions inside of object graphs.
 * @param {any} object
 * @param {Object} context
 * @param {any} [context.root]
 * @param {function} [context.stopClass]
 * @param {string} [context.leadIn]
 * @param {string} [context.leadOut]
 * @returns {any}
 */
export function expand(object, context = {}) {
  const /** @type {Array<Promise<any>>} */ promises = [];

  const leadIn = context.leadIn ?? "${";
  const leadOut = context.leadOut ?? "}";

  function _expand(object, path) {
    if (path.length >= maxNestingLevel) {
      throw new Error(
        `Max nesting level ${maxNestingLevel} reached: ${object}`,
        {
          cause: path
        }
      );
    }

    if (typeof object === "string" || object instanceof String) {
      let result = "";

      const localPromises = [];

      let cur = 0;
      let start;

      while ((start = object.indexOf(leadIn, cur)) >= 0) {
        const end = object.indexOf(leadOut, cur + leadIn.length);

        if (end >= 0) {
          const expression = object.substring(start + leadIn.length, end);

          let value = parse(expression, context);
          if (value === undefined) {
            result += object.substring(cur, end + leadOut.length);
          } else {
            if (typeof value === "string") {
              value = _expand(value, path);
            }
            if (value instanceof Promise) {
              localPromises.push(value);
              value = localPromises.length - 1;
            }

            if (start === 0 && end === object.length - leadOut.length) {
              return value;
            }
            result += object.substring(cur, start) + value;
          }

          cur = end + leadOut.length;
        } else {
          throw new Error(
            `Unterminated expression between '${leadIn}' and '${leadOut}'`,
            { cause: object }
          );
        }
      }

      result += object.substring(cur);

      return result;
    }

    switch (typeof object) {
      case "undefined":
      case "boolean":
      case "number":
      case "bigint":
      case "function":
        return object;
    }

    if (object === null || object instanceof Number || object instanceof Date) {
      // TODO: find a better way to identify special cases
      return object;
    }

    if (object instanceof Map) {
      const r = new Map();
      for (const [key, value] of object.entries()) {
        const path2 = [
          ...path,
          {
            key,
            value
          }
        ];

        r.set(_expand(key, path2), _expand(value, path2));
      }

      return r;
    }

    if (object instanceof Set) {
      const r = new Set();
      for (const value of object.values()) {
        r.add(_expand(value, [...path, { value }]));
      }

      return r;
    }

    if (Array.isArray(object)) {
      const array = new Array(object.length);

      for (let index = 0; index < object.length; index++) {
        const o = object[index];
        const r = _expand(o, [
          ...path,
          {
            key: index,
            value: o
          }
        ]);
        if (r instanceof Promise) {
          promises.push(r);
          r.then(f => (array[index] = f));
        }
        array[index] = r;
      }

      return array;
    }

    if (context.stopClass && object instanceof context.stopClass) {
      return object;
    }

    let newObject = {};

    for (let [key, value] of Object.entries(object)) {
      const newKey = _expand(key, path);
      if (typeof newKey === "string" || newKey instanceof String) {
        value = _expand(value, [
          ...path,
          {
            key,
            value
          }
        ]);
        if (value instanceof Promise) {
          promises.push(value);
          value.then(v => (newObject[newKey] = v));
        }
        newObject[newKey] = value;
      } else {
        newObject = newKey;
      }
    }

    return newObject;
  }

  const value = _expand(object, []);
  return promises.length > 0 ? Promise.all(promises).then(() => value) : value;
}
