import test from "ava";
import { prepareValue, types } from "pacc";

test("empty url type", t => {
  t.is(prepareValue("", { type: types.url }), undefined);
  t.is(
    prepareValue("http:/example.com", { type: types.url }),
    "http:/example.com"
  );
});

test("boolean type", t => {
  t.is(prepareValue("no", { type: types.boolean }), false);
  t.is(prepareValue("0", { type: types.boolean }), false);
  t.is(prepareValue(0, { type: types.boolean }), false);
  t.is(prepareValue(1, { type: types.boolean }), true);
});

test("duration type", t => {
  t.is(prepareValue(1, { type: types.duration }), 1000);
  t.is(prepareValue("1", { type: types.duration }), 1000);
  t.is(prepareValue("1ms", { type: types.duration }), 1);
  t.is(prepareValue("1 ms", { type: types.duration }), 1);
  t.is(prepareValue("1 h", { type: types.duration }), 3600000);
  t.is(prepareValue("1 h 30m", { type: types.duration }), 5400000);
});
