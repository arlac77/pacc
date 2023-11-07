const lookup = {};

function createToken(str) {
  const token = { str };
  lookup[str] = token;
  return token;
}

export const PLUS = createToken("+");
export const MINUS = createToken("-");
export const STAR = createToken("*");
export const DIVIDE = createToken("/");
export const NOT = createToken("!");
export const NOT_EQUAL = createToken("!=");
export const GREATER = createToken(">");
export const GREATER_EQUAL = createToken(">=");
export const LESS = createToken("<");
export const LESS_EQUAL = createToken("<=");
export const EQUAL = createToken("=");
export const OPEN_ROUND = createToken("(");
export const CLOSE_ROUND = createToken(")");
export const OPEN_BRACKET = createToken("[");
export const CLOSE_BRACKET = createToken("]");
export const OPEN_CURLY = createToken("{");
export const CLOSE_CURLY = createToken("}");
export const QUESTION = createToken("?");
export const COLON = createToken(":");
export const SEMICOLON = createToken(";");
export const COMMA = createToken(",");
export const DOT = createToken(".");
export const AMPERSAND = createToken("&");
export const DOUBLE_AMPERSAND = createToken("&&");
export const BAR = createToken("|");
export const DOUBLE_BAR = createToken("||");

/**
 * Split property path into tokens
 * @generator
 * @param {string} string
 * @yields {string}
 */
export function* tokens(string) {
  let state, buffer, hex;

  for (const c of string) {
    switch (state) {
      case "string-escaping-hex":
        hex += c;
        if (hex.length === 4) {
          buffer += String.fromCharCode(parseInt(hex, 16));
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
          buffer += esc[c] || c;
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
            buffer += c;
            break;
          case "number":
          case "identifier":
            yield buffer;
            buffer = "";
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
            buffer = "";
            state = "string";
            break;
          case "string":
            yield buffer;
            state = undefined;
            break;
          case "number":
          case "identifier":
            yield buffer;
            buffer = "";
            state = "string";
            break;
          default:
            yield lookup[state];
            buffer = "";
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
            buffer += c;
            break;
          case "number":
          case "identifier":
            yield buffer;
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
            buffer += c;
            break;
          case "number":
          case "identifier":
            yield buffer;
            state = c;
            break;
          default:
            state += c;
        }
        break;
      case ":":
      case ";":
      case ",":
      case ".":
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
            buffer += c;
            break;
          case "number":
          case "identifier":
            yield buffer;
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
            buffer = c.charCodeAt(0) - "0".charCodeAt(0);
            state = "number";
            break;
          case "number":
            buffer = buffer * 10 + c.charCodeAt(0) - "0".charCodeAt(0);
            break;
          case "string":
          case "identifier":
            buffer += c;
            break;
        }
        break;

      default:
        switch (state) {
          case undefined:
            buffer = c;
            state = "identifier";
            break;
          case "string":
          case "identifier":
            buffer += c;
            break;
          default:
            if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_") {
              yield lookup[state];
              state = "identifier";
              buffer = c;
            } else {
              state += c;
            }
        }
    }
  }

  switch (state) {
    case undefined:
      break;
    case "string":
      throw new Error("unterminated string");
    case "number":
    case "identifier":
      yield buffer;
      break;
    default:
      yield lookup[state];
  }
}