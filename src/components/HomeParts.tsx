"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { streak, today, useProgress } from "@/lib/store";

/** Big "pick up where you left off" card. Falls back to a friendly first step for new students. */
export function ContinueCard() {
  const p = useProgress();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  // wait for the browser so server and first client render match (progress lives only on the device)
  if (!ready) return <div className="skeleton h-[76px]" aria-hidden />;
  if (p.last)
    return (
      <Link href={p.last.href} className="card fade-in flex items-center gap-3 p-4 no-underline">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand text-brand-ink"><Icon name="learn" /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold uppercase tracking-wide text-muted">Continue learning</span>
          <span className="block truncate font-bold">{p.last.title}</span>
        </span>
        <Icon name="arrow" className="shrink-0 text-muted" />
      </Link>
    );
  return (
    <Link href="/learn/sss" className="card fade-in flex items-center gap-3 p-4 no-underline">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand text-brand-ink"><Icon name="star" /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold uppercase tracking-wide text-muted">New here?</span>
        <span className="block font-bold">Pick your level and try your first lesson</span>
      </span>
      <Icon name="arrow" className="shrink-0 text-muted" />
    </Link>
  );
}

/** Streak, mastered topics and a 7-day activity strip. */
export function StatsRow() {
  const p = useProgress();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const s = ready ? streak(p.days) : 0;
  const mastered = ready ? Object.values(p.best).filter((b) => b >= 80).length : 0;
  const tried = ready ? Object.keys(p.best).length : 0;
  // last 7 days, oldest first
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { key: today(d), label: d.toLocaleDateString("en", { weekday: "narrow" }) };
  });
  return (
    <div className="card p-4">
      <dl className="grid grid-cols-3 gap-2 text-center">
        {[
          ["flame", s, "day streak"],
          ["check", mastered, "mastered"],
          ["learn", tried, "topics tried"],
        ].map(([icon, n, label]) => (
          <div key={label as string}>
            <dd className="flex items-center justify-center gap-1 text-2xl font-extrabold"><Icon name={icon as string} size={20} className="text-brand" />{n}</dd>
            <dt className="text-xs text-muted">{label}</dt>
          </div>
        ))}
      </dl>
      <ul className="mt-3 grid grid-cols-7 gap-1.5" aria-label="Your last 7 days">
        {week.map((d) => {
          const on = ready && p.days.includes(d.key);
          return (
            <li key={d.key} className="text-center">
              <span className={`mx-auto block h-2 rounded-full ${on ? "bg-brand" : "bg-soft"}`} />
              <span className="text-[10px] text-muted">{d.label}<span className="sr-only">{on ? " (studied)" : " (no study)"}</span></span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export interface DailyQ {
  q: string;
  options: string[];
  answer: number;
  why: string;
  from: string;
}

/** One question a day (the same for everyone on the same date). Quick win that keeps the streak going. */
export function DailyQuestion({ pool }: { pool: DailyQ[] }) {
  const [item, setItem] = useState<DailyQ | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  useEffect(() => {
    const d = new Date();
    const dayNumber = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
    setItem(pool[dayNumber % pool.length] ?? null);
  }, [pool]);
  if (!item) return <div className="skeleton h-40" aria-hidden />;
  const done = picked !== null;
  return (
    <section className="card fade-in p-4" aria-labelledby="daily-h">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Question of the day · {item.from}</p>
      <h2 id="daily-h" className="mt-1 text-lg font-bold">{item.q}</h2>
      <div className="mt-3 grid gap-2" role="group" aria-label="Answer choices">
        {item.options.map((o, i) => {
          const right = done && i === item.answer;
          const wrong = done && i === picked && i !== item.answer;
          return (
            <button
              key={i}
              disabled={done}
              onClick={() => setPicked(i)}
              className={`min-h-[46px] rounded-xl border px-3 py-2 text-left transition-colors ${right ? "border-brand bg-good" : wrong ? "border-red-500 bg-bad" : "border-line bg-bg hover:border-brand"}`}
            >
              <span className="mr-2 font-bold text-muted">{"ABCDE"[i]}.</span>{o} {right && "✓"}{wrong && "✗"}
            </button>
          );
        })}
      </div>
      {done && (
        <p className="mt-3 rounded-lg bg-soft p-3 text-sm" role="status">
          <strong>{picked === item.answer ? "Correct! " : "Not quite. "}</strong>{item.why}
        </p>
      )}
    </section>
  );
}
