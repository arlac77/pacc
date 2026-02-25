import { run, bench, boxplot, summary } from "mitata";
import { tokens } from "../src/tokens.mjs";
import { parse, parseOnly } from "../src/parser.mjs";

const root = new Map([
  ["a", { n: 1, l: [1, 2] }],
  ["b", { n: 3, x: 7, l: [3, 4] }],
  [
    "c",
    {
      d: {
        e: { f: { g: { h: { i: { j: { k: { l: { m: { n: "xyz" } } } } } } } } }
      }
    }
  ]
]);

const root2 = {
  a: {
    b: {
      c: {
        d: {
          e: {
            f: { g: { h: { i: { j: { k: { l: { m: { n: "xyz" } } } } } } } }
          }
        }
      }
    }
  }
};

bench('"[n<5].l"', () => parse("[n<5].l", { root }));

const expression = "a.b.c.d.e.f.g.h.i.j.k.l.m.n";

bench(`parse ${expression}`, () => parse(expression, { root: root2 }));
bench(`parseOnly ${expression}`, () => parseOnly(expression, {}));
bench(`tokens ${expression}`, () => Array.from(tokens(expression, {})));

const expression2 = '"abc" "\t\n" "abcdefghijklmnopqrstuvwxyz"';

bench(`tokens ${expression2}`, () => Array.from(tokens(expression2, {})));

await run();
