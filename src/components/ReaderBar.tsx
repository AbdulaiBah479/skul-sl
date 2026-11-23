"use client";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { setLast } from "@/lib/store";

const MIN = 0.95;
const MAX = 1.5;
const STEP = 0.1;

/** Reading progress line, text-size buttons and print. Also remembers this lesson so Home can offer "Continue learning". */
export default function ReaderBar({ href, title, minutes }: { href: string; title: string; minutes: number }) {
  const [pct, setPct] = useState(0);
  const [size, setSize] = useState(1.06);

  useEffect(() => {
    setLast(href, title);
    try {
      const saved = parseFloat(localStorage.getItem("skul-fs") ?? "");
      if (saved >= MIN && saved <= MAX) setSize(saved);
    } catch {}
  }, [href, title]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        setPct(max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const change = (delta: number) => {
    const next = Math.round(Math.min(MAX, Math.max(MIN, size + delta)) * 100) / 100;
    setSize(next);
    document.documentElement.style.setProperty("--lesson-fs", `${next}rem`);
    try { localStorage.setItem("skul-fs", `${next}rem`); } catch {}
  };

  return (
    <>
      <div className="no-print fixed inset-x-0 top-0 z-40 h-[3px] bg-transparent" role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <span className="block h-full bg-brand transition-[width] duration-100" style={{ width: `${pct}%` }} />
      </div>
      <div className="no-print mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
        <span>{minutes} min read</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1" role="group" aria-label="Text size">
          <Icon name="type" size={16} />
          <button className="chip !min-h-9 !px-3" onClick={() => change(-STEP)} disabled={size <= MIN} aria-label="Smaller text">A−</button>
          <button className="chip !min-h-9 !px-3" onClick={() => change(STEP)} disabled={size >= MAX} aria-label="Larger text">A+</button>
        </span>
        <button className="chip !min-h-9" onClick={() => window.print()}>Print</button>
      </div>
    </>
  );
}
