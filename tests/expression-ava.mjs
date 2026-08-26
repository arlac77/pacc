import test from "ava";
import { eat, valueFor } from "./util.mjs";

test(eat, "1 +", undefined, new Error("unexpected EOF"));
test(eat, "( 1", undefined, new Error("unexpected EOF"));
test.skip(eat, "1,", undefined, new Error("unexpected EOF"));
test.skip(eat, "1 2", undefined, new Error("unexpected '2'"));
test(eat, "1", undefined, 1);
test(eat, "- 1", undefined, -1);
test(eat, "- 1 + 3", undefined, 2);
test(eat, "2 * - 1", undefined, -2);
test(eat, "- 1 * 2", undefined, -2);
test(eat, "1 + 2", undefined, 3);
test(eat, "'1' + 2", undefined, "12");
test(eat, "1 + 2 + 4", undefined, 7);
test(eat, "1 + 2 * 4", undefined, 9);
test(eat, "1 * 2 + 4", undefined, 6);
test(eat, "1 + (2 + 7)", undefined, 10);
test(eat, "(1 + 2) + 7", undefined, 10);
test(eat, "(1 + 2)", undefined, [3]);
test(eat, "(1) + 2", undefined, 3);
test(eat, "(1,2,3,4) + (5,6)", undefined, [1, 2, 3, 4, 5, 6]);
test(
  eat,
  "arrayA + arrayB",
  { current: { arrayA: [1, 2], arrayB: [3, 4] } },
  [1, 2, 3, 4]
);
test(
  eat,
  "setA + arrayB",
  { current: { setA: new Set([1, 2]), arrayB: [3, 4] } },
  [1, 2, 3, 4]
);
test(eat, "((1,2),3,4)", undefined, [[1, 2], 3, 4]);
test.skip(eat, "(1,(2,3),4)", undefined, [1, [2, 3], 4]);
test(eat, "(1,(2),3,4)", undefined, [1, [2], 3, 4]);
test(eat, "1 + (2 + 3)", undefined, 6);
test(eat, "(1 + 2) + 3", undefined, 6);
test(eat, "(1 + 2) * 4 + 5 + 6", undefined, 23);
test(eat, "'a' + 'b'", undefined, "ab");
test(eat, "1 < 2", undefined, true);
test(eat, "1 = 2", undefined, false);
test(eat, "1 != 2", undefined, true);
test(eat, "3 = 3", undefined, true);
test(eat, "true = false", undefined, false);
test(eat, "!true", undefined, false);
test(eat, "!(3 = 1 + 2)", undefined, false);
test(eat, "3 = 1 + 2", undefined, true);
test(eat, "true || false", undefined, true);
test(eat, "true && false", undefined, false);
test(eat, "1 + a", { current: { a: 5 } }, 6);
test(eat, "x > 2", { current: { x: 3 } }, true);
test(eat, "[ x > 2 ]", { current: { x: 3 } }, true);
test(eat, "[ 3 > '2' ]", { current: { x: 3 } }, true);
test(
  eat,
  "[ x > y ]",
  { current: { x: 3 }, valueFor: valueFor({ y: 2 }) },
  true
);
test(eat, "a[ c > 2 ]", { current: { a: [{ c: 2 }, { c: 3 }] } }, [{ c: 3 }]);
test(
  eat,
  "a[ b.c > 2 && d < 7].d",
  {
    current: {
      a: [
        { b: { c: 3 }, d: 2 },
        { b: { c: 1 }, d: 1 }
      ]
    }
  },
  [2]
);

test(eat, "[1]", { current: [0, 9] }, 9);
test(eat, "[2]", { current: [0, 3, 9].values() }, 9);
test(eat, "['a']", { current: { a: 7 } }, 7);
test(eat, "['b']", { current: new Map([["b", 8]]) }, 8);
test(eat, "[b]", { current: new Map([["b", 8]]) }, 8);
test(eat, "['c']", { current: new Map([["c", () => 9]]) }, 9);
test(eat, "d", { current: new Set(["d"]) }, "d");
test(eat, "[1+2].b", { current: [0, 0, 0, { b: 44 }] }, 44);
test(eat, "[3].b", { current: [0, 0, 0, { b: 44 }] }, 44);
test(eat, "a", { current: { a: 12 } }, 12);
test(eat, "b", { current: { b: () => 7 } }, 7);
test(eat, "a[2].c", { current: { a: [0, 0, { c: 17 }] } }, 17);
test(eat, ".a.b.c", { root: { a: { b: { c: 77 } } } }, 77);
test(eat, "a . b . c", { current: { a: { b: { c: 77 } } } }, 77);
test(
  eat,
  "'a-x' . b . 'c-d'",
  { current: { "a-x": { b: { "c-d": 77 } } } },
  77
);
test(eat, "a . b . d", { current: { a: { b: { d: () => 88 } } } }, 88);
test(
  eat,
  "b[n=3].x",
  {
    current: new Map([
      ["b", [{ n: 1 }, { n: 2 }, { n: 3, x: () => 6 }, { n: 3, x: 7 }]],
      ["c", 2]
    ])
  },
  [6, 7]
);
test(
  "map identifier",
  eat,
  "c",
  {
    current: new Map([
      ["b", 1],
      ["c", 2]
    ])
  },
  2
);

const current = new Map([
  ["a", { n: 1, l: [1, 2] }],
  ["b", { n: 3, x: 7, l: [3, 4] }]
]);

test(eat, "[n=3].x", { current }, [7]);
test(eat, "b.x", { current }, 7);
test(eat, "[n<5].l", { current }, [
  [1, 2],
  [3, 4]
]);

test(
  eat,
  "[].n",
  {
    current: [{ n: ["a"] }, { n: ["b"] }, { n: ["c"] }]
  },
  [["a"], ["b"], ["c"]]
);

test(
  eat,
  "[n=2].x",
  {
    current: new Set([{ n: 1 }, { n: 2, x: 4 }, { n: 3, x: 7 }])
  },
  [4]
);

test(
  eat,
  "[].x",
  {
    current: new Set([{ x: 7 }, { x: 4 }, { x: 8 }])
  },
  [7, 4, 8]
);

test(
  eat,
  "a[].x",
  {
    current: { a: new Set([{ x: 7 }, { x: 4 }, { x: 8 }]) }
  },
  [7, 4, 8]
);

test(eat, "in(3,3)", {}, true);
test(eat, "in(3,4)", {}, false);
test(eat, "in(2,array)", { valueFor: valueFor({ array: [1, 2, 3] }) }, true);
test(eat, "in('b',array)", { valueFor: valueFor({ array: [1, 2, 3] }) }, false);
test(
  eat,
  "in(2,set)",
  { valueFor: valueFor({ set: new Set([1, 2, 3]) }) },
  true
);
test(
  eat,
  "in(7,set)",
  { valueFor: valueFor({ set: new Set([1, 2, 3]) }) },
  false
);

test(eat, "ceil(0.7)", undefined, 1);
test(eat, "floor(2.9)", undefined, 2);
test(eat, "abs(-7)", undefined, 7);
test(eat, "min(1,2)", undefined, 1);
test(eat, "min(1,2)+3", undefined, 4);
test(eat, "3+(min(1,2))", undefined, 4);
test(eat, "3+min(1,2)", undefined, 4);
test(eat, "max(1,2,3)", undefined, 3);
test(eat, "substring('abcd',1,3)", undefined, "bc");
test(eat, "substring('abcd',1,1+2)", undefined, "bc");
test(eat, "substring('abcd',1,min(3,4))", undefined, "bc");
test(eat, "substring('abcd',1,min(2,3)+1)", undefined, "bc");
test(eat, "substring('abcd',1,1+min(2,3))", undefined, "bc");
test(eat, "length('a' + 'b')", undefined, 2);
test(eat, "lowercase('aA')", undefined, "aa");
test(eat, "uppercase('aA')", undefined, "AA");
test(eat, "trim(' aA X')", undefined, "aA X");
test(eat, "join(',','A','B','C')", undefined, "A,B,C");
test(
  eat,
  "join(',',a[n=2].b,'B')",
  { current: { a: [{ n: 2, b: "A" }] } },
  "A,B"
);
test(eat, "join(',','ABC')", undefined, "ABC");
test(eat, "sort(a)", { current: { a: [2, 1, 3] } }, [1, 2, 3]);
test(eat, "sort(b)", { current: { b: new Set([2, 1, 3]) } }, [1, 2, 3]);
test(
  eat,
  "sort(a,priority,'descending')",
  { current: { a: [{ priority: 2 }, { priority: 1 }, { priority: 3 }] } },
  [{ priority: 3 }, { priority: 2 }, { priority: 1 }]
);
test(
  eat,
  "sort(b,priority,'descending')",
  {
    current: { b: new Set([{ priority: 2 }, { priority: 1 }, { priority: 3 }]) }
  },
  [{ priority: 3 }, { priority: 2 }, { priority: 1 }]
);

test(eat, "truncate(a,2)", { current: { a: [2, 1, 3] } }, [2, 1]);
test(eat, "truncate(a,1)", { current: { a: [2, 1, 3].values() } }, [2]);
test(
  eat,
  "join(',',array)",
  { valueFor: valueFor({ array: ["A", "B", "C"] }) },
  "A,B,C"
);
function* iter() {
  yield "A";
  yield "B";
  yield "C";
}
test(eat, "join(',',iter)", { valueFor: valueFor({ iter: iter() }) }, "A,B,C");

test(
  eat,
  "all[in(7,x)]",
  {
    current: { all: [{ x: [1] }, { x: [2, 7] }, { x: [3] }] }
  },
  [{ x: [2, 7] }]
);
test(
  eat,
  "all[in(8,y)]",
  {
    current: {
      all: [{ y: new Set([1]) }, { y: new Set([2, 8]) }, { y: new Set([3]) }]
    }
  },
  [{ y: new Set([2, 8]) }]
);
test(eat, "encodeURI('http://localhost/a b')", {}, "http://localhost/a%20b");
