import { run, bench, boxplot, summary } from "mitata";
import { globals } from "../src/tokens.mjs";
import { parse } from "../src/parser.mjs";

const root = new Map([
  ["a", { n: 1, l: [1, 2] }],
  ["b", { n: 3, x: 7, l: [3, 4] }]
]);

bench('"[n<5].l"', () => {
  const result = parse("[n<5].l", { root });
});

await run();
