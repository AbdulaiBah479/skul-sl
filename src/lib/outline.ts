// Headings of a lesson ("## " and, when there is no "## ", "### " lines) with stable anchor ids, plus a reading-time estimate.
export interface Heading {
  line: number;
  id: string;
  text: string;
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "section";

export function outline(lines: string[], prefix = "s"): Heading[] {
  const hasTop = lines.some((l) => l.startsWith("## "));
  const out: Heading[] = [];
  const used = new Map<string, number>();
  lines.forEach((l, line) => {
    const isTop = l.startsWith("## ");
    const isSub = l.startsWith("### ");
    if (!(isTop || (isSub && !hasTop))) return;
    const text = l.slice(isTop ? 3 : 4).trim();
    const base = `${prefix}-${slug(text)}`;
    const n = (used.get(base) ?? 0) + 1;
    used.set(base, n);
    out.push({ line, id: n > 1 ? `${base}-${n}` : base, text });
  });
  return out;
}

/** Minutes to read at a relaxed 190 words per minute (at least 1). */
export function readingMinutes(lines: string[]): number {
  const words = lines.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 190));
}
