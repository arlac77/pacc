import test from "ava";
import { tokens, PLUS, GREATER, OPEN_BRACKET } from "../src/tokens.mjs";
import { parse } from "../src/expression.mjs";

function eat(t, input, expected) {
  const context = { tokens: tokens(input) };
  const result = parse(context);

  t.deepEqual(result, expected);
}

eat.title = (providedTitle, input, expected) =>
  `parse ${
    providedTitle ? providedTitle + " " : ""
  } ${input} => ${expected}`.trim();

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
test(eat, "a", { path: ["a"] });
test(eat, "a . b . c", {
  path: ["a", "b", "c"]
});
test(eat, "1 + a", { token: PLUS, left: 1, right: { path: ["a"] } });
test(eat, "[ x > 2 ]", {
  token: GREATER,
  left: { path: ["x"] },
  right: 2
});
test(eat, "a.b[ c > 2 ]", {
  path: ["a", "b", { left: { path: ["c"] }, right: 2, token: GREATER }]
});
test(eat, "a[ b.c > 2].d", {
  path: ["a", { left: { path: ["b", "c"] }, right: 2, token: GREATER }, "d"]
});
test(eat, "a[2].c", {
  path: ["a", 2, "c"]
});
