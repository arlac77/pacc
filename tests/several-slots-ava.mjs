import test from "ava";
import { sast } from "./util.mjs";
import { prepareAttributesDefinitions, string_attribute } from "pacc";

const definitions = prepareAttributesDefinitions({
  dir: {
    ...string_attribute,
    description: "recording base directory",
    default: "/tmp"
  },
  recorders: {
    ...string_attribute,
    description: "well known recorders"
  }
});

test(sast, {}, { recorders: { r1: {}, r2: {} } }, definitions, (t, object) => {
  t.deepEqual(object.recorders, { r1: {}, r2: {} });
});
