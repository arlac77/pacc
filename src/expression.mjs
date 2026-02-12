import { tokens, EOF } from "./tokens.mjs";

export function parseOnly(input, context = {}) {
  context.getGlobal ||= a => globals[a];

  input = tokens(input, context);

  let node, token, value;

  function advance() {
    const next = input.next();
    if (next.done) {
      token = EOF;
    } else {
      token = next.value[0];
      if (next.value.length > 1) {
        value = next.value[1];
      }
    }
  }

  const parser = {
    get node() {
      return node;
    },
    get token() {
      return token;
    },
    get value() {
      return value;
    },
    advance,
    expect(expected) {
      if (token !== expected) {
        throw new Error(
          `unexpected '${token?.str || token}' expecting '${expected.str}'`,
          { cause: token }
        );
      }
      advance();
    },
    expression(precedence) {
      const last = token;
      advance();
      node = last.nud ? last.nud(parser) : last;

      while (token.precedence > precedence) {
        const last = token;
        advance();
        node = last.led(parser, node);
      }

      return node;
    }
  };

  advance();

  return parser.expression(token.precedence ?? 0);
}

export function parse(input, context) {
  const result = parseOnly(input, context);
  return result.eval ? result.eval(result, context.root, context) : result;
}

export const globals = {
  in: (a, b) => {
    if (b?.[Symbol.iterator]) {
      for (const x of b) {
        if (x === a) {
          return true;
        }
      }
    }
    return false;
  },
  ceil: Math.ceil,
  floor: Math.floor,
  abs: Math.abs,
  min: Math.min,
  max: Math.max,
  encodeURI: encodeURI,
  decodeURI: decodeURI,
  encodeURIComponent: encodeURIComponent,
  decodeURIComponent: decodeURIComponent,
  trim: a => a.trim(),
  uppercase: a => a.toUpperCase(),
  lowercase: a => a.toLowerCase(),
  substring: (s, a, b) => s.substring(a, b),
  length: s => s.length,
  join: (separator, ...args) =>
    args
      .map(item => (item instanceof Iterator ? Array.from(item) : item))
      .flat()
      .join(separator)
};
