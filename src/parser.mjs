import { tokens } from "./tokens.mjs";

export function ast(input, context) {
  input = tokens(input, context);

  let token;

  const advance = () => (token = input.next().value);

  const parser = {
    get token() {
      return token[0];
    },
    advance,
    expect(expected) {
      if (token[0] !== expected) {
        throw new Error(
          `unexpected '${token[0].str}' expecting '${expected.str}'`,
          { cause: token }
        );
      }
      advance();
    },
    expression(precedence) {
      const last = token;
      advance();
      let node = last[0].nud(parser, last[1]);

      while (token[0].precedence > precedence) {
        const last = token;
        advance();
        node = last[0].led(parser, node, last[1]);
      }

      return node;
    }
  };

  advance();

  return parser.expression(0);
}

export function parse(input, context = {}) {
  const result = ast(input, context);
  return result.eval ? result.eval(result, context.current, context) : result;
}
