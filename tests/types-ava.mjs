import test from "ava";
import { oneOfType, types, addType } from "pacc";

test("oneOfType basics", t => {
  const type = oneOfType("boolean|string");
  const type2 = oneOfType([types.boolean, types.string]);

  t.is(type, type2);
  t.is(type.name, "boolean|string");
  t.true(type.members.has(types.boolean));
  t.true(type.members.has(types.string));
});

test("oneOfType cascade", t => {
  const booleanOrString = oneOfType("boolean|string");
  const type = oneOfType([booleanOrString, "integer"]);
  t.is(type.name, "boolean|string|integer");
  t.true(type.members.has(types.integer));
  t.true(type.members.has(types.boolean));
  t.true(type.members.has(types.string));
});

test("oneOfType cascade new defs", t => {
  const booleanOrString = oneOfType("boolean|string");
  const type = oneOfType([booleanOrString, "special"]);
  t.is(type.name, "boolean|string|special");
  t.true(type.members.has(types.special));
  t.true(type.members.has(types.boolean));
  t.true(type.members.has(types.string));

  t.is(types.special.name, "special");
});

test("oneOfType new defs", t => {
  const type = oneOfType("special");
  t.is(type.name, "special");
  t.is(types.special.name, "special");
  t.is(type.members, undefined);
});

test("add already present", t => {
  const def = { name: "string" };
  const type = addType(def);
  t.is(type, types.string);
});
