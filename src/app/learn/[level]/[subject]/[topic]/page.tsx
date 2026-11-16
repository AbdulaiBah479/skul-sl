import Link from "next/link";
import { notFound } from "next/navigation";
import { allTopicParams, extraFor, relatedTopics, resolveTopic } from "@/content/books";
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
  const extra = extraFor(level, subject, t.id);
  const related = relatedTopics(level, subject, t.id, t.title);
  const q = encodeURIComponent(t.title.replace(/^Introduction: /, ""));
  const links: [string, string][] = [
    ["Wikipedia", `https://en.wikipedia.org/w/index.php?search=${q}`],
    ["Khan Academy", `https://www.khanacademy.org/search?page_search_query=${q}`],
    ["Videos on YouTube", `https://www.youtube.com/results?search_query=${q}+explained`],
    ["Wikibooks", `https://en.wikibooks.org/w/index.php?search=${q}`],
    ...(level === "uni" || level === "sss" ? ([["Google Scholar", `https://scholar.google.com/scholar?q=${q}`]] as [string, string][]) : []),
    ...(book ? ([[`Full book: ${book.title}`, book.url]] as [string, string][]) : []),
  ];
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
      {extra && (
        <section className="mt-6" aria-labelledby="global">
          <h2 id="global" className="mb-2 text-xl font-bold">🌍 Global notes</h2>
          <p className="mb-2 text-xs text-muted">
            Extra reading from {extra.source}: <a href={extra.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent">{extra.title}</a>, shortened.
            Licensed <a href={extra.licenseUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent">{extra.license}</a>; authors are listed in the article history. Written for a worldwide audience, so some examples and spelling may differ from your syllabus. Wikipedia can contain mistakes, so check important facts.
          </p>
          <article className="card p-5">
            <Lesson lines={extra.lines} />
          </article>
        </section>
      )}

      <section className="mt-6" aria-labelledby="further">
        <h2 id="further" className="mb-2 text-xl font-bold">🔗 Go further (free)</h2>
        <ul className="flex flex-wrap gap-2">
          {links.map(([label, href]) => (
            <li key={label}><a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-sm no-underline">{label} ↗</a></li>
          ))}
        </ul>
        {related.length > 0 && (
          <>
            <h3 className="mt-4 mb-1 font-bold">Related lessons in Skul SL</h3>
            <ul className="grid gap-2">
              {related.map((r) => (
                <li key={r.href}><Link href={r.href} className="card block p-3 text-sm no-underline hover:border-brand"><span className="font-semibold">{r.title}</span> <span className="text-xs text-muted">{r.where}</span></Link></li>
              ))}
            </ul>
          </>
        )}
      </section>

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
