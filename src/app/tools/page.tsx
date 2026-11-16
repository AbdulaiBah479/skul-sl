import Link from "next/link";

export const metadata = { title: "Student tools" };

const TOOLS = [
  ["/tools/wassce", "🎯", "WASSCE / BECE grades", "Turn marks into grades, count credits and aggregate."],
  ["/tools/gpa", "🎓", "GPA & CGPA calculator", "For university. Edit the grade points to match your school."],
  ["/tools/target", "📈", "What score do I need?", "Find the mark you need in the rest of a course."],
  ["/tools/timer", "⏱️", "Study timer (Pomodoro)", "Focus blocks with breaks."],
  ["/tools/planner", "🗓️", "Exam countdown & planner", "Count the days and see how much to study."],
  ["/tools/calculator", "🧮", "Calculator", "Works offline, with brackets and powers."],
];

export default function Tools() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Student tools</h1>
      <ul className="mt-4 grid gap-3">
        {TOOLS.map(([href, icon, title, sub]) => (
          <li key={href}>
            <Link href={href} className="card flex items-center gap-3 p-4 no-underline hover:border-brand">
              <span className="text-3xl" aria-hidden>{icon}</span>
              <span>
                <span className="block font-bold">{title}</span>
                <span className="block text-sm text-muted">{sub}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
