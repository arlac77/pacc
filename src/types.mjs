import { attributeIterator } from "./attributes.mjs";
import { parseDuration, formatDuration } from "./time.mjs";
import { parseBytes } from "./bytes.mjs";
import { asArray } from "./utils.mjs";

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

function stringToInternal(value, attribute) {
  switch (typeof value) {
    case "string": {
      const toInternalScalar =
        attribute.toInternalScalar ?? attribute.type.toInternalScalar;
      if (attribute.collection) {
        let values = value.split(attribute.separator ?? " ");
        if (toInternalScalar) {
          values = values.map(value => toInternalScalar(value));
        }
        if (attribute.constructor && attribute.constructor !== Array) {
          return new attribute.constructor(values);
        }
        return values;
      }

      return toInternalScalar ? toInternalScalar(value) : value;
    }
  }

  return value;
}

function stringToExternal(value, attribute) {
  if (value !== undefined) {
    const toExternalScalar =
      attribute.toExternalScalar ?? attribute.type.toExternalScalar;

    if (attribute.collection) {
      value = asArray(value);

      if (toExternalScalar) {
        value = value.map(toExternalScalar);
      }

      if (attribute.separator !== undefined) {
        return value.join(attribute.separator);
      }

      return value;
    }

    return toExternalScalar ? toExternalScalar(value) : value;
  }
  return value;
}

export const primitive_type = {
  name: "primitive",
  primitive: true
};

export const string_type = {
  ...primitive_type,
  name: "string",
  toInternal: stringToInternal,
  toExternal: stringToExternal
};

export const enum_string_type = {
  ...string_type,
  name: "enum-string"
  toInternal(value,attribute) {
    if(attribute.values.has(value)) {
      return value;
    }
    // TODO error
  } 
};

export const integer_type = {
  ...primitive_type,
  name: "integer",
  toInternal: value => (typeof value === "string" ? parseInt(value) : value)
};

export const boolean_type = {
  ...primitive_type,
  name: "boolean",
  toInternal: (value, attribute) =>
    value === undefined
      ? attribute.default
      : !value || value === "0" || value === "false" || value === "no"
        ? false
        : true
};

export const types = {
  string: string_type,
  "lowercase-string": {
    ...string_type,
    name: "lowercase-string",
    toInternalScalar: value => value?.toLowerCase(),
    toExternalScalar: value => value?.toLowerCase()
  },
  "enum-string": enum_string_type,
  number: {
    ...primitive_type,
    name: "number",
    toInternal: value => (typeof value === "string" ? parseFloat(value) : value)
  },
  boolean: boolean_type,
  yesno: {
    ...boolean_type,
    name: "yesno",
    toInternal: (value, attribute) =>
      value === undefined
        ? attribute.default
        : !value || value === "0" || value === "false" || value === "no"
          ? false
          : true,
    toExternal: value =>
      value === undefined ? undefined : value ? "yes" : "no"
  },
  integer: integer_type,
  "unsigned-integer": {
    ...integer_type,
    name: "unsigned-integer"
  },
  duration: {
    ...primitive_type,
    name: "duration",
    toInternal: value => parseDuration(value),
    toExternal: value =>
      value === undefined ? undefined : formatDuration(value)
  },
  duration_ms: {
    ...primitive_type,
    name: "duration_ms",
    toInternal: value => parseDuration(value) * 1000
  },
  byte_size: {
    ...integer_type,
    name: "byte_size",
    toInternal: parseBytes
  },
  url: {
    ...primitive_type,
    name: "url",
    toInternal: emptyStringIsUndefined
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

    for (const [path, attribute] of attributeIterator(
      type.attributes,
      attribute => typeof attribute.type === "string"
    )) {
      attribute.type = oneOfType(attribute.type);
    }
  }
}

/**
 * Create object for a given type
 * @param {Type} type
 * @param {Object} owner
 * @param {any} data
 * @returns {Object} newly created object
 */
export function create(type, owner, data) {
  const factory = type.factoryFor?.(owner, data) || type;
  return new factory(owner, data);
}

/**
 * Is a type extending another one
 * @param {Type} a
 * @param {Type} b
 * @returns {boolean} true if a is extending b (or a is b)
 */
export function isExtendingType(a, b) {
  if (a === undefined) {
    return false;
  }
  if (a === b) {
    return true;
  }
  return isExtendingType(a.extends, b);
}
