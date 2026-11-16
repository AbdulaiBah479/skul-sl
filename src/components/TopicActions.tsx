"use client";
import { useEffect, useState } from "react";
import { saveNote, useProgress } from "@/lib/store";

/** Read aloud (the phone's own voice, works offline) and a private note for the topic. */
export default function TopicActions({ topicKey, title }: { topicKey: string; title: string }) {
  const p = useProgress();
  const [speaking, setSpeaking] = useState(false);
  // Decided after mount: the server cannot know whether this browser can speak, and guessing causes a hydration mismatch.
  const [canSpeak, setCanSpeak] = useState(false);
  useEffect(() => setCanSpeak("speechSynthesis" in window), []);

  const toggle = () => {
    if (!canSpeak) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = document.querySelector("article")?.textContent ?? title;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-GB";
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="mt-3 grid gap-3">
      {canSpeak && (
        <button className="btn btn-ghost w-fit" onClick={toggle} aria-pressed={speaking}>
          {speaking ? "⏹ Stop reading" : "🔊 Read this lesson aloud"}
        </button>
      )}
      <label className="block text-sm font-semibold">
        My notes (saved on this phone)
        <textarea
          key={topicKey}
          defaultValue={p.notes[topicKey] ?? ""}
          onBlur={(e) => saveNote(topicKey, e.target.value)}
          rows={3}
          className="input mt-1"
          placeholder="Write what you want to remember…"
        />
      </label>
    </div>
  );
}
