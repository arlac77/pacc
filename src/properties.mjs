import { attributeIterator } from "./attributes.mjs";
import { getAttribute } from "./settergetter.mjs";

export function createPropertiesFromAttributes(object, attributes, values) {
  for (const [path, def] of attributeIterator(attributes)) {
    const name = path.join(".");

    let value = getAttribute(values, name, def);
  }
}
