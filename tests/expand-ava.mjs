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

  t.is(expand("${a}", context), 1);
  t.is(expand("A${a}C", context), "A1C");
  t.is(expand("A${a}${b}C", context), "A12C");
  t.is(expand("A${c}C", context), "AtextC");
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
  t.is(expand(d,{}), d);
});
