"use client";
import { useEffect, useMemo, useState } from "react";
import { LEVELS } from "@/content";
import Quiz from "@/components/Quiz";
import type { Question } from "@/content/types";
import { booksFor, fetchBank, fetchIndex, toQuestions, type BookIndex } from "@/lib/bookindex";

export default function Practice() {
  const [level, setLevel] = useState("sss");
  const [subject, setSubject] = useState("all");
  const [count, setCount] = useState(10);
  const [timed, setTimed] = useState(true);
  const [run, setRun] = useState(0);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState<BookIndex>({});
  const [bookQs, setBookQs] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchIndex().then(setIndex); }, []);

  const lv = LEVELS.find((l) => l.id === level)!;
  const books = useMemo(() => booksFor(index, level, subject), [index, level, subject]);

  // subjects: hand-written ones plus any that only exist in a textbook
  const subjects = useMemo(() => {
    const m = new Map<string, string>(lv.subjects.map((s) => [s.id, s.title]));
    for (const [, e] of booksFor(index, level)) if (!m.has(e.subject)) m.set(e.subject, e.subject.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase()));
    return [...m.entries()];
  }, [lv, index, level]);

  useEffect(() => {
    let live = true;
    setLoading(true);
    Promise.all(books.map(([id]) => fetchBank(id))).then((all) => {
      if (live) { setBookQs(all.flatMap(toQuestions)); setLoading(false); }
    });
    return () => { live = false; };
  }, [books]);

  const pool = useMemo<Question[]>(
    () => [...lv.subjects.filter((s) => subject === "all" || s.id === subject).flatMap((s) => s.topics.flatMap((t) => t.questions)), ...bookQs],
    [lv, subject, bookQs]
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
          {lv.short} · {subject === "all" ? "all subjects" : subjects.find(([id]) => id === subject)?.[1]} · {questions.length} questions
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
      <p className="text-muted">Mixed questions from our lessons and the free textbooks, one minute each. These are practice questions, not real past papers.</p>
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
            {subjects.map(([id, title]) => <option key={id} value={id}>{title}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Number of questions ({loading ? "loading…" : `${pool.length} available`})
          <input className="input mt-1" type="number" min={3} max={Math.max(3, pool.length)} value={count} onChange={(e) => setCount(Math.max(3, Number(e.target.value) || 3))} />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} className="h-5 w-5" /> Timed (1 minute per question)
        </label>
        <button className="btn" disabled={loading || pool.length < 3} onClick={() => { setRun((r) => r + 1); setStarted(true); }}>Start practice</button>
      </div>
    </div>
  );
}
