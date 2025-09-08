import test from "ava";
import { boolean_attribute_writable } from "pacc";
import { definePropertiesFromAttributes } from "../src/properties.mjs";
import { prepareAttributesDefinitions } from "../src/attributes.mjs";

test("definePropertiesFromAttributes boolean_conversion", t => {
  const attributes = prepareAttributesDefinitions({
    boolean_conversion: boolean_attribute_writable
  });

  const object1 = {};
  definePropertiesFromAttributes(object1, attributes, {
    boolean_conversion: 1
  });
  t.is(object1.boolean_conversion, true);

  const object2 = {};
  definePropertiesFromAttributes(object2, attributes, {
    boolean_conversion: 0
  });
  t.is(object2.boolean_conversion, false);

  const object3 = {};
  definePropertiesFromAttributes(object3, attributes, {
    boolean_conversion: true
  });
  t.is(object3.boolean_conversion, true);

  object3.boolean_conversion = false;
  t.is(object3.boolean_conversion, false);
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
