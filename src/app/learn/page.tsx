import Link from "next/link";
import { LEVELS } from "@/content";
import { levelSubjects, subjectView } from "@/content/books";
import Icon from "@/components/Icon";

export const metadata = { title: "Learn" };

export default function Learn() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold sm:text-3xl">Choose your level</h1>
      <p className="mt-1 text-muted">Free lessons and quizzes for every stage of school.</p>
      <ul className="mt-4 grid gap-3">
        {LEVELS.map((l) => {
          const subs = levelSubjects(l.id);
          const topics = subs.reduce((a, s) => a + (subjectView(l.id, s.id)?.topicCount ?? 0), 0);
          return (
            <li key={l.id}>
              <Link href={`/learn/${l.id}`} className={`lvl lvl-${l.id} flex items-center gap-4 p-4 no-underline transition-transform hover:-translate-y-0.5`}>
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20 text-3xl" aria-hidden>{l.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-extrabold leading-tight">{l.title}</span>
                  <span className="block text-sm opacity-95">{l.blurb}</span>
                  <span className="mt-1 block text-xs font-semibold opacity-95">{l.exam} · {subs.length} subjects · {topics.toLocaleString()} topics</span>
                </span>
                <Icon name="arrow" className="shrink-0 opacity-90" />
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-sm text-muted">Looking for something specific? <Link href="/search" className="font-semibold text-accent">Search everything</Link> or browse <Link href="/courses" className="font-semibold text-accent">free courses</Link>.</p>
    </div>
  );
}
