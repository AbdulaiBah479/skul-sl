import Link from "next/link";

export const metadata = { title: "You are offline" };

export default function Offline() {
  return (
    <div className="card p-6 text-center">
      <p className="text-4xl" aria-hidden>📴</p>
      <h1 className="mt-2 text-xl font-extrabold">You are offline</h1>
      <p className="mt-1 text-muted">This page was not saved on your phone yet. Pages you have opened before still work. Connect once and open the lessons you want to keep.</p>
      <p className="mt-4"><Link href="/" className="btn no-underline">Go home</Link></p>
    </div>
  );
}
