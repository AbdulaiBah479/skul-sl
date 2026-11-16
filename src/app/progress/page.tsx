"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { allTopics, LEVELS } from "@/content";
import { resetAll, streak, useProgress } from "@/lib/store";
import { fetchIndex, type BookIndex } from "@/lib/bookindex";

export default function ProgressPage() {
  const p = useProgress();
  const [index, setIndex] = useState<BookIndex>({});
  useEffect(() => { fetchIndex().then(setIndex); }, []);

  // every topic we know a title for: hand-written + imported textbook topics
  const topics = useMemo(() => {
    const out = allTopics().map((t) => ({ key: t.key, title: t.topic.title, where: `${t.level.short} · ${t.subject.title}`, href: `/learn/${t.level.id}/${t.subject.id}/${t.topic.id}` }));
    for (const e of Object.values(index)) {
      const lvl = LEVELS.find((l) => l.id === e.level);
      for (const [id, title] of e.topics) out.push({ key: `${e.level}/${e.subject}/${id}`, title, where: `${lvl?.short ?? e.level} · ${e.title}`, href: `/learn/${e.level}/${e.subject}/${id}` });
    }
    return out;
  }, [index]);

  const byKey = useMemo(() => new Map(topics.map((t) => [t.key, t])), [topics]);
  const tried = Object.keys(p.best).filter((k) => byKey.has(k));
  const weak = tried.filter((k) => p.best[k] < 60).sort((a, b) => p.best[a] - p.best[b]);
  const noted = Object.keys(p.notes).filter((k) => p.notes[k]?.trim() && byKey.has(k));
  const avg = tried.length ? Math.round(tried.reduce((n, k) => n + p.best[k], 0) / tried.length) : 0;

  return (
    <div>
      <h1 className="text-2xl font-extrabold">My progress</h1>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-center">
        {[
          ["🔥 Streak", `${streak(p.days)} days`],
          ["📘 Topics tried", `${tried.length}/${topics.length}`],
          ["✅ Mastered (80%+)", String(tried.filter((k) => p.best[k] >= 80).length)],
          ["🎯 Average best", `${avg}%`],
        ].map(([k, v]) => (
          <div key={k} className="card p-3"><dd className="text-xl font-extrabold">{v}</dd><dt className="text-xs text-muted">{k}</dt></div>
        ))}
      </dl>

      <h2 className="mt-6 mb-2 text-lg font-bold">Topics to revise</h2>
      {weak.length ? (
        <ul className="grid gap-2">
          {weak.slice(0, 30).map((k) => {
            const t = byKey.get(k)!;
            return <li key={k}><Link href={t.href} className="card flex justify-between gap-2 p-3 no-underline"><span>{t.title} <span className="text-xs text-muted">{t.where}</span></span><strong>{p.best[k]}%</strong></Link></li>;
          })}
        </ul>
      ) : <p className="text-muted">{tried.length ? "Nothing below 60%. Great work!" : "Try a quiz and your weak topics will show here."}</p>}

      {noted.length > 0 && (
        <>
          <h2 className="mt-6 mb-2 text-lg font-bold">My notes</h2>
          <ul className="grid gap-2">
            {noted.map((k) => {
              const t = byKey.get(k)!;
              return <li key={k} className="card p-3"><Link href={t.href} className="font-bold">{t.title}</Link><p className="whitespace-pre-wrap text-sm text-muted">{p.notes[k]}</p></li>;
            })}
          </ul>
        </>
      )}

      <button className="btn btn-ghost mt-8" onClick={() => { if (confirm("Delete all your progress, notes and flashcards from this phone?")) resetAll(); }}>Reset all my data</button>
    </div>
  );
}
