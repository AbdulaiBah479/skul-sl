"use client";
import { useState } from "react";
import { evaluate, format } from "@/lib/calc";

const KEYS = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "%", "+", "(", ")", "^", "sqrt("];

export default function Calculator() {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState("");

  const run = () => {
    try {
      setResult(format(evaluate(expr)));
      setError("");
    } catch (e) {
      setResult("");
      setError(e instanceof Error ? e.message : "Error");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Calculator</h1>
      <p className="text-muted">Works offline. Supports brackets, powers (^), percent (%) and sqrt().</p>
      <div className="card mt-4 p-4">
        <label className="sr-only" htmlFor="expr">Calculation</label>
        <input id="expr" className="input text-right text-xl" value={expr} inputMode="text" onChange={(e) => setExpr(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} placeholder="e.g. (12 + 8) × 3" />
        <p className="mt-2 min-h-8 text-right text-2xl font-extrabold" role="status">{result !== "" ? `= ${result}` : <span className="text-base font-normal text-warn">{error}</span>}</p>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {KEYS.map((k) => <button key={k} className="btn btn-ghost" onClick={() => setExpr((x) => x + k)}>{k}</button>)}
          <button className="btn btn-ghost" onClick={() => { setExpr(""); setResult(""); setError(""); }}>Clear</button>
          <button className="btn btn-ghost" onClick={() => setExpr((x) => x.slice(0, -1))}>⌫</button>
          <button className="btn col-span-2" onClick={run}>=</button>
        </div>
      </div>
    </div>
  );
}
