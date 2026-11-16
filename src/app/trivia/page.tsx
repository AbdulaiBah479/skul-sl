"use client";
import { useState } from "react";
import Quiz from "@/components/Quiz";
import type { Question } from "@/content/types";

// General-knowledge practice from the free Open Trivia DB (no key). Needs internet.
const CATEGORIES: [string, string][] = [
  ["", "Any"], ["17", "Science & Nature"], ["19", "Mathematics"], ["18", "Computers"], ["22", "Geography"], ["23", "History"],
  ["9", "General Knowledge"], ["24", "Politics"], ["20", "Mythology"], ["25", "Art"],
];

export default function Trivia() {
  const [cat, setCat] = useState("17");
  const [diff, setDiff] = useState("easy");
  const [qs, setQs] = useState<Question[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    setBusy(true);
    setErr("");
    try {
      const url = `https://opentdb.com/api.php?amount=10&type=multiple&encode=url3986&difficulty=${diff}${cat ? `&category=${cat}` : ""}`;
      const j = await fetch(url).then((r) => r.json());
      if (j.response_code !== 0 || !j.results?.length) throw new Error("No questions for that choice. Try another category or level.");
      const d = decodeURIComponent;
      setQs(
        j.results.map((r: { question: string; correct_answer: string; incorrect_answers: string[] }) => {
          const options = [...r.incorrect_answers.map(d), d(r.correct_answer)];
          return { q: d(r.question), options, answer: options.length - 1, why: `The correct answer is ${d(r.correct_answer)}.` };
        })
      );
    } catch (e) {
      setErr(e instanceof Error && e.message.startsWith("No questions") ? e.message : "Could not load questions. Check your internet and try again.");
    } finally {
      setBusy(false);
    }
  };

  if (qs)
    return (
      <div>
        <h1 className="text-2xl font-extrabold">Trivia challenge</h1>
        <Quiz questions={qs} />
        <button className="btn btn-ghost mt-4" onClick={() => setQs(null)}>← New challenge</button>
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Trivia challenge</h1>
      <p className="text-muted">Fun general-knowledge questions from the free Open Trivia Database. Needs internet.</p>
      <div className="card mt-4 grid gap-3 p-4">
        <label className="text-sm font-semibold">Category
          <select className="input mt-1" value={cat} onChange={(e) => setCat(e.target.value)}>{CATEGORIES.map(([v, n]) => <option key={n} value={v}>{n}</option>)}</select>
        </label>
        <label className="text-sm font-semibold">Level
          <select className="input mt-1" value={diff} onChange={(e) => setDiff(e.target.value)}><option>easy</option><option>medium</option><option>hard</option></select>
        </label>
        <button className="btn" onClick={load} disabled={busy}>{busy ? "Loading…" : "Start 10 questions"}</button>
        {err && <p className="text-warn" role="alert">{err}</p>}
      </div>
    </div>
  );
}
