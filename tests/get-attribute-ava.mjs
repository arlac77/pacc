import test from "ava";
import { getAttribute } from "pacc";

function gat(t, object, key, expected) {
  try {
    const value = getAttribute(object, key);
    t.deepEqual(value, expected);
  } catch (e) {
    if (expected instanceof Error) {
      t.is(e.message, expected.message, "expected error");
    } else {
      t.fail("expected Error");
    }
  }
}

gat.title = (providedTitle, object, key, expected) =>
  `getAttribute ${providedTitle ? providedTitle + " " : ""}${JSON.stringify(
    object
  )} '${key}' ${expected instanceof Error ? expected : ""}`.trim();

test(gat, undefined, "a", undefined);
test(gat, { a: 1 }, "a", 1);
test(gat, { a: { b: 1 } }, "a.b", 1);
test(gat, {}, "x.y.z", undefined);
test(gat, [1, 2], "[1]", 2);
test(gat, [1, 2, 3], " \t[ 1 ] ", 2);
test(gat, [0, { b: 3 }], "[1].b", 3);
test(gat, [0, { c: 3 }], " [1 ] .c ", 3);
test(gat, { a: { b: 2 } }, "a.b", 2);
test(gat, { a: [4] }, "a [ 0 ]", 4);
test(gat, { a: [{ b: 6 }] }, "a[0].b", 6);
test(gat, { a: [{ b: 6 }, { b: 7 }, { b: 8 }] }, "a[1].b", 7);
test(gat, { a: 1 }, "a*", new Error("unexpected EOF"));
test(
  gat,
  {
    a() {
      return 8;
    }
  },
  "a",
  8
);

test(
  gat,
  {
    *b() {
      yield 9;
      yield 10;
    }
  },
  "b",
  [9, 10]
);
