import { pathEval, ASTTrue, functionEval } from "./ast.mjs";

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
 * @param {number} [precedence]
 * @param {string} [type]
 * @param {Function} [led]
 * @returns {Token}
 */
function createToken(
  str,
  precedence = 0,
  type,
  led = () => {},
  nud = () => {}
) {
  const token = { str, precedence, type };

  switch (type) {
    case "infix":
      token.led = (parser, left) =>
        led(left, parser.expression(token.precedence));
      break;
    case "infixr":
      token.led = (parser, left) =>
        led(left, parser.expression(token.precedence - 1));
      break;
    default:
      token.led = led;
  }

  token.nud = nud;
  lookup[str] = [token];
  return token;
}

function createBinopToken(str, precedence, type, binop) {
  const token = createToken(str, precedence, type, (left, right) => {
    if (!left.eval && !right.eval) {
      return binop(left, right);
    }

    return {
      eval: (node, current, context) =>
        binop(
          node.left.eval
            ? node.left.eval(node.left, current, context)
            : node.left,
          node.right.eval
            ? node.right.eval(node.right, current, context)
            : node.right
        ),
      token,
      left,
      right
    };
  });

  token.binop = binop;

  return token;
}

export /** @type {Token} */ const PLUS = createBinopToken(
  "+",
  50,
  "infix",
  (left, right) => {
    if (Array.isArray(left)) {
      if (Array.isArray(right)) {
        return [...left, ...right];
      }
    }
    return left + right;
  }
);

export /** @type {Token} */ const MINUS = createBinopToken(
  "-",
  50,
  "infix",
  (left, right) => left - right
);
export /** @type {Token} */ const STAR = createBinopToken(
  "*",
  60,
  "infix",
  (left, right) => left * right
);
export /** @type {Token} */ const DIVIDE = createBinopToken(
  "/",
  60,
  "infix",
  (left, right) => left / right
);
export /** @type {Token} */ const NOT = createToken("!");
export /** @type {Token} */ const NOT_EQUAL = createBinopToken(
  "!=",
  40,
  "infixr",
  (left, right) => left != right
);
export /** @type {Token} */ const EQUAL = createBinopToken(
  "=",
  40,
  "infixr",
  (left, right) => left == right
);
export /** @type {Token} */ const GREATER = createBinopToken(
  ">",
  40,
  "infixr",
  (left, right) => left > right
);
export /** @type {Token} */ const GREATER_EQUAL = createBinopToken(
  ">=",
  40,
  "infixr",
  (left, right) => left >= right
);
export /** @type {Token} */ const LESS = createBinopToken(
  "<",
  40,
  "infixr",
  (left, right) => left < right
);
export /** @type {Token} */ const LESS_EQUAL = createBinopToken(
  "<=",
  40,
  "infixr",
  (left, right) => left <= right
);
export /** @type {Token} */ const OPEN_ROUND = createToken(
  "(",
  40,
  "prefix",
  (parser, left) => {
    const args = [];
    while (parser.token !== CLOSE_ROUND) {
      args.push(parser.expression(0));
      if (parser.token === COMMA) {
        parser.advance();
      }
    }
    left.args = args;
    left.eval = functionEval;

    parser.advance();

    return left;
  },
  parser => {
    const sequence = [];

    while (parser.token !== CLOSE_ROUND) {
      sequence.push(parser.expression(0));
      if (parser.token === COMMA) {
        parser.advance();
      }
    }
    parser.expect(CLOSE_ROUND);

    // TODO always a sequence ?
    return sequence.length > 1 ? sequence : sequence[0];
  }
);

export /** @type {Token} */ const CLOSE_ROUND = createToken(")", 0, "infix");
export /** @type {Token} */ const OPEN_BRACKET = createToken(
  "[",
  10,
  "prefix",
  (parser, left) => {
    if (parser.token === CLOSE_BRACKET) {
      parser.advance();
      left.path.push(ASTTrue);
    } else {
      const predicate = parser.expression(0);
      parser.expect(CLOSE_BRACKET);
      left.path.push(predicate);
    }
    return left;
  },
  parser => {
    if (parser.token === CLOSE_BRACKET) {
      parser.advance();
      return ASTTrue;
    }

    const node = parser.expression(0);
    parser.expect(CLOSE_BRACKET);

    switch (typeof node) {
      case "string":
      case "number":
        return { eval: pathEval, path: [node] };
    }

    return node;
  }
);

export /** @type {Token} */ const CLOSE_BRACKET = createToken("]", 0, "infix");
export /** @type {Token} */ const OPEN_CURLY = createToken("{");
export /** @type {Token} */ const CLOSE_CURLY = createToken("}");
export /** @type {Token} */ const QUESTION = createToken("?", 20, "infix");
export /** @type {Token} */ const COLON = createToken(":", undefined, "infix");
export /** @type {Token} */ const SEMICOLON = createToken(";");
export /** @type {Token} */ const COMMA = createToken(",");
export /** @type {Token} */ const DOT = createToken(
  ".",
  80,
  "infix",
  (left, right) => {
    if (left.path) {
      right.path.unshift(...left.path);
    } else {
      right.path.unshift(left);
    }
    return right;
  }
);
export /** @type {Token} */ const AMPERSAND = createToken("&");
export /** @type {Token} */ const DOUBLE_AMPERSAND = createBinopToken(
  "&&",
  30,
  "infixr",
  (left, right) => left && right
);
export /** @type {Token} */ const BAR = createToken("|");
export /** @type {Token} */ const DOUBLE_BAR = createBinopToken(
  "||",
  30,
  "infixr",
  (left, right) => left || right
);
export /** @type {Token} */ const IDENTIFIER = createToken(
  "IDENTIFIER",
  0,
  undefined,
  undefined,
  parser => {
    return { eval: pathEval, path: [parser.value] };
  }
);

export /** @type {Token} */ const STRING = createToken(
  "STRING",
  0,
  undefined,
  undefined,
  parser => parser.value
);

export /** @type {Token} */ const NUMBER = createToken(
  "NUMBER",
  0,
  undefined,
  undefined,
  parser => parser.value
);
export /** @type {Token} */ const BOOLEAN = createToken(
  "BOOLEAN",
  0,
  undefined,
  undefined,
  parser => parser.value
);

export /** @type {Token} */ const EOF = createToken(
  "EOF",
  -1,
  "eof",
  undefined,
  parser => {
    throw new Error("unexpected EOF");
  }
);

export const keywords = {
  true: [BOOLEAN, true],
  false: [BOOLEAN, false]
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
export function* tokens(string, options = {}) {
  options.keywords ||= keywords;
  options.parseFloat ||= parseFloat;

  let state, value, hex, quote;

  const keywordOrIdentifier = () =>
    options.keywords[value] || [IDENTIFIER, value];
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
            yield [NUMBER, options.parseFloat(value)];
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
            yield [NUMBER,options.parseFloat(value)];
          case undefined:
            startString(c);
            break;
          case "string":
            if (c === quote) {
              yield [STRING, value];
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
            yield [NUMBER, options.parseFloat(value)];
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
            yield [NUMBER, options.parseFloat(value)];
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
          value += ".";
          break;
        } else if (state === "-") {
          value = "-.";
          state = "number";
          break;
        }

      case "-":
      case ":":
      case ";":
      case ",":
      case "+":
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
            yield [NUMBER, options.parseFloat(value)];
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
            value = c;
            state = "number";
            break;
          case "-":
            state = "number";
            value = "-" + c;
            break;
          case ".":
            state = "number";
            value = ".";
          case "number":
          case "string":
          case "identifier":
            value += c;
            break;
        }
        break;

      default:
        switch (state) {
          case "number":
            yield [NUMBER, options.parseFloat(value)];
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
    case "number":
      yield [NUMBER, options.parseFloat(value)];
      break;
    case "identifier":
      yield keywordOrIdentifier();
      break;
    default:
      yield lookup[state];
  }
}
