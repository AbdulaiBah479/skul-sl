import Link from "next/link";
import { notFound } from "next/navigation";
import { allTopics, getLevel, getSubject, getTopic, topicKey } from "@/content";
import Lesson from "@/components/Lesson";
import Quiz from "@/components/Quiz";
import TopicActions from "@/components/TopicActions";

export function generateStaticParams() {
  return allTopics().map((x) => ({ level: x.level.id, subject: x.subject.id, topic: x.topic.id }));
}
export const dynamicParams = false;

type P = { params: Promise<{ level: string; subject: string; topic: string }> };

export async function generateMetadata({ params }: P) {
  const { level, subject, topic } = await params;
  const t = getTopic(level, subject, topic);
  return { title: t ? t.title : "Lesson" };
}

export default async function TopicPage({ params }: P) {
  const { level, subject, topic } = await params;
  const l = getLevel(level);
  const s = getSubject(level, subject);
  const t = getTopic(level, subject, topic);
  if (!l || !s || !t) notFound();
  const idx = s.topics.findIndex((x) => x.id === t.id);
  const next = s.topics[idx + 1];
  const key = topicKey(l.id, s.id, t.id);
  return (
    <div>
      <p className="text-sm"><Link href={`/learn/${l.id}/${s.id}`}>← {s.title}</Link></p>
      <h1 className="mt-1 text-2xl font-extrabold">{t.title}</h1>
      <article className="card mt-3 p-5">
        <Lesson lines={t.lesson} />
      </article>
      <TopicActions topicKey={key} title={t.title} />
      <h2 className="mt-6 mb-2 text-xl font-bold">Check what you learned</h2>
      <Quiz questions={t.questions} scoreKey={key} />
      {next && (
        <p className="mt-5">
          <Link href={`/learn/${l.id}/${s.id}/${next.id}`} className="btn no-underline">Next topic: {next.title} →</Link>
        </p>
      )}
    </div>
  );
}
