/**
 * @typedef {Object} AST
 * @property {Function} [eval]
 */


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
