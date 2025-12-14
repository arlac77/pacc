import test from "ava";
import {
  boolean_attribute,
  boolean_attribute_writable,
  boolean_attribute_false,
  empty_attribute,
  duration_attribute,
  string_collection_attribute,
  types
} from "pacc";

test("boolean_attribute", t => {
  t.is(boolean_attribute.type, types.boolean);
  t.false(boolean_attribute.writable);
  t.is(boolean_attribute.default, undefined);
});

test("boolean_attribute_writable", t => {
  t.is(boolean_attribute_writable.type, types.boolean);
  t.true(boolean_attribute_writable.writable);
  t.is(boolean_attribute_writable.default, undefined);
});

test("boolean_attribute_false attribute", t => {
  t.is(boolean_attribute_false.type, types.boolean);
  t.false(boolean_attribute_false.writable);
  t.false(boolean_attribute_false.default);
});

test("empty_attribute", t => {
  t.is(empty_attribute.type, types.boolean);
  t.false(empty_attribute.writable);
  t.is(empty_attribute.default, undefined);
});

test("string_collection_attribute", t => {
  t.false(string_collection_attribute.writable);
  t.is(string_collection_attribute.default, undefined);
  t.is(string_collection_attribute.type, types.string);
  t.is(string_collection_attribute.collection, true);
});

test("duration_attribute", t => {
  t.false(duration_attribute.writable);
  t.is(duration_attribute.default, undefined);
  t.is(duration_attribute.type, types.duration);
  t.is(duration_attribute.collection, false);
});
