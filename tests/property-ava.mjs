import test from "ava";
import {
  boolean_attribute_writable,
  default_attribute,
  object_attribute,
  string_attribute,
  string_attribute_writable,
  token_attribute,
  types
} from "pacc";
import { definePropertiesFromAttributes } from "../src/properties.mjs";
import { prepareAttributesDefinitions } from "../src/attributes.mjs";

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
              d: { ...default_attribute, type: types.number, default: 7 }
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
  { user_token: "abc", user_name: "emil" },
  (t, object) => {
    t.is(object.authentification?.token, "abc");
    t.is(object.authentification?.user, "emil");
  }
);

class A {
  #a = "value of a";

  set a(value) {
    this.#a = value.toUpperCase();
  }

  get a() {
    return this.#a;
  }
}

class B extends A {
  b = "value of b";
}

test("use base class setter", t => {
  const object = new B();

  object.a = "abc";
  t.is(object.a, "ABC");

  definePropertiesFromAttributes(
    object,
    { a: { ...string_attribute_writable } },
    {
      a: "new value"
    }
  );

  t.is(object.a, "NEW VALUE");
});
