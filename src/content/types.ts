export type LevelId = "primary" | "jss" | "sss" | "tech" | "uni";

export interface Question {
  q: string;
  options: string[];
  answer: number; // index into options
  why: string; // short explanation shown after answering
}

/** An open-ended question with a model answer (shown on tap). Used for textbook exercises. */
export interface SelfCheck {
  q: string;
  a: string;
}

export interface Topic {
  id: string;
  title: string;
  lesson: string[]; // paragraphs; "- " bullet, "## " heading, "### " sub-heading
  questions: Question[];
  selfCheck?: SelfCheck[];
}

export interface Subject {
  id: string;
  title: string;
  emoji: string;
  topics: Topic[];
}

export interface Level {
  id: LevelId;
  title: string;
  short: string;
  exam: string;
  blurb: string;
  emoji: string;
  subjects: Subject[];
}

/** An imported open textbook (see scripts/import-openstax.mjs). */
export interface BookToc {
  id: string;
  title: string;
  level: LevelId;
  subject: string;
  subjectTitle: string;
  emoji: string;
  url: string;
  authors: string;
  publisher: string;
  license: { name: string; url: string } | null;
  chapters: { unit: string | null; title: string; topics: { id: string; title: string }[] }[];
}
