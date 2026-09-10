import test from "ava";
import { AggregatedMap } from "aggregated-map";
import { leafValues } from "pacc";

test("leafValues from scalar", t =>
  t.deepEqual(Array.from(leafValues(1)), [1]));
test("leafValues from string", t =>
  t.deepEqual(Array.from(leafValues("abc")), ["abc"]));
test("leafValues from array", t =>
  t.deepEqual(Array.from(leafValues([1])), [1]));
test("leafValues from array nested", t =>
  t.deepEqual(Array.from(leafValues([1,[2,[3]]])), [1,2,3]));
test("leafValues from undefined", t =>
  t.deepEqual(Array.from(leafValues(undefined)), []));
test("leafValues from Map", t =>
  t.deepEqual(Array.from(leafValues(new Map([["a", 1]]))), [1]));
test("leafValues from AggregatedMap", t =>
  t.deepEqual(
    Array.from(
      leafValues(
        new AggregatedMap([new Map([["a", 1]]), new Map([["b", 2]])])
      )
    ),
    [1, 2]
  ));
test("leafValues from Set", t =>
  t.deepEqual(Array.from(leafValues(new Set(["a", "b"]))), ["a", "b"]));

test("leafValues from Array of Maps", t =>
  t.deepEqual(
    Array.from(
      leafValues([new Map([["m1", "a"]]), new Map([["m2", "b"]])])
    ),
    ["a", "b"]
  ));
