"use client";
// Client helpers for the imported textbooks. The big question banks live in /qbank/*.json (not in the JS bundle) and are
// fetched on demand; the service worker keeps them for offline use after the first load.
import type { Question } from "@/content/types";

export interface BookIndexEntry {
  level: string;
  subject: string;
  title: string;
  topics: [string, string][]; // [topic id, title]
}
export type BookIndex = Record<string, BookIndexEntry>;

export type BankItem = { k: string; q: string; options: string[]; answer: number; why: string } | { k: string; card: { q: string; a: string } };

let indexP: Promise<BookIndex> | null = null;
export function fetchIndex(): Promise<BookIndex> {
  if (!indexP)
    indexP = fetch("/qbank/index.json")
      .then((r) => (r.ok ? (r.json() as Promise<BookIndex>) : Promise.reject(new Error("index " + r.status))))
      .catch(() => {
        indexP = null;
        return {} as BookIndex;
      });
  return indexP;
}

const banks = new Map<string, Promise<BankItem[]>>();
export function fetchBank(id: string): Promise<BankItem[]> {
  if (!banks.has(id))
    banks.set(
      id,
      fetch(`/qbank/${id}.json`)
        .then((r) => (r.ok ? (r.json() as Promise<BankItem[]>) : Promise.reject(new Error("bank " + r.status))))
        .catch(() => {
          banks.delete(id);
          return [] as BankItem[];
        })
    );
  return banks.get(id)!;
}

export const isMcq = (x: BankItem): x is Extract<BankItem, { options: string[] }> => "options" in x;

export function toQuestions(items: BankItem[]): Question[] {
  return items.filter(isMcq).map(({ q, options, answer, why }) => ({ q, options, answer, why }));
}

/** [bookId, entry] for every imported book at a level (and optionally one subject). */
export function booksFor(index: BookIndex, level: string, subject?: string) {
  return Object.entries(index).filter(([, e]) => e.level === level && (!subject || subject === "all" || e.subject === subject));
}
