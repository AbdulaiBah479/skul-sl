"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Icon from "./Icon";
import { RESOURCES } from "@/lib/resources";
import { searchLessons, words, type Hit } from "@/lib/search";
import { fetchIndex } from "@/lib/bookindex";

type CourseRow = [string, string, string, string];
const SMALL_SOURCES = ["fpb", "repos", "openstax", "ocw"]; // small enough to search on a phone; Coursera has its own page

const SUGGESTIONS = ["photosynthesis", "quadratic equations", "WASSCE", "python", "economics", "first aid", "calculus", "scholarships"];

function score(title: string, qw: string[], whole: string): number {
  const t = title.toLowerCase();
  const tw = words(title);
  let s = qw.filter((w) => tw.includes(w) || t.includes(w)).length;
  if (qw.length && s === qw.length) s += 2;
  if (t.includes(whole)) s += 3;
  return s;
}

export default function SearchClient() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const [term, setTerm] = useState(initial);
  const [lessons, setLessons] = useState<Hit[]>([]);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setQ(initial); setTerm(initial); }, [initial]);

  useEffect(() => {
    const t = term.trim();
    if (t.length < 2) { setLessons([]); setCourses([]); return; }
    let live = true;
    setBusy(true);
    const qw = words(t);
    const whole = t.toLowerCase();
    (async () => {
      const own = searchLessons(t, 8);
      const idx = await fetchIndex();
      const textbook: Hit[] = [];
      for (const [id, e] of Object.entries(idx))
        for (const [tid, title] of e.topics) {
          const s = score(title, qw, whole);
          if (s > 0) textbook.push({ key: `${id}/${tid}`, href: `/learn/${e.level}/${e.subject}/${tid}`, title, where: e.title, snippet: "Textbook lesson", score: s });
        }
      textbook.sort((a, b) => b.score - a.score);
      let cs: CourseRow[] = [];
      try {
        const meta: Record<string, unknown> = await fetch("/courses/index.json").then((r) => r.json());
        const lists = await Promise.all(SMALL_SOURCES.filter((s) => s in meta).map((s) => fetch(`/courses/${s}.json`).then((r) => (r.ok ? (r.json() as Promise<CourseRow[]>) : []))));
        cs = lists.flat().map((r) => ({ r, s: score(`${r[0]} ${r[2]}`, qw, whole) })).filter((x) => x.s >= Math.min(qw.length, 2) || x.s >= 3).sort((a, b) => b.s - a.s).slice(0, 12).map((x) => x.r);
      } catch {}
      if (live) {
        setLessons([...own, ...textbook.slice(0, 12)].sort((a, b) => b.score - a.score).slice(0, 14));
        setCourses(cs);
        setBusy(false);
      }
    })();
    return () => { live = false; };
  }, [term]);

  const resources = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (t.length < 2) return [];
    const qw = words(t);
    return RESOURCES.map((r) => ({ r, s: score(`${r.name} ${r.what} ${r.tags.join(" ")}`, qw, t) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 8).map((x) => x.r);
  }, [term]);

  const submit = (v: string) => {
    setTerm(v);
    router.replace(v.trim() ? `/search?q=${encodeURIComponent(v.trim())}` : "/search", { scroll: false });
  };
  const total = lessons.length + resources.length + courses.length;
  const searched = term.trim().length >= 2;

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Search</h1>
      <form role="search" className="relative mt-3" onSubmit={(e) => { e.preventDefault(); submit(q); }}>
        <label htmlFor="sq" className="sr-only">Search lessons, courses and resources</label>
        <input id="sq" type="search" className="input !min-h-[52px] pl-11" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search lessons, courses, resources…" autoComplete="off" autoFocus />
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"><Icon name="search" /></span>
      </form>

      {!searched && (
        <div className="mt-4">
          <p className="text-sm text-muted">Try:</p>
          <ul className="mt-2 flex flex-wrap gap-2">{SUGGESTIONS.map((s) => <li key={s}><button className="chip" onClick={() => { setQ(s); submit(s); }}>{s}</button></li>)}</ul>
        </div>
      )}

      {searched && (
        <p className="mt-4 text-sm text-muted" role="status">{busy ? "Searching…" : `${total} result${total === 1 ? "" : "s"} for “${term.trim()}”`}</p>
      )}

      {lessons.length > 0 && (
        <section className="mt-4" aria-labelledby="r-lessons">
          <h2 id="r-lessons" className="mb-2 text-lg font-bold">Lessons</h2>
          <ul className="grid gap-2">
            {lessons.map((h) => (
              <li key={h.key}>
                <Link href={h.href} className="card block p-3 no-underline">
                  <span className="font-semibold">{h.title}</span> <span className="text-xs text-muted">{h.where}</span>
                  <span className="block truncate text-sm text-muted">{h.snippet}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {resources.length > 0 && (
        <section className="mt-5" aria-labelledby="r-res">
          <h2 id="r-res" className="mb-2 text-lg font-bold">Free library</h2>
          <ul className="grid gap-2">
            {resources.map((r) => (
              <li key={r.url} className="card p-3">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent">{r.name} ↗</a>
                <p className="text-sm text-muted">{r.what}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {courses.length > 0 && (
        <section className="mt-5" aria-labelledby="r-courses">
          <h2 id="r-courses" className="mb-2 text-lg font-bold">Free courses</h2>
          <ul className="grid gap-2">
            {courses.map((c) => (
              <li key={c[1]} className="card p-3">
                <a href={/^https?:\/\//i.test(c[1]) ? c[1] : "#"} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent">{c[0]} ↗</a>
                <p className="text-xs text-muted">{c[2]}</p>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm"><Link href={`/courses?q=${encodeURIComponent(term.trim())}`} className="font-semibold text-accent">Search all 30,000 courses →</Link></p>
        </section>
      )}

      {searched && !busy && total === 0 && (
        <div className="card mt-4 p-4">
          <p className="font-semibold">Nothing found.</p>
          <p className="text-sm text-muted">Check the spelling, or try fewer words. You can also <Link href="/tutor" className="font-semibold text-accent">ask the tutor</Link> or <Link href={`/courses?q=${encodeURIComponent(term.trim())}`} className="font-semibold text-accent">search the course catalogue</Link>.</p>
        </div>
      )}
    </div>
  );
}
