import test from "ava";
import { expand } from "pacc";

test("plain expand string", t => {
  const context = {
    root: {
      a: 1,
      b: 2,
      c: "text"
    }
  };

  t.is(expand("XYZ", context), "XYZ");
  t.is(expand("${a}", context), 1);
  t.is(expand("A${a}C", context), "A1C");
  t.is(expand("A${a}", context), "A1");
  t.is(expand("A${a}${b}C", context), "A12C");
  t.is(expand("A${a}B${b}C", context), "A1B2C");
  t.is(expand("A${c}C", context), "AtextC");
  t.is(expand("A${d}C", context), "A${d}C");
});

test("plain expand string special lead-In/Out", t => {
  const context = {
    leadIn: "{{",
    leadOut: "}}",
    root: {
      a: 1,
      b: 2,
      c: "text"
    }
  };

  t.is(expand("XYZ", context), "XYZ");
  t.is(expand("{{a}}", context), 1);
  t.is(expand("A{{a}}C", context), "A1C");
  t.is(expand("A{{a}}", context), "A1");
  t.is(expand("A{{a}}{{b}}C", context), "A12C");
  t.is(expand("A{{a}}B{{b}}C", context), "A1B2C");
  t.is(expand("A{{c}}C", context), "AtextC");
  t.is(expand("A{{d}}C", context), "A{{d}}C");
});

test("expand unterminated", t => {
  t.throws(() => expand("A${a C", {}), {
    message: "Unterminated expression between '${' and '}'"
  });
});

test("expand empty string", t => {
  const context = {
    root: {
      a: ""
    }
  };

  t.is(expand("${a}", context), "");
});

test("plain expand string transitive", t => {
  const context = {
    root: {
      a: "${b}",
      b: 2
    }
  };

  t.is(expand("${a}", context), 2);
});

test("expand undefined", t => t.is(expand(undefined, {}), undefined));
test("expand null", t => t.is(expand(null, {}), null));
test("expand NaN", t => t.is(expand(NaN, {}), NaN));
test("expand false", t => t.is(expand(false, {}), false));
test("expand true", t => t.is(expand(true, {}), true));
test("expand number", t => t.is(expand(42, {}), 42));
test("expand bigint", t => t.is(expand(43n, {}), 43n));
test("expand function", t => {
  function f() {}
  t.is(expand(f, {}), f);
});
test("expand Date", t => {
  const d = new Date();
  t.is(expand(d, {}), d);
});
test("expand Array", t =>
  t.deepEqual(expand(["${a}", "${b}", "c"], { root: { a: "a1", b: "b2" } }), [
    "a1",
    "b2",
    "c"
  ]));

test("expand Set", t =>
  t.deepEqual(
    expand(new Set(["${a}", "${b}", "c"]), { root: { a: "a1", b: "b2" } }),
    new Set(["a1", "b2", "c"])
  ));
test("expand Map", t =>
  t.deepEqual(
    expand(new Map([["${a}", "${b}"]]), { root: { a: "a1", b: "b2" } }),
    new Map([["a1", "b2"]])
  ));
