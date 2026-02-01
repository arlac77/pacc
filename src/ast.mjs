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
function binopError(op, left, right) {
  throw new Error(`Unexpected '${op.str || op}'`, { cause: op });
}

export function binop(op, left, right, fallback) {
  if(op.binop) { return op.binop(left,right); }

  return fallback(op, left, right);
}

function binopEval(node, current, context) {
  return binop(
    node.token,
    node.left.eval ? node.left.eval(node.left, current, context) : node.left,
    node.right.eval
      ? node.right.eval(node.right, current, context)
      : node.right,
    binopError
  );
}

export function ASTBinop(token, left, right) {
  if (!left.eval && !right.eval) {
    return binop(token, left, right, binopError);
  }

  return {
    eval: binopEval,
    token,
    left,
    right
  };
}

export function pathEval(node, current, context) {
  let collection = false;
  let first = true;
  for (const item of node.path) {
    switch (typeof item) {
      case "string":
      case "number":
        switch (typeof current) {
          case "undefined":
            current = context.getGlobal(item);
            break;
          default:
            if (collection) {
              current = current.map(x => x[item]);
            } else {
              current =
                current instanceof Map ? current.get(item) : current[item];

              if (first && current === undefined) {
                current = context.getGlobal(item);
              }
            }
        }
        break;
      case "object":
        if (current.values) {
          current = current.values();
        }

        current = current.filter(c => item.eval(item, c, context));
        collection = true;
    }

    first = false;
  }

  return current;
}

export function functionEval(node, current, context) {
  const args = node.args.map(a =>
    typeof a === "object" ? a.eval(a, current, context) : a
  );
  return context.getGlobal(node.path[0])(...args);
}

export const ASTTrue = {
  eval: () => true
};
