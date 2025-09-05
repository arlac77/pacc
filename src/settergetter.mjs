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
  STAR
} from "./tokens.mjs";
import { parse } from "./expression.mjs";

/**
 * Set object attribute.
 * The name may be a property path like 'a.b.c'.
 * @param {Object} object
 * @param {string} expression
 * @param {any} value
 */
export function setAttribute(object, expression, value) {
  const { path } = parse({ tokens: tokens(expression) });

  let anchor, anchorKey;

  for (const key of path) {
    if (anchor) {
      anchor[anchorKey] = object = typeof key === "string" ? {} : [];
      anchor = undefined;
    }

    const next = object[key];

    if (next === undefined || typeof next !== "object") {
      anchor = object;
      anchorKey = key;
    } else {
      object = next;
    }
  }

  if (anchor) {
    anchor[anchorKey] = value;
  }
}

/**
 * Deliver attribute value.
 * The name may be a property path like 'a.b.c' or a[2]
 * @param {Object} object
 * @param {string} expression
 * @returns {any} value associated with the given property name
 */
export function getAttribute(object, expression) {
  return getAttributeAndOperator(object, expression)[0];
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
    switch (token) {
      case GREATER_EQUAL:
      case LESS_EQUAL:
      case GREATER:
      case LESS:
      case EQUAL:
      case NOT_EQUAL:
        op = token;
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
        predicateTokens.push(token);
        break;

      default:
        if (object !== undefined) {
          switch (typeof object[token]) {
            case "function":
              object = object[token]();
              if (typeof object[Symbol.iterator] === "function") {
                object = [...object];
              }
              break;
            default:
              object = object[token];
              break;
            case "undefined":
              return [undefined, op];
          }
        }
    }
  }

  return [object, op];
}
