"use client";
import { useRef, useState } from "react";

// Free, key-less public APIs, called straight from the student's browser:
//  • Wikipedia REST summary  • Free Dictionary API  • Gutendex (Project Gutenberg catalogue)
interface Wiki { title: string; extract: string; url: string; thumb?: string }
interface Def { word: string; phonetic?: string; meanings: { part: string; defs: string[] }[] }
interface Book { id: number; title: string; authors: string; url: string }

// Answers come from third-party APIs, so every URL is checked before it is used as a link or image.
function safeUrl(u: unknown, hosts: string[]): string {
  try {
    const x = new URL(String(u));
    return x.protocol === "https:" && hosts.includes(x.hostname) ? x.href : "";
  } catch {
    return "";
  }
}

export default function Explore() {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [wiki, setWiki] = useState<Wiki | null>(null);
  const [def, setDef] = useState<Def | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [note, setNote] = useState("");

  const run = useRef(0);

  // Each source is shown the moment it answers (one slow site must not hold back the others), and a newer search ignores older answers.
  const search = () => {
    const term = q.trim();
    if (!term) return;
    const id = ++run.current;
    const live = () => run.current === id;
    setBusy(true);
    setNote("");
    setWiki(null);
    setDef(null);
    setBooks([]);
    const get = (url: string) =>
      fetch(url, { signal: AbortSignal.timeout(15000) }).then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))));
    let found = 0;
    let pending = 3;
    const done = (hit: boolean) => {
      if (hit) found++;
      pending--;
      if (pending === 0 && live()) {
        setBusy(false);
        if (!found) setNote("Nothing found, or you are offline or the sites are slow. Check your spelling and connection, then try again.");
      }
    };

    get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term.replace(/\s+/g, "_"))}?redirect=true`)
      .then((w) => {
        const ok = !!w?.extract && w.type !== "disambiguation";
        if (ok && live()) setWiki({ title: String(w.title), extract: String(w.extract), url: safeUrl(w.content_urls?.desktop?.page, ["en.wikipedia.org"]), thumb: safeUrl(w.thumbnail?.source, ["upload.wikimedia.org"]) });
        done(ok);
      })
      .catch(() => done(false));

    if (term.includes(" ")) done(false);
    else
      get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term.toLowerCase())}`)
        .then((d) => {
          const e = Array.isArray(d) ? d[0] : null;
          if (e && live())
            setDef({
              word: String(e.word),
              phonetic: e.phonetic ? String(e.phonetic) : undefined,
              meanings: (e.meanings ?? []).slice(0, 3).map((m: { partOfSpeech: string; definitions: { definition: string }[] }) => ({ part: String(m.partOfSpeech), defs: m.definitions.slice(0, 2).map((x) => String(x.definition)) })),
            });
          done(!!e);
        })
        .catch(() => done(false));

    get(`https://gutendex.com/books/?search=${encodeURIComponent(term)}`)
      .then((b) => {
        const list = (b.results ?? []).slice(0, 5).filter((x: { id: unknown }) => Number.isInteger(x.id));
        if (list.length && live())
          setBooks(list.map((x: { id: number; title: string; authors: { name: string }[] }) => ({ id: x.id, title: String(x.title), authors: (x.authors ?? []).map((a) => String(a.name)).join(", "), url: `https://www.gutenberg.org/ebooks/${x.id}` })));
        done(list.length > 0);
      })
      .catch(() => done(false));
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Explore</h1>
      <p className="text-muted">Look up any topic or word. Results come live from Wikipedia, a free dictionary and Project Gutenberg, so you need internet for this page.</p>
      <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); search(); }}>
        <label className="sr-only" htmlFor="eq">Search</label>
        <input id="eq" className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. photosynthesis, democracy, ubiquitous" />
        <button className="btn" disabled={busy || !q.trim()}>{busy ? "…" : "Search"}</button>
      </form>
      {note && <p className="mt-4 text-warn" role="status">{note}</p>}

      {def && (
        <section className="card mt-4 p-4">
          <h2 className="text-lg font-bold">📖 {def.word} {def.phonetic && <span className="font-normal text-muted">{def.phonetic}</span>}</h2>
          {def.meanings.map((m, i) => (
            <div key={i} className="mt-1">
              <p className="text-sm font-semibold italic">{m.part}</p>
              <ul className="list-disc pl-5 text-sm">{m.defs.map((d, k) => <li key={k}>{d}</li>)}</ul>
            </div>
          ))}
        </section>
      )}
      {wiki && (
        <section className="card mt-4 p-4">
          <h2 className="text-lg font-bold">🌐 {wiki.title}</h2>
          <div className="mt-2 flex gap-3">
            {wiki.thumb && /* eslint-disable-next-line @next/next/no-img-element */ <img src={wiki.thumb} alt="" className="h-24 w-24 shrink-0 rounded-lg object-cover" loading="lazy" />}
            <p className="text-sm">{wiki.extract}</p>
          </div>
          {wiki.url && <a href={wiki.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-accent">Read more on Wikipedia ↗</a>}
        </section>
      )}
      {books.length > 0 && (
        <section className="card mt-4 p-4">
          <h2 className="text-lg font-bold">📚 Free books</h2>
          <ul className="mt-1 grid gap-1 text-sm">
            {books.map((b) => <li key={b.id}><a href={b.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent">{b.title} ↗</a> <span className="text-muted">{b.authors}</span></li>)}
          </ul>
        </section>
      )}
    </div>
  );
}
