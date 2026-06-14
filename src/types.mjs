import { attributeIterator } from "./attributes.mjs";
import { parseDuration, formatDuration } from "./time.mjs";
import { parseBytes } from "./bytes.mjs";

/**
 * @typedef {Object} Type
 * @property {string} name
 * @property {boolean} [primitive]
 * @property {Type} [extends]
 * @property {Set<Type>} [members]
 * @property {Function} [clazz]
 * @property {Function} [toInternal]
 * @property {Function} [toExternal]
 */

const emptyStringIsUndefined = value =>
  typeof value === "string" && value.length === 0 ? undefined : value;

export const types = {
  string: {
    name: "string",
    primitive: true,
    toInternal: (value, attribute) => {
      if (typeof value === "string") {
        if (attribute.collection) {
          if (attribute.constructor && attribute.constructor !== Array) {
            return new attribute.constructor(
              value.split(attribute.separator || " ")
            );
          }
          return value.split(attribute.separator || " ");
        }
      }
      return value;
    },
    toExternal: (value, attribute) => {
      if (value !== undefined) {
        if (attribute.collection && typeof value !== "string") {
          return [...value].join(attribute.separator || " ");
        }
      }
      return value;
    }
  },
  number: {
    name: "number",
    primitive: true,
    toInternal: value => (typeof value === "string" ? parseFloat(value) : value)
  },
  boolean: {
    name: "boolean",
    primitive: true,
    toInternal: (value, attribute) =>
      value === undefined
        ? attribute.default
        : !value || value === "0" || value === "false" || value === "no"
          ? false
          : true
  },
  yesno: {
    name: "yesno",
    primitive: true,
    toInternal: (value, attribute) =>
      value === undefined
        ? attribute.default
        : !value || value === "0" || value === "false" || value === "no"
          ? false
          : true,
    toExternal: value =>
      value === undefined ? undefined : value ? "yes" : "no"
  },
  integer: {
    name: "integer",
    primitive: true,
    toInternal: value => (typeof value === "string" ? parseInt(value) : value)
  },
  "unsigned-integer": {
    name: "unsigned-integer",
    primitive: true,
    toInternal: value => (typeof value === "string" ? parseInt(value) : value)
  },
  duration: {
    name: "duration",
    primitive: true,
    toInternal: value => parseDuration(value),
    toExternal: value =>
      value === undefined ? undefined : formatDuration(value)
  },
  duration_ms: {
    name: "duration_ms",
    primitive: true,
    toInternal: value => parseDuration(value) * 1000
  },
  byte_size: {
    name: "byte_size",
    primitive: true,
    toInternal: parseBytes
  },
  url: {
    name: "url",
    toInternal: emptyStringIsUndefined,
    primitive: true
  },
  object: { name: "object", primitive: false }
};

/**
 * Throw if type is not known.
 * @param {Type|string|undefined} type
 * @param {any} origin
 * @returns {Type}
 */
function raiseOnUnknownType(type, origin) {
  if (types[type]) {
    return types[type];
  }

  if (types[type?.name] === type) {
    return type;
  }

  throw new Error(`Unknown type ${type} in '${origin}'`, { cause: type });
}

export function addType(type) {
  if (typeof type.extends === "string") {
    type.extends = raiseOnUnknownType(type.extends, type);
  } else {
    if (type.extends === undefined || !type.hasOwnProperty("extends")) {
      const ex = Object.getPrototypeOf(type);

      if (ex?.name) {
        type.extends = ex;
      }
    }
  }

  if (type.specializationOf) {
    type.specializationOf.specializations[type.name] = type;
  }

  type.owners ||= [];

  if (!types[type.name]) {
    types[type.name] = type;
  } else {
    if (types[type.name] !== type) {
      return Object.assign(types[type.name], type);
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
  const factory = type.factoryFor?.(owner, data) || type.clazz || type;
  const object = new factory(owner);

  object.read(data);
  owner.addObject(object);
  return object;
}
