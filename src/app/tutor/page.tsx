"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { searchLessons, words, type Hit } from "@/lib/search";
import { fetchIndex } from "@/lib/bookindex";
import { markActive } from "@/lib/store";

type Msg = { role: "user" | "assistant"; content: string; hits?: Hit[] };

const IDEAS = ["Explain photosynthesis simply", "How do I solve 2x − 3 = 11?", "How do I write a formal letter?", "Tips for passing exams"];

export default function Tutor() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const ask = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    markActive();
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.answer) setMsgs([...next, { role: "assistant", content: j.answer }]);
      else throw new Error(j.error || "failed");
    } catch (e) {
      // No internet or no AI: still help, from the lessons stored in this app.
      const hits = searchLessons(q);
      // also match the titles of the textbook lessons (their index is small and saved for offline use)
      try {
        const idx = await fetchIndex();
        const qw = words(q);
        const found: Hit[] = [];
        for (const [id, e] of Object.entries(idx))
          for (const [tid, title] of e.topics) {
            const tw = words(title);
            const score = qw.filter((w) => tw.includes(w)).length;
            if (score) found.push({ key: `${id}/${tid}`, href: `/learn/${e.level}/${e.subject}/${tid}`, title, where: e.title, snippet: "Textbook lesson", score });
          }
        hits.push(...found.sort((a, b) => b.score - a.score).slice(0, 4));
      } catch {}
      const why = e instanceof Error && e.message ? e.message : "The AI tutor is not available.";
      setMsgs([
        ...next,
        {
          role: "assistant",
          content: hits.length
            ? `${why} Here are lessons in this app that may help:`
            : `${why} I could not find a matching lesson. Try different words, or open Learn and pick your subject.`,
          hits,
        },
      ]);
    } finally {
      setBusy(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">AI tutor</h1>
      <p className="text-muted">Ask anything about your studies. With no internet, it searches the lessons stored in this app.</p>

      {!msgs.length && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {IDEAS.map((i) => (
            <li key={i}><button className="btn btn-ghost text-sm" onClick={() => ask(i)}>{i}</button></li>
          ))}
        </ul>
      )}

      <div className="mt-4 grid gap-3" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={`rounded-2xl p-3 ${m.role === "user" ? "ml-8 bg-brand text-brand-ink" : "mr-8 card"}`}>
            <p className="whitespace-pre-wrap">{m.content}</p>
            {m.hits && m.hits.length > 0 && (
              <ul className="mt-2 grid gap-2">
                {m.hits.map((h) => (
                  <li key={h.key}>
                    <Link href={h.href} className="block rounded-lg bg-bg p-2 text-sm no-underline">
                      <span className="font-bold">{h.title}</span> <span className="text-xs text-muted">{h.where}</span>
                      <span className="block text-muted">{h.snippet}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {busy && <p className="text-muted">Thinking…</p>}
        <div ref={endRef} />
      </div>

      <form className="sticky bottom-16 mt-4 flex gap-2 bg-bg py-2 sm:bottom-0" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
        <label className="sr-only" htmlFor="q">Your question</label>
        <input id="q" className="input" value={input} maxLength={1200} onChange={(e) => setInput(e.target.value)} placeholder="Type your question…" />
        <button className="btn" disabled={busy || !input.trim()}>Ask</button>
      </form>
      <p className="text-xs text-muted">AI can make mistakes. Check important answers with your teacher or textbook.</p>
    </div>
  );
}
