import Link from "next/link";
import { notFound } from "next/navigation";
import { LEVELS, getLevel } from "@/content";
import { levelSubjects } from "@/content/books";

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
  const subjects = levelSubjects(l.id);
  return (
    <div>
      <p className="text-sm"><Link href="/learn">← All levels</Link></p>
      <header className={`lvl lvl-${l.id} mt-2 p-5`}>
        <p className="text-3xl" aria-hidden>{l.emoji}</p>
        <h1 className="mt-1 text-2xl font-extrabold leading-tight">{l.title}</h1>
        <p className="opacity-95">{l.blurb}</p>
        <p className="mt-1 text-xs font-semibold opacity-95">{l.exam}</p>
      </header>
      <p className="text-muted">{l.blurb}</p>
      {l.id === "uni" && (
        <p className="mt-3 card p-3 text-sm">
          Also see the <Link href="/university" className="font-semibold text-accent">University hub</Link> for scholarships, free books and the CGPA calculator.
        </p>
      )}
      <ul className="mt-4 grid grid-cols-2 gap-3">
        {subjects.map((s) => {
          const n = (s.hand?.topics.length ?? 0) + s.books.reduce((a, b) => a + b.chapters.reduce((m, c) => m + c.topics.length, 0), 0);
          return (
            <li key={s.id}>
              <Link href={`/learn/${l.id}/${s.id}`} className="card block h-full p-4 no-underline hover:border-brand">
                <span className="text-3xl" aria-hidden>{s.emoji}</span>
                <span className="mt-1 block font-bold">{s.title}</span>
                <span className="block text-xs text-muted">{n} topics{s.books.length ? " · with open textbook" : ""}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
