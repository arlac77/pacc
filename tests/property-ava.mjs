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

function dpct(t, clazz, options, expected) {
  const object = new clazz(options);
  expected(t, object);
}

dpct.title = (providedTitle, clazz, options) =>
  `constructor options ${providedTitle ? providedTitle + " " : ""}${
    clazz.name
  } ${JSON.stringify(options)}`.trim();

class MyClass {
  static attributes = {
    att_setter: { set: x => x * 2 },
    set_conversion: { type: "set" },
    preexisting_property: {},
    calculatedDefault: {
      get: (attribute, object) => object.preexisting_property + 1
    }
  };

  constructor(options, additionalProperties) {
    definePropertiesFromOptions(this, options, additionalProperties);
  }

  get preexisting_property() {
    return 77;
  }
  set preexisting_property(value) {
    this._preexisting_property = value;
  }
}
test(dpct, MyClass, { other: 1 }, (t, o) => t.is(o.calculatedDefault, 77 + 1));

test(dpct, MyClass, { set_conversion: ["a", "b"] }, (t, o) =>
  t.deepEqual(o.set_conversion, new Set(["a", "b"]))
);
test(dpct, MyClass, { set_conversion: new Set(["a", "b"]) }, (t, o) =>
  t.deepEqual(o.set_conversion, new Set(["a", "b"]))
);

test(dpct, MyClass, { att_setter: 7 }, (t, o) => t.is(o.att_setter, 14));
test(dpct, MyClass, { rw: 1 }, (t, o) => {
  t.is(o.rw, 1);
  o.rw = 2;
  t.is(o.rw, 2);
});
test(dpct, MyClass, undefined, (t, o) => {
  o.rw = 2;
  t.is(o.rw, 2);
});

test(dpct, MyClass, { something: "a" }, (t, object) => {
  t.is(object.authentification?.token, undefined);
  t.is(object.authentification?.user, "hugo");
});

test("default with deep path", dpct, MyClass, { something: "b" }, (t, object) =>
  t.is(object.a.b.c.d, 7)
);

test(dpct, MyClass, { preexisting_property: 77 }, (t, object) => {
  t.is(object.preexisting_property, 77);
  t.is(object._preexisting_property, 77);
});
  static attributes = {
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

  ro: { ...default_attribute, writable: false },
  rw: { ...default_attribute, writable: true },

  authentification: {
    ...object_attribute,
    attributes: {
      token: { ...token_attribute, externalName: "user_token" },
      user: { ...string_attribute, externalName: "user_name", default: "hugo" }
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

test("definePropertiesFromAttributes read only", t => {
  const object1 = {};
  definePropertiesFromAttributes(object1, attributes, {
    ro: 3
  });

  t.is(object1.ro, 3);
  try {
    object1.ro = 2;
    t.fail();
  } catch (e) {
    t.true(true);
  }
});

function dpfat(t, object, attributes, values, expected) {
  definePropertiesFromAttributes(object, attributes, values, {});
  expected(t, object);
}

dpfat.title = (providedTitle, object, attributes, values, expected) =>
  `definePropertiesFromAttributes ${
    providedTitle ? providedTitle + " " : ""
  }${Object.keys(attributes)} ${JSON.stringify(values)}`.trim();

test(dpfat, { b: 8 }, attributes, undefined, (t, object) => t.is(object.b, 8));
test(dpfat, {}, {}, attributes, (t, object) => t.is(object.a, undefined));
test(dpfat, {}, attributes, { name: "x" }, (t, object) =>
  t.is(object.x, undefined)
);

test(
  dpfat,
  {},
  attributes,
  { "user_token": "abc", "user_name": "emil" },
  (t, object) => {
    t.is(object.authentification?.token, "abc");
    t.is(object.authentification?.user, "emil");
  }
);
