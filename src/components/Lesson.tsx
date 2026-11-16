export default function Lesson({ lines }: { lines: string[] }) {
  const out: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = (k: number) => {
    if (bullets.length) {
      out.push(
        <ul key={"u" + k} className="my-2 list-disc space-y-1 pl-6">
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
      if (l.startsWith("### ")) out.push(<h4 key={k} className="mt-3 font-bold">{l.slice(4)}</h4>);
      else if (l.startsWith("## ")) out.push(<h3 key={k} className="mt-5 text-lg font-bold">{l.slice(3)}</h3>);
      else if (/^(Problem|Solution):/.test(l)) out.push(<p key={k} className="my-2 rounded-lg bg-bg p-2"><strong>{l.slice(0, l.indexOf(":") + 1)}</strong>{l.slice(l.indexOf(":") + 1)}</p>);
      else out.push(<p key={k} className="my-2">{l}</p>);
    }
  });
  flush(lines.length);
  return <div className="leading-relaxed">{out}</div>;
}
