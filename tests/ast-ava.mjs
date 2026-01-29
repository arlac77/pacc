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

export function pet(t, item, path, expectedResult) {
  const context = {
    getGlobal: name => undefined
  };

  const node = {
    eval: pathEval,
    path
  };

  let result = pathEval(node, item, context);

  if (typeof result == "function") {
    result = Array.from(result());
  } else if (result instanceof Iterator) {
    result = Array.from(result);
  }

  t.deepEqual(result, expectedResult);
}
pet.title = (providedTitle = "", item, path, result) =>
  `pathEval ${providedTitle} ${item} ${path} ->${result}`.trim();

test(pet, { a: ["x", new Map([["c", 7]])] }, ["a", 1, "c"], 7);
test(pet, {}, [], {});

test(
  pet,
  { a: { b: [{ c: 2 }, { c: 3 }] } },
  ["a", "b", { eval: (node, current, context) => current.c > 2 }],
  [{ c: 3 }]
);

//a.b[c > 2];
