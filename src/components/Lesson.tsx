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
      if (l.startsWith("## ")) out.push(<h3 key={k} className="mt-4 text-lg font-bold">{l.slice(3)}</h3>);
      else out.push(<p key={k} className="my-2">{l}</p>);
    }
  });
  flush(lines.length);
  return <div>{out}</div>;
}
