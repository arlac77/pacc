import test from "ava";
import { setAttributes } from "pacc";

function sat(t, object, source, definitions, expected) {
  setAttributes(object, source, definitions);
  t.deepEqual(object, expected);
}

sat.title = (providedTitle, object, source, definitions, expected) =>
  `setAttributes ${providedTitle ? providedTitle + " " : ""}${JSON.stringify(
    object
  )} ${source} => ${JSON.stringify(expected)}`.trim();

test(
  sat,
  {},
  { a: 1, b: {} },
  { a: { name: "a" }, b: { name: "b" } },
  { a: 1, b: {} }
);
