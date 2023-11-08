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

test(gat, "a", { a: 1 }, 1);
test(gat, "a.b", { a: { b: 2 } }, 2);
test(gat, "'a '.b", { "a ": { b: 3 } }, 3);
test(gat, "a [ * ]", { a: [4] }, 4);
test(gat, "a[*]", { a: new Set([5]) }, 5);
test(gat, "a[*].b", { a: [{ b: 6 }] }, 6);
test(gat, "a[1].b", { a: [{ b: 6 }, { b: 7 }, { b: 8 }] }, 7);

function sat(t, object, key, value, expected) {
  setAttribute(object, key, value);
  t.deepEqual(object, expected);
}

sat.title = (providedTitle, object, key, value, expected) =>
  `setAttribute ${providedTitle ? providedTitle + " " : ""}${JSON.stringify(
    object
  )} ${key}=${value} => ${JSON.stringify(expected)}`.trim();

test(sat, {}, "a", 1, { a: 1 });
test(sat, {}, "a.b", 1, { a: { b: 1 } });
test(sat, { a: { b: "x" } }, "a.b", 1, { a: { b: 1 } });
test(sat, { a: 1 }, "a.b", 1, { a: { b: 1 } });
test(sat, { a: "1" }, "a . b ", 1, { a: { b: 1 } });
test(sat, { a: { x: 7 } }, "a.b.c.d", 1, { a: { x: 7, b: { c: { d: 1 } } } });

test(sat, { }, "a[0]", 1, { a: [1] });
test(sat, { a: [] }, "a[0]", 1, { a: [1] });
