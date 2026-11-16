"use client";
import { useMemo, useState } from "react";
import { RESOURCES } from "@/lib/resources";

const FILTERS = ["all", "video", "books", "maths", "science", "computing", "university", "research", "offline", "sierra leone"];

export default function Library() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("all");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return RESOURCES.filter((r) => (tag === "all" || r.tags.includes(tag)) && (!s || `${r.name} ${r.what} ${r.tags.join(" ")}`.toLowerCase().includes(s)));
  }, [q, tag]);
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Free library</h1>
      <p className="text-muted">Trusted free books, videos, courses and tools from around the world. These sites need internet. Kiwix lets you download libraries to use offline.</p>
      <label className="sr-only" htmlFor="rq">Search resources</label>
      <input id="rq" className="input mt-3" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Filter by type">
        {FILTERS.map((f) => (
          <li key={f}><button aria-pressed={tag === f} onClick={() => setTag(f)} className={`rounded-full border px-3 py-1 text-sm font-semibold ${tag === f ? "border-brand bg-brand text-brand-ink" : "border-line bg-card"}`}>{f}</button></li>
        ))}
      </ul>
      <ul className="mt-4 grid gap-3">
        {list.map((r) => (
          <li key={r.url} className="card p-4">
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-bold text-accent">{r.name} ↗</a>
            <p className="text-sm text-muted">{r.what}</p>
          </li>
        ))}
        {!list.length && <li className="text-muted">Nothing matches. Try another word.</li>}
      </ul>
    </div>
  );
}
