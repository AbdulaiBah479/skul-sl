"use client";
import { useMemo, useState } from "react";
import { CATS, RESOURCES, type Cat } from "@/lib/resources";

export default function Library() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Cat | "All">("All");

  const groups = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = RESOURCES.filter((r) => (cat === "All" || r.cat === cat) && (!s || `${r.name} ${r.what} ${r.cat} ${r.tags.join(" ")}`.toLowerCase().includes(s)));
    return CATS.map((c) => ({ cat: c, items: list.filter((r) => r.cat === c) })).filter((g) => g.items.length);
  }, [q, cat]);
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Free library</h1>
      <p className="text-muted">{RESOURCES.length} free books, courses, tools, GitHub repos and APIs. These sites need internet. For offline, see the Offline section (Kolibri, Kiwix).</p>
      <label className="sr-only" htmlFor="rq">Search resources</label>
      <input id="rq" className="input mt-3" placeholder="Search… e.g. medicine, python, WASSCE" value={q} onChange={(e) => setQ(e.target.value)} />
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Filter by category">
        {(["All", ...CATS] as const).map((c) => (
          <li key={c}>
            <button aria-pressed={cat === c} onClick={() => setCat(c)} className={`rounded-full border px-3 py-1 text-sm font-semibold ${cat === c ? "border-brand bg-brand text-brand-ink" : "border-line bg-card"}`}>{c}</button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-muted" role="status">{total} result{total === 1 ? "" : "s"}</p>
      {groups.map((g) => (
        <section key={g.cat} className="mt-4" aria-labelledby={`h-${g.cat}`}>
          <h2 id={`h-${g.cat}`} className="mb-2 text-lg font-bold">{g.cat}</h2>
          <ul className="grid gap-3">
            {g.items.map((r) => (
              <li key={r.url} className="card p-4">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-bold text-accent">{r.name} ↗</a>
                <p className="text-sm text-muted">{r.what}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {!total && <p className="mt-4 text-muted">Nothing matches. Try another word.</p>}
    </div>
  );
}
