"use client";
import { useMemo, useState } from "react";
import { LEVELS, topicKey } from "@/content";
import { markActive, saveCard, useProgress } from "@/lib/store";
import { isDue, newCard, review, type ReviewGrade, type StoredCard } from "@/lib/srs";

// Every quiz question becomes a flashcard: question on the front, answer + reason on the back.
interface CardDef {
  id: string;
  front: string;
  back: string;
  level: string;
}

const ALL: CardDef[] = LEVELS.flatMap((l) =>
  l.subjects.flatMap((s) =>
    s.topics.flatMap((t) =>
      t.questions.map((q, i) => ({
        id: `${topicKey(l.id, s.id, t.id)}#${i}`,
        front: q.q,
        back: `${q.options[q.answer]} — ${q.why}`,
        level: l.id,
      }))
    )
  )
);

export default function Flashcards() {
  const p = useProgress();
  const [level, setLevel] = useState("sss");
  const [flipped, setFlipped] = useState(false);
  const [skipped, setSkipped] = useState<string[]>([]);

  const stored = (id: string): StoredCard | null => {
    try {
      return p.cards[id] ? (JSON.parse(p.cards[id]) as StoredCard) : null;
    } catch {
      return null;
    }
  };

  const queue = useMemo(() => {
    const pool = ALL.filter((c) => c.level === level);
    const due: CardDef[] = [];
    const fresh: CardDef[] = [];
    for (const c of pool) {
      if (skipped.includes(c.id)) continue;
      const s = p.cards[c.id] ? (JSON.parse(p.cards[c.id]) as StoredCard) : null;
      if (!s) fresh.push(c);
      else if (isDue(s)) due.push(c);
    }
    return [...due, ...fresh.slice(0, 20)];
  }, [level, p.cards, skipped]);

  const cur = queue[0];
  const learned = ALL.filter((c) => c.level === level && p.cards[c.id]).length;
  const total = ALL.filter((c) => c.level === level).length;

  const grade = (g: ReviewGrade) => {
    if (!cur) return;
    saveCard(cur.id, JSON.stringify(review(stored(cur.id) ?? newCard(), g)));
    markActive();
    setFlipped(false);
    // "again" cards come back later in this session
    if (g === "again") setSkipped((s) => [...s, cur.id]);
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Flashcards</h1>
      <p className="text-muted">Spaced repetition shows you each card just before you would forget it.</p>
      <label className="mt-3 block text-sm font-semibold">
        Level
        <select className="input mt-1" value={level} onChange={(e) => { setLevel(e.target.value); setSkipped([]); setFlipped(false); }}>
          {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
        </select>
      </label>
      <p className="mt-2 text-sm text-muted">Started {learned} of {total} cards · {queue.length} ready now</p>

      {cur ? (
        <div className="card mt-4 p-5">
          <p className="text-xs font-semibold uppercase text-muted">{flipped ? "Answer" : "Question"}</p>
          <p className="mt-2 min-h-24 text-lg font-semibold">{flipped ? cur.back : cur.front}</p>
          {!flipped ? (
            <button className="btn mt-4" onClick={() => setFlipped(true)}>Show answer</button>
          ) : (
            <div className="mt-4 grid grid-cols-4 gap-2 text-sm">
              {(["again", "hard", "good", "easy"] as ReviewGrade[]).map((g) => (
                <button key={g} className="btn btn-ghost capitalize" onClick={() => grade(g)}>{g}</button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="card mt-4 p-5 text-center" role="status">
          <p className="text-lg font-bold">All done for now 🎉</p>
          <p className="text-sm text-muted">Come back later. Your next cards will be ready when it is time to review them.</p>
        </div>
      )}
    </div>
  );
}
