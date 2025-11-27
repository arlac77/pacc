import test from "ava";
import { prepareValue, types } from "pacc";

test("empty url type", t => {
  t.is(prepareValue("", { type: types.url }), undefined);
  t.is(
    prepareValue("http:/example.com", { type: types.url }),
    "http:/example.com"
  );
});
