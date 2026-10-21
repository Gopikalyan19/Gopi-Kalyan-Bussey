"use client";

import { useEffect, useRef, useState } from "react";

/** One breath: in, hold, out (seconds). Two rounds ≈ 24s, then a gentle sign-off. */
const PHASES = [
  { label: "Breathe in…", secs: 4, scale: 1 },
  { label: "Hold…", secs: 2, scale: 1 },
  { label: "Breathe out…", secs: 6, scale: 0.45 },
];
const ROUNDS = 2;

/**
 * "Take a breath": a tiny guided breathing moment (a nod to designing for mental health).
 * The circle grows and shrinks with each phase; the label is announced politely to screen
 * readers. With reduced motion the circle doesn't animate, but the guided text still runs.
 */
export default function Breathe() {
  const [step, setStep] = useState(-1); // -1 idle, 0..n-1 running, n done
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const total = PHASES.length * ROUNDS;

  useEffect(() => {
    if (step < 0 || step >= total) return;
    timer.current = setTimeout(() => setStep((s) => s + 1), PHASES[step % PHASES.length].secs * 1000);
    return () => clearTimeout(timer.current);
  }, [step, total]);

  const running = step >= 0 && step < total;
  const phase = running ? PHASES[step % PHASES.length] : null;

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setStep(running ? -1 : 0)}
        aria-pressed={running}
        className="hero-link inline-flex items-center gap-2 font-display text-[13px] font-medium"
      >
        <span aria-hidden="true">🫧</span>
        {running ? "Stop" : step >= total ? "Breathe again" : "Take a breath"}
      </button>

      {step >= 0 && (
        <div className="mt-4 flex items-center gap-4">
          <span className="relative grid h-[56px] w-[56px] shrink-0 place-items-center" aria-hidden="true">
            <span className="absolute inset-0 rounded-full border border-ink/12" />
            <span
              className="breathe-dot h-full w-full rounded-full bg-ink/10"
              style={{ scale: phase ? phase.scale : 0.45, transitionDuration: `${phase ? phase.secs : 0.6}s` }}
            />
          </span>
          <p className="font-display text-[14px] text-ink/70" aria-live="polite">
            {phase ? phase.label : "Feel a little lighter? ♥"}
          </p>
        </div>
      )}
    </div>
  );
}
