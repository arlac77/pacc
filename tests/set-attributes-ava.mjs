import test from "ava";
import { sast, gast } from "./util.mjs";
import {
  prepareAttributesDefinitions,
  password_attribute,
  string_attribute
} from "pacc";

const definitions = prepareAttributesDefinitions({
  att1: {
    ...string_attribute,
    mandatory: true,
    private: true
  },
  att2: {
    type: "string",
    set(value) {
      this.att2x = value;
      return true;
    },
    getter() {
      return this.att2x;
    }
  },
  att3: {
    type: "unsigned-integer",
    default: 77
  },
  att4: password_attribute,
  nested: {
    attributes: {
      att1: {
        ...string_attribute,
        default: "the default"
      }
    }
  }
});

test("has mandatory", t => t.true(definitions.att1.mandatory));
test("has private", t => t.true(definitions.att1.private));
test.skip("has inherited private", t => t.true(definitions.att4.private));
test("has given type name", t =>
  t.is(definitions.att3.type.name, "unsigned-integer"));

test("merge attributes", t => {
  const ma = prepareAttributesDefinitions(
    {
      nested: {
        attributes: {
          att2: {
            type: "string",
            default: "the default"
          }
        }
      }
    },
    definitions
  );
  t.deepEqual(Object.keys(ma.nested.attributes), ["att1", "att2"]);
});

test(sast, {}, { att1: "value1" }, definitions, (t, object) => {
  t.is(object.att1, "value1");
  t.is(object.att3, 77);
});

test("unknown key", sast, {}, { att7: "value7" }, definitions, (t, object) =>
  t.is(object.att7, undefined)
);

test("with defaults", sast, {}, { att3: 17 }, definitions, (t, object) =>
  t.is(object.att3, 17)
);

test("use default", sast, {}, { att1: 17 }, definitions, (t, object) =>
  t.is(object.att3, 77)
);

test("keep old value", sast, { att3: 4711 }, {}, definitions, (t, object) =>
  t.is(object.att3, 4711)
);

test(
  "nested simple into empty",
  sast,
  {},
  {
    nested: {
      att1: "value1a"
    }
  },
  definitions,
  (t, object) => t.is(object.nested.att1, "value1a")
);

test(
  "nested simple overwrite",
  sast,
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
  definitions,
  (t, object) => t.is(object.nested.att1, "value1b")
);

test("nested default", sast, {}, {}, definitions, (t, object) =>
  t.is(object.nested.att1, "the default")
);

test.skip(
  "nested empty",
  sast,
  {},
  {
    data: {
      a: 1,
      b: 2
    }
  },
  prepareAttributesDefinitions({
    data: {
      attributes: {}
    }
  }),
  (t, object) =>
    t.deepEqual(object.data, {
      a: 1,
      b: 2
    })
);

test(
  "with setter",
  sast,
  {},
  {
    att2: "value2"
  },
  definitions,
  (t, object) => t.is(object.att2x, "value2")
);

test.skip(
  gast,
  {
    att1: "value1b",
    att2x: "value2b"
  },
  definitions,
  {
    att1: "value1b",
    att2: "value2b"
  }
);
