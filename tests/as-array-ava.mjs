import test from "ava";
import { AggregatedMap } from "aggregated-map";
import { asArray } from "pacc";

test("asArray from scalar", t => t.deepEqual(asArray(1), [1]));
test("asArray from string", t => t.deepEqual(asArray("abc"), ["abc"]));
test("asArray from array", t => t.deepEqual(asArray([1]), [1]));
test("asArray from undefined", t => t.deepEqual(asArray(undefined), []));
test("asArray from Map", t =>
  t.deepEqual(asArray(new Map([["a", 1]])), [["a", 1]]));
test("asArray from AggregatedMap", t =>
  t.deepEqual(
    asArray(new AggregatedMap([new Map([["a", 1]]), new Map([["b", 2]])])),
    [
      ["a", 1],
      ["b", 2]
    ]
  ));
test("asArray from Set", t =>
  t.deepEqual(asArray(new Set(["a", "b"])), ["a", "b"]));
