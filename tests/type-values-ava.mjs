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
