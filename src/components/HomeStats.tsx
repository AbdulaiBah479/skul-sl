"use client";
import { streak, useProgress } from "@/lib/store";

export default function HomeStats() {
  const p = useProgress();
  const s = streak(p.days);
  const mastered = Object.values(p.best).filter((b) => b >= 80).length;
  const tried = Object.keys(p.best).length;
  return (
    <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
      {[
        ["🔥", s, "day streak"],
        ["✅", mastered, "topics mastered"],
        ["📘", tried, "topics tried"],
      ].map(([icon, n, label]) => (
        <div key={label as string} className="rounded-xl bg-bg p-2">
          <dd className="text-xl font-extrabold">{icon} {n}</dd>
          <dt className="text-xs text-muted">{label}</dt>
        </div>
      ))}
    </dl>
  );
}
