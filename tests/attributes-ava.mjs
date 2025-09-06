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

const definitions = {
  a: { default: "ad" },
  b: {},
  c: {},
  d: {
    attributes: {
      d1: { default: "dd1" }
    }
  }
};

test(sat, {}, { a: 1, b: {}, c: { c1: {} } }, definitions, {
  a: 1,
  b: {},
  c: { c1: {} },
  d: {
    d1: "dd1"
  }
});

test(sat, {}, {}, definitions, {
  a: "ad",
  d: {
    d1: "dd1"
  }
});
