import { extendingAttributeIterator } from "pacc";

export function extract(object, type = object.constructor) {
  const result = {};
  for (const [path, attribute] of extendingAttributeIterator(
    type,
    attribute => !attribute.private
  )) {
    const name = path.join(".");
    const value = object[name];

    if (value !== undefined) {
      if (attribute.type.primitive) {
        if (attribute.collection) {
          if ((value.size ?? value.length) > 0) {
            result[name] = [...value.values()];
          }
        } else {
          result[name] = value;
        }
      } else {
        const key = value.constructor.key;

        if (attribute.backpointer) {
          if (attribute.collection) {
            if ((value.size ?? value.length) > 0) {
              result[name] = Object.fromEntries(
                [...value.values()].map(v => [v[key], v])
              );
            }
          } else {
            result[name] = extract(value);
          }
        } else {
          result[name] = { [key]: value[key], type: value.constructor.name };
        }
      }
    }
  }

  return result;
}
