import test from "ava";
import {
  tokens,
  PLUS,
  IDENTIFIER,
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
    expected = expected.map(e => (Array.isArray(e) ? e : [e]));
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
test(tt, "12345.0", [12345.0]);
test(tt, "true", [true]);
test(tt, "true false", [true, false]);
test(tt, " \t'a'b\"c\"d ", ["a", [IDENTIFIER, "b"], "c", [IDENTIFIER, "d"]]);
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
test(tt, "a< <= >= b>", [
  [IDENTIFIER, "a"],
  LESS,
  LESS_EQUAL,
  GREATER_EQUAL,
  [IDENTIFIER, "b"],
  GREATER
]);
test(tt, "a=", [[IDENTIFIER, "a"], EQUAL]);
test(tt, "a!=", [[IDENTIFIER, "a"], NOT_EQUAL]);
test(tt, "a>=", [[IDENTIFIER, "a"], GREATER_EQUAL]);
test(tt, "a<=", [[IDENTIFIER, "a"], LESS_EQUAL]);
test(tt, "a[ 2 ] .b", [
  [IDENTIFIER, "a"],
  OPEN_BRACKET,
  2,
  CLOSE_BRACKET,
  DOT,
  [IDENTIFIER, "b"]
]);
test(tt, "a[2].b", [
  [IDENTIFIER, "a"],
  OPEN_BRACKET,
  2,
  CLOSE_BRACKET,
  DOT,
  [IDENTIFIER, "b"]
]);
test(tt, "a123 <= >= a = <> +-*/[](){}|&||&&:,; b.c 1234567890", [
  [IDENTIFIER, "a123"],
  LESS_EQUAL,
  GREATER_EQUAL,
  [IDENTIFIER, "a"],
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
  [IDENTIFIER, "b"],
  DOT,
  [IDENTIFIER, "c"],
  1234567890
]);

test(tt, "2.34", [2.34]);
test(tt, ".34", [0.33999999999999997]);

test(tt, "a.b + 2.34 - c", [
  [IDENTIFIER, "a"],
  DOT,
  [IDENTIFIER, "b"],
  PLUS,
  2.34,
  MINUS,
  [IDENTIFIER, "c"]
]);

test(tt, "a[*]._b", [
  [IDENTIFIER, "a"],
  OPEN_BRACKET,
  STAR,
  CLOSE_BRACKET,
  DOT,
  [IDENTIFIER, "_b"]
]);

test.skip(
  tt,
  `4711 0.23 12345.0
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
  [
    4711,
    0.23,
    12345.0,
    "str2",
    "str3",
    "\\\b\n\r\t\"'\u0041",
    "str4",
    "str5",
    [IDENTIFIER, "name1"],
    [IDENTIFIER, "name_2"],
    [IDENTIFIER, "name_3"],
    [IDENTIFIER, "n"],
    PLUS,
    MINUS,
    STAR,
    DIVIDE
  ]
);
