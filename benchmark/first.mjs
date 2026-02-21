import { run, bench, boxplot, summary } from "mitata";
import { globals } from "../src/tokens.mjs";
import { parse } from "../src/parser.mjs";

const root = new Map([
  ["a", { n: 1, l: [1, 2] }],
  ["b", { n: 3, x: 7, l: [3, 4] }],
  ["c", { d: { e: { f: { g: "xyz" } }} }]
]);

bench('"[n<5].l"', () => parse("[n<5].l", { root }));
bench('"c.d.e.f.g"', () => parse("c.d.e.f.g", { root }));

await run();
