import test from "ava";
import { boolean_attribute, boolean_attribute_false, string_collection_attribute } from "pacc";

test("boolean attribute", t => {
  t.true(boolean_attribute.writable);
  t.false(boolean_attribute.default);
  t.is(boolean_attribute.type, "boolean");
});

test("boolean_attribute_false attribute", t => {
  t.false(boolean_attribute_false.writable);
  t.false(boolean_attribute_false.default);
  t.is(boolean_attribute_false.type, "boolean");
});

test("string_collection_attribute", t => {
  t.false(string_collection_attribute.writable);
  t.is(string_collection_attribute.default, undefined);
  t.is(string_collection_attribute.type, "string");
  t.is(string_collection_attribute.collection, true);
});
