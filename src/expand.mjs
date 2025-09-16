import { parse } from "./expression.mjs";
import { tokens } from "./tokens.mjs";

const maxNestingLevel = 5;

export function expand(object, context) {
  const promises = [];

  function _expand(object, path) {
    if (path.length >= maxNestingLevel) {
      throw new Error(
        `Max nesting level ${maxNestingLevel} reached: ${object}`
      );
    }

    if (typeof object === "string" || object instanceof String) {
      let wholeValue;

      const localPromises = [];
      const v = object.replace(
        /\$\{([^\}]*)\}/g,
        (match, expression, offset, string) => {
          context.tokens = tokens(expression);
          let value = parse(context);

          if (typeof value === "string" || value instanceof String) {
            value = _expand(value, path);
          } else if (value === undefined) {
            value = "${" + expression + "}";
          }
          if (string.length === expression.length + 3) {
            wholeValue = value;
            return "";
          }

          if (value instanceof Promise) {
            localPromises.push(value);
            return "${" + (localPromises.length - 1) + "}";
          }
          return value;
        }
      );

      if (wholeValue !== undefined) {
        return wholeValue;
      }

      if (localPromises.length !== 0) {
        return Promise.all(localPromises).then(all =>
          v.replace(/\$\{(\d+)\}/g, (match, key) => all[parseInt(key, 10)])
        );
      }

      return v;
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
