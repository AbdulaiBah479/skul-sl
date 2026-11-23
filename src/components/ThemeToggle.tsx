"use client";
import { useEffect, useState } from "react";
import Icon from "./Icon";

type Mode = "auto" | "light" | "dark";
const ORDER: Mode[] = ["auto", "light", "dark"];
const LABEL: Record<Mode, string> = { auto: "Theme: automatic", light: "Theme: light", dark: "Theme: dark" };

function apply(m: Mode) {
  const el = document.documentElement;
  if (m === "auto") el.removeAttribute("data-theme");
  else el.setAttribute("data-theme", m);
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("auto");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("skul-theme");
      if (saved === "light" || saved === "dark") setMode(saved);
    } catch {}
  }, []);

  const next = () => {
    const m = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    setMode(m);
    apply(m);
    try {
      if (m === "auto") localStorage.removeItem("skul-theme");
      else localStorage.setItem("skul-theme", m);
    } catch {}
  };

  return (
    <button onClick={next} className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-card" aria-label={`${LABEL[mode]}. Press to change.`} title={LABEL[mode]}>
      <Icon name={mode === "auto" ? "auto" : mode === "light" ? "sun" : "moon"} />
    </button>
  );
}
