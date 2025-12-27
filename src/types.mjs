import { attributeIterator } from "./attributes.mjs";
import { parseDuration } from "./time.mjs";
import { parseBytes } from "./bytes.mjs";

/**
 * @typedef {Object} Type
 * @property {string} name
 * @property {boolean} [primitive]
 * @property {Function} [prepareValue]
 */

const emptyStringIsUndefined = value =>
  typeof value === "string" && value.length === 0 ? undefined : value;

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
  duration: {
    name: "duration",
    primitive: true,
    prepareValue: value => parseDuration(value)
  },
  duration_ms: {
    name: "duration_ms",
    primitive: true,
    prepareValue: value => parseDuration(value) * 1000
  },
  byte_size: {
    name: "byte_size",
    primitive: true,
    prepareValue: parseBytes
  },
  url: {
    name: "url",
    prepareValue: emptyStringIsUndefined,
    primitive: true
  },
  object: { name: "object", primitive: false }
};

/**
 * 
 * @param {string|undefined} type 
 * @param {any} origin 
 * @returns {Type}
 */
function raiseOnUnknownType(type, origin) {
  switch (typeof type) {
    case "string":
      if (types[type]) {
        return types[type];
      }
    case "undefined":
      throw new Error(`Unknown type ${type} in '${origin}'`, { cause: type });
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

    for (const [path, attribute] of attributeIterator(type.attributes)) {
      if (typeof attribute.type === "string") {
        attribute.type = oneOfType(attribute.type);
      }
    }
  }
}

export function typeFactory(type, owner, data) {
  const factory = type.factoryFor?.(owner, data) || type.clazz;
  const object = new factory(owner);

  object.read(data);
  owner.addObject(object);
  return object;
}
