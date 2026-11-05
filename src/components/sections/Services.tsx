import { useEffect, useRef, useState } from "react";
import { SERVICES, STATS } from "../../data/content";
import { useInView } from "../../hooks/useInView";

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.5);
  const [n, setN] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const t0 = performance.now();
    let raf = 0;
    const run = (t: number) => {
      const k = Math.min((t - t0) / 1200, 1);
      setN(Math.round(value * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <div ref={ref}>
      <b className="block font-display text-[clamp(34px,4vw,52px)] font-bold tracking-[-0.02em] text-ink">
        {n}
        <span className="text-glow">{suffix}</span>
      </b>
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </span>
    </div>
  );
}

export default function Services() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="services"
      ref={ref}
      className={`reveal px-[var(--page-gutter)] py-[clamp(80px,12vh,140px)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <header className="mb-14">
          <span className="mb-2.5 block font-mono text-xs tracking-[0.2em] text-accent-deep">
            01
          </span>
          <h2 className="font-display text-[clamp(34px,5vw,56px)] font-bold tracking-[-0.02em]">
            Услуги
          </h2>
          <p className="mt-2 text-[15px] text-ink-muted">
            Полный цикл: от идеи до запуска
          </p>
        </header>

        <div className="mb-14 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-5">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
          {SERVICES.map((s) => (
            <article
              key={s.id}
              className="card rounded-[18px] border border-line bg-[rgba(255,255,255,0.5)] px-7 py-[30px]"
            >
              <span className="font-mono text-[11px] tracking-[0.15em] text-ink-faint">
                {s.id}
              </span>
              <h3 className="mb-2.5 mt-3.5 font-display text-[21px]">{s.title}</h3>
              <p className="text-sm leading-[1.6] text-ink-muted">{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
