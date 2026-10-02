import test from "ava";
import { extract } from "pacc";
import { aClass } from "./fixtures.mjs";

test("extract", t => {
  const object = new aClass();

  object.a = "av";
  object.b = ["b1", "b2"];

  t.deepEqual(extract(object), {
    a: "av",
    b: ["b1", "b2"],
    d: { d1: "dd1" }
  });
});

test("extract with options filter + externalNames", t => {
  const object = new aClass();

  object.a = "av";
  object.b = ["b1", "b2"];
  object.c = 100;
  object.d = { d1: "org"};

  t.deepEqual(
    extract(object, {
      type: aClass,
      filter: attribute => attribute.name !== "b",
      externalNames: true
    }),
    {
      ae: "av",
      c: '1m 40s',
      d: { d1: "org" }
    }
  );
});
