import { useEffect, useRef, useState } from "react";

const STEPS = [
  "SYSTEM BOOT…",
  "LOADING MODULES…",
  "UNIT ZTRX-07 ONLINE",
  "OPTIC ARRAY… OK",
  "PWR-CORE… OK",
  "INTERFACE READY",
];

export default function Boot() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const tick = (i: number) => {
      setStep(i);
      if (i + 1 < STEPS.length) {
        timers.current.push(
          window.setTimeout(() => tick(i + 1), 160 + Math.random() * 140),
        );
      } else {
        timers.current.push(window.setTimeout(() => setDone(true), 350));
      }
    };
    tick(0);
    return () => timers.current.forEach(clearTimeout);
  }, []);

  // remove from DOM after fade-out so it can't trap focus
  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setGone(true), 700);
    return () => clearTimeout(t);
  }, [done]);

  if (gone) return null;

  return (
    <div className={`boot ${done ? "is-done" : ""}`} aria-hidden="true">
      <div className="w-[min(320px,80vw)] text-center">
        <div className="mb-[22px] font-display text-[26px] font-bold tracking-[0.04em]">
          ZETRONIX<span className="font-normal text-ink-faint">.RU</span>
        </div>
        <div className="boot-bar">
          <i
            className="boot-bar-fill"
            style={{ width: `${Math.round(((step + 1) / STEPS.length) * 100)}%` }}
          />
        </div>
        <div className="mt-3.5 min-h-[1.5em] text-left font-mono text-[10px] tracking-[0.18em] text-ink-muted">
          {STEPS[step]}
        </div>
      </div>
    </div>
  );
}
