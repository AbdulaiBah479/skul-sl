"use client";
import Link from "next/link";
import { allTopics } from "@/content";
import { resetAll, streak, useProgress } from "@/lib/store";

export default function ProgressPage() {
  const p = useProgress();
  const topics = allTopics();
  const tried = topics.filter((t) => p.best[t.key] !== undefined);
  const weak = tried.filter((t) => p.best[t.key] < 60).sort((a, b) => p.best[a.key] - p.best[b.key]);
  const noted = topics.filter((t) => p.notes[t.key]?.trim());
  const avg = tried.length ? Math.round(tried.reduce((n, t) => n + p.best[t.key], 0) / tried.length) : 0;

  return (
    <div>
      <h1 className="text-2xl font-extrabold">My progress</h1>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-center">
        {[
          ["🔥 Streak", `${streak(p.days)} days`],
          ["📘 Topics tried", `${tried.length}/${topics.length}`],
          ["✅ Mastered (80%+)", String(tried.filter((t) => p.best[t.key] >= 80).length)],
          ["🎯 Average best", `${avg}%`],
        ].map(([k, v]) => (
          <div key={k} className="card p-3"><dd className="text-xl font-extrabold">{v}</dd><dt className="text-xs text-muted">{k}</dt></div>
        ))}
      </dl>

      <h2 className="mt-6 mb-2 text-lg font-bold">Topics to revise</h2>
      {weak.length ? (
        <ul className="grid gap-2">
          {weak.map((t) => (
            <li key={t.key}><Link href={`/learn/${t.level.id}/${t.subject.id}/${t.topic.id}`} className="card flex justify-between p-3 no-underline"><span>{t.topic.title} <span className="text-xs text-muted">{t.level.short} · {t.subject.title}</span></span><strong>{p.best[t.key]}%</strong></Link></li>
          ))}
        </ul>
      ) : <p className="text-muted">{tried.length ? "Nothing below 60%. Great work!" : "Try a quiz and your weak topics will show here."}</p>}

      {noted.length > 0 && (
        <>
          <h2 className="mt-6 mb-2 text-lg font-bold">My notes</h2>
          <ul className="grid gap-2">
            {noted.map((t) => (
              <li key={t.key} className="card p-3"><Link href={`/learn/${t.level.id}/${t.subject.id}/${t.topic.id}`} className="font-bold">{t.topic.title}</Link><p className="whitespace-pre-wrap text-sm text-muted">{p.notes[t.key]}</p></li>
            ))}
          </ul>
        </>
      )}

      <button className="btn btn-ghost mt-8" onClick={() => { if (confirm("Delete all your progress, notes and flashcards from this phone?")) resetAll(); }}>Reset all my data</button>
    </div>
  );
}
