"use client";
import { useState } from "react";
import { WASSCE_SCALE, wassceGrade, wassceSummary } from "@/lib/grades";

export default function Wassce() {
  const [rows, setRows] = useState<{ name: string; score: string }[]>([
    { name: "English Language", score: "" },
    { name: "Mathematics", score: "" },
    { name: "", score: "" },
    { name: "", score: "" },
  ]);
  const set = (i: number, k: "name" | "score", v: string) => setRows((r) => r.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const graded = rows.map((r) => (r.score.trim() === "" || isNaN(Number(r.score)) ? null : wassceGrade(Number(r.score))));
  const sum = wassceSummary(graded.filter(Boolean).map((g) => g!.grade));

  return (
    <div>
      <h1 className="text-2xl font-extrabold">WASSCE / BECE grade calculator</h1>
      <p className="text-muted">Enter your mark out of 100 for each subject. Uses the standard WAEC grade bands (A1 = 75–100 … F9 = 0–39).</p>
      <div className="card mt-4 grid gap-3 p-4">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_5.5rem_3rem] items-center gap-2">
            <input className="input" aria-label={`Subject ${i + 1} name`} placeholder="Subject" value={r.name} onChange={(e) => set(i, "name", e.target.value)} />
            <input className="input" aria-label={`Subject ${i + 1} mark`} inputMode="numeric" placeholder="Mark" value={r.score} onChange={(e) => set(i, "score", e.target.value)} />
            <span className={`text-center text-lg font-extrabold ${graded[i] && graded[i]!.points <= 6 ? "text-brand" : "text-warn"}`}>{graded[i]?.grade ?? "–"}</span>
          </div>
        ))}
        <button className="btn btn-ghost" onClick={() => setRows((r) => [...r, { name: "", score: "" }])}>+ Add subject</button>
      </div>
      <div className="card mt-4 p-4" role="status">
        <p><strong>Credit passes (A1–C6):</strong> {sum.credits}</p>
        <p><strong>Best-6 aggregate:</strong> {sum.aggregate ?? "enter at least 6 marks"} <span className="text-xs text-muted">(lower is better; 6 is perfect)</span></p>
        <p className="mt-2 text-xs text-muted">Admission rules differ by institution and course. Always check the entry requirements of your university or college. This tool is a guide, not an official result.</p>
      </div>
      <h2 className="mt-5 mb-1 font-bold">Grade bands</h2>
      <div className="card overflow-x-auto p-3">
        <table className="w-full text-left text-sm">
          <thead><tr><th>Grade</th><th>Marks</th><th>Meaning</th></tr></thead>
          <tbody>
            {WASSCE_SCALE.map((g, i) => (
              <tr key={g.grade} className="border-t border-line">
                <td className="py-1 font-bold">{g.grade}</td>
                <td>{g.min}{i === 0 ? "–100" : `–${WASSCE_SCALE[i - 1].min - 1}`}</td>
                <td>{g.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
