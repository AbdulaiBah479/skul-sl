"use client";
import { useEffect, useState } from "react";
import type { Question } from "@/content/types";
import { markActive, recordScore } from "@/lib/store";

interface Item {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

/** Shuffles the questions and the answer options, so the right answer is not always in the same place. */
export function prepare(questions: Question[]): Item[] {
  return shuffle(questions).map((q) => {
    const idx = shuffle(q.options.map((_, i) => i));
    return { q: q.q, options: idx.map((i) => q.options[i]), answer: idx.indexOf(q.answer), why: q.why };
  });
}

export default function Quiz({
  questions,
  scoreKey,
  timedSeconds,
  onDone,
}: {
  questions: Question[];
  scoreKey?: string;
  timedSeconds?: number;
  onDone?: (score: number, total: number) => void;
}) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [left, setLeft] = useState(timedSeconds ?? 0);
  const [wrong, setWrong] = useState<Item[]>([]);

  useEffect(() => {
    setItems(prepare(questions));
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setWrong([]);
    setLeft(timedSeconds ?? 0);
  }, [questions, timedSeconds]);

  const finish = (finalScore: number, total: number) => {
    setDone(true);
    if (scoreKey) recordScore(scoreKey, Math.round((finalScore / total) * 100));
    else markActive();
    onDone?.(finalScore, total);
  };

  useEffect(() => {
    if (!timedSeconds || done || !items) return;
    if (left <= 0) {
      finish(score, items.length);
      return;
    }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, done, items, timedSeconds]);

  if (!items) return <p className="text-muted">Loading questions…</p>;

  if (done) {
    const pct = Math.round((score / items.length) * 100);
    return (
      <div className="card p-5" role="status">
        <h3 className="text-xl font-bold">
          {pct >= 80 ? "Excellent! 🎉" : pct >= 50 ? "Good effort 👍" : "Keep practising 💪"}
        </h3>
        <p className="mt-1">
          You scored <strong>{score}</strong> out of {items.length} ({pct}%).
        </p>
        {wrong.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold">Review what you missed</h4>
            <ul className="mt-2 space-y-3">
              {wrong.map((w, k) => (
                <li key={k} className="rounded-lg bg-bad p-3 text-sm">
                  <p className="font-semibold">{w.q}</p>
                  <p>
                    Answer: <strong>{w.options[w.answer]}</strong>. {w.why}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          className="btn mt-4"
          onClick={() => {
            setItems(prepare(questions));
            setI(0);
            setPicked(null);
            setScore(0);
            setDone(false);
            setWrong([]);
            setLeft(timedSeconds ?? 0);
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  const cur = items[i];
  const answered = picked !== null;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          Question {i + 1} of {items.length}
        </span>
        {timedSeconds ? <span aria-live="off" className={left < 30 ? "font-bold text-warn" : ""}>⏱ {mm}:{ss}</span> : <span>Score {score}</span>}
      </div>
      <h3 className="mt-2 text-lg font-bold">{cur.q}</h3>
      <div className="mt-3 grid gap-2" role="group" aria-label="Answer choices">
        {cur.options.map((o, k) => {
          const isRight = answered && k === cur.answer;
          const isWrong = answered && k === picked && k !== cur.answer;
          return (
            <button
              key={k}
              disabled={answered}
              onClick={() => {
                setPicked(k);
                if (k === cur.answer) setScore((s) => s + 1);
                else setWrong((w) => [...w, cur]);
              }}
              className={`min-h-[44px] rounded-xl border px-3 py-2 text-left ${
                isRight ? "border-brand bg-good" : isWrong ? "border-red-500 bg-bad" : "border-line bg-bg hover:border-brand"
              }`}
            >
              <span className="mr-2 font-bold text-muted">{"ABCDE"[k]}.</span>
              {o} {isRight && "✓"} {isWrong && "✗"}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="mt-3 rounded-lg bg-bg p-3 text-sm" role="status">
          <strong>{picked === cur.answer ? "Correct. " : "Not quite. "}</strong>
          {cur.why}
        </div>
      )}
      {answered && (
        <button
          className="btn mt-4"
          onClick={() => {
            const finalScore = score;
            if (i + 1 >= items.length) finish(finalScore, items.length);
            else {
              setI(i + 1);
              setPicked(null);
            }
          }}
        >
          {i + 1 >= items.length ? "See my score" : "Next question →"}
        </button>
      )}
    </div>
  );
}
