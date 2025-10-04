import test from "ava";
import { sast } from "./util.mjs";
import { attributeDefinitionsComplex } from "./fixtures.mjs";

test("default", sast, {}, {}, attributeDefinitionsComplex, (t, object) =>
  t.deepEqual(object.listen, undefined)
);

test(
  sast,
  {},
  { listen: { socket: "/run/service/socket" } },
  attributeDefinitionsComplex,
  (t, object) => t.deepEqual(object.listen, { socket: "/run/service/socket" })
);
