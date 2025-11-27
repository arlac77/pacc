import { attributeIterator } from "./attributes.mjs";
import { getAttribute, setAttribute } from "./settergetter.mjs";
import { prepareValue } from "./attributes.mjs";

function findPropertyDescriptor(obj, name) {
  let descriptor;
  do {
    (descriptor = Object.getOwnPropertyDescriptor(obj, name)) ||
      (obj = Object.getPrototypeOf(obj));
  } while (!descriptor && obj);
  return descriptor;
}

export function definePropertiesFromAttributes(
  object,
  attributes,
  initialValues,
  properties = {}
) {
  const applyLater = {};

  for (const [path, attribute] of attributeIterator(attributes)) {
    const name = path.join(".");
    const externalName = attribute.externalName ?? name;

    const value = prepareValue(
      getAttribute(initialValues, externalName, attribute) ??
        initialValues?.[externalName] ??
        attribute.default,
      attribute
    );

    if (value !== undefined) {
      if (path.length === 1) {
        const property = properties[name];

        if (property?.set) {
          applyLater[name] = value;
        } else {
          const op = findPropertyDescriptor(object, name);
          if (op?.set) {
            applyLater[name] = value;
          } else {
            properties[name] = Object.assign({ ...attribute, value }, property);
          }
        }
      } else {
        setAttribute(object, name, value, attribute);
      }
    }
  }

  Object.defineProperties(object, properties);
  Object.assign(object, applyLater);
}
