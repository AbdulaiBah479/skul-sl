// Spaced repetition (FSRS) for flashcards. Cards are saved as JSON on the device.
import { createEmptyCard, fsrs, generatorParameters, Rating, type Card, type Grade } from "ts-fsrs";

export type StoredCard = Omit<Card, "due" | "last_review"> & { due: string; last_review?: string };
export type ReviewGrade = "again" | "hard" | "good" | "easy";

const scheduler = fsrs(generatorParameters({ enable_fuzz: true }));
const GRADES: Record<ReviewGrade, Grade> = { again: Rating.Again, hard: Rating.Hard, good: Rating.Good, easy: Rating.Easy };

const ser = (c: Card): StoredCard => ({ ...c, due: c.due.toISOString(), last_review: c.last_review?.toISOString() });
const rev = (c: StoredCard): Card => ({ ...c, due: new Date(c.due), last_review: c.last_review ? new Date(c.last_review) : undefined });

export function newCard(now = new Date()): StoredCard {
  return ser(createEmptyCard(now));
}
export function review(card: StoredCard, grade: ReviewGrade, now = new Date()): StoredCard {
  return ser(scheduler.next(rev(card), now, GRADES[grade]).card);
}
export function isDue(card: StoredCard, now = new Date()): boolean {
  return new Date(card.due).getTime() <= now.getTime();
}
