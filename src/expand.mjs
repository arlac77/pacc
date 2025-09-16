import { parse } from "./expression.mjs";
import { tokens } from "./tokens.mjs";

export function expand(object, context) {
  switch (typeof object) {
    case "string":
      return object.replaceAll(/\$\{([^\}]*)\}/g, (match, m1) => {
        context.tokens = tokens(m1);
        return parse(context) ?? "${" + m1 + "}";
      });

    case "object":
      if (object instanceof Map) {
        return new Map(
          [...object].map(([k, v]) => [expand(k, context), expand(v, context)])
        );
      }

      if (object instanceof Set) {
        return new Set([...object].map(e => expand(e, context)));
      }

      if (Array.isArray(object)) {
        return object.map(e => expand(e, context));
      }

      return Object.fromEntries(
        Object.entries(object).map(([k, v]) => [k, expand(v, context)])
      );
  }

  return object;
}
