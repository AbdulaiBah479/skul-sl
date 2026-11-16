export type LevelId = "primary" | "jss" | "sss" | "tech" | "uni";

export interface Question {
  q: string;
  options: string[];
  answer: number; // index into options
  why: string; // short explanation shown after answering
}

export interface Topic {
  id: string;
  title: string;
  lesson: string[]; // paragraphs; lines starting with "- " render as bullets, "## " as a heading
  questions: Question[];
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
