import {
  tokens,
  DOT,
  OPEN_ROUND,
  CLOSE_ROUND,
  OPEN_BRACKET,
  CLOSE_BRACKET,
  DOUBLE_BAR,
  DOUBLE_AMPERSAND,
  EQUAL,
  NOT_EQUAL,
  LESS,
  LESS_EQUAL,
  GREATER,
  GREATER_EQUAL,
  STAR,
  DIVIDE,
  PLUS,
  MINUS,
  IDENTIFIER,
  COMMA,
  EOF
} from "./tokens.mjs";

export function binop(op, left, right, fallback) {
  switch (op) {
    case DOUBLE_BAR:
      return left || right;
    case DOUBLE_AMPERSAND:
      return left && right;
    case EQUAL:
      return left == right;
    case NOT_EQUAL:
      return left != right;
    case GREATER:
      return left > right;
    case LESS:
      return left < right;
    case GREATER_EQUAL:
      return left >= right;
    case LESS_EQUAL:
      return left <= right;
    case PLUS:
      return left + right;
    case MINUS:
      return left - right;
    case STAR:
      return left * right;
    case DIVIDE:
      return left / right;
  }

  return fallback(op, left, right);
}

/**
 *
 * @param {string} message
 */
function error(message) {
  const error = new Error(message);
  throw error;
}
/**
 *
 * @param {Token} op
 * @param {AST} left
 * @param {AST} right
 */
function binopError(op, left, right) {
  error(`Unexpected '${op.str || op}'`);
}

export function parse(input, context = { globals }) {
  input = tokens(input);

  let node, token, value;

  const predicateIteratorEval = (node, current) => {
    if (current instanceof Set) {
      current = [...current];
    } else if (current instanceof Map) {
      current = [...current.values()];
    }
    return current
      .filter(item => node.predicate(node, item))
      .map(item => node.right.eval(node.right, item));
  };
  const pathEval = (node, current) => {
    let result = current;

    for (const p of node.path) {
      switch (typeof p) {
        case "string":
        case "number":
          if (typeof result === "function") {
            const r = [];
            for (const x of result()) {
              r.push(x[p]);
            }
            result = r;
          } else {
            if (result === undefined) {
              result = context.globals?.[p];
            } else {
              if (result instanceof Map) {
                result = result.get(p);
              } else {
                result = result[p] ?? context.globals?.[p];
              }
            }
          }
          break;
        case "object":
          const r = result;
          function* filter() {
            for (const x of r) {
              if (p.eval(p, x)) {
                yield x;
              }
            }
          }
          result = filter;
      }
    }

    return result;
  };

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
          eval: (node, current) =>
            binop(
              last,
              left.eval ? left.eval(left, current) : left,
              right.eval ? right.eval(right, current) : right,
              binopError
            ),
          last,
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
              return binop(last, left, right, binopError);
          }
        }
        if (last === DOT) {
          switch (typeof left) {
            case "number":
              right.path.unshift(left);
              return right;
          }

          if (left.path) {
            left.path.push(...right.path);
            return left;
          }

          if (left.eval) {
            return {
              eval: predicateIteratorEval,
              predicate: left.eval,
              right
              // path: right.path
            };
          }

          return { eval: pathEval, path: [left.token, right.token] };
        }

        if (right.token === EOF) {
          error("unexpected EOF");
        }

        return {
          eval: (node, current) =>
            binop(
              last,
              left.eval ? left.eval(left, current) : left,
              right.eval ? right.eval(right, current) : right,
              binopError
            ),
          token: last,
          left,
          right
        };
      }
      case "prefix":
        switch (last) {
          case OPEN_ROUND:
            {
              const args = [];
              while (token !== CLOSE_ROUND) {
                args.push(expression(0));
                if (token === COMMA) {
                  advance();
                }
              }
              left.path.push(args);
              left.eval = (node, current) => {
                const args = node.path[1].map(a =>
                  typeof a === "object" ? a.eval(a, current) : a
                );
                return context.globals[node.path[0]](...args);
              };

              advance();

              return left;
            }
            break;
          case OPEN_BRACKET: {
            const predicate = expression(0);
            expect(CLOSE_BRACKET);
            left.path.push(predicate);
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
    result = result.eval(result, context.root);

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
