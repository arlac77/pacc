import {
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
  MINUS
} from "./tokens.mjs";

/**
 * @typedef {Object} AST
 * @property {Function} [eval]
 */

/**
 *
 * @param {Token} op
 * @param {AST} left
 * @param {AST} right
 *
 */
export function binopError(op, left, right) {
  throw new Error(`Unexpected '${op.str || op}'`, { cause: op });
}

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

export function binopEval(node, current, context) {
  return binop(
    node.token,
    node.left.eval ? node.left.eval(node.left, current, context) : node.left,
    node.right.eval
      ? node.right.eval(node.right, current, context)
      : node.right,
    binopError
  );
}

export function predicateIteratorEval(node, current, context) {
  if (current instanceof Set) {
    current = [...current];
  } else if (current instanceof Map) {
    current = [...current.values()];
  }
  return current
    .filter(item => node.left.eval(node.left, item, context))
    .map(item => node.right.eval(node.right, item, context));
}

export function pathEval(node, current, context) {
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
            result = context.getGlobal(p);
          } else {
            if (result instanceof Map) {
              result = result.get(p);
            } else {
              result = result[p] ?? context.getGlobal(p);
            }
          }
        }
        break;
      case "object":
        const r = result;
        function* filter() {
          for (const x of r) {
            if (p.eval(p, x, context)) {
              yield x;
            }
          }
        }
        result = filter;
    }
  }

  return result;
}

export function functionEval(node, current, context) {
  const args = node.args.map(a =>
    typeof a === "object" ? a.eval(a, current, context) : a
  );
  return context.getGlobal(node.path[0])(...args);
}
