import test from "ava";
import { parse, globals } from "../src/expression.mjs";

function getGlobal(other) {
  return a => globals[a] ?? other?.[a];
}

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

    clear(result);
    t.deepEqual(
      Array.isArray(expected) ? Array.from(result) : result,
      expected
    );
  }
}

eat.title = (providedTitle, input, context, expected) =>
  `parse ${providedTitle ? providedTitle + " " : ""} ${
    typeof input === "object" ? input.input : input
  } => ${expected}`.trim();

test(eat, "1 +", undefined, new Error("unexpected EOF"));
test.skip(eat, "1 2", undefined, new Error("unexpected '2'"));
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
test(
  eat,
  "[ x > y ]",
  { root: { x: 3 }, getGlobal: getGlobal({ y: 2 }) },
  true
);
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
test(eat, "['b']", { root: new Map([["b", 8]]) }, 8);
test(eat, "[c]", { root: new Map([["c", 9]]) }, 9);
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
test(
  "map identifier",
  eat,
  "c",
  {
    root: new Map([
      ["b", 1],
      ["c", 2]
    ])
  },
  2
);

test(
  eat,
  "[n=3].x",
  {
    root: new Map([
      ["a", { n: 1 }],
      ["b", { n: 2 }],
      ["b", { n: 3, x: 7 }]
    ])
  },
  [7]
);

test(
  eat,
  "[n=2].x",
  {
    root: new Set([{ n: 1 }, { n: 2, x: 4 }, { n: 3, x: 7 }])
  },
  [4]
);

test(
  eat,
  "[].x",
  {
    root: new Set([{ x: 7 }, { x: 4 }, { x: 8 }])
  },
  [7, 4, 8]
);

test(
  eat,
  "a[].x",
  {
    root: { a: new Set([{ x: 7 }, { x: 4 }, { x: 8 }]) }
  },
  [7, 4, 8]
);

test(eat, "in(2,array)", { getGlobal: getGlobal({ array: [1, 2, 3] }) }, true);
test(
  eat,
  "in('b',array)",
  { getGlobal: getGlobal({ array: [1, 2, 3] }) },
  false
);
test(
  eat,
  "in(2,set)",
  { getGlobal: getGlobal({ set: new Set([1, 2, 3]) }) },
  true
);
test(
  eat,
  "in(7,set)",
  { getGlobal: getGlobal({ set: new Set([1, 2, 3]) }) },
  false
);

test(eat, "ceil(0.7)", {}, 1);
test(eat, "floor(2.9)", {}, 2);
test(eat, "abs(-7)", {}, 7);
test(eat, "min(1,2)", {}, 1);
test(eat, "max(1,2,3)", {}, 3);
test(eat, "substring('abcd',1,3)", {}, "bc");
test(eat, "length('a' + 'b')", {}, 2);
test(eat, "lowercase('aA')", {}, "aa");
test(eat, "uppercase('aA')", {}, "AA");
test(
  eat,
  "all[in(7,x)]",
  {
    root: { all: [{ x: [1] }, { x: [2, 7] }, { x: [3] }] }
  },
  [{ x: [2, 7] }]
);
test(
  eat,
  "all[in(8,y)]",
  {
    root: {
      all: [{ y: new Set([1]) }, { y: new Set([2, 8]) }, { y: new Set([3]) }]
    }
  },
  [{ y: new Set([2, 8]) }]
);
