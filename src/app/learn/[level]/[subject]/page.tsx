import Link from "next/link";
import { notFound } from "next/navigation";
import { LEVELS } from "@/content";
import { levelSubjects, subjectView } from "@/content/books";
import { BestScore } from "@/components/ProgressBadge";

export function generateStaticParams() {
  return LEVELS.flatMap((l) => levelSubjects(l.id).map((s) => ({ level: l.id, subject: s.id })));
}
export const dynamicParams = false;

type P = { params: Promise<{ level: string; subject: string }> };

export async function generateMetadata({ params }: P) {
  const { level, subject } = await params;
  const v = subjectView(level, subject);
  return { title: v ? `${v.subject.title} (${v.level.short})` : "Subject" };
}

export default async function SubjectPage({ params }: P) {
  const { level, subject } = await params;
  const v = subjectView(level, subject);
  if (!v) notFound();
  let lastUnit: string | null = null;
  return (
    <div>
      <p className="text-sm"><Link href={`/learn/${v.level.id}`}>← {v.level.title}</Link></p>
      <h1 className="mt-1 text-2xl font-extrabold">{v.subject.emoji} {v.subject.title}</h1>
      <p className="text-sm text-muted">{v.topicCount} topics</p>
      {v.books.length > 0 && (
        <p className="card mt-3 p-3 text-xs text-muted">
          Includes lessons adapted from the free textbook{v.books.length > 1 ? "s" : ""}{" "}
          {v.books.map((b, i) => <span key={b.id}>{i ? ", " : ""}<a href={b.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent">{b.title}</a></span>)}{" "}
          by OpenStax. See <Link href="/credits" className="font-semibold text-accent">credits and licences</Link>.
        </p>
      )}
      {v.groups.map((g, gi) => {
        const unitHeading = g.unit && g.unit !== lastUnit ? g.unit : null;
        if (g.unit) lastUnit = g.unit;
        return (
          <section key={gi} className="mt-5" aria-label={g.title}>
            {unitHeading && <p className="mb-1 text-sm font-bold uppercase tracking-wide text-accent">{unitHeading}</p>}
            <h2 className="mb-2 text-lg font-bold">{g.title}</h2>
            <ul className="grid gap-2">
              {g.topics.map((t) => (
                <li key={t.id}>
                  <Link href={`/learn/${v.level.id}/${v.subject.id}/${t.id}`} className="card flex items-center justify-between gap-3 p-3 no-underline hover:border-brand">
                    <span className="font-semibold">{t.title}</span>
                    <BestScore k={`${v.level.id}/${v.subject.id}/${t.id}`} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
