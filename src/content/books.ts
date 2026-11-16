// SERVER-ONLY: reads imported textbook JSON from disk at build time. Never import this from a client component
// (the textbooks are large, so the browser fetches question banks from /qbank/*.json on demand instead).
import fs from "node:fs";
import path from "node:path";
import { LEVELS, getLevel, getSubject } from "./index";
import type { BookToc, Level, Subject, Topic } from "./types";

const DIR = path.join(process.cwd(), "src", "content", "books");

let cache: BookToc[] | null = null;
export function books(): BookToc[] {
  if (cache) return cache;
  if (!fs.existsSync(DIR)) return (cache = []);
  cache = fs
    .readdirSync(DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(DIR, d.name, "toc.json")))
    .map((d) => JSON.parse(fs.readFileSync(path.join(DIR, d.name, "toc.json"), "utf8")) as BookToc)
    .sort((a, b) => a.id.localeCompare(b.id));
  return cache;
}

export function bookTopic(bookId: string, topicId: string): Topic | null {
  if (!/^[a-z0-9-]+$/.test(bookId) || !/^[a-z0-9-]+$/.test(topicId)) return null;
  const f = path.join(DIR, bookId, "t", topicId + ".json");
  return fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, "utf8")) as Topic) : null;
}

export interface TopicRef {
  id: string;
  title: string;
  book?: string;
}
export interface Group {
  unit: string | null;
  title: string;
  book?: string;
  topics: TopicRef[];
}
export interface SubjectView {
  level: Level;
  subject: { id: string; title: string; emoji: string };
  groups: Group[];
  books: BookToc[];
  topicCount: number;
}

/** Every subject at a level: the hand-written ones plus any subject that comes only from a textbook. */
export function levelSubjects(levelId: string): { id: string; title: string; emoji: string; hand: Subject | null; books: BookToc[] }[] {
  const level = getLevel(levelId);
  if (!level) return [];
  const out = level.subjects.map((s) => ({ id: s.id, title: s.title, emoji: s.emoji, hand: s as Subject | null, books: [] as BookToc[] }));
  for (const b of books().filter((x) => x.level === levelId)) {
    let e = out.find((o) => o.id === b.subject);
    if (!e) {
      e = { id: b.subject, title: b.subjectTitle, emoji: b.emoji, hand: null, books: [] };
      out.push(e);
    }
    e.books.push(b);
  }
  return out;
}

export function subjectView(levelId: string, subjectId: string): SubjectView | null {
  const level = getLevel(levelId);
  const s = levelSubjects(levelId).find((x) => x.id === subjectId);
  if (!level || !s) return null;
  const groups: Group[] = [];
  if (s.hand) groups.push({ unit: null, title: "Exam essentials", topics: s.hand.topics.map((t) => ({ id: t.id, title: t.title })) });
  for (const b of s.books)
    for (const c of b.chapters) groups.push({ unit: c.unit && c.unit !== c.title ? c.unit : null, title: c.title, book: b.id, topics: c.topics.map((t) => ({ id: t.id, title: t.title, book: b.id })) });
  return { level, subject: { id: s.id, title: s.title, emoji: s.emoji }, groups, books: s.books, topicCount: groups.reduce((n, g) => n + g.topics.length, 0) };
}

export function resolveTopic(levelId: string, subjectId: string, topicId: string): { topic: Topic; book: BookToc | null; subject: SubjectView } | null {
  const view = subjectView(levelId, subjectId);
  if (!view) return null;
  const hand = getSubject(levelId, subjectId)?.topics.find((t) => t.id === topicId);
  if (hand) return { topic: hand, book: null, subject: view };
  for (const b of view.books) {
    if (b.chapters.some((c) => c.topics.some((t) => t.id === topicId))) {
      const t = bookTopic(b.id, topicId);
      if (t) return { topic: t, book: b, subject: view };
    }
  }
  return null;
}

export function allTopicParams() {
  const out: { level: string; subject: string; topic: string }[] = [];
  for (const l of LEVELS)
    for (const s of levelSubjects(l.id)) {
      const v = subjectView(l.id, s.id)!;
      for (const g of v.groups) for (const t of g.topics) out.push({ level: l.id, subject: s.id, topic: t.id });
    }
  return out;
}

export function totals() {
  let topics = 0;
  let questions = 0;
  for (const l of LEVELS)
    for (const s of l.subjects) {
      topics += s.topics.length;
      questions += s.topics.reduce((n, t) => n + t.questions.length, 0);
    }
  for (const b of books()) {
    for (const c of b.chapters) {
      topics += c.topics.length;
      for (const t of c.topics) questions += bookTopic(b.id, t.id)?.questions.length ?? 0;
    }
  }
  return { topics, questions, books: books().length };
}
