import test from "ava";
import { predicateIteratorEval } from "../src/ast.mjs";

test("predicateIteratorEval", t => {
  const context = {};

  const node = {
    eval: predicateIteratorEval,
    left: {
      eval: (node, current, context) => true
    },
    right: {
      eval: (node, current, context) => current
    }
  };

  t.deepEqual(
    predicateIteratorEval(node, new Set([1, 2, 3]), context),
    [1, 2, 3]
  );
});
