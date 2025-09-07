import { attributeIterator } from "./attributes.mjs";
import { getAttribute, setAttribute } from "./settergetter.mjs";
import { convertValue } from "./attributes.mjs";

export function definePropertiesFromAttributes(
  object,
  attributes,
  values,
  properties
) {
  const applyLater = {};

  for (const [path, attribute] of attributeIterator(attributes)) {
    const name = path.join(".");

    let value = getAttribute(values, name, attribute);

    if (value !== undefined && path.length === 1) {
      const op = Object.getOwnPropertyDescriptor(
        object.constructor.prototype,
        name
      );

      value = convertValue(value, attribute);
      const property = properties[name];

      console.log(name, value);
      if (op?.set || property?.set) {
        applyLater[name] = value;
      } else {
        properties[name] = Object.assign(
          { value, writable: attribute.writable },
          property
        );
      }
    } else {
      setAttribute(object, name, value, attribute);
    }
  }

  Object.defineProperties(object, properties);
  Object.assign(object, applyLater);
}
