import Link from "next/link";
import { notFound } from "next/navigation";
import { LEVELS, getLevel, getSubject, topicKey } from "@/content";
import { BestScore } from "@/components/ProgressBadge";

export function generateStaticParams() {
  return LEVELS.flatMap((l) => l.subjects.map((s) => ({ level: l.id, subject: s.id })));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ level: string; subject: string }> }) {
  const { level, subject } = await params;
  const s = getSubject(level, subject);
  return { title: s ? `${s.title} (${getLevel(level)?.short})` : "Subject" };
}

export default async function SubjectPage({ params }: { params: Promise<{ level: string; subject: string }> }) {
  const { level, subject } = await params;
  const l = getLevel(level);
  const s = getSubject(level, subject);
  if (!l || !s) notFound();
  return (
    <div>
      <p className="text-sm"><Link href={`/learn/${l.id}`}>← {l.title}</Link></p>
      <h1 className="mt-1 text-2xl font-extrabold">{s.emoji} {s.title}</h1>
      <ul className="mt-4 grid gap-3">
        {s.topics.map((t, i) => (
          <li key={t.id}>
            <Link href={`/learn/${l.id}/${s.id}/${t.id}`} className="card flex items-center justify-between gap-3 p-4 no-underline hover:border-brand">
              <span>
                <span className="text-xs text-muted">Topic {i + 1}</span>
                <span className="block font-bold">{t.title}</span>
              </span>
              <BestScore k={topicKey(l.id, s.id, t.id)} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
