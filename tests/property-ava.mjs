import test from "ava";
import { definePropertiesFromAttributes } from "../src/properties.mjs";
import { prepareAttributesDefinitions } from "../src/attributes.mjs";

test("definePropertiesFromAttributes", t => {
  const object = {};

  definePropertiesFromAttributes(
    object,
    prepareAttributesDefinitions(
      {
        boolean_conversion: { type: "boolean" }
      },
      undefined
    ),
    { boolean_conversion: 1 },
    {}
  );

  t.is(object.boolean_conversion, true);

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
