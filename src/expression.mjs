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

export function parse(context) {
  let node, token;

  function error(message) {
    const error = new Error(message);
    throw error;
  }
  function binopError(op, left, right) {
    error(`Unexpected '${op.str || op}'`);
  }

  const pathEval = node => {
    let result = context.root;

    for (const p of node.path) {
      switch (typeof p) {
        case "string":
        case "number":
          result = result[p];
      }
    }

    return result;
  };

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
              return { eval: pathEval, path: [node] };
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
        return { eval: pathEval, path: [token] };
      case "number":
      case "bigint":
      case "boolean":
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
            case "string":
            case "number":
            case "bigint":
            case "boolean":
              return binop(token, left, right, binopError);
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
            case "number":
            case "bigint":
              return binop(token, left, right, binopError);
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
          return { eval: pathEval, path: [left.token, right.token] };
        }

        if (right.token === EOF) {
          error("unexpected EOF");
        }

        return {
          eval: (node) => {
            const left = node.left?.eval ? node.left.eval(node.left) : node.left;
            const right = node.right?.eval ? node.right.eval(node.right) : node.right;
            return binop(node.token,left,right);
          },
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

  const result = expression(token.precedence ?? 0);

  if(context.exec !== false &&result?.eval) {
    return result.eval(result);
  }

  return result;
}
