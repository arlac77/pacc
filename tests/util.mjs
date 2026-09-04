import { setAttributes, getAttributes } from "pacc";
import { globals } from "../src/tokens.mjs";
import { parse } from "../src/parser.mjs";

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

export function valueFor(other) {
  return a => globals[a] ?? other?.[a];
}

export function eat(t, input, context, expected) {
  if (expected instanceof Error) {
    try {
      const result = parse(input, context);
    } catch (e) {
      t.is(e.message, expected.message, input);
    }
  } else {
    let result = parse(input, context);

    if (Array.isArray(expected)) {
      try {
        result = [...result];
      } catch (e) {
        console.log(e, result);
      }
    }

    t.deepEqual(
      Array.isArray(expected) ? Array.from(result) : result,
      expected
    );
  }
}

eat.title = (providedTitle, input, context, expected) =>
  `parse ${providedTitle ? providedTitle + " " : ""} ${
    typeof input === "object" ? input.input : input
  } => ${expected}`.trim();
