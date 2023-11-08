import test from "ava";
import { getAttribute, setAttribute } from "pacc";

function gat(t, object, key, expected) {
  const value = getAttribute(object, key);
  t.is(value, expected);
}

gat.title = (providedTitle, object, key) =>
  `getAttribute ${providedTitle ? providedTitle + " " : ""}${JSON.stringify(
    object
  )} ${key}`.trim();

test(gat, undefined, "a", undefined);
test(gat, { a: 1 }, "a", 1);
test(gat, { b: 1 }, "b>", 1);
test(gat, { b: 1 }, "b<", 1);
test(gat, { a: { b: 1 } }, "a.b", 1);
test(gat, { "a.b": 1 }, "a.b", 1);
test(gat, {}, "x.y.z", undefined);
test(gat, [1, 2], "[1]", 2);
test(gat, [1, 2, 3], " \t[ 1 ] ", 2);
test(gat, [0, { b: 3 }], "[1].b", 3);
test(gat, [0, { c: 3 }], " [1 ] .c ", 3);
test(gat, { a: { b: 2 } }, "a.b", 2);
test(gat, { "a ": { b: 3 } }, "'a '.b", 3);
test(gat, { a: [4] }, "a [ * ]", 4);
test(gat, { a: new Set([5]) }, "a[*]", 5);
test(gat, { a: [{ b: 6 }] }, "a[*].b", 6);
test(gat, { a: [{ b: 6 }, { b: 7 }, { b: 8 }] }, "a[1].b", 7);

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

test(sat, {}, "a[0]", 1, { a: [1] });
test(sat, { a: [] }, "a[0]", 1, { a: [1] });
