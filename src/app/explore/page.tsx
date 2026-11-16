"use client";
import { useState } from "react";

// Free, key-less public APIs, called straight from the student's browser:
//  • Wikipedia REST summary  • Free Dictionary API  • Gutendex (Project Gutenberg catalogue)
interface Wiki { title: string; extract: string; url: string; thumb?: string }
interface Def { word: string; phonetic?: string; meanings: { part: string; defs: string[] }[] }
interface Book { id: number; title: string; authors: string; url: string }

export default function Explore() {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [wiki, setWiki] = useState<Wiki | null>(null);
  const [def, setDef] = useState<Def | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [note, setNote] = useState("");

  const search = async () => {
    const term = q.trim();
    if (!term) return;
    setBusy(true);
    setNote("");
    setWiki(null);
    setDef(null);
    setBooks([]);
    const [w, d, b] = await Promise.allSettled([
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term.replace(/\s+/g, "_"))}?redirect=true`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      term.includes(" ") ? Promise.reject("phrase") : fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term.toLowerCase())}`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch(`https://gutendex.com/books/?search=${encodeURIComponent(term)}`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
    ]);
    if (w.status === "fulfilled" && w.value?.extract && w.value.type !== "disambiguation")
      setWiki({ title: w.value.title, extract: w.value.extract, url: w.value.content_urls?.desktop?.page ?? "", thumb: w.value.thumbnail?.source });
    if (d.status === "fulfilled" && Array.isArray(d.value) && d.value[0])
      setDef({
        word: d.value[0].word,
        phonetic: d.value[0].phonetic,
        meanings: (d.value[0].meanings ?? []).slice(0, 3).map((m: { partOfSpeech: string; definitions: { definition: string }[] }) => ({ part: m.partOfSpeech, defs: m.definitions.slice(0, 2).map((x) => x.definition) })),
      });
    if (b.status === "fulfilled")
      setBooks((b.value.results ?? []).slice(0, 5).map((x: { id: number; title: string; authors: { name: string }[] }) => ({ id: x.id, title: x.title, authors: x.authors.map((a) => a.name).join(", "), url: `https://www.gutenberg.org/ebooks/${x.id}` })));
    if (w.status === "rejected" && d.status === "rejected" && b.status === "rejected") setNote("Nothing found, or you are offline. Check your spelling and connection.");
    setBusy(false);
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
