"use client";
import { useMemo, useState } from "react";
import { LEVELS } from "@/content";
import Quiz from "@/components/Quiz";
import type { Question } from "@/content/types";

export default function Practice() {
  const [level, setLevel] = useState("sss");
  const [subject, setSubject] = useState("all");
  const [count, setCount] = useState(10);
  const [timed, setTimed] = useState(true);
  const [run, setRun] = useState(0);
  const [started, setStarted] = useState(false);

  const lv = LEVELS.find((l) => l.id === level)!;
  const pool = useMemo<Question[]>(
    () => lv.subjects.filter((s) => subject === "all" || s.id === subject).flatMap((s) => s.topics.flatMap((t) => t.questions)),
    [lv, subject]
  );
  const questions = useMemo(() => {
    const copy = [...pool].sort(() => Math.random() - 0.5);
    return copy.slice(0, Math.min(count, copy.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, count, run]);

  if (started)
    return (
      <div>
        <h1 className="text-2xl font-extrabold">Exam practice</h1>
        <p className="mb-3 text-sm text-muted">
          {lv.short} · {subject === "all" ? "all subjects" : lv.subjects.find((s) => s.id === subject)?.title} · {questions.length} questions
        </p>
        <Quiz questions={questions} timedSeconds={timed ? questions.length * 60 : undefined} />
        <button className="btn btn-ghost mt-4" onClick={() => { setStarted(false); setRun((r) => r + 1); }}>
          ← Change settings
        </button>
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Exam practice</h1>
      <p className="text-muted">Mixed questions in exam style, one minute each. These are original practice questions, not real past papers.</p>
      <div className="card mt-4 grid gap-4 p-4">
        <label className="block text-sm font-semibold">
          Level
          <select className="input mt-1" value={level} onChange={(e) => { setLevel(e.target.value); setSubject("all"); }}>
            {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.title} ({l.exam})</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Subject
          <select className="input mt-1" value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="all">All subjects</option>
            {lv.subjects.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Number of questions (max {pool.length})
          <input className="input mt-1" type="number" min={3} max={pool.length} value={count} onChange={(e) => setCount(Math.max(3, Number(e.target.value) || 3))} />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} className="h-5 w-5" /> Timed (1 minute per question)
        </label>
        <button className="btn" onClick={() => { setRun((r) => r + 1); setStarted(true); }}>Start practice</button>
      </div>
    </div>
  );
}
