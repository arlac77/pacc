import test from "ava";
import { extract } from "pacc";
import { aClass } from "./fixtures.mjs";

test("extract", t => {
  const object = new aClass();

  object.a = "av";

  t.deepEqual(extract(object), { a: "av"});
});
