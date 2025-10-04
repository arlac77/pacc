import test from "ava";
import { sast } from "./util.mjs";
import {
  prepareAttributesDefinitions,
  string_attribute,
  setAttributes
} from "pacc";
import { attributeDefinitions } from "./fixtures.mjs";

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

function sat(t, object, source, definitions, expected) {
  setAttributes(object, source, definitions);
  t.deepEqual(object, expected);
}

sat.title = (providedTitle, object, source, definitions, expected) =>
  `setAttributes ${providedTitle ? providedTitle + " " : ""}${JSON.stringify(
    object
  )} ${source} => ${JSON.stringify(expected)}`.trim();

test(sat, {}, { a: 1, b: {}, c: { c1: {} } }, attributeDefinitions, {
  a: 1,
  b: {},
  c: { c1: {} },
  d: {
    d1: "dd1"
  }
});

test(sat, {}, {}, attributeDefinitions, {
  a: "ad",
  d: {
    d1: "dd1"
  }
});
