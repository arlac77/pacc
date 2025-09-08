import test from "ava";
import { boolean_attribute_writable } from "pacc";
import { definePropertiesFromAttributes } from "../src/properties.mjs";
import { prepareAttributesDefinitions } from "../src/attributes.mjs";

test("definePropertiesFromAttributes boolean_conversion", t => {
  const object = {};

  definePropertiesFromAttributes(
    object,
    prepareAttributesDefinitions(
      {
        boolean_conversion: boolean_attribute_writable
      },
      undefined
    ),
    { boolean_conversion: 1 },
    {}
  );

  t.is(object.boolean_conversion, true);

  object.boolean_conversion = false;
  t.is(object.boolean_conversion, false);
});

/*
function dpot(t, object, attributes, values, expected) {
  definePropertiesFromAttributes(object, attributes, values, {});
  expected(t, object);
}

dpot.title = (providedTitle, object, attributes, values, expected) =>
  `definePropertiesFromAttributes ${
    providedTitle ? providedTitle + " " : ""
  }${JSON.stringify(object)} ${JSON.stringify(attributes)}`.trim();

test(dpot, { b: 7 }, undefined, (t, object) => t.is(object.b, 7));
*/
/*
test(dpot, {}, {}, (t, object) => t.is(object.a, undefined));
test(dpot, {}, { name: "a" }, (t, object) => t.is(object.a, undefined));
*/
