import test from "ava";
import { iterateToExternal } from "pacc";
import { attributeDefinitions } from "./fixtures.mjs";

test("iterateToExternal", t => {
  const result = Object.fromEntries([
    ...iterateToExternal({ a: "ABC", e: ["a", "b"] }, attributeDefinitions)
  ]);
  t.deepEqual(result, {
    ae: "abc",
    c: undefined,
    "d.d1": "dd1",
    e: ["a", "b"]
  });
});

test("iterateToExternal filtered", t => {
  const result = Object.fromEntries([
    ...iterateToExternal(
      { a: "ABC", e: ["a", "b"] },
      attributeDefinitions,
      attribute => attribute.name === "a"
    )
  ]);
  t.deepEqual(result, {
    ae: "abc"
  });
});

import { expand, expandContextDoubbleCurly } from "pacc";
