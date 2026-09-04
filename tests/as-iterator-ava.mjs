import test from "ava";
import { AggregatedMap } from "aggregated-map";
import { asValueIterator } from "pacc";

test("asValueIterator from scalar", t =>
  t.deepEqual(Array.from(asValueIterator(1)), [1]));
test("asValueIterator from string", t =>
  t.deepEqual(Array.from(asValueIterator("abc")), ["abc"]));
test("asValueIterator from array", t =>
  t.deepEqual(Array.from(asValueIterator([1])), [1]));
test("asValueIterator from undefined", t =>
  t.deepEqual(Array.from(asValueIterator(undefined)), []));
test("asValueIterator from Map", t =>
  t.deepEqual(Array.from(asValueIterator(new Map([["a", 1]]))), [1]));
test("asValueIterator from AggregatedMap", t =>
  t.deepEqual(
    Array.from(
      asValueIterator(
        new AggregatedMap([new Map([["a", 1]]), new Map([["b", 2]])])
      )
    ),
    [
      1,
      2
    ]
  ));
test("asValueIterator from Set", t =>
  t.deepEqual(Array.from(asValueIterator(new Set(["a", "b"]))), ["a", "b"]));
