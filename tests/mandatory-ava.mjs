import test from "ava";
import { mandatoryAttributesPresent, string_attribute } from "pacc";

test("mandatoryAttributesPresent", t => {
  const attributes = { a: { ...string_attribute, mandatory: true } };

  t.true(mandatoryAttributesPresent({ a: "abc" }, attributes));
  t.false(mandatoryAttributesPresent({ b: "abc" }, attributes));
  t.false(mandatoryAttributesPresent(undefined, attributes));
  t.true(mandatoryAttributesPresent(undefined, undefined));
});
