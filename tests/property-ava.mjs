import test from "ava";
import {
  boolean_attribute_writable,
  default_attribute,
  object_attribute,
  string_attribute,
  token_attribute
} from "pacc";
import { definePropertiesFromAttributes } from "../src/properties.mjs";
import { prepareAttributesDefinitions } from "../src/attributes.mjs";

/*
  static attributes = {
    read_only: {},
    rw: { writable: true },
    att_setter: { set: x => x * 2 },
    set_conversion: { type: "set" },
    preexisting_property: {},

    calculatedDefault: {
      get: (attribute, object) => object.preexisting_property + 1
    }
  };
*/

const attributes = prepareAttributesDefinitions({
  boolean_conversion: boolean_attribute_writable,

  authentification: {
    ...object_attribute,
    attributes: {
      token: { ...token_attribute },
      user: { ...string_attribute, default: "hugo" }
    }
  },

  a: {
    ...object_attribute,
    attributes: {
      b: {
        ...object_attribute,
        attributes: {
          c: {
            ...object_attribute,
            attributes: {
              d: { ...default_attribute, type: "number", default: 7 }
            }
          }
        }
      }
    }
  }
});

test("definePropertiesFromAttributes boolean_conversion", t => {
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

function dpfat(t, object, attributes, values, expected) {
  definePropertiesFromAttributes(object, attributes, values, {});
  expected(t, object);
}

dpfat.title = (providedTitle, object, attributes, values, expected) =>
  `definePropertiesFromAttributes ${
    providedTitle ? providedTitle + " " : ""
  }${Object.keys(attributes)} ${JSON.stringify(values)}`.trim();

test(dpfat, { b: 7 }, attributes, undefined, (t, object) => t.is(object.b, 7));
test(dpfat, {}, {}, attributes, (t, object) => t.is(object.a, undefined));
test(dpfat, {}, attributes, { name: "x" }, (t, object) =>
  t.is(object.x, undefined)
);

test(
  dpfat,
  {},
  attributes,
  { "authentification.token": "abc", "authentification.user": "emil" },
  (t, object) => {
    t.is(object.authentification?.token, "abc");
    t.is(object.authentification?.user, "emil");
  }
);
