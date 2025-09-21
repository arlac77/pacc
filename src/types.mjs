export const baseTypes = new Set(["string", "number", "bigint", "boolean"]);

export const types = {
  base: { name: "base" },

  string: { name: "string", extends: "base" },
  number: {
    name: "number",
    extends: "base",
    prepareValue: value =>
      typeof value === "string" ? parseFloat(value) : value
  },
  boolean: {
    name: "boolean",
    extends: "base",
    prepareValue: value =>
      !value || value === "0" || value === "false" || value === "no"
        ? false
        : true
  },
  integer: {
    name: "integer",
    extends: "base",
    prepareValue: value => (typeof value === "string" ? parseInt(value) : value)
  },
  "unsigned-integer": {
    name: "unsigned-integer",
    prepareValue: value =>
      typeof value === "string" ? parseInt(value) : value,
    extends: "integer"
  },
  url: { name: "url", extends: "string" },
  object: { name: "object", extends: "base" }
};

export function addType(type) {
  types[type.name] = type;
  return type;
}

export function oneOfType(definition) {
  if (Array.isArray(definition)) {
    return addType({
      name: definition.map(t => t.name).join("|"),
      members: new Set(definition)
    });
  } else {
    return (
      types[definition] ||
      addType({
        name: definition,
        members: new Set(definition.split("|").map(t => types[t]))
      })
    );
  }
}
