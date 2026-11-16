"use client";
import { useState } from "react";
import { neededScore } from "@/lib/grades";

export default function Target() {
  const [target, setTarget] = useState("50");
  const [weight, setWeight] = useState("40");
  const [score, setScore] = useState("35");
  const need = neededScore(Number(target), Number(weight), Number(score));
  return (
    <div>
      <h1 className="text-2xl font-extrabold">What score do I need?</h1>
      <p className="text-muted">Example: coursework is 40% of the grade and you got 35/100 on it. What must you score in the exam to reach 50 overall?</p>
      <div className="card mt-4 grid gap-3 p-4">
        <label className="text-sm font-semibold">Overall mark I want (%)<input className="input mt-1" inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} /></label>
        <label className="text-sm font-semibold">Weight already completed (% of the course)<input className="input mt-1" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} /></label>
        <label className="text-sm font-semibold">My score on that part (out of 100)<input className="input mt-1" inputMode="decimal" value={score} onChange={(e) => setScore(e.target.value)} /></label>
      </div>
      <div className="card mt-4 p-4" role="status">
        {need === null ? (
          <p>Nothing is left to score.</p>
        ) : need > 100 ? (
          <p>You would need <strong>{need}%</strong> in the rest, which is above 100%. This target is not reachable. Try a lower target.</p>
        ) : need <= 0 ? (
          <p>You have already reached the target. 🎉</p>
        ) : (
          <p>You need <strong className="text-xl text-brand">{need}%</strong> in the remaining part of the course.</p>
        )}
      </div>
    </div>
  );
}
