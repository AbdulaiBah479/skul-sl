import assert from "node:assert/strict";
import { RESOURCES, SCHOLARSHIPS, CATS } from "../src/lib/resources.ts";

const urls = new Set<string>();
for (const r of RESOURCES) {
  assert.ok(r.name.trim() && r.what.trim(), "empty text: " + r.name);
  assert.match(r.url, /^https?:\/\/[^\s]+$/, "bad url " + r.url);
  assert.ok(CATS.includes(r.cat), "unknown category " + r.cat);
  assert.ok(!urls.has(r.url), "duplicate url " + r.url);
  urls.add(r.url);
  assert.ok(r.tags.length > 0, "no tags " + r.name);
}
for (const c of CATS) assert.ok(RESOURCES.some((r) => r.cat === c), "empty category " + c);
for (const s of SCHOLARSHIPS) assert.match(s.url, /^https:\/\//, s.name);
console.log(`resources ok: ${RESOURCES.length} resources in ${CATS.length} categories, ${SCHOLARSHIPS.length} scholarships`);
