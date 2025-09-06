import {
  tokens,
  EQUAL,
  NOT_EQUAL,
  DOT,
  OPEN_ROUND,
  CLOSE_ROUND,
  OPEN_BRACKET,
  CLOSE_BRACKET,
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
      case "number":
        return token;
    }

    return { token };
  };

  const led = (token, left) => {
    switch (token.type) {
      case "infix":
        const right = expression(token.precedence);
        if (typeof left === "number" && typeof right === "number") {
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
        }
        if (token === DOT) {
          if (left.path) {
            left.path.push(...right.path);
            return left;
          }
          if (typeof left === "number") {
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

      case "infixr":
        return {
          token,
          left,
          right: expression(token.precedence - 1)
        };

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
