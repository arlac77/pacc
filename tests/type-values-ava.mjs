import test from "ava";
import { toInternal, toExternal, types, formatDuration } from "pacc";

test("empty url type", t => {
  t.is(toInternal("", { type: types.url }), undefined);
  t.is(
    toInternal("http:/example.com", { type: types.url }),
    "http:/example.com"
  );
});

test("string type", t => {
  t.is(toInternal("abc", { type: types.string }), "abc");
  t.is(toInternal(undefined, { type: types.string }), undefined);

  t.is(toExternal("abc", { type: types.string }), "abc");
  t.is(toExternal(undefined, { type: types.string }), undefined);
});

test("string collection type", t => {
  t.deepEqual(
    toInternal("a b c", {
      collection: true,
      separator: " ",
      type: types.string
    }),
    ["a", "b", "c"]
  );
  t.deepEqual(
    toInternal("a b c", {
      collection: true,
      type: types.string
    }),
    ["a", "b", "c"]
  );

  t.deepEqual(
    toInternal("a b c", {
      collection: true,
      constructor: Set,
      type: types.string
    }),
    new Set(["a", "b", "c"])
  );
  t.deepEqual(
    toInternal("a b c", {
      collection: true,
      constructor: Array,
      type: types.string
    }),
    ["a", "b", "c"]
  );

  /*
  t.deepEqual(
    toInternal(2, {
      collection: true,
      separator: " ",
      type: types.string
    }),
    2
  );
*/

  t.deepEqual(
    toInternal(undefined, {
      collection: true,
      separator: " ",
      type: types.string
    }),
    undefined
  );

  t.deepEqual(
    toExternal("abc", {
      collection: true,
      separator: " ",
      type: types.string
    }),
    "abc"
  );

  t.deepEqual(
    toExternal(["a", "b", "c"], {
      collection: true,
      separator: " ",
      type: types.string
    }),
    "a b c"
  );

  t.deepEqual(
    toExternal(new Set(["a", "b", "c"]), {
      collection: true,
      separator: " ",
      type: types.string
    }),
    "a b c"
  );

  t.deepEqual(
    toExternal(undefined, {
      collection: true,
      separator: " ",
      type: types.string
    }),
    undefined
  );
});

test("boolean type", t => {
  t.is(toInternal("no", { type: types.boolean }), false);
  t.is(toInternal("yes", { type: types.boolean }), true);
  t.is(toInternal("0", { type: types.boolean }), false);
  t.is(toInternal(0, { type: types.boolean }), false);
  t.is(toInternal(1, { type: types.boolean }), true);
  t.is(toInternal(undefined, { type: types.boolean }), undefined);
  t.is(toInternal(undefined, { type: types.boolean, default: true }), true);
  t.is(toInternal(undefined, { type: types.boolean, default: false }), false);

  t.is(toExternal(true, { type: types.boolean }), true);
  t.is(toExternal(false, { type: types.boolean }), false);
  t.is(toExternal(undefined, { type: types.boolean }), undefined);
});

test("yesno type", t => {
  t.is(toInternal("no", { type: types.yesno }), false);
  t.is(toInternal("yes", { type: types.yesno }), true);
  t.is(toInternal("0", { type: types.yesno }), false);
  t.is(toInternal(0, { type: types.yesno }), false);
  t.is(toInternal(1, { type: types.yesno }), true);
  t.is(toInternal(undefined, { type: types.yesno }), undefined);
  t.is(toInternal(undefined, { type: types.yesno, default: true }), true);
  t.is(toInternal(undefined, { type: types.yesno, default: false }), false);

  t.is(toExternal(true, { type: types.yesno }), "yes");
  t.is(toExternal(false, { type: types.yesno }), "no");
  t.is(toExternal(undefined, { type: types.yesno }), undefined);
});

test("duration_ms type", t => {
  t.is(toInternal(1, { type: types.duration_ms }), 1000);
  t.is(toInternal("1", { type: types.duration_ms }), 1000);
  t.is(toInternal("1ms", { type: types.duration_ms }), 1);
  t.is(toInternal("1 ms", { type: types.duration_ms }), 1);
  t.is(toInternal("1 h", { type: types.duration_ms }), 3600000);
  t.is(toInternal("1 h 30m", { type: types.duration_ms }), 5400000);
  t.is(toInternal("1hour 30m 5seconds", { type: types.duration_ms }), 5405000);
});

test("duration type", t => {
  t.is(toInternal(1, { type: types.duration }), 1);
  t.is(toInternal("1", { type: types.duration }), 1);
  t.is(toInternal("1ms", { type: types.duration }), 0.001);
  t.is(toInternal("1 ms", { type: types.duration }), 0.001);
  t.is(toInternal("1 h", { type: types.duration }), 3600);
  t.is(toInternal("1 h 30m", { type: types.duration }), 5400);
  t.is(toInternal("1hour 30m 5seconds", { type: types.duration }), 5405);
  t.is(toInternal(undefined, { type: types.duration }), undefined);

  t.is(toExternal(5405, { type: types.duration }), "1h 30m 5s");
  t.is(toExternal(undefined, { type: types.duration }), undefined);
});

test("formatDuration", t => {
  t.is(formatDuration(1), "1s");
  t.is(formatDuration(60), "1m");
  t.is(formatDuration(61), "1m 1s");
  t.is(formatDuration(3661), "1h 1m 1s");
});

test("bytes type", t => {
  t.is(toInternal(1, { type: types.byte_size }), 1);
  t.is(toInternal("1", { type: types.byte_size }), 1);
  t.is(toInternal("1kb", { type: types.byte_size }), 1024);
  t.is(toInternal("1K", { type: types.byte_size }), 1024);
  t.is(toInternal("1mb", { type: types.byte_size }), 1024 * 1024);
  t.is(toInternal("1m", { type: types.byte_size }), 1024 * 1024);
  t.is(toInternal(undefined, { type: types.byte_size }), undefined);

  t.is(toExternal(1, { type: types.byte_size }), 1);
  //t.is(toExternal(1024, { type: types.byte_size }), "1k");
  t.is(toExternal(undefined, { type: types.byte_size }), undefined);
});
