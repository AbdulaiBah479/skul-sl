"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="card mx-auto mt-6 max-w-lg p-6 text-center" role="alert">
      <p className="text-5xl" aria-hidden>⚠️</p>
      <h1 className="mt-2 text-2xl font-extrabold">Something went wrong</h1>
      <p className="mt-1 text-muted">Your progress is safe on this phone. Try again, and if it keeps happening, reload the page.</p>
      <p className="mt-4 flex justify-center gap-2">
        <button className="btn" onClick={reset}>Try again</button>
        <a href="/" className="btn btn-ghost no-underline">Home</a>
      </p>
    </div>
  );
}
