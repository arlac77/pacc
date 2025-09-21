import test from "ava";
import {
  types,
  prepareAttributesDefinitions,
  setAttributes,
  attributeIterator,
  writableAttributeIterator,
  default_attribute
} from "pacc";

test("prepareAttributesDefinitions", t => {
  const p = prepareAttributesDefinitions({
    a: { type: "string" },
    b: { type: "integer|string" },
    c: { type: "boolean|integer|string" }
  });

  t.deepEqual(p, {
    a: { type: types.string },
    b: { type: types["integer|string"] },
    c: { type: types["boolean|integer|string"] }
  });
});

function sat(t, object, source, definitions, expected) {
  setAttributes(object, source, definitions);
  t.deepEqual(object, expected);
}

sat.title = (providedTitle, object, source, definitions, expected) =>
  `setAttributes ${providedTitle ? providedTitle + " " : ""}${JSON.stringify(
    object
  )} ${source} => ${JSON.stringify(expected)}`.trim();

const definitions = {
  a: { ...default_attribute, default: "ad" },
  b: default_attribute,
  c: { ...default_attribute, writable: true },
  d: {
    attributes: {
      d1: { ...default_attribute, default: "dd1" }
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

test("attributeIterator", t => {
  t.deepEqual(
    [...attributeIterator(definitions)],
    [
      [["a"], definitions.a],
      [["b"], definitions.b],
      [["c"], definitions.c],
      [["d"], definitions.d],
      [["d", "d1"], definitions.d.attributes.d1]
    ]
  );
});

test("writableAttributeIterator", t => {
  t.deepEqual(
    [...writableAttributeIterator(definitions)],
    [[["c"], definitions.c]]
  );
});
