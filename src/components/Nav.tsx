"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/learn", label: "Learn", icon: "📚" },
  { href: "/practice", label: "Practice", icon: "📝" },
  { href: "/tools", label: "Tools", icon: "🧰" },
  { href: "/tutor", label: "Tutor", icon: "🤖" },
  { href: "/more", label: "More", icon: "➕" },
];

export default function Nav() {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-lg no-underline">
            <span aria-hidden>🇸🇱</span> Skul SL
          </Link>
          <nav aria-label="Main" className="hidden gap-1 sm:flex">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active(t.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-semibold no-underline ${active(t.href) ? "bg-brand text-brand-ink" : "hover:bg-card"}`}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg sm:hidden">
        <ul className="mx-auto grid max-w-3xl grid-cols-6">
          {TABS.map((t) => (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={active(t.href) ? "page" : undefined}
                className={`flex flex-col items-center py-2 text-[11px] font-semibold no-underline ${active(t.href) ? "text-brand" : "text-muted"}`}
              >
                <span aria-hidden className="text-lg leading-none">{t.icon}</span>
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
