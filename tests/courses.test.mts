// Checks the free-course catalogue files in public/courses.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const DIR = path.resolve(import.meta.dirname, "../public/courses");
const index = JSON.parse(fs.readFileSync(path.join(DIR, "index.json"), "utf8"));
const ids = Object.keys(index);
assert.ok(ids.includes("fpb") && ids.includes("openstax"), "expected the core sources");
let total = 0;
for (const id of ids) {
  const m = index[id];
  assert.ok(m.name && m.about && /^https:\/\//.test(m.url) && /^https:\/\//.test(m.licenceUrl) && m.licence, id + " metadata");
  const rows: [string, string, string, string][] = JSON.parse(fs.readFileSync(path.join(DIR, id + ".json"), "utf8"));
  assert.equal(rows.length, m.count, `${id}: count in index.json is out of date`);
  assert.ok(rows.length >= 20, `${id}: suspiciously few rows (${rows.length})`);
  const seen = new Set<string>();
  for (const [t, u, c, n] of rows) {
    assert.ok(typeof t === "string" && t.trim().length > 1, `${id}: empty title`);
    assert.match(u, /^https?:\/\/[^\s"'<>]+$/, `${id}: bad url ${u}`);
    assert.ok(!/^\s*javascript:/i.test(u), "javascript url");
    assert.ok(typeof c === "string" && c.trim(), `${id}: missing category for ${t}`);
    assert.ok(typeof n === "string", `${id}: bad note`);
    assert.ok(!seen.has(u), `${id}: duplicate ${u}`);
    seen.add(u);
    assert.ok(!/<[a-z][^>]*>/i.test(t + c + n), `${id}: markup in text: ${t}`);
  }
  total += rows.length;
  console.log(`  ${id}: ${rows.length} courses`);
}
console.log(`courses ok: ${total} courses from ${ids.length} sources`);
