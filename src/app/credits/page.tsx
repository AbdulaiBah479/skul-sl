import Link from "next/link";
import { LEVELS } from "@/content";
import { books } from "@/content/books";

export const metadata = { title: "Credits and licences" };

export default function Credits() {
  const list = books();
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-extrabold">Credits and licences</h1>
      <p>
        Many lessons in Skul SL are adapted from free, openly licensed textbooks published by{" "}
        <a href="https://openstax.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent">OpenStax</a> (Rice University). Thank you to the authors, reviewers and OpenStax.
      </p>
      <p className="text-sm text-muted">
        We changed the books for this app: images, videos and some exercises were removed, text was reformatted for phones, and quiz questions were made from each book&apos;s multiple-choice questions and
        key-term lists. Any mistakes introduced by these changes are ours, not the authors&apos;. OpenStax does not endorse Skul SL. Textbook content stays under the licence shown below, so it may be shared with credit, but not sold, and adaptations must keep the same licence.
      </p>
      <ul className="grid gap-3">
        {list.map((b) => (
          <li key={b.id} className="card p-4">
            <p className="font-bold"><a href={b.url} target="_blank" rel="noopener noreferrer" className="text-accent">{b.title} ↗</a></p>
            <p className="text-sm text-muted">{b.publisher}{b.authors ? ` · ${b.authors}` : ""}</p>
            <p className="text-sm">Licence: {b.license ? <a href={b.license.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent">{b.license.name}</a> : "see original"}</p>
            <p className="text-sm text-muted">Used in: {LEVELS.find((l) => l.id === b.level)?.short} · {b.subjectTitle}</p>
          </li>
        ))}
      </ul>
      <p className="text-sm"><Link href="/about">About Skul SL</Link></p>
    </div>
  );
}
