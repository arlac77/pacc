import test from "ava";
import {
  types,
  prepareAttributesDefinitions,
  attributeIterator,
  writableAttributeIterator
} from "pacc";
import { attributeDefinitions } from "./fixtures.mjs";

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

test("attributeIterator", t => {
  t.deepEqual(
    [...attributeIterator(attributeDefinitions)],
    [
      [["a"], attributeDefinitions.a],
      [["b"], attributeDefinitions.b],
      [["c"], attributeDefinitions.c],
      [["d"], attributeDefinitions.d],
      [["d", "d1"], attributeDefinitions.d.attributes.d1]
    ]
  );
});

test("writableAttributeIterator", t => {
  t.deepEqual(
    [...writableAttributeIterator(attributeDefinitions)],
    [[["c"], attributeDefinitions.c]]
  );
});
