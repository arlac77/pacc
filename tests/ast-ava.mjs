import test from "ava";
import { predicateIteratorEval } from "../src/ast.mjs";

export function piet(t, iterable, result) {
  const context = {};

  const node = {
    eval: predicateIteratorEval,
    left: {
      eval: () => true
    },
    right: {
      eval: (node, current, context) => current
    }
  };

  t.deepEqual(
    Array.from(predicateIteratorEval(node, iterable, context)),
    result
  );
}

piet.title = (providedTitle = "", iterable, result) =>
  `predicateIteratorEval ${providedTitle} ${iterable} ->${result}`.trim();

test(piet, new Set([1, 2, 3]), [1, 2, 3]);
test(piet, [1, 2, 3], [1, 2, 3]);
test(
  piet,
  new Map([
    [1.1, 1],
    [2.2, 2],
    [3.3, 3]
  ]),
  [1, 2, 3]
);
