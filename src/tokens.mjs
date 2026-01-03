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
function createToken(str, precedence = 0, type) {
  const token = { str, precedence, type };
  lookup[str] = [token];
  return token;
}

export /** @type {Token} */ const PLUS = createToken("+", 50, "infix");
export /** @type {Token} */ const MINUS = createToken("-", 50, "infix");
export /** @type {Token} */ const STAR = createToken("*", 60, "infix");
export /** @type {Token} */ const DIVIDE = createToken("/", 60, "infix");
export /** @type {Token} */ const NOT = createToken("!");
export /** @type {Token} */ const NOT_EQUAL = createToken("!=", 40, "infixr");
export /** @type {Token} */ const EQUAL = createToken("=", 40, "infixr");
export /** @type {Token} */ const GREATER = createToken(">", 40, "infixr");
export /** @type {Token} */ const GREATER_EQUAL = createToken(
  ">=",
  40,
  "infixr"
);
export /** @type {Token} */ const LESS = createToken("<", 40, "infixr");
export /** @type {Token} */ const LESS_EQUAL = createToken("<=", 40, "infixr");
export /** @type {Token} */ const OPEN_ROUND = createToken("(", 40, "prefix");
export /** @type {Token} */ const CLOSE_ROUND = createToken(")", 0, "infix");
export /** @type {Token} */ const OPEN_BRACKET = createToken("[", 10, "prefix");
export /** @type {Token} */ const CLOSE_BRACKET = createToken("]", 0, "infix");
export /** @type {Token} */ const OPEN_CURLY = createToken("{");
export /** @type {Token} */ const CLOSE_CURLY = createToken("}");
export /** @type {Token} */ const QUESTION = createToken("?", 20, "infix");
export /** @type {Token} */ const COLON = createToken(":", "infix");
export /** @type {Token} */ const SEMICOLON = createToken(";");
export /** @type {Token} */ const COMMA = createToken(",");
export /** @type {Token} */ const DOT = createToken(".", 80, "infix");
export /** @type {Token} */ const AMPERSAND = createToken("&");
export /** @type {Token} */ const DOUBLE_AMPERSAND = createToken(
  "&&",
  30,
  "infixr"
);
export /** @type {Token} */ const BAR = createToken("|");
export /** @type {Token} */ const DOUBLE_BAR = createToken("||", 30, "infixr");
export /** @type {Token} */ const IDENTIFIER = createToken("IDENTIFIER", 0);
export /** @type {Token} */ const EOF = createToken("EOF", -1, "eof");

const keywords = {
  true: [true],
  false: [false]
};

const esc = {
  b: "\b",
  f: "\f",
  n: "\n",
  r: "\r",
  t: "\t",
  v: "\v"
};

/**
 * Split property path into tokens
 * @generator
 * @param {string} string
 * @yields {Token}
 */
export function* tokens(string) {
  let state, value, hex, divider, quote;

  const keywordOrIdentifier = () => keywords[value] || [IDENTIFIER, value];
  const startString = c => {
    value = "";
    state = "string";
    quote = c;
  };

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
          value += esc[c] || c;
          state = "string";
        }
        continue;
    }

    switch (c) {
      case "\n":
      case "\r":
      case "\t":
      case "\v":
      case " ":
        switch (state) {
          case "number":
          case "number-fraction":
            yield [value];
            state = undefined;
          case undefined:
            break;
          case "string":
            value += c;
            break;
          case "identifier":
            yield keywordOrIdentifier();
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
          case "number":
          case "number-fraction":
            yield [value];
          case undefined:
            startString(c);
            break;
          case "string":
            if (c === quote) {
              yield [value];
              state = undefined;
            } else {
              value += c;
            }
            break;
          case "identifier":
            yield keywordOrIdentifier();
            startString(c);
            break;
          default:
            yield lookup[state];
            startString(c);
        }
        break;
      case "!":
      case ">":
      case "<":
      case "&":
      case "|":
        switch (state) {
          case "number":
          case "number-fraction":
            yield [value];
          case undefined:
            state = c;
            break;
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
          case "string":
            value += c;
            break;
          case "identifier":
            yield keywordOrIdentifier();
            state = c;
            break;
          default:
            yield lookup[state];
            state = c;
        }
        break;

      case "=":
        switch (state) {
          case "number":
          case "number-fraction":
            yield [value];
          case undefined:
            state = c;
            break;
          case "identifier":
            yield keywordOrIdentifier();
            state = c;
            break;
          case "string":
            value += c;
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
          case "number":
          case "number-fraction":
            yield [value];
          case undefined:
            state = c;
            break;
          case "identifier":
            yield keywordOrIdentifier();
            state = c;
            break;
          case "string":
            value += c;
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
          case ".":
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
          case "number":
          case "number-fraction":
            yield [value];
          case undefined:
            state = "identifier";
            value = c;
            break;
          case "string":
          case "identifier":
            value += c;
            break;
          default:
            yield lookup[state];
            value = c;
            state = "identifier";
        }
    }
  }

  switch (state) {
    case undefined:
      break;
    case "string":
      throw new Error("unterminated string", { cause: string });
    case "number-fraction":
    case "number":
      yield [value];
      break;
    case "identifier":
      yield keywordOrIdentifier();
      break;
    default:
      yield lookup[state];
  }
}
