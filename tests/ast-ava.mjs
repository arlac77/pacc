import test from "ava";
import { pathEval, keyedAccessEval, ASTNullFilter } from "../src/ast.mjs";

export function pet(t, root, path, expectedResult) {
  const context = {
    valueFor: name => undefined,
    root
  };

  const node = {
    eval: pathEval,
    path
  };

  let result = pathEval(node, root, context);

  if (typeof result == "function") {
    result = Array.from(result());
  } else if (result instanceof Iterator) {
    result = Array.from(result);
  }

  t.deepEqual(result, expectedResult);
}
pet.title = (providedTitle = "", item, path, result) =>
  `pathEval ${providedTitle} ${item} ${path.map(p => p.key || p).join()} ->${result}`.trim();

test(
  pet,
  { b: ["x", new Map([["c", 7]])] },
  [
    { eval: keyedAccessEval, key: "b" },
    { eval: keyedAccessEval, key: 1 },
    { eval: keyedAccessEval, key: "c" }
  ],
  7
);

test(pet, {}, [], {});

test(
  pet,
  { a: { b: [{ c: 2 }, { c: 3 }] } },
  [
    { eval: keyedAccessEval, key: "a" },
    { eval: keyedAccessEval, key: "b" },
    { eval: (node, current, context) => current.filter(item => item.c > 2) }
  ],
  [{ c: 3 }]
);

test(pet, new Set([1, 2, 3]), [ASTNullFilter], [1, 2, 3]);
test(pet, new Set([1, 2, 3, 4]).values(), [ASTNullFilter], [1, 2, 3, 4]);
test(pet, [1, 2, 3], [ASTNullFilter], [1, 2, 3]);
test(
  pet,
  new Map([
    [1.1, 1],
    [2.2, 2],
    [3.3, 3]
  ]),
  [ASTNullFilter],
  [1, 2, 3]
);

function* iter() {
  yield 1;
  yield 2;
  yield 3;
}

test(pet, iter(), [ASTNullFilter], [1, 2, 3]);
