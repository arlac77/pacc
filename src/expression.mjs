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

export function parse(input, context = {}) {
  input = tokens(input);

  let node, token, value;

  function error(message) {
    const error = new Error(message);
    throw error;
  }
  function binopError(op, left, right) {
    error(`Unexpected '${op.str || op}'`);
  }

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
            if (result instanceof Map) {
              result = result.get(p);
            } else {
              result = result[p] ?? context.globals?.[p];
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
            switch (typeof node) {
              case "string":
              case "number":
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
      case "number":
      case "bigint":
      case "boolean":
        return token;
    }

    if (token === IDENTIFIER) {
      return { eval: pathEval, path: [value] };
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
          eval: (node, current) =>
            binop(
              token,
              left.eval ? left.eval(left, current) : left,
              right.eval ? right.eval(right, current) : right,
              binopError
            ),
          token,
          left,
          right
        };
      }

      case "infix": {
        let right = expression(token.precedence);

        if (typeof left === typeof right) {
          switch (typeof left) {
            case "string":
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
          eval: (node, current) =>
            binop(
              token,
              left.eval ? left.eval(left, current) : left,
              right.eval ? right.eval(right, current) : right,
              binopError
            ),
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

  let result = expression(token.precedence ?? 0);

  if (context.exec !== false && result?.eval) {
    result = result.eval(result, context.root);

    if (typeof result === "function") {
      return [...result()];
    }
  }

  return result;
}
