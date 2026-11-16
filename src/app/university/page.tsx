import Link from "next/link";
import { RESOURCES, SCHOLARSHIPS } from "@/lib/resources";

export const metadata = { title: "University hub" };

export default function University() {
  const uni = RESOURCES.filter((r) => r.tags.includes("university") || r.tags.includes("research"));
  return (
    <div>
      <h1 className="text-2xl font-extrabold">🏛️ University & college hub</h1>
      <p className="text-muted">Everything free for degree and HND students.</p>

      <h2 className="mt-5 mb-2 text-lg font-bold">Study & calculators</h2>
      <ul className="grid grid-cols-2 gap-3 text-sm">
        {[
          ["/learn/uni", "📚", "First-year foundations"],
          ["/tools/gpa", "🎓", "GPA & CGPA"],
          ["/tools/target", "📈", "Score I need"],
          ["/tools/planner", "🗓️", "Exam planner"],
          ["/flashcards", "🃏", "Flashcards"],
          ["/tutor", "🤖", "AI tutor"],
        ].map(([href, icon, title]) => (
          <li key={href}><Link href={href} className="card flex items-center gap-2 p-3 font-semibold no-underline hover:border-brand"><span aria-hidden className="text-xl">{icon}</span>{title}</Link></li>
        ))}
      </ul>

      <h2 className="mt-6 mb-2 text-lg font-bold">Free textbooks, courses & research</h2>
      <ul className="grid gap-3">
        {uni.map((r) => (
          <li key={r.url} className="card p-3">
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-bold text-accent">{r.name} ↗</a>
            <p className="text-sm text-muted">{r.what}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-6 mb-2 text-lg font-bold">Scholarships to explore</h2>
      <p className="mb-2 text-sm text-muted">Always check each official site for current eligibility and deadlines, and beware of anyone who asks you to pay to apply.</p>
      <ul className="grid gap-3">
        {SCHOLARSHIPS.map((s) => (
          <li key={s.url} className="card p-3">
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-bold text-accent">{s.name} ↗</a>
            <p className="text-sm text-muted">{s.what}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-6 mb-2 text-lg font-bold">Writing a research project: 8 steps</h2>
      <ol className="card list-decimal space-y-1 p-4 pl-8 text-sm">
        <li>Pick a topic you can finish in the time you have.</li>
        <li>Turn it into a clear research question.</li>
        <li>Search Google Scholar, DOAJ and your library (Research4Life) for sources.</li>
        <li>Save every source in Zotero as you go.</li>
        <li>Choose a method: survey, interviews, experiment or document review.</li>
        <li>Get permission and consent where people are involved.</li>
        <li>Write a little every day; revise later.</li>
        <li>Check your references, then give your supervisor an early draft.</li>
      </ol>
    </div>
  );
}
