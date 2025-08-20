/**
 * Token lookup
 */
const lookup = {};

/**
 * @typedef {Object} Token
 * @property {string} str
 */

/**
 *
 * @param {string} str
 * @returns {Token}
 */
function createToken(str) {
  const token = { str };
  lookup[str] = token;
  return token;
}

export /** @type {Token} */ const PLUS = createToken("+");
export /** @type {Token} */ const MINUS = createToken("-");
export /** @type {Token} */ const STAR = createToken("*");
export /** @type {Token} */ const DIVIDE = createToken("/");
export /** @type {Token} */ const NOT = createToken("!");
export /** @type {Token} */ const NOT_EQUAL = createToken("!=");
export /** @type {Token} */ const GREATER = createToken(">");
export /** @type {Token} */ const GREATER_EQUAL = createToken(">=");
export /** @type {Token} */ const LESS = createToken("<");
export /** @type {Token} */ const LESS_EQUAL = createToken("<=");
export /** @type {Token} */ const EQUAL = createToken("=");
export /** @type {Token} */ const OPEN_ROUND = createToken("(");
export /** @type {Token} */ const CLOSE_ROUND = createToken(")");
export /** @type {Token} */ const OPEN_BRACKET = createToken("[");
export /** @type {Token} */ const CLOSE_BRACKET = createToken("]");
export /** @type {Token} */ const OPEN_CURLY = createToken("{");
export /** @type {Token} */ const CLOSE_CURLY = createToken("}");
export /** @type {Token} */ const QUESTION = createToken("?");
export /** @type {Token} */ const COLON = createToken(":");
export /** @type {Token} */ const SEMICOLON = createToken(";");
export /** @type {Token} */ const COMMA = createToken(",");
export /** @type {Token} */ const DOT = createToken(".");
export /** @type {Token} */ const AMPERSAND = createToken("&");
export /** @type {Token} */ const DOUBLE_AMPERSAND = createToken("&&");
export /** @type {Token} */ const BAR = createToken("|");
export /** @type {Token} */ const DOUBLE_BAR = createToken("||");

/**
 * Split property path into tokens
 * @generator
 * @param {string} string
 * @yields {Token}
 */
export function* tokens(string) {
  let state, value, hex, divider;

  for (const c of string) {
    switch (state) {
      case "string-escaping-hex":
        hex += c;
        // @ts-ignore
        if (hex.length === 4) {
          // @ts-ignore
          value += String.fromCharCode(parseInt(hex, 16));
          state = "string";
        }
        continue;
      case "string-escaping":
        if (c === "u") {
          state = "string-escaping-hex";
          hex = "";
        } else {
          const esc = {
            b: "\b",
            f: "\f",
            n: "\n",
            r: "\r",
            t: "\t"
          };
          value += esc[c] || c;
          state = "string";
        }
        continue;
    }

    switch (c) {
      case "\t":
      case " ":
        switch (state) {
          case undefined:
            break;
          case "string":
            value += c;
            break;
          case "number-fraction":
          case "number":
          case "identifier":
            yield value;
            value = undefined;
            state = undefined;
            break;
          default:
            yield lookup[state];
            state = undefined;
        }
        break;

      case "\\":
        switch (state) {
          case "string":
            state = "string-escaping";
            break;
        }
        break;
      case '"':
      case "'":
        switch (state) {
          case undefined:
            value = "";
            state = "string";
            break;
          case "string":
            yield value;
            state = undefined;
            break;
          case "number-fraction":
          case "number":
          case "identifier":
            yield value;
            value = "";
            state = "string";
            break;
          default:
            yield lookup[state];
            value = "";
            state = "string";
        }
        break;
      case "!":
      case ">":
      case "<":
      case "&":
      case "|":
        switch (state) {
          case "&":
          case "|":
            if (state === c) {
              state += c;
              yield lookup[state];
              state = undefined;
            } else {
              yield lookup[state];
              state = c;
            }
            break;
          case undefined:
            state = c;
            break;
          case "string":
            value += c;
            break;

          case "number-fraction":
          case "number":
          case "identifier":
            yield value;
            state = c;
            break;
          default:
            yield lookup[state];
            state = c;
        }
        break;

      case "=":
        switch (state) {
          case undefined:
            state = c;
            break;
          case "string":
            value += c;
            break;
          case "number-fraction":
          case "number":
          case "identifier":
            yield value;
            state = c;
            break;
          default:
            state += c;
        }
        break;
      case ".":
        if (state === "number") {
          state = "number-fraction";
          divider = 10;
          break;
        }
      case ":":
      case ";":
      case ",":
      case "+":
      case "-":
      case "*":
      case "/":
      case "(":
      case ")":
      case "[":
      case "]":
      case "{":
      case "}":
        switch (state) {
          case undefined:
            state = c;
            break;
          case "string":
            value += c;
            break;
          case "number":
          case "number-fraction":
          case "identifier":
            yield value;
            state = c;
            break;
          default:
            yield lookup[state];
            state = c;
        }
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        switch (state) {
          default:
            yield lookup[state];
          case undefined:
            value = c.charCodeAt(0) - 48;
            state = "number";
            break;
          case '.':
              state = "number-fraction";
              value = 0;
              divider = 10;
          case "number-fraction":
            value = value + (c.charCodeAt(0) - 48) / divider;
            divider *= 10;
            break;
          case "number":
            // @ts-ignore
            value = value * 10 + c.charCodeAt(0) - 48;
            break;
          case "string":
          case "identifier":
            value += c;
            break;
        }
        break;

      default:
        switch (state) {
          case undefined:
            value = c;
            state = "identifier";
            break;
          case "string":
          case "identifier":
            value += c;
            break;
          default:
            yield lookup[state];
            state = "identifier";
            value = c;
        }
    }
  }

  switch (state) {
    case undefined:
      break;
    case "string":
      const error = new Error("unterminated string");
      // @ts-ignore
      error.expression = string;
      throw error;
    case "number-fraction":
    case "number":
    case "identifier":
      yield value;
      break;
    default:
      yield lookup[state];
  }
}
