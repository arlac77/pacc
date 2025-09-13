import {
  getAttributeAndOperator,
  EQUAL,
  NOT_EQUAL,
  LESS,
  LESS_EQUAL,
  GREATER,
  GREATER_EQUAL
} from "pacc";
import { binop } from "./expression.mjs";

function dateOp(op, value, against) {
  return binop(op, value.getTime(), against.getTime());
}

function collectionOp(op, value, against) {
  for (const v of value) {
    if (allOp(op, v, against)) {
      return true;
    }
  }

  return false;
}

function allOp(op, value, against) {
  switch (typeof value) {
    case "undefined":
      return false;

    case "object":
      if (value === null) {
        return false;
      }

      if (value instanceof Map) {
        return collectionOp(op, value.keys(), against);
      }
      if (value instanceof RegExp) {
        return value.test(against);
      }
      if (value[Symbol.iterator]) {
        return collectionOp(op, value, against);
      }

      switch (typeof against) {
        case "object":
          if (value instanceof Date) {
            if (
              Array.isArray(against) &&
              against[0] instanceof Date &&
              against[1] instanceof Date
            ) {
              return (
                dateOp(GREATER_EQUAL, value, against[0]) &&
                dateOp(LESS_EQUAL, value, against[1])
              );
            }

            if (against instanceof Date) {
              return dateOp(op, value, against);
            }
          }

          if (value[Symbol.toPrimitive] && against[Symbol.toPrimitive]) {
            return binop(
              op,
              value[Symbol.toPrimitive]("number"),
              against[Symbol.toPrimitive]("number")
            );
          }
          break;

        case "bigint":
        case "number":
          return allOp(op, value[Symbol.toPrimitive]("number"), against);

        case "string":
          if (against.length === 0) {
            return true;
          }

          if (value instanceof Date) {
            return dateOp(op, value, new Date(against));
          }
          break;
        case "boolean":
          return binop(op, value ? true : false, against);
      }

      if (against instanceof RegExp) {
        return against.test(value.toString());
      }

      return value.toString().match(against);
    case "string":
      switch (typeof against) {
        case "boolean":
          return binop(op, value.length !== 0, against);
        case "string":
          if (
            op === EQUAL &&
            (against.length === 0 || value.indexOf(against) >= 0)
          ) {
            return true;
          }

          if (!value.match(/^-?\d/)) {
            break;
          }
        case "bigint":
        case "number":
          return value.length ? binop(op, value, against) : true;
        case "object":
          if (value.length === 0) {
            return false;
          }

          if (against instanceof Date) {
            return dateOp(op, new Date(value), against);
          }

          if (against instanceof RegExp) {
            return against.test(value);
          }

          if (against instanceof Map) {
            for (const [k, v] of against) {
              if (allOp(op, value, k) || allOp(op, value, v)) {
                return true;
              }
            }
          }

          if (against[Symbol.iterator]) {
            for (const i of against) {
              if (allOp(op, value, i)) {
                return true;
              }
            }
            return false;
          }
      }

      return value.match(against);
    case "bigint":
    case "number":
      switch (typeof against) {
        case "object":
          if (against instanceof RegExp) {
            return against.test(String(value));
          }

          if (against instanceof Map) {
            for (const [k, v] of against) {
              if (binop(op, value, k) || binop(op, value, v)) {
                return true;
              }
            }
            return false;
          }

          if (against[Symbol.iterator]) {
            for (const i of against) {
              if (binop(op, value, i)) {
                return true;
              }
            }
            return false;
          }
      }
      return binop(op, value, against);
    case "boolean":
      switch (typeof against) {
        case "object":
          if (against[Symbol.iterator]) {
            for (const i of against) {
              if (allOp(op, value, i)) {
                return true;
              }
            }
          }
          break;
      }

      return value == against;
  }

  return false;
}

/**
 * Generate filter function.
 * @param {Object} [filterBy]
 * @returns {Function}
 */
export function filter(filterBy) {
  if (filterBy) {
    const filters = Object.entries(filterBy).map(([key, against]) => {
      return a => {
        const [value, op] = getAttributeAndOperator(a, key);
        return allOp(op, value, against);
      };
    });

    if (filters.length === 1) {
      return filters[0];
    }
    if (filters.length > 1) {
      return a => !filters.some(f => !f(a));
    }
  }

  return () => true;
}
