/**
 * @typedef {import('./tokens.mjs').Token} Token
 */

import {
  tokens,
  EQUAL,
  NOT_EQUAL,
  DOT,
  OPEN_BRACKET,
  CLOSE_BRACKET,
  LESS,
  LESS_EQUAL,
  GREATER,
  GREATER_EQUAL,
  STAR,
  IDENTIFIER,
  STRING,
  NUMBER,
  BOOLEAN
} from "./tokens.mjs";
import { parseOnly, parse } from "./parser.mjs";
import { toInternal } from "./attributes.mjs";
import { keyedAccessOrGlobalEval, keyedAccessEval, pathEval } from "./ast.mjs";

/**
 * Set object attribute.
 * The name may be a property path like 'a.b.c'.
 * @param {Object} object
 * @param {string} expression
 * @param {any} value
 * @param {Object} [definition] type def
 */
export function setAttribute(object, expression, value, definition) {
  if(definition?.set) {
    definition.set.call(object, value, definition);
    return;
  }

  const context = {};
  const ast = parseOnly(expression, context);

  let parent, parentItem;

  switch (ast.eval) {
    case keyedAccessEval:
    case keyedAccessOrGlobalEval:
      object[ast.key] = toInternal(value, definition);
      break;

    case pathEval:
      for (const item of ast.path) {
        if (typeof object !== "object") {
          object = typeof item.key === "number" ? [] : {};
          parent[parentItem.key] = object;
        }

        parent = object;
        parentItem = item;

        object = item.eval(item, object, context);
      }

      parent[parentItem.key] = toInternal(value, definition);
      break;

      default:
        console.log("UKNOWN AST",ast);
  }
}

/**
 * Deliver attribute value.
 * The name may be a property path like 'a.b.c' or a[2]
 * @param {Object} object
 * @param {string} expression
 * @param {Object} [definition]
 * @returns {any} value associated with the given property name
 */
export function getAttribute(object, expression, definition) {
  return parse(expression, { root: object }) ?? definition?.default;
}

/**
 * Deliver attribute value and operator.
 * The name may be a property path like 'a.b.c <='.
 * @param {Object} object
 * @param {string} expression
 * @returns {[any,Token]} value associated with the given property name
 */
export function getAttributeAndOperator(object, expression) {
  switch (typeof object?.[expression]) {
    case "function":
      object = object[expression]();
      if (typeof object[Symbol.iterator] === "function") {
        object = [...object];
      }
      return [object, EQUAL];
    case "undefined":
      break;
    default:
      return [object[expression], EQUAL];
  }

  let predicateTokens;
  let op = EQUAL;

  const next = tokens(expression);

  for (const token of next) {
    switch (token[0]) {
      case GREATER_EQUAL:
      case LESS_EQUAL:
      case GREATER:
      case LESS:
      case EQUAL:
      case NOT_EQUAL:
        op = token[0];
        break;
      case DOT:
      case OPEN_BRACKET:
        predicateTokens = [];
        break;
      case CLOSE_BRACKET:
        // TODO: should loop over array actually getAttribute api should deliver iterators
        if (object[Symbol.iterator]) {
          object = [...object][0];
        }

        predicateTokens = undefined;
        break;
      case STAR:
        if (!predicateTokens) {
          const error = new Error("unexpected '*' in attribute path");
          // @ts-ignore
          error.expression = expression;
          throw error;
        }
        predicateTokens.push(token[0]);
        break;

      case STRING:
      case NUMBER:
      case BOOLEAN:
      case IDENTIFIER:
        if (object !== undefined) {
          switch (typeof object[token[1]]) {
            case "function":
              object = object[token[1]]();
              if (typeof object[Symbol.iterator] === "function") {
                object = [...object];
              }
              break;
            default:
              object = object[token[1]];
              break;
            case "undefined":
              return [undefined, op];
          }
        }
        break;
    }
  }

  return [object, op];
}
