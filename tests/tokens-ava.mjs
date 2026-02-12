import test from "ava";
import { tokens } from "pacc";
import {
  NOT_EQUAL,
  GREATER,
  GREATER_EQUAL,
  LESS,
  LESS_EQUAL,
  BAR,
  DOUBLE_BAR,
  EQUAL,
  PLUS,
  MINUS,
  STAR,
  DIVIDE,
  AMPERSAND,
  DOUBLE_AMPERSAND,
  IDENTIFIER,
  NUMBER,
  BOOLEAN,
  STRING,
  CLOSE_BRACKET,
  CLOSE_CURLY,
  CLOSE_ROUND,
  COLON,
  COMMA,
  DOT,
  OPEN_BRACKET,
  OPEN_CURLY,
  OPEN_ROUND,
  SEMICOLON
} from "../src/tokens.mjs";

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

test(tt, '"a', (() => new Error("unterminated string", { cause: '"a' }))());
test(tt, "", []);
test(tt, "3", [[NUMBER, 3]]);
test(tt, "12345.0", [[NUMBER, 12345.0]]);
test(tt, "true", [[BOOLEAN, true]]);
test(tt, "true false", [
  [BOOLEAN, true],
  [BOOLEAN, false]
]);
test(tt, '"A"', [[STRING, "A"]]);
test(tt, '"\'B"', [[STRING, "'B"]]);
test(tt, "'\"C'", [[STRING, '"C']]);
test(tt, '"\'\u0041"', [[STRING, "'\u0041"]]);
test(tt, ` \t'a'b"c"d `, [
  [STRING, "a"],
  [IDENTIFIER, "b"],
  [STRING, "c"],
  [IDENTIFIER, "d"]
]);
test(tt, " 'a2\\\\\\n\\r\\t\\b\\x\u0041' ", [[STRING, "a2\\\n\r\t\bxA"]]);
test(tt, " ''+''", [[STRING, ""], PLUS, [STRING, ""]]);
test(tt, " ''=''", [[STRING, ""], EQUAL, [STRING, ""]]);
test(tt, " '|'", [[STRING, "|"]]);
test(tt, " '='", [[STRING, "="]]);
test(tt, " '}'", [[STRING, "}"]]);
test(tt, "2'a'", [
  [NUMBER, 2],
  [STRING, "a"]
]);
test(tt, "'a'2", [
  [STRING, "a"],
  [NUMBER, 2]
]);
test(tt, "|2", [BAR, [NUMBER, 2]]);
test(tt, "2|", [[NUMBER, 2], BAR]);
test(tt, "2=", [[NUMBER, 2], EQUAL]);
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
  [NUMBER, 2],
  CLOSE_BRACKET,
  DOT,
  [IDENTIFIER, "b"]
]);
test(tt, "a[2].b", [
  [IDENTIFIER, "a"],
  OPEN_BRACKET,
  [NUMBER, 2],
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
  [NUMBER, 1234567890]
]);

test(tt, "2.34", [[NUMBER, 2.34]]);
test(tt, ".34", [[NUMBER, 0.34]]);
test(tt, "-1.35", [[NUMBER, -1.35]]);
test(tt, "-.36", [[NUMBER, -0.36]]);

test(tt, "a.b + 2.34 - c", [
  [IDENTIFIER, "a"],
  DOT,
  [IDENTIFIER, "b"],
  PLUS,
  [NUMBER, 2.34],
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

// "\\\b\f\n\r\t\"\'\u0041"

test(
  tt,
  `4711 0.23 12345.0
"str2""str3" "\\\"\'\u0041" 'str4''str5'
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
< = = = >!= = =
<=
>=
=
2 + (3 * 17)`,
  [
    [NUMBER, 4711],
    [NUMBER, 0.23],
    [NUMBER, 12345.0],
    [STRING, "str2"],
    [STRING, "str3"],
    [STRING, "\"'\u0041"],
    [STRING, "str4"],
    [STRING, "str5"],
    [IDENTIFIER, "name1"],
    [IDENTIFIER, "name_2"],
    [IDENTIFIER, "_name3"],
    [IDENTIFIER, "n"],
    PLUS,
    MINUS,
    STAR,
    DIVIDE,
    OPEN_ROUND,
    CLOSE_ROUND,
    OPEN_CURLY,
    CLOSE_CURLY,
    OPEN_BRACKET,
    CLOSE_BRACKET,
    COLON,
    COMMA,
    SEMICOLON,
    DOT,
    LESS,
    EQUAL,
    EQUAL,
    EQUAL,
    GREATER,
    NOT_EQUAL,
    EQUAL,
    EQUAL,
    LESS_EQUAL,
    GREATER_EQUAL,
    EQUAL,
    [NUMBER, 2],
    PLUS,
    OPEN_ROUND,
    [NUMBER, 3],
    STAR,
    [NUMBER, 17],
    CLOSE_ROUND
  ]
);
