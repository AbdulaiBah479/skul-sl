"use client";
import { useEffect, useRef, useState } from "react";
import { markActive } from "@/lib/store";

export default function Timer() {
  const [focus, setFocus] = useState(25);
  const [rest, setRest] = useState(5);
  const [mode, setMode] = useState<"focus" | "rest">("focus");
  const [left, setLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const endRef = useRef<number>(0);

  // Based on the clock, not on counting ticks, so it stays correct when the phone sleeps or the tab is in the background.
  useEffect(() => {
    if (!running) return;
    endRef.current = Date.now() + left * 1000;
    const id = setInterval(() => {
      const l = Math.max(0, Math.round((endRef.current - Date.now()) / 1000));
      setLeft(l);
      if (l === 0) {
        clearInterval(id);
        try { navigator.vibrate?.([200, 100, 200]); } catch {}
        if (mode === "focus") {
          setSessions((s) => s + 1);
          markActive();
          setMode("rest");
          setLeft(rest * 60);
        } else {
          setMode("focus");
          setLeft(focus * 60);
        }
        setRunning(false);
      }
    }, 500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Study timer</h1>
      <p className="text-muted">Work in focused blocks, then rest. It really helps.</p>
      <div className="card mt-4 p-6 text-center">
        <p className="text-sm font-semibold uppercase text-muted">{mode === "focus" ? "Focus" : "Break"}</p>
        <p className="text-6xl font-extrabold tabular-nums" role="timer" aria-live="off">{mm}:{ss}</p>
        <div className="mt-4 flex justify-center gap-2">
          <button className="btn" onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Start"}</button>
          <button className="btn btn-ghost" onClick={() => { setRunning(false); setMode("focus"); setLeft(focus * 60); }}>Reset</button>
        </div>
        <p className="mt-3 text-sm text-muted">Focus blocks finished today: {sessions}</p>
      </div>
      <div className="card mt-4 grid grid-cols-2 gap-3 p-4">
        <label className="text-sm font-semibold">Focus (min)<input className="input mt-1" type="number" min={5} max={90} value={focus} disabled={running} onChange={(e) => { const v = Math.max(5, Math.min(90, Number(e.target.value) || 25)); setFocus(v); if (mode === "focus") setLeft(v * 60); }} /></label>
        <label className="text-sm font-semibold">Break (min)<input className="input mt-1" type="number" min={1} max={30} value={rest} disabled={running} onChange={(e) => { const v = Math.max(1, Math.min(30, Number(e.target.value) || 5)); setRest(v); if (mode === "rest") setLeft(v * 60); }} /></label>
      </div>
    </div>
  );
}
