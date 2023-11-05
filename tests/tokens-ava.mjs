import test from "ava";
import { tokens } from "pacc";

function tt(t, input, expected) {
  try {
    const result = [...tokens(input)];
    t.deepEqual(result, expected);
  } catch (e) {
    t.deepEqual(e, expected);
  }
}

tt.title = (providedTitle = "token", input, expected) =>
  `${providedTitle} ${input}${
    expected instanceof Error ? " =>ERROR" : ""
  }`.trim();

test(tt, '"a', new Error("unterminated string"));

test(tt, " \t'a'b\"c\"d ", ["a", "b", "c", "d"]);
test(tt, " 'a\\\\\\n\\r\\t\\b' ", ["a\\\n\r\t\b"]);
test(tt, " ''+''", ["", "+", ""]);
test(tt, " ''=''", ["", "=", ""]);

test(tt, "a< <= >= b>", ["a", "<", "<=", ">=", "b", ">"]);
test(tt, "a=", ["a", "="]);
test(tt, "a!=", ["a", "!="]);
test(tt, "a>=", ["a", ">="]);
test(tt, "a<=", ["a", "<="]);
test(tt, "a[ 2 ] .c", ["a", "[", "2", "]", ".", "c"]);
test(tt, "a123 <= >= a = <> +-[](){}|&||&&:,; b.c 1234567890", [
  "a123",
  "<=",
  ">=",
  "a",
  "=",
  "<",
  ">",
  "+",
  "-",
  "[",
  "]",
  "(",
  ")",
  "{",
  "}",
  "|",
  "&",
  "||",
  "&&",
  ":",
  ",",
  ";",
  "b",
  ".",
  "c",
  "1234567890"
]);

test(tt, "a[*]._b", ["a", "[", "*", "]", ".", "_b"]);

test.skip(
  tt,
  `4711 0.23 12345.0 12.4E20 0.4E7
"str2""str3" "\\\b\f\n\r\t\"\'\u0041" 'str4''str5'
name1 name_2 _name3
n
+
-
*
/
()
{}
[]
:,;.
< ===>           !===
<=
>=
=
2 + (3 * 17)`,
  ["4711","0.23","12345",]
);
