import { outline } from "@/lib/outline";

/** `base` is the heading level used for "## " lines ("### " lines use base + 1), so headings never skip a level on the page.
 *  `idPrefix` keeps anchor ids unique when a page shows more than one lesson (lesson + global notes). */
export default function Lesson({ lines, base = 2, idPrefix = "s" }: { lines: string[]; base?: 2 | 3; idPrefix?: string }) {
  const H1 = (base === 2 ? "h2" : "h3") as "h2" | "h3";
  const H2 = (base === 2 ? "h3" : "h4") as "h3" | "h4";
  const ids = new Map(outline(lines, idPrefix).map((h) => [h.line, h.id]));
  const out: React.ReactNode[] = [];
  let bullets: string[] = [];
  let seenTop = false;
  const flush = (k: number) => {
    if (bullets.length) {
      out.push(
        <ul key={"u" + k} className="my-3 list-disc space-y-1.5 pl-6 marker:text-brand">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      );
      bullets = [];
    }
  };
  lines.forEach((l, k) => {
    if (l.startsWith("- ")) bullets.push(l.slice(2));
    else {
      flush(k);
      const id = ids.get(k);
      if (l.startsWith("### ")) {
        // a sub-heading with no heading above it takes the top level, so the outline never skips a level
        if (seenTop) out.push(<H2 key={k} id={id} className="mt-4 font-bold">{l.slice(4)}</H2>);
        else { seenTop = true; out.push(<H1 key={k} id={id} className="mt-6 text-lg font-bold">{l.slice(4)}</H1>); }
      } else if (l.startsWith("## ")) { seenTop = true; out.push(<H1 key={k} id={id} className="mt-6 border-t border-line pt-4 text-lg font-bold first:mt-0 first:border-0 first:pt-0">{l.slice(3)}</H1>); }
      else if (/^(Problem|Solution):/.test(l)) out.push(<p key={k} className="my-2 rounded-xl bg-soft p-3"><strong>{l.slice(0, l.indexOf(":") + 1)}</strong>{l.slice(l.indexOf(":") + 1)}</p>);
      else out.push(<p key={k}>{l}</p>);
    }
  });
  flush(lines.length);
  return <div className="lesson-text">{out}</div>;
}
