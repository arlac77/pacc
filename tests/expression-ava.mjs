import test from "ava";
import {
  tokens,
  PLUS,
  GREATER,
  LESS,
  DOUBLE_AMPERSAND
} from "../src/tokens.mjs";
import { parse } from "../src/expression.mjs";

function eat(t, input, expected) {
  let context;
  if (typeof input === "object") {
    context = { ...input, tokens: tokens(input.tokens) };
  } else {
    context = { tokens: tokens(input), exec: false };
  }

  if (expected instanceof Error) {
    try {
      const result = parse(context);
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

    let result = parse(context);

    clear(result);
    t.deepEqual(result, expected);
  }
}

eat.title = (providedTitle, input, expected) =>
  `parse ${providedTitle ? providedTitle + " " : ""} ${
    typeof input === "object" ? input.tokens : input
  } => ${expected}`.trim();

test(eat, "1 +", new Error("unexpected EOF"));
test.skip(eat, "1 )", new Error("unexpected ')'"));
test(eat, "1 + 2", 3);
test(eat, "1 + 2 + 4", 7);
test(eat, "1 + 2 * 4", 9);
test(eat, "1 * 2 + 4", 6);
test(eat, "1 + (2 + 7)", 10);
test(eat, "(1 + 2)", 3);
test(eat, "(1) + 2", 3);
test(eat, "1 + (2 + 3)", 6);
test(eat, "(1 + 2) + 3", 6);
test(eat, "(1 + 2) * 4 + 5 + 6", 23);
test(eat, "1 < 2", true);
test(eat, "1 = 2", false);
test(eat, "1 != 2", true);
test(eat, "3 = 3", true);
test(eat, "true = false", false);
test(eat, "3 = 1 + 2", true);
test(eat, "true || false", true);
test(eat, "true && false", false);
test(eat, { tokens: "1 + a", root: { a: 5 } }, 6);
test(eat, "[ x > 2 ]", {
  token: GREATER,
  left: { path: ["x"] },
  right: 2
});
test(eat, "a.b[ c > 2 ]", {
  path: ["a", "b", { left: { path: ["c"] }, right: 2, token: GREATER }]
});
test(eat, "a[ b.c > 2 && d < 7].d", {
  path: [
    "a",
    {
      left: { left: { path: ["b", "c"] }, right: 2, token: GREATER },
      right: { left: { path: ["d"] }, right: 7, token: LESS },
      token: DOUBLE_AMPERSAND
    },
    "d"
  ]
});

test(eat, { tokens: "[1]", root: [0, 9] }, 9);
test(eat, { tokens: "[1+3].b", root: [0, 0, 0, 0, { b: 44 }] }, 44);
test(eat, { tokens: "a", root: { a: 12 } }, 12);
test(eat, { tokens: "a[2].c", root: { a: [0, 0, { c: 17 }] } }, 17);
test(eat, { tokens: "a . b . c", root: { a: { b: { c: 77 } } } }, 77);
