import assert from "node:assert/strict";
import { LEVELS, allTopics, countQuestions } from "../src/content/index.ts";
import { wassceGrade, wassceSummary, gpa, cgpa, neededScore, isCredit } from "../src/lib/grades.ts";

let n = 0;
const ok = (name: string, fn: () => void) => {
  fn();
  n++;
  console.log("  ✓", name);
};

ok("five levels exist with subjects", () => {
  assert.deepEqual(LEVELS.map((l) => l.id), ["primary", "jss", "sss", "tech", "uni"]);
  for (const l of LEVELS) assert.ok(l.subjects.length >= 3, l.id);
});

ok("ids are unique and URL-safe", () => {
  const seen = new Set<string>();
  for (const { key } of allTopics()) {
    assert.match(key, /^[a-z]+\/[a-z0-9-]+\/[a-z0-9-]+$/, key);
    assert.ok(!seen.has(key), "duplicate " + key);
    seen.add(key);
  }
});

ok("every question is well formed", () => {
  for (const { key, topic } of allTopics()) {
    assert.ok(topic.lesson.length >= 2, key + " lesson too short");
    assert.ok(topic.questions.length >= 5, key + " needs 5+ questions");
    for (const q of topic.questions) {
      assert.ok(q.q.trim().length > 3, key + " empty question");
      assert.ok(q.options.length >= 2 && q.options.length <= 5, key + " options: " + q.q);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, key + " answer index: " + q.q);
      assert.equal(new Set(q.options.map((o) => o.trim())).size, q.options.length, key + " duplicate options: " + q.q);
      assert.ok(q.why.trim().length > 3, key + " missing explanation: " + q.q);
    }
  }
});

ok("correct answer is not always the same slot", () => {
  const counts = [0, 0, 0, 0];
  for (const { topic } of allTopics()) for (const q of topic.questions) counts[q.answer]++;
  console.log("    answer slot counts:", counts.join(", "));
  // quizzes are shuffled at run time, but a stored bias is still worth knowing about
  assert.ok(counts.filter((c) => c > 0).length >= 2);
});

ok("WASSCE grades", () => {
  assert.equal(wassceGrade(80).grade, "A1");
  assert.equal(wassceGrade(75).grade, "A1");
  assert.equal(wassceGrade(74).grade, "B2");
  assert.equal(wassceGrade(50).grade, "C6");
  assert.equal(wassceGrade(49).grade, "D7");
  assert.equal(wassceGrade(39).grade, "F9");
  assert.equal(wassceGrade(150).grade, "A1");
  assert.equal(wassceGrade(-5).grade, "F9");
  assert.ok(isCredit("C6") && !isCredit("D7"));
});

ok("WASSCE summary", () => {
  const s = wassceSummary(["A1", "B2", "B3", "C4", "C5", "C6", "D7", "F9"]);
  assert.equal(s.credits, 6);
  assert.equal(s.aggregate, 1 + 2 + 3 + 4 + 5 + 6);
  assert.equal(wassceSummary(["A1", "B2"]).aggregate, null);
});

ok("GPA and CGPA", () => {
  assert.equal(gpa([{ credits: 3, grade: "A" }, { credits: 3, grade: "C" }]), 4);
  assert.equal(gpa([]), null);
  assert.equal(gpa([{ credits: 0, grade: "A" }]), null);
  assert.equal(cgpa([[{ credits: 3, grade: "A" }], [{ credits: 3, grade: "B" }]]), 4.5);
  assert.equal(gpa([{ credits: 4, grade: "B" }, { credits: 2, grade: "F" }]), 2.67);
});

ok("needed score", () => {
  assert.equal(neededScore(50, 40, 40), 56.67); // 40% done at 40 => need 56.67 on the remaining 60%
  assert.equal(neededScore(50, 100, 50), null);
});

console.log(`\n${n} groups passed — ${allTopics().length} topics, ${countQuestions()} questions`);
