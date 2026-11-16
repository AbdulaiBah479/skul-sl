import Link from "next/link";

export const metadata = { title: "More" };

const ITEMS = [
  ["/progress", "📊", "My progress", "Streak, scores and notes"],
  ["/curriculum", "🗺️", "What is covered", "Topics and depth for every subject"],
  ["/flashcards", "🃏", "Flashcards", "Spaced repetition"],
  ["/explore", "🔎", "Explore", "Wikipedia, dictionary, books"],
  ["/library", "📖", "Free library", "Courses, books, GitHub repos and APIs"],
  ["/trivia", "🧩", "Trivia challenge", "General knowledge from a free API"],
  ["/university", "🏛️", "University hub", "Scholarships and research skills"],
  ["/install", "📲", "Install & use offline", "Add Skul SL to your phone"],
  ["/credits", "📚", "Credits and licences", "Open textbooks used in this app"],
  ["/about", "ℹ️", "About & privacy", "How this app works"],
];

export default function More() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold">More</h1>
      <ul className="mt-4 grid gap-3">
        {ITEMS.map(([href, icon, title, sub]) => (
          <li key={href}>
            <Link href={href} className="card flex items-center gap-3 p-4 no-underline hover:border-brand">
              <span className="text-3xl" aria-hidden>{icon}</span>
              <span><span className="block font-bold">{title}</span><span className="block text-sm text-muted">{sub}</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
