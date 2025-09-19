import test from "ava";
import { manadatoryAttributesPresent, string_attribute } from "pacc";

test("manadatoryAttributesPresent", t => {
  const attributes = { a: { ...string_attribute, mandatory: true } };

  t.true(manadatoryAttributesPresent({ a: "abc" }, attributes));
  t.false(manadatoryAttributesPresent({ b: "abc" }, attributes));
  t.false(manadatoryAttributesPresent(undefined, attributes));
  t.true(manadatoryAttributesPresent(undefined, undefined));
});
