// Checks the "Global notes" (Wikipedia extracts) are attributed, clean and match their topic.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const DIR = path.resolve(import.meta.dirname, "../src/content/extra");
const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith(".json")) : [];
let chars = 0;
const bad: string[] = [];
const titles = new Map<string, number>();
for (const f of files) {
  assert.match(f, /^[a-z]+__[a-z0-9-]+__[a-z0-9-]+\.json$/, "bad file name " + f);
  const x = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
  assert.equal(x.source, "Wikipedia", f);
  assert.equal(x.license, "CC BY-SA 4.0", f);
  assert.match(x.url, /^https:\/\/en\.wikipedia\.org\//, f);
  assert.ok(x.title && Array.isArray(x.lines) && x.lines.length >= 3, f + " too short");
  const blob = x.lines.join("\n");
  chars += blob.length;
  assert.ok(blob.length >= 700, f + " under 700 characters");
  assert.ok(blob.length <= 14000, f + " too long: " + blob.length);
  if (/\{\\displaystyle|\[edit\]|\[\d+\]|<\/?[a-z]+>|==/.test(blob)) bad.push(f);
  if (/^#{2,3} (See also|References|External links|Further reading)/m.test(blob)) bad.push(f + " (reference section left in)");
  titles.set(x.title, (titles.get(x.title) ?? 0) + 1);
}
assert.deepEqual(bad, [], "dirty extracts:\n" + bad.slice(0, 10).join("\n"));
for (const [t, n] of titles) assert.ok(n <= 3, `${t} is reused by ${n} topics`);
console.log(`extra ok: ${files.length} topics have global notes, ${(chars / 1e6).toFixed(2)}M characters`);
