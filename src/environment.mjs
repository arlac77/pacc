import { attributeIterator, setAttribute } from "pacc";

/**
 * Extract values from environment.
 * @param {Object} env as from process.env
 * @param {Object} attributes as from process.env
 * @param {string} instanceIdentifier part of variable name.
 * @return {Object|undefined} undefined if no suitable environment variables have been found
 */
export function environmentValues(env, attributes, instanceIdentifier) {
  let values;

  for (const [path, attribute] of attributeIterator(
    attributes,
    (name, attribute) => attribute.env || attribute.attributes
  )) {
    const name = path.join(".");

    for (const envName of (Array.isArray(attribute.env)
      ? attribute.env
      : [attribute.env]
    ).map(
      name =>
        name && name.replace("{{instanceIdentifier}}", () => instanceIdentifier)
    )) {
      if (env?.[envName] !== undefined) {
        values ??= {};
        setAttribute(values, name, env[envName]);
      }
    }
  }

  return values;
}
