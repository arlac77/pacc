/**
 * @typedef {Object} AttributeDefinition
 *
 * @property {string} type
 * @property {boolean} isKey
 * @property {boolean} writable
 * @property {boolean} mandatory
 * @property {boolean} [private] should the value be shown
 * @property {string} [depends] name of an attribute we depend on
 * @property {string[]} additionalAttributes extra attributes that are present in case our attribute is set
 * @property {string} [description] human readable
 * @property {any} [default] the default value
 * @property {Function} [set] set the value
 * @property {Function} [get] get the value can be used to calculate default values
 * @property {string[]|string} [env] environment variable(s) used to provide the value
 */

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
export * from "./tokens.mjs";

/**
 * Set Object attribute.
 * The name may be a property path like 'a.b.c'.
 * @param {Object} object
 * @param {string} expression
 * @param {any} value
 */
export function setAttribute(object, expression, value) {
  let anchor, anchorKey;

  for (const token of tokens(expression)) {
    switch (token) {
      case DOT:
      case OPEN_BRACKET:
      case CLOSE_BRACKET:
        break;

      default:
        if (anchor) {
          anchor[anchorKey] = object = typeof token === "string" ? {} : [];
          anchor = undefined;
        }

        const next = object[token];

        if (next === undefined || typeof next !== "object") {
          anchor = object;
          anchorKey = token;
        } else {
          object = next;
        }
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
  return object?.[expression] || getAttributeAndOperator(object, expression)[0];
}

/**
 * Deliver attribute value and operator.
 * The name may be a property path like 'a.b.c <='.
 * @param {Object} object
 * @param {string} expression
 * @returns {[any,Token]} value associated with the given property name
 */
export function getAttributeAndOperator(object, expression) {
  let op = EQUAL;
  let predicateTokens;

  for (const token of tokens(expression)) {
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
        if(!predicateTokens) {
          const error = new Error("unexpected '*' in attribute path");
          // @ts-ignore
          error.expression = expression;
          throw error;
        }
        predicateTokens.push(token);
        break;

      default:
        if (object === undefined) {
          break;
        }

        if (object[token] !== undefined) {
          object = object[token];
        } else {
          return [undefined, op];
        }
    }
  }

  return [object, op];
}
