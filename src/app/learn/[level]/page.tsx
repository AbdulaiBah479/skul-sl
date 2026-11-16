import Link from "next/link";
import { notFound } from "next/navigation";
import { LEVELS, getLevel, topicKey } from "@/content";
import { SubjectProgress } from "@/components/ProgressBadge";

export function generateStaticParams() {
  return LEVELS.map((l) => ({ level: l.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }) {
  const l = getLevel((await params).level);
  return { title: l?.title ?? "Level" };
}

export default async function LevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const l = getLevel(level);
  if (!l) notFound();
  return (
    <div>
      <p className="text-sm"><Link href="/learn">← All levels</Link></p>
      <h1 className="mt-1 text-2xl font-extrabold">{l.emoji} {l.title}</h1>
      <p className="text-muted">{l.blurb}</p>
      {l.id === "uni" && (
        <p className="mt-3 card p-3 text-sm">
          Also see the <Link href="/university" className="font-semibold text-accent">University hub</Link> for scholarships, free books and the CGPA calculator.
        </p>
      )}
      <ul className="mt-4 grid grid-cols-2 gap-3">
        {l.subjects.map((s) => (
          <li key={s.id}>
            <Link href={`/learn/${l.id}/${s.id}`} className="card block p-4 no-underline hover:border-brand">
              <span className="text-3xl" aria-hidden>{s.emoji}</span>
              <span className="mt-1 block font-bold">{s.title}</span>
              <span className="block text-xs text-muted">{s.topics.length} topics</span>
              <SubjectProgress keys={s.topics.map((t) => topicKey(l.id, s.id, t.id))} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
