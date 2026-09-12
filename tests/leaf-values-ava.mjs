import test from "ava";
import { AggregatedMap } from "aggregated-map";
import { leafValues } from "pacc";

test("leafValues scalar", t => t.deepEqual(Array.from(leafValues(1)), [1]));
test("leafValues string", t =>
  t.deepEqual(Array.from(leafValues("abc")), ["abc"]));
test("leafValues array", t => t.deepEqual(Array.from(leafValues([1])), [1]));
test("leafValues array nested", t =>
  t.deepEqual(Array.from(leafValues([1, [2, [3]]])), [1, 2, 3]));
test("leafValues undefined", t =>
  t.deepEqual(Array.from(leafValues(undefined)), []));
test("leafValues Map", t =>
  t.deepEqual(Array.from(leafValues(new Map([["a", 1]]))), [1]));
test("leafValues AggregatedMap", t =>
  t.deepEqual(
    Array.from(
      leafValues(new AggregatedMap([new Map([["a", 1]]), new Map([["b", 2]])]))
    ),
    [1, 2]
  ));
test("leafValues Set", t =>
  t.deepEqual(Array.from(leafValues(new Set(["a", "b"]))), ["a", "b"]));

test("leafValues Array of Maps", t =>
  t.deepEqual(
    Array.from(leafValues([new Map([["m1", "a"]]), new Map([["m2", "b"]])])),
    ["a", "b"]
  ));

const iter = {
  *[Symbol.iterator]() {
    let n = 0;
    while (n < 3) {
      yield new Map([["a" + n, n++]]);
    }
  }
};

test("leafValues Iterable of Maps", t =>
  t.deepEqual(Array.from(leafValues(iter)), [0, 1, 2]));
