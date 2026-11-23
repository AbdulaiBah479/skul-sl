"use client";
import { useCallback, useEffect, useRef, useState } from "react";
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

function Ring({ pct }: { pct: number }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" role="img" aria-label={`${pct} percent`} className="shrink-0">
      <circle cx="56" cy="56" r={r} fill="none" stroke="var(--soft)" strokeWidth="10" />
      <circle cx="56" cy="56" r={r} fill="none" stroke={pct >= 80 ? "var(--brand)" : pct >= 50 ? "var(--accent)" : "var(--warn)"} strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 56 56)" />
      <text x="56" y="62" textAnchor="middle" fontSize="24" fontWeight="800" fill="var(--ink)">{pct}%</text>
    </svg>
  );
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
  const nextRef = useRef<HTMLButtonElement>(null);

  const reset = useCallback(() => {
    setItems(prepare(questions));
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setWrong([]);
    setLeft(timedSeconds ?? 0);
  }, [questions, timedSeconds]);

  useEffect(() => { reset(); }, [reset]);

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

  const choose = useCallback(
    (k: number) => {
      if (!items || picked !== null) return;
      const cur = items[i];
      setPicked(k);
      if (k === cur.answer) setScore((s) => s + 1);
      else setWrong((w) => [...w, cur]);
    },
    [items, i, picked]
  );

  const advance = useCallback(() => {
    if (!items || picked === null) return;
    if (i + 1 >= items.length) finish(score, items.length);
    else {
      setI(i + 1);
      setPicked(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, picked, i, score]);

  // keyboard: A–E or 1–5 choose an answer; Enter / → go to the next question
  useEffect(() => {
    if (!items || done) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toLowerCase();
      const idx = "abcde".indexOf(k) >= 0 && k.length === 1 ? "abcde".indexOf(k) : "12345".indexOf(k) >= 0 && k.length === 1 ? "12345".indexOf(k) : -1;
      if (idx >= 0 && idx < items[i].options.length && picked === null) { e.preventDefault(); choose(idx); }
      else if ((k === "arrowright" || (k === "enter" && (e.target as HTMLElement | null)?.tagName !== "BUTTON")) && picked !== null) { e.preventDefault(); advance(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, i, picked, done, choose, advance]);

  // after answering, move focus to the Next button so keyboard and screen-reader users can continue straight away
  useEffect(() => { if (picked !== null) nextRef.current?.focus({ preventScroll: true }); }, [picked]);

  if (!items) return <div className="skeleton h-56" aria-label="Loading questions" />;

  if (done) {
    const pct = Math.round((score / items.length) * 100);
    return (
      <div className="card fade-in p-5" role="status">
        <div className="flex items-center gap-4">
          <Ring pct={pct} />
          <div>
            <h3 className="text-xl font-extrabold">{pct >= 80 ? "Excellent! 🎉" : pct >= 50 ? "Good effort 👍" : "Keep practising 💪"}</h3>
            <p className="mt-1">You scored <strong>{score}</strong> out of {items.length} ({pct}%).</p>
            <p className="text-sm text-muted">{pct >= 80 ? "This topic counts as mastered." : "Score 80% or more to master a topic."}</p>
          </div>
        </div>
        {wrong.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold">Review what you missed</h4>
            <ul className="mt-2 space-y-2">
              {wrong.map((w, k) => (
                <li key={k} className="rounded-xl bg-bad p-3 text-sm">
                  <p className="font-semibold">{w.q}</p>
                  <p>Answer: <strong>{w.options[w.answer]}</strong>. {w.why}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button className="btn mt-4" onClick={reset}>Try again</button>
      </div>
    );
  }

  const cur = items[i];
  const answered = picked !== null;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="card fade-in p-5">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>Question {i + 1} of {items.length}</span>
        {timedSeconds ? <span className={left < 30 ? "font-bold text-warn" : ""}>⏱ {mm}:{ss}</span> : <span>Score {score}</span>}
      </div>
      <div className="progress mt-2" aria-hidden><span style={{ width: `${((i + (answered ? 1 : 0)) / items.length) * 100}%` }} /></div>
      <h3 className="mt-4 text-lg font-bold leading-snug">{cur.q}</h3>
      <div className="mt-3 grid gap-2" role="group" aria-label="Answer choices">
        {cur.options.map((o, k) => {
          const isRight = answered && k === cur.answer;
          const isWrong = answered && k === picked && k !== cur.answer;
          return (
            <button
              key={k}
              disabled={answered}
              onClick={() => choose(k)}
              aria-keyshortcuts={`${"ABCDE"[k]} ${k + 1}`}
              className={`min-h-[48px] rounded-xl border px-3 py-2 text-left transition-colors ${
                isRight ? "border-brand bg-good" : isWrong ? "border-red-500 bg-bad" : "border-line bg-bg enabled:hover:border-brand enabled:hover:bg-soft"
              }`}
            >
              <span className="mr-2 font-bold text-muted">{"ABCDE"[k]}.</span>
              {o} {isRight && "✓"} {isWrong && "✗"}
            </button>
          );
        })}
      </div>
      {!answered && <p className="mt-2 hidden text-xs text-muted sm:block">Tip: press A–D (or 1–4) to answer.</p>}
      {answered && (
        <div className="fade-in mt-3 rounded-xl bg-soft p-3 text-sm" role="status">
          <strong>{picked === cur.answer ? "Correct. " : "Not quite. "}</strong>
          {cur.why}
        </div>
      )}
      {answered && (
        <button ref={nextRef} className="btn mt-4" onClick={advance}>
          {i + 1 >= items.length ? "See my score" : "Next question →"}
        </button>
      )}
    </div>
  );
}
