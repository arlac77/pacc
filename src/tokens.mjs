import {
  pathEval,
  ASTNullFilter,
  keyedAccessEval,
  keyedAccessOrGlobalEval,
  filterEval,
  functionEval
} from "./ast.mjs";

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
  led = (parser, node) => node,
  nud = parser => this
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

MINUS.nud = parser => -parser.expression(100);

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
  100,
  "prefix",
  (parser, left) => {
    const args = parser.expression(0);
    parser.expect(CLOSE_ROUND);
    return {
      eval: functionEval,
      name: left.key,
      args: Array.isArray(args) ? args : [args]
    };
  },
  parser => {
    const result = parser.expression(0);
    parser.expect(CLOSE_ROUND);
    return result;
  }
);

export /** @type {Token} */ const CLOSE_ROUND = createToken(")", 0);

function createFilter(parser) {
  if (parser.token === CLOSE_BRACKET) {
    parser.advance();
    return ASTNullFilter;
  }

  const filter = parser.expression(0);
  parser.expect(CLOSE_BRACKET);

  switch (typeof filter) {
    case "string":
    case "number":
      return { eval: keyedAccessEval, key: filter };
    default:
      if (
        filter.eval === keyedAccessEval ||
        filter.eval === keyedAccessOrGlobalEval
      ) {
        return filter;
      }

      return { eval: filterEval, filter };
  }
}

export /** @type {Token} */ const OPEN_BRACKET = createToken(
  "[",
  80,
  "prefix",
  (parser, left) => {
    const node = createFilter(parser);

    if (left.key) {
      return { eval: pathEval, path: [left, node] };
    }

    left.path.push(node);
    return left;
  },
  parser => createFilter(parser)
);

export /** @type {Token} */ const CLOSE_BRACKET = createToken("]", 0);
export /** @type {Token} */ const OPEN_CURLY = createToken("{");
export /** @type {Token} */ const CLOSE_CURLY = createToken("}");
export /** @type {Token} */ const QUESTION = createToken("?", 20, "infix");
export /** @type {Token} */ const COLON = createToken(":", undefined, "infix");
export /** @type {Token} */ const SEMICOLON = createToken(";");
export /** @type {Token} */ const COMMA = createToken(
  ",",
  20,
  "infix",
  (left, right) => (Array.isArray(left) ? [...left, right] : [left, right])
);

export /** @type {Token} */ const DOT = createToken(
  ".",
  80,
  "infix",
  (left, right) => {
    if (right.eval === keyedAccessOrGlobalEval) {
      right.eval = keyedAccessEval;
    }
    if (left.path) {
      left.path.push(right);
      return left;
    }

    return { eval: pathEval, path: [left, right] };
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
    return { eval: keyedAccessOrGlobalEval, key: parser.value };
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

const esc = {
  b: "\b",
  f: "\f",
  n: "\n",
  r: "\r",
  t: "\t",
  v: "\v"
};

export const keywords = {
  true: [BOOLEAN, true],
  false: [BOOLEAN, false]
};

function evalAll(args, current, context) {
  return args.map(a =>
    typeof a?.eval === "function" ? a.eval(a, current, context) : a
  );
}

function evalOne(arg, current, context) {
  return typeof arg?.eval === "function"
    ? arg.eval(arg, current, context)
    : arg;
}

export const globals = {
  in: (args, current, context) => {
    const a = evalOne(args[0], current, context);
    const b = evalOne(args[1], current, context);

    if (b?.[Symbol.iterator]) {
      for (const x of b) {
        if (x === a) {
          return true;
        }
      }
    }
    return false;
  },
  ceil: (args, current, context) =>
    Math.ceil(evalOne(args[0], current, context)),
  floor: (args, current, context) =>
    Math.floor(evalOne(args[0], current, context)),
  abs: (args, current, context) => Math.abs(evalOne(args[0], current, context)),
  min: (args, current, context) => Math.min(...evalAll(args, current, context)),
  max: (args, current, context) => Math.max(...evalAll(args, current, context)),
  encodeURI: (args, current, context) =>
    encodeURI(...evalAll(args, current, context)),
  decodeURI: (args, current, context) =>
    decodeURI(...evalAll(args, current, context)),
  encodeURIComponent: (args, current, context) =>
    encodeURIComponent(...evalAll(args, current, context)),
  decodeURIComponent: (args, current, context) =>
    decodeURIComponent(...evalAll(args, current, context)),
  trim: (args, current, context) => evalOne(args[0], current, context).trim(),
  length: (args, current, context) => evalOne(args[0], current, context).length,
  uppercase: (args, current, context) =>
    evalOne(args[0], current, context).toUpperCase(),
  lowercase: (args, current, context) =>
    evalOne(args[0], current, context).toLowerCase(),
  substring: (args, current, context) => {
    const str = evalOne(args[0], current, context);
    const n1 = evalOne(args[1], current, context);
    return args.length > 2
      ? str.substring(n1, evalOne(args[2], current, context))
      : str.substring(n1);
  },
  join: (args, current, context) => {
    const separator = evalOne(args.shift(), current, context);
    return evalAll(args, current, context)
      .map(item => (item instanceof Iterator ? Array.from(item) : item))
      .flat()
      .join(separator);
  },
  sort: (args, current, context) => {
    const data = evalOne(args[0], current, context);
    if (args.length >= 2) {
      let order = 1;
      if (args.length > 2) {
        const str = evalOne(args[2], current, context);
        if (str === "descending") {
          order = -1;
        }
      }
      const selector = args[1];
      return data.sort(
        (a, b) =>
          (selector.eval(selector, a, context) -
            selector.eval(selector, b, context)) *
          order
      );
    }

    return data.sort();
  },
  truncate: (args, current, context) => {
    const data = evalOne(args[0], current, context);
    const length = evalOne(args[1], current, context);

    if (data instanceof Iterator) {
      return data.take(length);
    }

    data.length = length;
    return data;
  }
};

/**
 * Split expression path into tokens.
 * @generator
 * @param {string} string
 * @yields {Token}
 */
export function* tokens(string, context = {}) {
  context.keywords ||= keywords;
  context.parseFloat ||= parseFloat;
  context.valueFor ||= (name, at) => globals[name];

  let state, value, hex, quote;

  const keywordOrIdentifier = () =>
    context.keywords[value] || [IDENTIFIER, value];
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
            yield [NUMBER, context.parseFloat(value)];
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
            yield [NUMBER, context.parseFloat(value)];
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
            yield [NUMBER, context.parseFloat(value)];
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
            yield [NUMBER, context.parseFloat(value)];
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
            yield [NUMBER, context.parseFloat(value)];
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
            yield [NUMBER, context.parseFloat(value)];
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
      yield [NUMBER, context.parseFloat(value)];
      break;
    case "identifier":
      yield keywordOrIdentifier();
      break;
    default:
      yield lookup[state];
  }
}
