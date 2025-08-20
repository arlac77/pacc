import test from "ava";
import {
  tokens,
  PLUS,
  MINUS,
  STAR,
  DIVIDE,
  EQUAL,
  NOT_EQUAL,
  LESS,
  LESS_EQUAL,
  GREATER_EQUAL,
  GREATER,
  DOT,
  BAR,
  COLON,
  OPEN_BRACKET,
  CLOSE_BRACKET,
  OPEN_ROUND,
  CLOSE_ROUND,
  OPEN_CURLY,
  CLOSE_CURLY,
  AMPERSAND,
  DOUBLE_BAR,
  DOUBLE_AMPERSAND,
  COMMA,
  SEMICOLON
} from "pacc";

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

test(
  tt,
  '"a',
  (() => {
    const error = new Error("unterminated string");
    // @ts-ignore
    error.expression = '"a';
    return error;
  })()
);
test(tt, "", []);
test(tt, "3", [3]);
test(tt, " \t'a'b\"c\"d ", ["a", "b", "c", "d"]);
test(tt, " 'a2\\\\\\n\\r\\t\\b\\x\u0041' ", ["a2\\\n\r\t\bxA"]);
test(tt, " ''+''", ["", PLUS, ""]);
test(tt, " ''=''", ["", EQUAL, ""]);
test(tt, " '|'", ["|"]);
test(tt, " '='", ["="]);
test(tt, " '}'", ["}"]);
test(tt, "2'a'", [2, "a"]);
test(tt, "'a'2", ["a", 2]);
test(tt, "|2", [BAR, 2]);
test(tt, "2|", [2, BAR]);
test(tt, "2=", [2, EQUAL]);

test(tt, "a< <= >= b>", ["a", LESS, LESS_EQUAL, GREATER_EQUAL, "b", GREATER]);
test(tt, "a=", ["a", EQUAL]);
test(tt, "a!=", ["a", NOT_EQUAL]);
test(tt, "a>=", ["a", GREATER_EQUAL]);
test(tt, "a<=", ["a", LESS_EQUAL]);
test(tt, "a[ 2 ] .b", ["a", OPEN_BRACKET, 2, CLOSE_BRACKET, DOT, "b"]);
test(tt, "a[2].b", ["a", OPEN_BRACKET, 2, CLOSE_BRACKET, DOT, "b"]);
test(tt, "a123 <= >= a = <> +-*/[](){}|&||&&:,; b.c 1234567890", [
  "a123",
  LESS_EQUAL,
  GREATER_EQUAL,
  "a",
  EQUAL,
  LESS,
  GREATER,
  PLUS,
  MINUS,
  STAR,
  DIVIDE,
  OPEN_BRACKET,
  CLOSE_BRACKET,
  OPEN_ROUND,
  CLOSE_ROUND,
  OPEN_CURLY,
  CLOSE_CURLY,
  BAR,
  AMPERSAND,
  DOUBLE_BAR,
  DOUBLE_AMPERSAND,
  COLON,
  COMMA,
  SEMICOLON,
  "b",
  DOT,
  "c",
  1234567890
]);

test(tt, "2.34", [2.34]);
test.skip(tt, ".34", [0.34]);

test(tt, "a.b + 2.34 - c", ["a", DOT, "b", PLUS, 2.34, MINUS, "c"]);

test(tt, "a[*]._b", ["a", OPEN_BRACKET, STAR, CLOSE_BRACKET, DOT, "_b"]);

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
  [4711, 0.23, 12345.0, 12.4e20, 0.4e7, "str2", "str3"]
);
