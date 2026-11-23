"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import ThemeToggle from "./ThemeToggle";

const TABS = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/learn", label: "Learn", icon: "learn" },
  { href: "/practice", label: "Practice", icon: "practice" },
  { href: "/tools", label: "Tools", icon: "tools" },
  { href: "/tutor", label: "Tutor", icon: "tutor" },
  { href: "/more", label: "More", icon: "more" },
];

export default function Nav() {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <>
      <header className="no-print sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-2.5">
          <Link href="/" className="mr-auto flex items-center gap-2 text-lg font-extrabold no-underline" aria-label="Skul SL home">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-base text-brand-ink" aria-hidden>🇸🇱</span>
            Skul SL
          </Link>
          <nav aria-label="Main" className="mr-2 hidden gap-1 sm:flex">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active(t.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-semibold no-underline transition-colors ${active(t.href) ? "bg-brand text-brand-ink" : "hover:bg-soft"}`}
              >
                {t.label}
              </Link>
            ))}
          </nav>
          <Link href="/search" aria-label="Search everything" className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-card no-underline">
            <Icon name="search" />
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <nav aria-label="Main" className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden">
        <ul className="mx-auto grid max-w-3xl grid-cols-6">
          {TABS.map((t) => (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={active(t.href) ? "page" : undefined}
                className={`relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold no-underline ${active(t.href) ? "text-brand" : "text-muted"}`}
              >
                {active(t.href) && <span className="absolute top-0 h-[3px] w-8 rounded-b-full bg-brand" aria-hidden />}
                <Icon name={t.icon} />
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
