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
  if (current.values) {
    current = current.values();
  }

  return current
    .filter(item => node.left.eval(node.left, item, context))
    .map(item => node.right.eval(node.right, item, context));
}

export function pathEval(node, current, context) {
  for (const item of node.path) {
    switch (typeof item) {
      case "string":
      case "number":
        if (typeof current === "function") {
          const r = [];
          for (const x of current()) {
            r.push(x[item]);
          }
          current = r;
        } else {
          if (current === undefined) {
            current = context.getGlobal(item);
          } else {
            if (current instanceof Map) {
              current = current.get(item);
            } else {
              current = current[item] ?? context.getGlobal(item);
            }
          }
        }
        break;
      case "object":
        const r = current;
        function* filter() {
          for (const x of r) {
            if (item.eval(item, x, context)) {
              yield x;
            }
          }
        }
        current = filter;
    }
  }

  return current;
}

export function functionEval(node, current, context) {
  const args = node.args.map(a =>
    typeof a === "object" ? a.eval(a, current, context) : a
  );
  return context.getGlobal(node.path[0])(...args);
}
