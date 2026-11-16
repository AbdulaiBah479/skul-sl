import assert from "node:assert/strict";
import { evaluate, format } from "../src/lib/calc.ts";

const cases: [string, number][] = [
  ["1+2*3", 7],
  ["(1+2)*3", 9],
  ["2^3^2", 512],
  ["-4+10", 6],
  ["12÷4×2", 6],
  ["50%", 0.5],
  ["200*10%", 20],
  ["sqrt(16)+1", 5],
  ["3.5+1.5", 5],
  ["2*-3", -6],
  ["(2+3)^2", 25],
];
for (const [src, want] of cases) {
  assert.equal(evaluate(src), want, src);
  console.log("  ✓", src, "=", want);
}
for (const bad of ["", "1+", "(1+2", "1/0", "abc", "1..2", "sqrt(-4)", "2 3", "1+)"]) {
  assert.throws(() => evaluate(bad), undefined, `should reject ${JSON.stringify(bad)}`);
  console.log("  ✓ rejects", JSON.stringify(bad));
}
assert.equal(format(0.1 + 0.2), "0.3");
// code injection attempts are just "unexpected symbol", never executed
assert.throws(() => evaluate("process.exit(1)"));
assert.throws(() => evaluate("constructor"));
console.log("calc ok");
