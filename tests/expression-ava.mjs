import test from "ava";
import { parse } from "../src/expression.mjs";

function eat(t, input, context, expected) {
  if (!context) {
    context = { exec: false };
  }

  if (expected instanceof Error) {
    try {
      const result = parse(input, context);
    } catch (e) {
      t.is(e.message, expected.message);
    }
  } else {
    function clear(node) {
      if (node?.left) {
        clear(node.left);
      }
      if (node?.right) {
        clear(node.right);
      }
      if (node?.path) {
        node.path.forEach(p => clear(p));
      }
      if (node?.eval) {
        delete node.eval;
      }
    }

    const result = parse(input, context);

    //console.log(result);
    clear(result);
    t.deepEqual(result, expected);
  }
}

eat.title = (providedTitle, input, context, expected) =>
  `parse ${providedTitle ? providedTitle + " " : ""} ${
    typeof input === "object" ? input.input : input
  } => ${expected}`.trim();

test(eat, "1 +", undefined, new Error("unexpected EOF"));
test.skip(eat, "1 )", undefined, new Error("unexpected ')'"));
test(eat, "1 + 2", undefined, 3);
test(eat, "1 + 2 + 4", undefined, 7);
test(eat, "1 + 2 * 4", undefined, 9);
test(eat, "1 * 2 + 4", undefined, 6);
test(eat, "1 + (2 + 7)", undefined, 10);
test(eat, "(1 + 2)", undefined, 3);
test(eat, "(1) + 2", undefined, 3);
test(eat, "1 + (2 + 3)", undefined, 6);
test(eat, "(1 + 2) + 3", undefined, 6);
test(eat, "(1 + 2) * 4 + 5 + 6", undefined, 23);
test(eat, "'a' + 'b'", undefined, "ab");
test(eat, "1 < 2", undefined, true);
test(eat, "1 = 2", undefined, false);
test(eat, "1 != 2", undefined, true);
test(eat, "3 = 3", undefined, true);
test(eat, "true = false", undefined, false);
test(eat, "3 = 1 + 2", undefined, true);
test(eat, "true || false", undefined, true);
test(eat, "true && false", undefined, false);
test(eat, "1 + a", { root: { a: 5 } }, 6);
test(eat, "x > 2", { root: { x: 3 } }, true);
test(eat, "[ x > 2 ]", { root: { x: 3 } }, true);
test(eat, "[ x > y ]", { root: { x: 3 }, globals: { y: 2 } }, true);
test(eat, "a.b[ c > 2 ]", { root: { a: { b: [{ c: 2 }, { c: 3 }] } } }, [
  { c: 3 }
]);
test(
  eat,
  "a[ b.c > 2 && d < 7].d",
  {
    root: {
      a: [
        { b: { c: 3 }, d: 2 },
        { b: { c: 1 }, d: 1 }
      ]
    }
  },
  [2]
);

test(eat, "[1]", { root: [0, 9] }, 9);
test(eat, "['a']", { root: { a: 7 } }, 7);
test(eat, "[1+3].b", { root: [0, 0, 0, 0, { b: 44 }] }, 44);
test(eat, "a", { root: { a: 12 } }, 12);
test(eat, "a[2].c", { root: { a: [0, 0, { c: 17 }] } }, 17);
test(eat, "a . b . c", { root: { a: { b: { c: 77 } } } }, 77);
test(
  eat,
  "b[n=3].x",
  {
    root: new Map([
      ["b", [{ n: 1 }, { n: 2 }, { n: 3, x: 7 }]],
      ["c", 2]
    ])
  },
  [7]
);


test.skip(eat, "f1()", { globals: { f1: { name: "f1"} } }, "f1");
