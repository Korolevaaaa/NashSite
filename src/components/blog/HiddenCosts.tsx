import { useEffect, useRef, useState } from "react";
import { useInView } from "../../hooks/useInView";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/* Stacked «year-one cost» bar: launch price vs real cost of ownership. */

const LAUNCH = 30; // тыс. ₽ — средняя «цена сайта» из прайса

const SEGMENTS = [
  { label: "Разработка", value: 30, cls: "seg-dev" },
  { label: "Домен", value: 0.5, cls: "seg-a", fixed: "0,5к" },
  { label: "Хостинг + SSL", value: 5, cls: "seg-b" },
  { label: "Правки и поддержка", value: 10, cls: "seg-c" },
  { label: "Минимум продвижения", value: 6, cls: "seg-d" },
];

const TOTAL = SEGMENTS.reduce((s, x) => s + x.value, 0);

function Total({ started }: { started: boolean }) {
  const reduced = useReducedMotion();
  const [v, setV] = useState(reduced ? TOTAL : 0);
  const raf = useRef(0);

  useEffect(() => {
    if (!started || reduced) return;
    const dur = 1100;
    const t0 = performance.now() + 500;
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0) / dur));
      setV(Math.round(TOTAL * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [started, reduced]);

  return <>{v}</>;
}

export default function HiddenCosts() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className={`post-viz hcosts ${inView ? "is-in" : ""}`}>
      <div className="hcosts__bar" role="img" aria-label={`Сайт за ${LAUNCH} тысяч рублей в первый год стоит около ${TOTAL} тысяч`}>
        {SEGMENTS.map((s, i) => (
          <span
            key={s.label}
            className={`hcosts__seg ${s.cls}`}
            style={{
              width: `${(s.value / TOTAL) * 100}%`,
              transitionDelay: reduced ? "0ms" : `${i * 160}ms`,
            }}
          />
        ))}
      </div>

      <ul className="hcosts__legend">
        {SEGMENTS.map((s, i) => (
          <li
            key={s.label}
            style={{ transitionDelay: reduced ? "0ms" : `${i * 160 + 200}ms` }}
          >
            <i className={s.cls} />
            <span>{s.label}</span>
            <b>{s.fixed ?? `~${s.value}к ₽`}</b>
          </li>
        ))}
      </ul>

      <div className="hcosts__total">
        <span>Итого честный год владения</span>
        <b>
          ≈ <Total started={inView} />к ₽
        </b>
      </div>
    </div>
  );
}
