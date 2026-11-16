"use client";
import { useState } from "react";
import { DEFAULT_GPA_SCALE, gpa, cgpa, type Course } from "@/lib/grades";

type Row = { name: string; credits: string; grade: string };
const blank = (): Row => ({ name: "", credits: "3", grade: "A" });

export default function Gpa() {
  const [semesters, setSemesters] = useState<Row[][]>([[blank(), blank(), blank()]]);
  const [scale, setScale] = useState<Record<string, number>>({ ...DEFAULT_GPA_SCALE });

  const toCourses = (rows: Row[]): Course[] => rows.map((r) => ({ credits: Number(r.credits) || 0, grade: r.grade }));
  const upd = (s: number, i: number, k: keyof Row, v: string) =>
    setSemesters((all) => all.map((rows, a) => (a === s ? rows.map((r, b) => (b === i ? { ...r, [k]: v } : r)) : rows)));

  return (
    <div>
      <h1 className="text-2xl font-extrabold">GPA & CGPA calculator</h1>
      <p className="text-muted">Add each course with its credit units and grade. Grade points vary between universities, so check and edit them below.</p>

      {semesters.map((rows, s) => {
        const g = gpa(toCourses(rows), scale);
        return (
          <section key={s} className="card mt-4 p-4" aria-label={`Semester ${s + 1}`}>
            <h2 className="font-bold">Semester {s + 1}{g !== null && <span className="ml-2 text-brand">GPA {g.toFixed(2)}</span>}</h2>
            <div className="mt-2 grid gap-2">
              {rows.map((r, i) => (
                <div key={i} className="grid grid-cols-[1fr_4rem_4.5rem] gap-2">
                  <input className="input" aria-label="Course name" placeholder="Course" value={r.name} onChange={(e) => upd(s, i, "name", e.target.value)} />
                  <input className="input" aria-label="Credit units" inputMode="numeric" value={r.credits} onChange={(e) => upd(s, i, "credits", e.target.value)} />
                  <select className="input" aria-label="Grade" value={r.grade} onChange={(e) => upd(s, i, "grade", e.target.value)}>
                    {Object.keys(scale).map((k) => <option key={k}>{k}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <button className="btn btn-ghost mt-3" onClick={() => setSemesters((all) => all.map((rr, a) => (a === s ? [...rr, blank()] : rr)))}>+ Add course</button>
          </section>
        );
      })}
      <div className="mt-3 flex gap-2">
        <button className="btn btn-ghost" onClick={() => setSemesters((s) => [...s, [blank(), blank(), blank()]])}>+ Add semester</button>
        {semesters.length > 1 && <button className="btn btn-ghost" onClick={() => setSemesters((s) => s.slice(0, -1))}>Remove last semester</button>}
      </div>

      <div className="card mt-4 p-4" role="status">
        <p className="text-lg"><strong>CGPA:</strong> {cgpa(semesters.map(toCourses), scale)?.toFixed(2) ?? "–"}</p>
      </div>

      <details className="card mt-4 p-4">
        <summary className="cursor-pointer font-semibold">Grade points (edit to match your university)</summary>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {Object.keys(scale).map((k) => (
            <label key={k} className="text-sm font-semibold">
              {k}
              <input className="input mt-1" inputMode="decimal" value={scale[k]} onChange={(e) => setScale((sc) => ({ ...sc, [k]: Number(e.target.value) || 0 }))} />
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">Default is a common 5-point scale (A=5 … F=0). Your institution may differ, so confirm in your student handbook.</p>
      </details>
    </div>
  );
}
