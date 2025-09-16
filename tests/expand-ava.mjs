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
