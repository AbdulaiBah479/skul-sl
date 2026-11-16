"use client";
import { useSyncExternalStore } from "react";

// All progress lives on the student's own device (localStorage): no account, no cost, works offline.
export interface Progress {
  best: Record<string, number>; // topicKey -> best score percent
  attempts: Record<string, number>;
  days: string[]; // YYYY-MM-DD days with activity (for the streak)
  cards: Record<string, string>; // flashcard id -> serialized FSRS card
  notes: Record<string, string>;
}

const KEY = "skul-sl-progress-v1";
const EMPTY: Progress = { best: {}, attempts: {}, days: [], cards: {}, notes: {} };
let cache: Progress | null = null;
const listeners = new Set<() => void>();

function read(): Progress {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache!;
}
function write(next: Progress) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked: keep working in memory */
  }
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function today(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function markActive() {
  const p = read();
  const t = today();
  if (!p.days.includes(t)) write({ ...p, days: [...p.days, t].slice(-400) });
}

export function recordScore(key: string, percent: number) {
  const p = read();
  write({
    ...p,
    best: { ...p.best, [key]: Math.max(p.best[key] ?? 0, percent) },
    attempts: { ...p.attempts, [key]: (p.attempts[key] ?? 0) + 1 },
    days: p.days.includes(today()) ? p.days : [...p.days, today()].slice(-400),
  });
}

export function saveCard(id: string, serialized: string) {
  const p = read();
  write({ ...p, cards: { ...p.cards, [id]: serialized } });
}

export function saveNote(key: string, text: string) {
  const p = read();
  write({ ...p, notes: { ...p.notes, [key]: text } });
}

export function resetAll() {
  write({ ...EMPTY });
}

/** Consecutive days of activity ending today (or yesterday, so the streak is not lost until a day is fully missed). */
export function streak(days: string[], now = new Date()): number {
  const set = new Set(days);
  const d = new Date(now);
  if (!set.has(today(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(today(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
