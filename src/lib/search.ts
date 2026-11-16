import { allTopics } from "@/content";

export interface Hit {
  key: string;
  href: string;
  title: string;
  where: string;
  snippet: string;
  score: number;
}

const STOP = new Set("the a an and or of to in on is are was were what how why when which who for with from that this it as at by be do does".split(" "));

export function words(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

/** Simple offline search across every lesson and quiz explanation (no internet or AI needed). */
export function searchLessons(query: string, limit = 5): Hit[] {
  const qs = words(query);
  if (!qs.length) return [];
  const hits: Hit[] = [];
  for (const { level, subject, topic, key } of allTopics()) {
    const lines = [...topic.lesson, ...topic.questions.map((q) => `${q.q} ${q.why}`)];
    const hay = words(`${topic.title} ${lines.join(" ")}`);
    const set = new Set(hay);
    let score = 0;
    for (const w of qs) {
      if (set.has(w)) score += 1;
      if (words(topic.title).includes(w)) score += 3;
    }
    if (!score) continue;
    const best = lines.find((l) => qs.some((w) => l.toLowerCase().includes(w))) ?? topic.lesson[0];
    hits.push({
      key,
      href: `/learn/${level.id}/${subject.id}/${topic.id}`,
      title: topic.title,
      where: `${level.short} · ${subject.title}`,
      snippet: best.replace(/^(- |## )/, ""),
      score,
    });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
