import test from "ava";
import {expand} from "pacc";

test("expand",t => {

    const context = { root: {}};

    t.is(expand("a${1 + 2}b",context),"a3b");
})