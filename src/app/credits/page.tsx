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
      <h2 className="pt-2 text-lg font-bold">Wikipedia (Global notes)</h2>
      <p className="text-sm">
        The “Global notes” on many lessons are shortened extracts of <a href="https://www.wikipedia.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent">Wikipedia</a> articles, available under the{" "}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent">Creative Commons Attribution-ShareAlike 4.0 licence</a>. Each note links to its article, where the authors are listed in the page history. We removed references, images and some sections.
      </p>
      <h2 className="pt-2 text-lg font-bold">Free courses list</h2>
      <p className="text-sm">
        The course list at <Link href="/courses" className="font-semibold text-accent">Free courses</Link> includes entries from the{" "}
        <a href="https://github.com/EbookFoundation/free-programming-books" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent">Free Programming Books</a> list (EbookFoundation, CC BY 4.0), the OpenStax catalogue, Coursera’s public catalogue and the MIT OpenCourseWare site map. The last two are links only; the courses themselves belong to Coursera, MIT and their partners under their own terms.
      </p>
      <p className="text-sm"><Link href="/about">About Skul SL</Link></p>
    </div>
  );
}
