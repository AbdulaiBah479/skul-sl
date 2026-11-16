"use client";
import { useState } from "react";
import { allTopics, LEVELS } from "@/content";

/** Fetches every lesson page once so the service worker saves them. Runs 4 at a time to be gentle on slow connections. */
export default function SaveOffline() {
  const [done, setDone] = useState(0);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  const urls = [
    "/", "/learn", "/practice", "/flashcards", "/tools", "/tools/wassce", "/tools/gpa", "/tools/target", "/tools/timer", "/tools/planner", "/tools/calculator",
    "/tutor", "/library", "/explore", "/university", "/more", "/progress", "/offline",
    ...LEVELS.flatMap((l) => [`/learn/${l.id}`, ...l.subjects.map((s) => `/learn/${l.id}/${s.id}`)]),
    ...allTopics().map((x) => `/learn/${x.level.id}/${x.subject.id}/${x.topic.id}`),
  ];

  const run = async () => {
    setState("busy");
    setDone(0);
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
      <button className="btn" onClick={run} disabled={state === "busy"}>{state === "busy" ? "Saving…" : "Save everything for offline"}</button>
      {state !== "idle" && (
        <p className="mt-3" role="status">
          {state === "busy" && `Saved ${done} of ${urls.length} pages…`}
          {state === "done" && `✅ Done. ${urls.length} pages are ready for offline use.`}
          {state === "error" && "Could not save most pages. Check your connection and try again."}
        </p>
      )}
    </div>
  );
}
