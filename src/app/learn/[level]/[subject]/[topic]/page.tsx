import Link from "next/link";
import { notFound } from "next/navigation";
import { allTopicParams, resolveTopic } from "@/content/books";
import Lesson from "@/components/Lesson";
import Quiz from "@/components/Quiz";
import TopicActions from "@/components/TopicActions";

export function generateStaticParams() {
  return allTopicParams();
}
export const dynamicParams = false;

type P = { params: Promise<{ level: string; subject: string; topic: string }> };

export async function generateMetadata({ params }: P) {
  const { level, subject, topic } = await params;
  const r = resolveTopic(level, subject, topic);
  return { title: r ? r.topic.title : "Lesson" };
}

export default async function TopicPage({ params }: P) {
  const { level, subject, topic } = await params;
  const r = resolveTopic(level, subject, topic);
  if (!r) notFound();
  const { topic: t, book, subject: view } = r;
  const flat = view.groups.flatMap((g) => g.topics);
  const idx = flat.findIndex((x) => x.id === t.id);
  const prev = flat[idx - 1];
  const next = flat[idx + 1];
  const key = `${level}/${subject}/${t.id}`;
  const base = `/learn/${level}/${subject}`;
  return (
    <div>
      <p className="text-sm"><Link href={base}>← {view.subject.title}</Link></p>
      <h1 className="mt-1 text-2xl font-extrabold">{t.title}</h1>
      <article className="card mt-3 p-5">
        <Lesson lines={t.lesson} />
      </article>
      {book && (
        <p className="mt-2 text-xs text-muted">
          Adapted from <a href={book.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent">{book.title}</a> by {book.publisher}
          {book.authors ? ` (${book.authors})` : ""}, licensed under{" "}
          {book.license ? <a href={book.license.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent">{book.license.name}</a> : "an open licence"}.
          Images and some exercises were left out, and the text was reformatted for phones.
        </p>
      )}
      <TopicActions topicKey={key} title={t.title} />

      {t.selfCheck && t.selfCheck.length > 0 && (
        <section className="mt-6" aria-labelledby="self">
          <h2 id="self" className="mb-2 text-xl font-bold">Check yourself</h2>
          <ul className="grid gap-2">
            {t.selfCheck.map((s, i) => (
              <li key={i} className="card p-3">
                <details>
                  <summary className="cursor-pointer font-semibold">{s.q}</summary>
                  <p className="mt-2 rounded-lg bg-bg p-2 text-sm">{s.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </section>
      )}

      {t.questions.length > 0 ? (
        <>
          <h2 className="mt-6 mb-2 text-xl font-bold">Quiz</h2>
          <Quiz questions={t.questions} scoreKey={key} />
        </>
      ) : (
        <p className="mt-6 text-sm text-muted">No quiz for this topic yet. Try the Check yourself questions, make flashcards, or ask the AI tutor.</p>
      )}

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Topic navigation">
        {prev && <Link href={`${base}/${prev.id}`} className="btn btn-ghost no-underline">← {prev.title}</Link>}
        {next && <Link href={`${base}/${next.id}`} className="btn no-underline">Next: {next.title} →</Link>}
      </nav>
    </div>
  );
}
