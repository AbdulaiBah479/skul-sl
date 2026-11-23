import Link from "next/link";
import { LEVELS } from "@/content";
import { levelSubjects, subjectView, totals } from "@/content/books";
import { ContinueCard, DailyQuestion, StatsRow, type DailyQ } from "@/components/HomeParts";
import Icon from "@/components/Icon";

// A fixed pool of 60 hand-written questions (spread over every level); the browser picks today's.
function dailyPool(): DailyQ[] {
  const all: DailyQ[] = LEVELS.flatMap((l) =>
    l.subjects.flatMap((s) => s.topics.flatMap((t) => t.questions.map((q) => ({ q: q.q, options: q.options, answer: q.answer, why: q.why, from: `${l.short} · ${s.title}` }))))
  );
  const step = Math.max(1, Math.floor(all.length / 60));
  return all.filter((_, i) => i % step === 0).slice(0, 60);
}

const SHORTCUTS: [string, string, string, string][] = [
  ["/practice", "practice", "Exam practice", "Timed mixed questions"],
  ["/flashcards", "star", "Flashcards", "Spaced repetition"],
  ["/tutor", "tutor", "AI tutor", "Ask anything"],
  ["/courses", "learn", "Free courses", "30,000 and counting"],
  ["/tools/wassce", "check", "WASSCE grades", "Marks to grades"],
  ["/tools/gpa", "tools", "CGPA calculator", "For university"],
  ["/library", "learn", "Free library", "Sites, books, repos"],
  ["/university", "star", "University hub", "Scholarships, skills"],
];

export default function Home() {
  const t = totals();
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <section className="hero p-5 sm:p-7">
        <p className="text-sm font-semibold opacity-90">🇸🇱 Free for every student in Sierra Leone</p>
        <h1 className="mt-1 text-[1.75rem] font-extrabold leading-tight sm:text-4xl">Learn anything. Pass your exams. No fees.</h1>
        <p className="mt-2 max-w-xl opacity-95">
          Lessons, quizzes, past-style practice, study tools and an AI tutor, from Primary to University. Works offline once you open a lesson.
        </p>
        <form action="/search" method="get" role="search" className="relative mt-4 max-w-xl">
          <label htmlFor="home-q" className="sr-only">Search lessons, courses and resources</label>
          <input id="home-q" name="q" type="search" placeholder="Search “photosynthesis”, “calculus”, “WASSCE”…" className="input !min-h-[52px] !rounded-2xl !border-transparent pl-11 !text-[#14231a] placeholder:!text-[#52625a] !bg-white" autoComplete="off" />
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52625a]"><Icon name="search" /></span>
        </form>
      </section>

      <ContinueCard />

      <section aria-labelledby="levels-h">
        <h2 id="levels-h" className="mb-2 text-lg font-bold">Choose your level</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {LEVELS.map((l) => {
            const n = levelSubjects(l.id).reduce((a, s) => a + (subjectView(l.id, s.id)?.topicCount ?? 0), 0);
            return (
              <li key={l.id} className={l.id === "uni" ? "col-span-2 sm:col-span-1" : ""}>
                <Link href={`/learn/${l.id}`} className={`lvl lvl-${l.id} block h-full p-4 no-underline transition-transform hover:-translate-y-0.5`}>
                  <span className="text-3xl" aria-hidden>{l.emoji}</span>
                  <span className="mt-2 block text-lg font-extrabold leading-tight">{l.short}</span>
                  <span className="block text-sm opacity-95">{l.exam}</span>
                  <span className="mt-2 block text-xs opacity-95">{n.toLocaleString()} topics</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <DailyQuestion pool={dailyPool()} />
      <StatsRow />

      <section aria-labelledby="quick-h">
        <h2 id="quick-h" className="mb-2 text-lg font-bold">Quick links</h2>
        <ul className="grid grid-cols-2 gap-3">
          {SHORTCUTS.map(([href, icon, title, sub]) => (
            <li key={href}>
              <Link href={href} className="card flex h-full items-center gap-3 p-3 no-underline">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-soft text-brand"><Icon name={icon} /></span>
                <span className="min-w-0">
                  <span className="block truncate font-bold">{title}</span>
                  <span className="block truncate text-xs text-muted">{sub}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-xs text-muted">
        {t.topics.toLocaleString()} topics · {t.questions.toLocaleString()} practice questions · {t.books} open textbooks · all free.
        <br />Content is for revision. Always check your teacher’s notes and the official syllabus.
      </p>
    </div>
  );
}
