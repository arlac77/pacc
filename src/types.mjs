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
  object: { name: "object" }
};

function error(message) {
  throw new Error(message);
}

function raiseOnUnknownType(type, origin) {
  switch (typeof type) {
    case "string":
      if (types[type]) {
        return types[type];
      }
    case "undefined":
      error(`Unknown type ${type} in '${origin}'`);
  }

  return type;
}

export function addType(type) {
  if (type.typeDefinition) {
    const clazz = type;
    type = type.typeDefinition;
    type.clazz = clazz;
  } else {
    if (!!type?.constructor.name) {
      const clazz = type;
      type.clazz = clazz;
    }
  }

  if (type.specializationOf) {
    type.specializationOf.specializations[type.name] = type;
  }

  if (!type.owners) {
    type.owners = [];
  }

  switch (typeof type.extends) {
    case "undefined":
      const ex = Object.getPrototypeOf(type.clazz);
      if (ex?.name) {
        type.extends = ex.typeDefinition || ex;
      }
      break;

    case "string":
      type.extends = raiseOnUnknownType(type.extends, type);
      break;
  }

  if (!types[type.name]) {
    types[type.name] = type;
  }

  for (const [path, attribute] of attributeIterator(type.attributes)) {
    if (typeof attribute.type === "string") {
      attribute.type = oneOfType(attribute.type);
    }
  }

  if (types[type.name] !== type) {
    return Object.assign(types[type.name], type);
  }

  return type;
}

export function oneOfType(definition) {
  const aggregate = (name, list) => {
    const def = {
      name,
      members: list.reduce((all, type) => {
        if (typeof type === "string") {
          type = raiseOnUnknownType(type, definition);
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

export function resolveTypeLinks() {
  for (const type of Object.values(types)) {
    if (typeof type.extends === "string") {
      type.extends = raiseOnUnknownType(type.extends, type);
    }

    if (type.owners) {
      type.owners = type.owners.map(owner => raiseOnUnknownType(owner, type));
    }
  }
}
