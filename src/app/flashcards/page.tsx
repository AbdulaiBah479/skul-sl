"use client";
import { useEffect, useMemo, useState } from "react";
import { LEVELS, topicKey } from "@/content";
import { markActive, saveCard, useProgress } from "@/lib/store";
import { isDue, newCard, review, type ReviewGrade, type StoredCard } from "@/lib/srs";
import { booksFor, fetchBank, fetchIndex, isMcq } from "@/lib/bookindex";

// Every quiz question and textbook Q&A becomes a flashcard: question on the front, answer on the back.
interface CardDef {
  id: string;
  front: string;
  back: string;
}

function parseCard(s: string | undefined): StoredCard | null {
  if (!s) return null;
  try {
    const c = JSON.parse(s);
    return c && typeof c.due === "string" && !Number.isNaN(Date.parse(c.due)) ? (c as StoredCard) : null;
  } catch {
    return null;
  }
}

const HAND: Record<string, CardDef[]> = Object.fromEntries(
  LEVELS.map((l) => [
    l.id,
    l.subjects.flatMap((s) =>
      s.topics.flatMap((t) =>
        t.questions.map((q, i) => ({ id: `${topicKey(l.id, s.id, t.id)}#${i}`, front: q.q, back: `${q.options[q.answer]} — ${q.why}` }))
      )
    ),
  ])
);

export default function Flashcards() {
  const p = useProgress();
  const [level, setLevel] = useState("sss");
  const [flipped, setFlipped] = useState(false);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [bookCards, setBookCards] = useState<CardDef[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    setLoading(true);
    fetchIndex().then(async (idx) => {
      const lists = await Promise.all(
        booksFor(idx, level).map(async ([id]) => {
          const items = await fetchBank(id);
          return items.map((x, i): CardDef => (isMcq(x) ? { id: `${id}#${i}`, front: x.q, back: `${x.options[x.answer]} — ${x.why}` } : { id: `${id}#${i}`, front: x.card.q, back: x.card.a }));
        })
      );
      if (live) { setBookCards(lists.flat()); setLoading(false); }
    });
    return () => { live = false; };
  }, [level]);

  const pool = useMemo(() => [...(HAND[level] ?? []), ...bookCards], [level, bookCards]);

  const queue = useMemo(() => {
    const due: CardDef[] = [];
    const fresh: CardDef[] = [];
    for (const c of pool) {
      if (skipped.includes(c.id)) continue;
      const s = parseCard(p.cards[c.id]);
      if (!s) fresh.push(c);
      else if (isDue(s)) due.push(c);
    }
    return [...due, ...fresh.slice(0, 20)];
  }, [pool, p.cards, skipped]);

  const cur = queue[0];
  const learned = pool.filter((c) => p.cards[c.id]).length;

  const grade = (g: ReviewGrade) => {
    if (!cur) return;
    const prev = parseCard(p.cards[cur.id]) ?? newCard();
    saveCard(cur.id, JSON.stringify(review(prev, g)));
    markActive();
    setFlipped(false);
    if (g === "again") setSkipped((s) => [...s, cur.id]); // comes back later
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
      <p className="mt-2 text-sm text-muted">{loading ? "Loading cards…" : `Started ${learned} of ${pool.length} cards · ${queue.length} ready now`}</p>

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
      ) : !loading ? (
        <div className="card mt-4 p-5 text-center" role="status">
          <p className="text-lg font-bold">All done for now 🎉</p>
          <p className="text-sm text-muted">Come back later. Your next cards will be ready when it is time to review them.</p>
        </div>
      ) : null}
    </div>
  );
}
