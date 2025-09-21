export const types = {
  string: { name: "string", primitive: true },
  number: {
    name: "number",
    primitive: true,
    prepareValue: value =>
      typeof value === "string" ? parseFloat(value) : value
  },
  boolean: {
    name: "boolean",
    primitive: true,
    prepareValue: value =>
      !value || value === "0" || value === "false" || value === "no"
        ? false
        : true
  },
  integer: {
    name: "integer",
    primitive: true,
    prepareValue: value => (typeof value === "string" ? parseInt(value) : value)
  },
  "unsigned-integer": {
    name: "unsigned-integer",
    primitive: true,
    prepareValue: value => (typeof value === "string" ? parseInt(value) : value)
  },
  url: { name: "url", primitive: true },
  object: { name: "object", extends: "base" }
};

export function addType(type) {
  types[type.name] = type;
  return type;
}

export function oneOfType(definition) {
  const aggregate = list =>
    list.reduce(
      (a, c) => a.union(c?.members ?? new Set([types[c] ?? c])),
      new Set()
    );

  if (Array.isArray(definition)) {
    const name = definition
      .map(t => t.name ?? t)
      .sort()
      .join("|");

    return (
      types[name] ||
      addType({
        name,
        members: aggregate(definition)
      })
    );
  } else {
    const parts = definition.split("|").sort();
    const name = parts.join("|");
    return (
      types[name] ||
      addType({
        name,
        members: aggregate(parts.map(t => types[t]))
      })
    );
  }
}
