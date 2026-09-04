import test from "ava";
import { eat } from "./util.mjs";


test(eat, "()", undefined, []);
test(eat, "(1)", undefined, [1]);
test(eat, "(1,2)", undefined, [1, 2]);
test(eat, "(1,2,3,4)", undefined, [1, 2, 3, 4]);
test(eat, "(a,b)", { current: { a: [1, 2], b: [3, 4] } }, [
  [1, 2],
  [3, 4]
]);
test(eat, "('a',2,true)", undefined, ["a", 2, true]);

test(eat, "(", undefined, new Error("unexpected 'EOF'"));
test(eat, "(1", undefined, new Error("unexpected 'EOF'"));
test(eat, "(1 2", undefined, new Error("unexpected 'EOF'"));
