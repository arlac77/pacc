import test from "ava";
import { sast } from "./util.mjs";
import { prepareAttributesDefinitions } from "pacc";

const definitions = prepareAttributesDefinitions({
  dir: {
    type: "posix-path",
    description: "recording base directory",
    default: "/tmp"
  },
  recorders: {
    description: "well known recorders"
  }
});

test(sast, {}, { recorders: { r1: {}, r2: {} } }, definitions, (t, object) => {
  t.deepEqual(object.recorders, { r1: {}, r2: {} });
});
