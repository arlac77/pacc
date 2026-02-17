import { tokens, EOF } from "./tokens.mjs";

export function parseOnly(input, context = {}) {
  input = tokens(input, context);
  
  let token, value;

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
          `unexpected '${token.str}' expecting '${expected.str}'`,
          { cause: token }
        );
      }
      advance();
    },
    expression(precedence) {
      const last = token;
      advance();
      let node = last.nud(parser);

      while (token.precedence > precedence) {
        const last = token;
        advance();
        node = last.led(parser, node);
      }

      return node;
    }
  };

  advance();

  return parser.expression(0);
}

export function parse(input, context) {
  const result = parseOnly(input, context);
  return result.eval ? result.eval(result, context.root, context) : result;
}
