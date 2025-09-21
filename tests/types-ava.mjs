import test from "ava";
import { oneOfType, types } from "pacc";

test("one of", t => {
  const type = oneOfType("boolean|string");
  const type2 = oneOfType("boolean|string");

  t.is(type, type2);
  t.is(type.name, "boolean|string");
  t.true(type.members.has(types.boolean));
  t.true(type.members.has(types.string));
});
