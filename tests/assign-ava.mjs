import test from "ava";
import {
  assign,
  password_attribute_writable,
  string_attribute_writable,
  integer_attribute_writable,
  object_attribute
} from "pacc";

export function ast(t, object, source, attributes, expected) {
  assign(object, source, { type: { attributes } });
  expected(t, object);
}

ast.title = (providedTitle = "", object, source, attributes, expected) =>
  `assign ${providedTitle} ${JSON.stringify(
    object
  )} ${source} ${JSON.stringify(attributes)}`.trim();

const attributes = {
  att1: {
    ...string_attribute_writable,
    mandatory: true,
    private: true
  },
  att2: {
    ...string_attribute_writable,
    set(value) {
      this.att2x = value;
      return true;
    },
    get() {
      return this.att2x;
    }
  },
  att3: {
    ...integer_attribute_writable,
    default: 77
  },
  att4: password_attribute_writable,
  nested: {
    attributes: {
      att1: {
        ...string_attribute_writable,
        default: "the default"
      }
    }
  }
};

test(ast, {}, { att1: "value1" }, attributes, (t, object) => {
  t.is(object.att1, "value1");
  //t.is(object.att3, 77);
});

test("unknown key", ast, {}, { att7: "value7" }, attributes, (t, object) =>
  t.is(object.att7, undefined)
);

test("with defaults", ast, {}, { att3: 17 }, attributes, (t, object) =>
  t.is(object.att3, 17)
);

test.skip("use default", ast, {}, { att1: 17 }, attributes, (t, object) =>
  t.is(object.att3, 77)
);

test("keep old value", ast, { att3: 4711 }, {}, attributes, (t, object) =>
  t.is(object.att3, 4711)
);

test(
  "nested simple into empty",
  ast,
  {},
  {
    nested: {
      att1: "value1a"
    }
  },
  attributes,
  (t, object) => t.is(object.nested.att1, "value1a")
);

test(
  "nested simple overwrite",
  ast,
  {
    att3: 777,
    nested: {
      att1: "value1a"
    }
  },
  {
    nested: {
      att1: "value1b"
    }
  },
  attributes,
  (t, object) => t.is(object.nested.att1, "value1b")
);

test.skip("nested default", ast, {}, {}, attributes, (t, object) =>
  t.is(object.nested?.att1, "the default")
);

test(
  "nested empty",
  ast,
  {},
  {
    data: {
      a: 1,
      b: 2
    }
  },
  {
    data: {
      ...object_attribute,
      attributes: {}
    }
  },
  (t, object) =>
    t.deepEqual(object.data, {
      a: 1,
      b: 2
    })
);

test.skip(
  "with setter",
  ast,
  {},
  {
    att2: "value2"
  },
  attributes,
  (t, object) => t.is(object.att2x, "value2")
);
