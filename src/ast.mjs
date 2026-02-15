/**
 * @typedef {Object} AST
 * @property {Function} [eval]
 */

export function pathEval(node, current, context) {
  for (const item of node.path) {
    current = item.eval(item, current, context);
  }

  return current;
}

export function functionEval(node, current, context) {
  const args = node.args.map(a =>
    typeof a === "object" ? a.eval(a, current, context) : a
  );
  return context.valueFor(node.name)(...args);
}

export function keyedAccessOrGlobalEval(node, current, context) {
  return keyedAccessEval(node, current, context) ?? context.valueFor(node.key);
}

export function keyedAccessEval(node, current, context) {
  if (current === undefined) {
    return undefined;
  }
  if (current instanceof Map) {
    return current.get(node.key);
  }
  if (current instanceof Set) {
    return current.has(node.key) ? node.key : undefined;
  }
  if (current instanceof Iterator) {
    return current.map(item => item[node.key]);
  }

  switch (typeof current[node.key]) {
    case "function": {
      const value = current[node.key]();

      if (typeof value[Symbol.iterator] === "function") {
        return [...value];
        //return value[Symbol.iterator]();
      }
      return value;
    }
    case "undefined":
      return context.valueFor(node.key, current);
  }

  return current[node.key];
}

export function filterEval(node, current, context) {
  if (typeof current.values === "function") {
    current = current.values();
  }

  return current.filter(item => node.filter.eval(node.filter, item, context));
}

export function nullFilterEval(node, current, context) {
  if (typeof current.values === "function") {
    current = current.values();
  }

  return current;
}

export const ASTNullFilter = {
  eval: nullFilterEval
};
