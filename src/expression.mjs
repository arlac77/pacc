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

import {
  binopError,
  binop,
  binopEval,
  predicateIteratorEval,
  pathEval,
  functionEval,
  ASTNodeTrue
} from "./ast.mjs";

/**
 *
 * @param {string} message
 */
export function error(message) {
  throw new Error(message);
}

export function parse(input, context = {}) {
  context.getGlobal ||= a => globals[a];

  input = tokens(input, context);

  let node, token, value;

  const advance = () => {
    const next = input.next();
    if (next.done) {
      token = EOF;
    } else {
      token = next.value[0];
      if (next.value.length > 1) {
        value = next.value[1];
      }
    }
  };

  const expect = expected => {
    if (token !== expected) {
      error(`unexpected '${token?.str || token}' expecting '${expected.str}'`);
    }
    advance();
  };

  const nud = (last, left) => {
    switch (last.type) {
      case "prefix":
        switch (last) {
          case OPEN_ROUND: {
            const node = expression(0);
            expect(CLOSE_ROUND);
            return node;
          }
          case OPEN_BRACKET: {
            if (token === CLOSE_BRACKET) {
              advance();
              return ASTNodeTrue;
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
        }
        return { token: last, left, right: expression(last.precedence) };
      case "eof":
        error("unexpected EOF");
    }

    switch (typeof last) {
      case "string":
      case "number":
      case "bigint":
      case "boolean":
        return last;
    }

    if (last === IDENTIFIER) {
      return { eval: pathEval, path: [value] };
    }

    return { token: last };
  };

  const led = (last, left) => {
    switch (last.type) {
      case "infixr": {
        const right = expression(last.precedence - 1);
        if (typeof left === typeof right) {
          switch (typeof left) {
            case "string":
            case "number":
            case "bigint":
            case "boolean":
              return binop(last, left, right, binopError);
          }
        }

        return {
          eval: binopEval,
          token: last,
          left,
          right
        };
      }

      case "infix": {
        let right = expression(last.precedence);

        if (typeof left === typeof right) {
          switch (typeof left) {
            case "string":
            case "number":
            case "bigint":
            case "boolean":
              return binop(last, left, right, binopError);
          }
        }
        if (last === DOT) {
          if (left.path) {
            left.path.push(...right.path);
            return left;
          }

          if (left.eval) {
            return {
              eval: predicateIteratorEval,
              left,
              right
            };
          }

          return { eval: pathEval, path: [left.token, right.token] };
        }

        if (right.token === EOF) {
          error("unexpected EOF");
        }

        return {
          eval: binopEval,
          token: last,
          left,
          right
        };
      }
      case "prefix":
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
              left.path.push(ASTNodeTrue);
            } else {
              const predicate = expression(0);
              expect(CLOSE_BRACKET);
              left.path.push(predicate);
            }
            return left;
          }
        }
    }

    return { token };
  };

  const expression = precedence => {
    const last = token;
    advance();
    node = nud(last, node);

    while (token.precedence > precedence) {
      const last = token;
      advance();
      node = led(last, node);
    }

    return node;
  };

  advance();

  let result = expression(token.precedence ?? 0);

  if (context.exec !== false && result?.eval) {
    result = result.eval(result, context.root, context);

    if (typeof result === "function") {
      return [...result()];
    }
  }

  return result;
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
  uppercase: a => a.toUpperCase(),
  lowercase: a => a.toLowerCase(),
  substring: (s, a, b) => s.substring(a, b),
  length: s => s.length
};
