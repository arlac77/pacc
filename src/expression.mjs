import {
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
  EOF
} from "./tokens.mjs";

export function parse(context) {
  let node, token;

  function error(message) {
    const error = new Error(message);
    throw error;
  }

  const advance = () => {
    const { value, done } = context.tokens.next();
    token = done ? EOF : value;
  };

  const expect = expected => {
    if (token !== expected) {
      error(`unexpected '${token.str}' expecting '${expected.str}'`);
    }
    advance();
  };

  const nud = (token, left) => {
    switch (token.type) {
      case "prefix":
        switch (token) {
          case OPEN_ROUND: {
            const node = expression(0);
            expect(CLOSE_ROUND);
            return node;
          }
          case OPEN_BRACKET: {
            const node = expression(0);
            expect(CLOSE_BRACKET);
            if (typeof node === "number") {
              return { path: [node] };
            }
            return node;
          }
        }
        return { token, left, right: expression(token.precedence) };
      case "eof":
        error("unexpected EOF");
    }

    switch (typeof token) {
      case "string":
        return { path: [token] };
      case "boolean":
      case "bigint":
      case "number":
        return token;
    }

    return { token };
  };

  const led = (token, left) => {
    switch (token.type) {
      case "infixr": {
        const right = expression(token.precedence - 1);
        if (typeof left === typeof right) {
          switch (typeof left) {
            case "bigint":
            case "number":
            case "string":
              switch (token) {
                case GREATER:
                  return left > right;
                case GREATER_EQUAL:
                  return left >= right;
                case LESS:
                  return left < right;
                case LESS_EQUAL:
                  return left <= right;
                case EQUAL:
                  return left == right;
                case NOT_EQUAL:
                  return left != right;
              }
              break;
            case "boolean":
              switch (token) {
                case DOUBLE_BAR:
                  return left || right;
                case DOUBLE_AMPERSAND:
                  return left && right;
                case EQUAL:
                  return left == right;
                case NOT_EQUAL:
                  return left != right;
              }
          }
        }
        return {
          token,
          left,
          right
        };
      }

      case "infix": {
        const right = expression(token.precedence);
        if (typeof left === typeof right) {
          switch (typeof left) {
            case "bigint":
            case "number":
              switch (token) {
                case PLUS:
                  return left + right;
                case MINUS:
                  return left - right;
                case STAR:
                  return left * right;
                case DIVIDE:
                  return left / right;
              }
              break;
          }
        }
        if (token === DOT) {
          if (left.path) {
            left.path.push(...right.path);
            return left;
          }
          switch (typeof left) {
            case "number":
              right.path.unshift(left);
              return right;
          }
          return { path: [left.token, right.token] };
        }

        if (right.token === EOF) {
          error("unexpected EOF");
        }
        return {
          token,
          left,
          right
        };
      }
      case "prefix":
        switch (token) {
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

  return expression(token.precedence ?? 0);
}
