import Link from "next/link";
import { LEVELS } from "@/content";
import { bookTopic, levelSubjects, subjectView } from "@/content/books";

export const metadata = { title: "What is covered" };

export default function Curriculum() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold">What is covered</h1>
      <p className="text-muted">
        An honest map of what each level contains today. Subjects with a textbook have full chapter-by-chapter coverage; the others have short revision lessons only. This is not an official syllabus: always check with your teacher and the examination body.
      </p>
      {LEVELS.map((l) => (
        <section key={l.id} className="mt-6" aria-labelledby={`l-${l.id}`}>
          <h2 id={`l-${l.id}`} className="text-lg font-bold">{l.emoji} {l.title}</h2>
          <div className="card mt-2 overflow-x-auto p-3">
            <table className="w-full text-left text-sm">
              <thead><tr><th className="pr-2">Subject</th><th className="pr-2">Topics</th><th className="pr-2">Questions</th><th>Depth</th></tr></thead>
              <tbody>
                {levelSubjects(l.id).map((s) => {
                  const v = subjectView(l.id, s.id)!;
                  const qs = (s.hand?.topics.reduce((n, t) => n + t.questions.length, 0) ?? 0) + s.books.reduce((n, b) => n + b.chapters.reduce((m, c) => m + c.topics.reduce((k, t) => k + (bookTopic(b.id, t.id)?.questions.length ?? 0), 0), 0), 0);
                  return (
                    <tr key={s.id} className="border-t border-line align-top">
                      <td className="py-1 pr-2"><Link href={`/learn/${l.id}/${s.id}`} className="font-semibold text-accent">{s.emoji} {s.title}</Link></td>
                      <td className="pr-2">{v.topicCount}</td>
                      <td className="pr-2">{qs}</td>
                      <td>{s.books.length ? `Full textbook (${s.books.map((b) => b.title).join(", ")})` : "Short revision lessons"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      <p className="mt-6 text-sm text-muted">Primary school has no open textbook available, so it has short revision lessons for now.</p>
    </div>
  );
}
