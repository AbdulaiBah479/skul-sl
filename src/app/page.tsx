import Link from "next/link";
import { LEVELS } from "@/content";
import { totals } from "@/content/books";
import HomeStats from "@/components/HomeStats";

export default function Home() {
  const t = totals();
  return (
    <div>
      <section className="card p-5">
        <h1 className="text-2xl font-extrabold leading-tight">Free learning for every student in Sierra Leone 🇸🇱</h1>
        <p className="mt-2 text-muted">
          Lessons, quizzes, exam practice, study tools and an AI tutor — from Primary to University. No account, no fees. Pages you open keep working with no internet.
        </p>
        <HomeStats />
      </section>

      <h2 className="mt-6 mb-2 text-lg font-bold">Start learning</h2>
      <ul className="grid grid-cols-2 gap-3">
        {LEVELS.map((l) => (
          <li key={l.id}>
            <Link href={`/learn/${l.id}`} className="card block h-full p-4 no-underline hover:border-brand">
              <span className="text-3xl" aria-hidden>{l.emoji}</span>
              <span className="mt-1 block font-bold">{l.short}</span>
              <span className="block text-xs text-muted">{l.exam}</span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-6 mb-2 text-lg font-bold">Quick links</h2>
      <ul className="grid grid-cols-2 gap-3 text-sm">
        {[
          ["/practice", "📝", "Exam practice", "Timed mixed questions"],
          ["/flashcards", "🃏", "Flashcards", "Spaced repetition"],
          ["/tutor", "🤖", "AI tutor", "Ask any question"],
          ["/tools/wassce", "🎯", "WASSCE calculator", "Grades and aggregate"],
          ["/tools/gpa", "🎓", "CGPA calculator", "For university"],
          ["/explore", "🔎", "Explore", "Wikipedia and dictionary"],
          ["/library", "📖", "Free library", "Books, videos, courses"],
          ["/university", "🏛️", "University hub", "Scholarships and skills"],
        ].map(([href, icon, title, sub]) => (
          <li key={href}>
            <Link href={href} className="card flex h-full items-start gap-2 p-3 no-underline hover:border-brand">
              <span aria-hidden className="text-2xl">{icon}</span>
              <span>
                <span className="block font-bold">{title}</span>
                <span className="block text-xs text-muted">{sub}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center text-xs text-muted">
        {t.topics.toLocaleString()} topics · {t.questions.toLocaleString()} practice questions · {t.books} open textbooks · all free.
        Content is written for revision. Always check your teacher’s notes and the official syllabus.
      </p>
    </div>
  );
}
