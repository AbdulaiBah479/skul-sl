import Link from "next/link";
import { LEVELS } from "@/content";

export const metadata = { title: "Learn" };

export default function Learn() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Choose your level</h1>
      <p className="mt-1 text-muted">Free lessons and quizzes for every stage of school.</p>
      <ul className="mt-4 grid gap-3">
        {LEVELS.map((l) => (
          <li key={l.id}>
            <Link href={`/learn/${l.id}`} className="card flex items-center gap-4 p-4 no-underline hover:border-brand">
              <span className="text-4xl" aria-hidden>{l.emoji}</span>
              <span>
                <span className="block text-lg font-bold">{l.title}</span>
                <span className="block text-sm text-muted">{l.blurb}</span>
                <span className="mt-1 block text-xs font-semibold text-accent">{l.exam} · {l.subjects.length} subjects</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
