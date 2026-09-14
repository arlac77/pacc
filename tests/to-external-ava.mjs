import test from "ava";
import { iterateToExternal } from "pacc";
import { attributeDefinitions } from "./fixtures.mjs";

test("iterateToExternal", t => {
  const result = Object.fromEntries([
    ...iterateToExternal({ a: "abc" }, attributeDefinitions)
  ]);
  t.deepEqual(result, { ae: "abc" });
});

import { expand, expandContextDoubbleCurly } from "pacc";
