import { attributeIterator } from "./attributes.mjs";

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

function error(message) {
  throw new Error(message);
}

export function addType(type) {
  if (types[type.name]) {
    return Object.assign(types[type.name], type);
  }

  types[type.name] = type;

  for (const [path, attribute] of attributeIterator(type.attributes)) {
    if (typeof attribute.type === "string") {
      attribute.type = oneOfType(attribute.type);
    }
    if(attribute.isKey && !type.key) {
      type.key = path.join('.');
    }
  }

  return type;
}

export function oneOfType(definition) {
  const aggregate = (name, list) => {
    const def = {
      name,
      members: list.reduce((all, type) => {
        if (typeof type === "string") {
          const t = types[type] || addType({ name: type });
          if (!t) {
            error(`Unknown type ${type} in '${definition}'`);
          }
          type = t;
        }
        return all.union(type.members ?? new Set([type]));
      }, new Set())
    };

    if (def.members.size < 2) {
      delete def.members;
    }
    return types[name] || addType(def);
  };

  if (Array.isArray(definition)) {
    return aggregate(
      definition
        .map(t => t.name ?? t)
        .sort()
        .join("|"),
      definition
    );
  } else {
    const parts = definition.split("|").sort();
    return aggregate(parts.join("|"), parts);
  }
}
