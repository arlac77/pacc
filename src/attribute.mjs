/**
 * @typedef {Object} AttributeDefinition
 *
 * @property {string} type
 * @property {boolean} writable
 * @property {boolean} [private] should the value be shown
 * @property {string} [depends] name of an attribute we depend on
 * @property {string[]} additionalAttributes extra attributes that are present in case our attribute is set
 * @property {string} description
 * @property {any} [default] the default value
 * @property {Function} [set] set the value
 * @property {Function} [get] get the value can be used to calculate default values
 * @property {string[]|string} [env] environment variable use to provide the value
 */

import { tokens } from "./tokens.mjs";

export { tokens };

/**
 * Set Object attribute.
 * The name may be a property path like 'a.b.c'.
 * @param {Object} object
 * @param {string} expression
 * @param {any} value
 */
export function setAttribute(object, expression, value) {
  let lastObject = object;
  let lastKey;

  for (const token of tokens(expression)) {
    switch (token) {
      case ">":
      case "<":
      case ".":
      case "[":
      case "]":
        break;

      default:
        if (object[token] === undefined || typeof object[token] !== "object") {
          object[token] = {};
        }

        lastObject = object;
        lastKey = token;

        object = object[token];
    }
  }

  if (lastKey) {
    lastObject[lastKey] = value;
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
  if (object?.[expression] !== undefined) {
    return object[expression];
  }

  return getAttributeAndOperator(object, expression)[0];
}

/**
 * Deliver attribute value and operator.
 * The name may be a property path like 'a.b.c <='.
 * @param {Object} object
 * @param {string} expression
 * @returns {[any,string]} value associated with the given property name
 */
export function getAttributeAndOperator(object, expression, getters = {}) {
  let op = "=";
  let predicateTokens;

  for (const token of tokens(expression)) {
    switch (token) {
      case ">=":
      case "<=":
      case ">":
      case "<":
      case "=":
      case "!=":
        op = token;
        break;
      case ".":
      case "[":
        predicateTokens = [];
        break;
      case "]":
        // TODO: should loop over array actually getAttribute api should deliver iterators
        if (object[Symbol.iterator]) {
          object = [...object][0];
        }

        predicateTokens = undefined;
        break;
      case "*":
        predicateTokens.push(token);
        break;

      default:
        if (object === undefined) {
          break;
        }

        const g = getters[token];
        if (g) {
          object = g(object);
        } else {
          if (object[token] !== undefined) {
            object = object[token];
          } else {
            return [undefined, op];
          }
        }
    }
  }

  return [object, op];
}
