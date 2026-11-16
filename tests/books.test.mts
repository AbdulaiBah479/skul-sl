// Checks the imported textbooks (src/content/books + public/qbank) are complete and clean.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIR = path.join(ROOT, "src/content/books");
const QB = path.join(ROOT, "public/qbank");
const books = fs.readdirSync(DIR, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
assert.ok(books.length >= 10, "expected at least 10 imported books, found " + books.length);

const index = JSON.parse(fs.readFileSync(path.join(QB, "index.json"), "utf8"));
const LEVELS = ["primary", "jss", "sss", "tech", "uni"];
let topics = 0, questions = 0, cards = 0, lessonChars = 0;
const junk = [];

for (const id of books) {
  const toc = JSON.parse(fs.readFileSync(path.join(DIR, id, "toc.json"), "utf8"));
  assert.equal(toc.id, id);
  assert.ok(LEVELS.includes(toc.level), id + " level");
  assert.match(toc.subject, /^[a-z0-9-]+$/, id + " subject id");
  assert.ok(toc.license?.url?.startsWith("http"), id + " must carry its licence");
  assert.match(toc.license.name, /Creative Commons/, id + " licence name");
  assert.equal(toc.publisher, "OpenStax");
  assert.ok(index[id], id + " missing from qbank/index.json");
  const bank = JSON.parse(fs.readFileSync(path.join(QB, id + ".json"), "utf8"));
  const seen = new Set();
  let bankQ = 0;
  for (const ch of toc.chapters) {
    assert.ok(ch.title && ch.topics.length, id + " empty chapter");
    for (const t of ch.topics) {
      assert.match(t.id, /^[a-z0-9-]+$/, `${id}: bad topic id ${t.id}`);
      assert.ok(!seen.has(t.id), `${id}: duplicate topic ${t.id}`);
      seen.add(t.id);
      const topic = JSON.parse(fs.readFileSync(path.join(DIR, id, "t", t.id + ".json"), "utf8"));
      assert.equal(topic.id, t.id);
      assert.ok(topic.title && topic.lesson.length >= 1, `${id}/${t.id} empty lesson`);
      topics++;
      lessonChars += topic.lesson.join("").length;
      const blob = topic.lesson.join("\n");
      if (/\[object Object\]|<\/?[a-z]+>|&[a-z]+;/.test(blob)) junk.push(`${id}/${t.id}: leftover markup`);
      for (const q of topic.questions) {
        questions++;
        bankQ++;
        assert.ok(q.q.trim().length > 5, `${id}/${t.id} empty question`);
        assert.ok(q.options.length >= 2 && q.options.length <= 5, `${id}/${t.id} option count`);
        assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, `${id}/${t.id} answer index: ${q.q}`);
        assert.equal(new Set(q.options).size, q.options.length, `${id}/${t.id} duplicate options: ${q.q}`);
        assert.ok(q.options.every((o) => o.trim()), `${id}/${t.id} blank option`);
        assert.ok(q.why.trim(), `${id}/${t.id} missing explanation`);
      }
      for (const s of topic.selfCheck ?? []) {
        cards++;
        bankQ++;
        assert.ok(s.q.trim() && s.a.trim(), `${id}/${t.id} empty self-check`);
      }
    }
  }
  assert.equal(bank.length, bankQ, `${id}: qbank file out of date (run the importer)`);
  assert.equal(index[id].topics.length, seen.size, `${id}: index.json topic count`);
}
assert.deepEqual(junk, [], "junk found:\n" + junk.slice(0, 10).join("\n"));
console.log(`books ok: ${books.length} books, ${topics} topics, ${questions} quiz questions, ${cards} self-check Q&As, ${(lessonChars / 1e6).toFixed(1)}M characters of lessons`);
