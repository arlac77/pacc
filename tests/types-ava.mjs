import test from "ava";
import { oneOfType, types, addType } from "pacc";
import { aClass, bClass, cClass } from "./fixtures.mjs";

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
  addType({ name: "special" });
  const booleanOrString = oneOfType("boolean|string");
  const type = oneOfType([booleanOrString, "special"]);
  t.is(type.name, "boolean|string|special");
  t.true(type.members.has(types.special));
  t.true(type.members.has(types.boolean));
  t.true(type.members.has(types.string));

  t.is(types.special.name, "special");
});

test("oneOfType new defs", t => {
  addType({ name: "special" });
  const type = oneOfType("special");
  t.is(type.name, "special");
  t.is(types.special.name, "special");
  t.is(type.members, undefined);
});

test("addType already present", t => {
  const def = { name: "string" };
  const type = addType(def);
  t.is(type, types.string);
});

test("addType with extends", t => {
  const def = { name: "extendet", extends: "object" };
  const type = addType(def);
  t.is(type.extends, types.object);
});

test("addType class", t => {
  const aType = addType(aClass);
  t.is(aType, types.a);
  t.is(aType.clazz, aClass);

  const bType = addType(bClass);
  t.is(bType, types.b);
  t.is(bType.clazz, bClass);
  t.is(bType.extends, types.a);
});

test("addType class with typeDefinition", t => {
  const cType = addType(cClass);
  t.is(cType, types.c);
  t.is(cType.clazz, cClass);
  t.is(cType.extends, types.a);
});
