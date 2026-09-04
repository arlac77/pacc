import test from "ava";
import { eat, valueFor } from "./util.mjs";

test(eat, "[1]", { current: [0, 9] }, 9);
test(eat, "[2]", { current: [0, 3, 9].values() }, 9);
test(eat, "['a']", { current: { a: 7 } }, 7);
test(eat, "['b']", { current: new Map([["b", 8]]) }, 8);
test(eat, "[b]", { current: new Map([["b", 8]]) }, 8);
test(eat, "['c']", { current: new Map([["c", () => 9]]) }, 9);
test(eat, "a[2].c", { current: { a: [0, 0, { c: 17 }] } }, 17);
test(eat, "[1+2].b", { current: [0, 0, 0, { b: 44 }] }, 44);
test(eat, "[3].b", { current: [0, 0, 0, { b: 44 }] }, 44);
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


const current = new Map([
  ["a", { n: 1, l: [1, 2] }],
  ["b", { n: 3, x: 7, l: [3, 4] }]
]);

test(eat, "[n=3].x", { current }, [7]);
test(eat, "[n<5].l", { current }, [
  [1, 2],
  [3, 4]
]);


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

