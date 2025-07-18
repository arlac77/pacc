import {
  setAttributes,
  getAttributes
} from "pacc";

export function sast(t, object, source, definitions, expected) {
  setAttributes(object, source, definitions);
  expected(t, object);
}

sast.title = (providedTitle = "", object, source, definitions, expected) =>
  `setAttributes ${providedTitle} ${JSON.stringify(
    object
  )} ${source} ${JSON.stringify(definitions)}`.trim();

export function gast(t, object, def, expected) {
  t.deepEqual(getAttributes(object, def), expected);
}

gast.title = (providedTitle = "", object, def, expected) =>
  `getAttributes ${providedTitle} ${JSON.stringify(object)} ${JSON.stringify(
    def
  )}`.trim();
