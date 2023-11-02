import test from "ava";
import { getAttribute, setAttribute } from "pacc";

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

function sat(t, expression, candidate, value) {
  try {
    setAttribute(candidate, expression, value);
    const result = getAttribute(candidate, expression);

    t.deepEqual(result, value);
  } catch (e) {
    t.deepEqual(e, expected);
  }
}

sat.title = (providedTitle = "setAttribute", expression, candidate, value) =>
  `${providedTitle} ${expression} ${JSON.stringify(candidate)} ${
    value instanceof Error ? " =>ERROR" : ""
  }`.trim();

test(sat, "a.b", { a: { b: 2 } }, 5);
