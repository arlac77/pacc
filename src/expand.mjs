import { parse } from "./parser.mjs";

const maxNestingLevel = 8;

class _Dummy {}

/**
 * Default expand context
 * using '§{' and '}' as lead in/out
 */
export const expandContextDefault = {
  root: {},
  current: {},
  leadIn: "${",
  leadOut: "}",
  stopClass: _Dummy
};

/**
 * Expand context with doubble curly separaion '{{' '}}'
 */
export const expandContextDoubbleCurly = {
  ...expandContextDefault,
  leadIn: "{{",
  leadOut: "}}"
};

/**
 * Expand expressions inside of object graphs.
 * @param {any} object
 * @param {Object} context
 * @param {any} [context.root] actual replacement values
 * @param {any} [context.current] actual replacement values
 * @param {function} [context.stopClass] do not expand instanceof
 * @param {string} [context.leadIn] starting separator
 * @param {string} [context.leadOut] ending separator
 * @returns {any|Promise<any>}
 */
export function expand(object, context) {
  const /** @type {Array<Promise<any>>} */ promises = [];

  context = Object.assign({}, expandContextDefault, context);
  const leadIn = context.leadIn;
  const leadOut = context.leadOut;
  const seen = new Map();

  function _expand(object, path) {
    if (path.length >= maxNestingLevel) {
      throw new Error(
        `Max nesting level ${maxNestingLevel} reached: ${object}`,
        {
          cause: path
        }
      );
    }

    const e = seen.get(object);
    if (e) {
      return e;
    }

    if (typeof object === "string" || object instanceof String) {
      let copy = "";

      const localPromises = [];

      let cur = 0;
      let start;

      while ((start = object.indexOf(leadIn, cur)) >= 0) {
        const end = object.indexOf(leadOut, cur + leadIn.length);

        if (end >= 0) {
          const expression = object.substring(start + leadIn.length, end);

          let value = parse(expression, context);
          if (value === undefined) {
            copy += object.substring(cur, end + leadOut.length);
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
            copy += object.substring(cur, start) + value;
          }

          cur = end + leadOut.length;
        } else {
          throw new Error(
            `Unterminated expression between '${leadIn}' and '${leadOut}'`,
            { cause: object }
          );
        }
      }

      copy += object.substring(cur);

      seen.set(object, copy);
      return copy;
    }

    switch (typeof object) {
      case "undefined":
      case "boolean":
      case "number":
      case "bigint":
      case "function":
        seen.set(object, object);
        return object;
    }

    if (object === null) {
      return object;
    }

    if (Array.isArray(object)) {
      const copy = new object.constructor[Symbol.species](object.length);

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
          r.then(f => (copy[index] = f));
        }
        copy[index] = r;
      }

      seen.set(object, copy);
      return copy;
    }

    if (typeof object.add === "function") {
      const copy = new object.constructor[Symbol.species]();
      for (const value of object.values()) {
        copy.add(_expand(value, [...path, { value }]));
      }

      seen.set(object, copy);
      return copy;
    }

    if (typeof object.entries === "function") {
      const copy = new object.constructor[Symbol.species]();

      for (const [key, value] of object.entries()) {
        const path2 = [
          ...path,
          {
            key,
            value
          }
        ];

        copy.set(_expand(key, path2), _expand(value, path2));
      }

      seen.set(object, copy);
      return copy;
    }

    if (object instanceof context.stopClass) {
      seen.set(object, object);
      return object;
    }

    if (Object.prototype.toString.call(object) !== "[object Object]") {
      seen.set(object, object);
      return object;
    }

    let copy = {};

    seen.set(object, copy);

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
        copy[newKey] = value;
      } else {
        copy = newKey;
        seen.set(object, copy);
      }
    }
    return copy;
  }

  const value = _expand(object, []);
  return promises.length > 0 ? Promise.all(promises).then(() => value) : value;
}
