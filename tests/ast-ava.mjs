import test from "ava";
import { predicateIteratorEval, pathEval } from "../src/ast.mjs";

export function iet(t, iterable, result) {
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
iet.title = (providedTitle = "", iterable, result) =>
  `predicateIteratorEval ${providedTitle} ${iterable} ->${result}`.trim();

test(iet, new Set([1, 2, 3]), [1, 2, 3]);
test(iet, [1, 2, 3], [1, 2, 3]);
test(
  iet,
  new Map([
    [1.1, 1],
    [2.2, 2],
    [3.3, 3]
  ]),
  [1, 2, 3]
);

function* iter() {
  yield 1;
  yield 2;
  yield 3;
}

test(iet, iter(), [1, 2, 3]);

export function pet(t, item, path, result) {
  const context = {
    getGlobal: name => undefined
  };

  const node = {
    eval: pathEval,
    path
  };

  t.deepEqual(pathEval(node, item, context), result);
}
pet.title = (providedTitle = "", item, path, result) =>
  `pathEval ${providedTitle} ${item} ${path} ->${result}`.trim();

test(pet, { a: { b: { c: 1 } } }, ["a", "b", "c"], 1);
test(pet, {}, [], {});
