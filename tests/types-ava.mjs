import test from "ava";
import { oneOfType, types } from "pacc";

test("one of basics", t => {
  const type = oneOfType("boolean|string");
  const type2 = oneOfType([types.boolean, types.string]);

  t.is(type, type2);
  t.is(type.name, "boolean|string");
  t.true(type.members.has(types.boolean));
  t.true(type.members.has(types.string));
});

test("one of cascade", t => {
  const booleanOrString = oneOfType("boolean|string");
  const type = oneOfType([booleanOrString, "integer"]);
  t.is(type.name, "boolean|string|integer");
  t.true(type.members.has(types.integer));
  t.true(type.members.has(types.boolean));
  t.true(type.members.has(types.string));
});
