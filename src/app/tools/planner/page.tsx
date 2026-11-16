"use client";
import { useEffect, useState } from "react";

interface Exam {
  id: number;
  subject: string;
  date: string; // YYYY-MM-DD
}
const KEY = "skul-sl-exams-v1";

function daysUntil(date: string, now = new Date()) {
  const [y, m, d] = date.split("-").map(Number);
  const target = new Date(y, m - 1, d).getTime();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((target - start) / 86400000);
}

export default function Planner() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("2");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setExams(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) try { localStorage.setItem(KEY, JSON.stringify(exams)); } catch {}
  }, [exams, ready]);

  const sorted = [...exams].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Exam countdown & planner</h1>
      <div className="card mt-4 grid gap-3 p-4">
        <label className="text-sm font-semibold">Subject / exam<input className="input mt-1" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. WASSCE Mathematics" /></label>
        <label className="text-sm font-semibold">Date<input className="input mt-1" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
        <label className="text-sm font-semibold">Hours I can study per day<input className="input mt-1" inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)} /></label>
        <button className="btn" disabled={!subject.trim() || !date} onClick={() => { setExams((e) => [...e, { id: Date.now(), subject: subject.trim(), date }]); setSubject(""); setDate(""); }}>Add exam</button>
      </div>
      <ul className="mt-4 grid gap-3">
        {sorted.map((e) => {
          const d = daysUntil(e.date);
          const h = Number(hours) || 0;
          return (
            <li key={e.id} className="card flex items-center justify-between gap-3 p-4">
              <span>
                <span className="block font-bold">{e.subject}</span>
                <span className="block text-sm text-muted">{e.date}{d > 0 && h > 0 ? ` · about ${Math.round(d * h)} study hours available` : ""}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className={`text-xl font-extrabold ${d < 0 ? "text-muted" : d <= 7 ? "text-warn" : "text-brand"}`}>{d < 0 ? "Past" : d === 0 ? "Today" : `${d}d`}</span>
                <button className="btn btn-ghost" aria-label={`Remove ${e.subject}`} onClick={() => setExams((x) => x.filter((y) => y.id !== e.id))}>✕</button>
              </span>
            </li>
          );
        })}
      </ul>
      {ready && !sorted.length && <p className="mt-4 text-muted">No exams yet. Add one above.</p>}
    </div>
  );
}
