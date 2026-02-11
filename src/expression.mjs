import {
  tokens,
  DOT,
  OPEN_ROUND,
  CLOSE_ROUND,
  OPEN_BRACKET,
  CLOSE_BRACKET,
  IDENTIFIER,
  COMMA,
  EOF
} from "./tokens.mjs";
import { pathEval, functionEval, ASTTrue, ASTBinop } from "./ast.mjs";

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

  function expect(expected) {
    if (token !== expected) {
      throw new Error(
        `unexpected '${token?.str || token}' expecting '${expected.str}'`,
        { cause: token }
      );
    }
    advance();
  }

  function nud(last, left) {
    switch (last) {
      case OPEN_ROUND: {
        const sequence = [];

        while (token !== CLOSE_ROUND) {
          sequence.push(expression(0));
          if (token === COMMA) {
            advance();
          }
        }
        expect(CLOSE_ROUND);

        // TODO always a sequence ?
        return sequence.length > 1 ? sequence : sequence[0];
      }
      case OPEN_BRACKET: {
        if (token === CLOSE_BRACKET) {
          advance();
          return ASTTrue;
        }

        const node = expression(0);
        expect(CLOSE_BRACKET);

        switch (typeof node) {
          case "string":
          case "number":
            return { eval: pathEval, path: [node] };
        }

        return node;
      }

      case IDENTIFIER:
        return { eval: pathEval, path: [value] };

      case EOF:
        throw new Error("unexpected EOF");
    }

    if (last.type === "prefix") {
      return { token: last, left, right: expression(last.precedence) };
    }

    return last;
  }

  function led(last, left) {
    switch (last.type) {
      case "infixr":
        return ASTBinop(last, left, expression(last.precedence - 1));

      case "infix": {
        const right = expression(last.precedence);

        if (last === DOT) {
          return last.led(left, right);
        }

        return ASTBinop(last, left, right);
      }
    }

    switch (last) {
      case OPEN_ROUND: {
        const args = [];
        while (token !== CLOSE_ROUND) {
          args.push(expression(0));
          if (token === COMMA) {
            advance();
          }
        }
        left.args = args;
        left.eval = functionEval;

        advance();

        return left;
      }
      case OPEN_BRACKET: {
        if (token === CLOSE_BRACKET) {
          advance();
          left.path.push(ASTTrue);
        } else {
          const predicate = expression(0);
          expect(CLOSE_BRACKET);
          left.path.push(predicate);
        }
        return left;
      }
    }

    return { token };
  }

  function expression(precedence) {
    const last = token;
    advance();
    node = nud(last, node);

    while (token.precedence > precedence) {
      const last = token;
      advance();
      node = led(last, node);
    }

    return node;
  }

  advance();

  return expression(token.precedence ?? 0);
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
