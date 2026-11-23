import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="card mx-auto mt-6 max-w-lg p-6 text-center">
      <p className="text-5xl" aria-hidden>🧭</p>
      <h1 className="mt-2 text-2xl font-extrabold">We could not find that page</h1>
      <p className="mt-1 text-muted">The link may be old, or the lesson was moved. Try searching, or go back to the start.</p>
      <p className="mt-4 flex flex-wrap justify-center gap-2">
        <Link href="/search" className="btn no-underline">Search</Link>
        <Link href="/learn" className="btn btn-ghost no-underline">Browse levels</Link>
        <Link href="/" className="btn btn-ghost no-underline">Home</Link>
      </p>
    </div>
  );
}
