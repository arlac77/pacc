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
  return context.valueFor(node.name)(node.args, current, context);
}

export function keyedAccessOrGlobalEval(node, current, context) {
  return keyedAccessEval(node, current, context) ?? context.valueFor(node.key);
}

function scalarAccessEval(node, current, context) {
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

function plain(value) {
  if (typeof value === "function") {
    return value();
  }

  return value;
}

export function keyedAccessEval(node, current, context) {
  if (current === undefined) {
    return undefined;
  }
  if (current instanceof Map) {
    return plain(current.get(node.key));
  }
  if (current instanceof Set) {
    return current.has(node.key) ? node.key : undefined;
  }
  if (current instanceof Iterator) {
    if (typeof node.key === "number") {
      for (const item of current.drop(node.key)) {
        return plain(item);
      }
    }

    return current.map(item => scalarAccessEval(node, item, context));
  }

  return scalarAccessEval(node, current, context);
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
