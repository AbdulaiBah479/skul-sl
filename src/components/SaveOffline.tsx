"use client";
import { useEffect, useState } from "react";
import { LEVELS } from "@/content";
import { fetchIndex, type BookIndex } from "@/lib/bookindex";

const CORE = [
  "/", "/learn", "/practice", "/flashcards", "/tools", "/tools/wassce", "/tools/gpa", "/tools/target", "/tools/timer", "/tools/planner", "/tools/calculator",
  "/tutor", "/library", "/explore", "/university", "/more", "/progress", "/offline", "/credits", "/qbank/index.json",
];

/** Saves lessons for offline use. Textbook subjects are big (hundreds of pages), so the student picks what to save. */
export default function SaveOffline() {
  const [index, setIndex] = useState<BookIndex>({});
  const [choice, setChoice] = useState("essentials");
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  useEffect(() => { fetchIndex().then(setIndex); }, []);

  const books = Object.entries(index);
  const urlsFor = (c: string): string[] => {
    if (c === "essentials") {
      return [...CORE, ...LEVELS.flatMap((l) => [`/learn/${l.id}`, ...l.subjects.flatMap((s) => [`/learn/${l.id}/${s.id}`, ...s.topics.map((t) => `/learn/${l.id}/${s.id}/${t.id}`)])])];
    }
    const [id] = c.split("::");
    const e = index[id];
    if (!e) return [];
    return [`/learn/${e.level}/${e.subject}`, `/qbank/${id}.json`, ...e.topics.map(([t]) => `/learn/${e.level}/${e.subject}/${t}`)];
  };

  const run = async () => {
    const urls = urlsFor(choice);
    setState("busy");
    setDone(0);
    setTotal(urls.length);
    let failed = 0;
    let i = 0;
    const worker = async () => {
      while (i < urls.length) {
        const u = urls[i++];
        try {
          const r = await fetch(u);
          if (!r.ok) failed++;
        } catch {
          failed++;
        }
        setDone((d) => d + 1);
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
    setState(failed > urls.length / 2 ? "error" : "done");
  };

  return (
    <div className="card mt-3 p-4">
      <label className="block text-sm font-semibold">
        What to save
        <select className="input mt-1" value={choice} onChange={(e) => { setChoice(e.target.value); setState("idle"); }}>
          <option value="essentials">Essentials: all quick lessons and tools (small)</option>
          {books.map(([id, e]) => (
            <option key={id} value={id}>{e.title} — {e.topics.length} lessons</option>
          ))}
        </select>
      </label>
      <button className="btn mt-3" onClick={run} disabled={state === "busy"}>{state === "busy" ? "Saving…" : "Save for offline"}</button>
      {state !== "idle" && (
        <p className="mt-3" role="status">
          {state === "busy" && `Saved ${done} of ${total} pages…`}
          {state === "done" && `✅ Done. ${total} pages are ready for offline use.`}
          {state === "error" && "Could not save most pages. Check your connection and try again."}
        </p>
      )}
    </div>
  );
}
