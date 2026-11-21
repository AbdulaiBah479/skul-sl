"use client";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

// Free-course catalogue built by scripts/import-courses.mjs from open GitHub lists and public catalogues.
// Each source is a separate JSON file in /courses, loaded only when chosen (the biggest are several hundred KB).
type Row = [title: string, url: string, category: string, note: string];
interface Meta {
  name: string;
  about: string;
  url: string;
  licence: string;
  licenceUrl: string;
  count: number;
  kb: number;
}

const PAGE = 60;
const BIG_KB = 1500; // lists larger than this are only downloaded when chosen on their own (data costs, low-end phones)
const rowsCache = new Map<string, Promise<Row[]>>();
function loadRows(id: string): Promise<Row[]> {
  if (!rowsCache.has(id))
    rowsCache.set(
      id,
      fetch(`/courses/${id}.json`)
        .then((r) => (r.ok ? (r.json() as Promise<Row[]>) : Promise.reject(new Error("HTTP " + r.status))))
        .catch(() => {
          rowsCache.delete(id);
          return [] as Row[];
        })
    );
  return rowsCache.get(id)!;
}

// Only ever link to http(s) pages, whatever the catalogue file says.
const safe = (u: string) => (/^https?:\/\//i.test(u) ? u : "#");

export default function Courses() {
  const [index, setIndex] = useState<Record<string, Meta> | null>(null);
  const [source, setSource] = useState("fpb");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [shown, setShown] = useState(PAGE);
  const dq = useDeferredValue(q);

  useEffect(() => {
    fetch("/courses/index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
      .then(setIndex)
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    if (!index) return;
    let live = true;
    setLoading(true);
    setShown(PAGE);
    setCat("");
    const ids = source === "all" ? Object.keys(index).filter((id) => index[id].kb <= BIG_KB) : [source];
    Promise.all(ids.map(loadRows)).then((all) => {
      if (live) {
        setRows(all.flat());
        setLoading(false);
      }
    });
    return () => {
      live = false;
    };
  }, [index, source]);

  const categories = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rows) {
      const c = r[2].split(" › ")[0];
      m.set(c, (m.get(c) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [rows]);

  const results = useMemo(() => {
    const words = dq.toLowerCase().split(/\s+/).filter(Boolean);
    return rows.filter((r) => (!cat || r[2].split(" › ")[0] === cat) && words.every((w) => `${r[0]} ${r[2]} ${r[3]}`.toLowerCase().includes(w)));
  }, [rows, dq, cat]);

  if (error)
    return (
      <div>
        <h1 className="text-2xl font-extrabold">Free courses</h1>
        <p className="mt-3 text-warn" role="alert">Could not load the course list. Check your internet connection and reload.</p>
      </div>
    );

  const total = index ? Object.values(index).reduce((n, m) => n + m.count, 0) : 0;
  const meta = index && source !== "all" ? index[source] : null;

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Free courses</h1>
      <p className="text-muted">
        {total ? `${total.toLocaleString()} free courses and textbooks` : "Loading…"} collected from open GitHub lists and public catalogues. Search by subject, such as “python”, “calculus” or “nursing”. Most need internet.
      </p>

      {index && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Choose a source">
          {[...Object.entries(index).map(([id, m]) => [id, `${m.name} (${m.count.toLocaleString()}${m.kb > BIG_KB ? `, ${(m.kb / 1024).toFixed(1)} MB download` : ""})`] as const), ["all", "All except big lists"] as const].map(([id, label]) => (
            <li key={id}>
              <button aria-pressed={source === id} onClick={() => setSource(id)} className={`rounded-full border px-3 py-1 text-sm font-semibold ${source === id ? "border-brand bg-brand text-brand-ink" : "border-line bg-card"}`}>{label}</button>
            </li>
          ))}
        </ul>
      )}

      {meta && (
        <p className="mt-3 text-xs text-muted">
          {meta.about} Source: <a href={safe(meta.url)} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent">{meta.name}</a> · {meta.licence === "Links only" ? "links only" : <>licence <a href={safe(meta.licenceUrl)} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent">{meta.licence}</a></>}
        </p>
      )}

      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_14rem]">
        <label className="sr-only" htmlFor="cq">Search courses</label>
        <input id="cq" className="input" placeholder="Search courses…" value={q} onChange={(e) => { setQ(e.target.value); setShown(PAGE); }} />
        <label className="sr-only" htmlFor="cc">Category</label>
        <select id="cc" className="input" value={cat} onChange={(e) => { setCat(e.target.value); setShown(PAGE); }}>
          <option value="">All categories</option>
          {categories.map(([c, n]) => <option key={c} value={c}>{c} ({n})</option>)}
        </select>
      </div>

      <p className="mt-3 text-sm text-muted" role="status">{loading ? "Loading courses…" : `${results.length.toLocaleString()} result${results.length === 1 ? "" : "s"}`}</p>
      <ul className="mt-2 grid gap-2">
        {results.slice(0, shown).map((r) => (
          <li key={r[1]} className="card p-3">
            <a href={safe(r[1])} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent">{r[0]} ↗</a>
            <p className="text-xs text-muted">{r[2]}{r[3] ? ` · ${r[3]}` : ""}</p>
          </li>
        ))}
      </ul>
      {results.length > shown && (
        <button className="btn btn-ghost mt-4" onClick={() => setShown((s) => s + PAGE)}>Show more ({(results.length - shown).toLocaleString()} left)</button>
      )}
      {!loading && !results.length && <p className="mt-4 text-muted">Nothing matches. Try another word or choose “All except big lists”.</p>}
    </div>
  );
}
