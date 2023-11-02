import test from "ava";
import { getAttribute } from "pacc";

function gat(t, expression, candidate, expected) {
  try {
    const result = getAttribute(candidate, expression);
    t.deepEqual(result, expected);
  } catch (e) {
    t.deepEqual(e, expected);
  }
}

gat.title = (providedTitle = "getAttribute", expression, candidate, expected) =>
  `${providedTitle} ${expression} ${JSON.stringify(candidate)} ${
    expected instanceof Error ? " =>ERROR" : ""
  }`.trim();

test(gat, "a.b", { a: { b: 2 } }, 2);
test(gat, "a [ * ]", { a: [3] }, 3);
test(gat, "a[*]", { a: new Set([4]) }, 4);
test(gat, "a[*].b", { a: [{ b: 5 }] }, 5);
