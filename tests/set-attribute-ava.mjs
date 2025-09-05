import test from "ava";
import { setAttribute } from "pacc";

function sat(t, object, key, value, expected) {
  setAttribute(object, key, value);
  t.deepEqual(object, expected);
}

sat.title = (providedTitle, object, key, value, expected) =>
  `setAttribute ${providedTitle ? providedTitle + " " : ""}${JSON.stringify(
    object
  )} ${key}=${value} => ${JSON.stringify(expected)}`.trim();

test(sat, {}, "a", 1, { a: 1 });
test(sat, {}, "b", new Date(1), { b: new Date(1) });
test(sat, {}, "a.b", 1, { a: { b: 1 } });
test(sat, { a: { b: "x" } }, "a.b", 1, { a: { b: 1 } });
test(sat, { a: 1 }, "a.b", 1, { a: { b: 1 } });
test(sat, { a: "1" }, "a . b ", 1, { a: { b: 1 } });
test(sat, { a: { x: 7 } }, "a.b.c.d", 1, { a: { x: 7, b: { c: { d: 1 } } } });
test(sat, {}, "a[1 + 0]", 1, { a: [undefined, 1] });
test(sat, {}, "a[1].b", 1, { a: [undefined, { b: 1 }] });
test(sat, { a: [] }, "a[0]", 1, { a: [1] });
