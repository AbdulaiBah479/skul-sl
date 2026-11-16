"use client";
import { useProgress } from "@/lib/store";

export function BestScore({ k }: { k: string }) {
  const p = useProgress();
  const b = p.best[k];
  if (b === undefined) return <span className="text-xs text-muted">Not tried</span>;
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${b >= 80 ? "bg-good" : b >= 50 ? "bg-card border border-line" : "bg-bad"}`}>
      Best {b}%
    </span>
  );
}

export function SubjectProgress({ keys }: { keys: string[] }) {
  const p = useProgress();
  const done = keys.filter((k) => (p.best[k] ?? 0) >= 80).length;
  return (
    <span className="text-xs text-muted">
      {done}/{keys.length} mastered
    </span>
  );
}
