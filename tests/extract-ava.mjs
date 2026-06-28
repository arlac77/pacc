import test from "ava";
import { extract } from "pacc";
import { aClass } from "./fixtures.mjs";

test("extract", t => {
  const object = new aClass();

  object.a = "av";
  object.b = ["b1","b2"];

  t.deepEqual(extract(object), { a: "av", b: ["b1","b2"]});
});
