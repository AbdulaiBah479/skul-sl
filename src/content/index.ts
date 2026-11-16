import type { Level, LevelId, Subject, Topic } from "./types";
import { primary } from "./primary";
import { jss } from "./jss";
import { sss } from "./sss";
import { tech } from "./tech";
import { uni } from "./uni";

export const LEVELS: Level[] = [primary, jss, sss, tech, uni];

export function getLevel(id: string): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}
export function getSubject(levelId: string, subjectId: string): Subject | undefined {
  return getLevel(levelId)?.subjects.find((s) => s.id === subjectId);
}
export function getTopic(levelId: string, subjectId: string, topicId: string): Topic | undefined {
  return getSubject(levelId, subjectId)?.topics.find((t) => t.id === topicId);
}
export function topicKey(levelId: LevelId | string, subjectId: string, topicId: string) {
  return `${levelId}/${subjectId}/${topicId}`;
}
export function allTopics() {
  return LEVELS.flatMap((l) =>
    l.subjects.flatMap((s) => s.topics.map((t) => ({ level: l, subject: s, topic: t, key: topicKey(l.id, s.id, t.id) })))
  );
}
export function countQuestions() {
  return allTopics().reduce((n, x) => n + x.topic.questions.length, 0);
}
