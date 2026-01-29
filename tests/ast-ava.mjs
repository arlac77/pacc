import test from "ava";
import { pathEval } from "../src/ast.mjs";

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

test(pet, new Set([1, 2, 3]), [{ eval: () => true }], [1, 2, 3]);
test(pet, [1, 2, 3], [{ eval: () => true }], [1, 2, 3]);
test(
  pet,
  new Map([
    [1.1, 1],
    [2.2, 2],
    [3.3, 3]
  ]),
  [{ eval: () => true }],
  [1, 2, 3]
);

function* iter() {
  yield 1;
  yield 2;
  yield 3;
}

test(pet, iter(), [{ eval: () => true }], [1, 2, 3]);
