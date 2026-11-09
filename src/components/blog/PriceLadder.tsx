import { useEffect, useRef, useState } from "react";
import { useInView } from "../../hooks/useInView";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/* Animated price-range ladder for the «Сколько стоит сайт» post.
   Bars sit on a sqrt scale so 3k vs 150k stay readable. */

const MAX = 160; // тыс. ₽, правый край шкалы

const ROWS = [
  {
    label: "Шаблон с маркетплейса",
    min: 3,
    max: 15,
    note: "наполняете сами",
    hot: false,
  },
  {
    label: "Фрилансер",
    min: 15,
    max: 30,
    note: "лотерея по качеству",
    hot: false,
  },
  {
    label: "Готовый макет + адаптация",
    min: 20,
    max: 45,
    note: "золотая середина",
    hot: true,
  },
  {
    label: "Студия с нуля",
    min: 40,
    max: 150,
    note: "уникум + команда",
    hot: false,
  },
];

const TICKS = [0, 25, 50, 75, 100, 150];

const pos = (v: number) => (Math.sqrt(v) / Math.sqrt(MAX)) * 100;
const fmt = (v: number) => `${Math.round(v)}`;

function CountUp({ to, started, delay }: { to: number; started: boolean; delay: number }) {
  const reduced = useReducedMotion();
  const [v, setV] = useState(reduced ? to : 0);
  const raf = useRef(0);

  useEffect(() => {
    if (!started || reduced) return;
    let from = 0;
    const dur = 900;
    const t0 = performance.now() + delay;
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0) / dur));
      const eased = 1 - Math.pow(1 - p, 3);
      from = to * eased;
      setV(from);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [started, to, delay, reduced]);

  return <>{fmt(v)}</>;
}

export default function PriceLadder() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className={`post-viz price-ladder ${inView ? "is-in" : ""}`}>
      <div className="price-ladder__grid" aria-hidden="true">
        {TICKS.map((t, i) => (
          <span
            key={t}
            className={`price-ladder__tick ${i === 0 ? "is-first" : ""} ${i === TICKS.length - 1 ? "is-last" : ""}`}
            style={{ left: `${pos(t)}%` }}
          >
            <i />
            {t > 0 ? `${t}к` : "0"}
          </span>
        ))}
      </div>

      <div className="price-ladder__rows">
        {ROWS.map((r, i) => (
          <div
            key={r.label}
            className={`price-ladder__row ${r.hot ? "is-hot" : ""}`}
            style={{ transitionDelay: reduced ? "0ms" : `${i * 140}ms` }}
          >
            <div className="price-ladder__meta">
              <span className="price-ladder__name">{r.label}</span>
              <span className="price-ladder__note">{r.note}</span>
            </div>
            <div className="price-ladder__track">
              <span
                className="price-ladder__range"
                style={{
                  left: `${pos(r.min)}%`,
                  width: `${pos(r.max) - pos(r.min)}%`,
                }}
              />
              <span
                className="price-ladder__dot"
                style={{ left: `${pos(r.min)}%` }}
              />
              <span
                className="price-ladder__dot price-ladder__dot--end"
                style={{ left: `${pos(r.max)}%` }}
              />
              <span
                className={`price-ladder__val ${pos(r.max) > 85 ? "is-end" : ""}`}
                style={{ left: `${pos(r.max)}%` }}
              >
                <CountUp to={r.min} started={inView} delay={i * 140} />–
                <CountUp to={r.max} started={inView} delay={i * 140 + 150} />к ₽
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="price-ladder__cap">
        Средние цены рынка РФ — коридор, не прайс-лист
      </p>
    </div>
  );
}
