import { useEffect, useRef, useState } from "react";
import { PROCESS } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

function useActiveStep(count: number) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            setActive(Number((e.target as HTMLElement).dataset.step));
          }
        }),
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    refs.current.slice(0, count).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [count]);
  return { refs, active };
}

export default function Process() {
  const { ref, inView } = useInView<HTMLElement>();
  const { refs, active } = useActiveStep(PROCESS.length);
  const listRef = useRef<HTMLOListElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLElement>(null);

  // rail spans first→last dot centers; fill ends at the active dot center
  useEffect(() => {
    const list = listRef.current;
    const rail = railRef.current;
    const fill = fillRef.current;
    if (!list || !rail || !fill) return;

    const dotCy = (i: number) => {
      const li = list.querySelectorAll<HTMLElement>(".proc-step")[i];
      const dot = li?.querySelector<HTMLElement>(".proc-dot");
      return li && dot ? li.offsetTop + dot.offsetTop + dot.offsetHeight / 2 : 0;
    };

    const paint = () => {
      const first = dotCy(0);
      const last = dotCy(PROCESS.length - 1);
      rail.style.top = `${first}px`;
      rail.style.height = `${Math.max(0, last - first)}px`;
      fill.style.transform = `scaleY(${(dotCy(active) - first) / Math.max(1, last - first)})`;
    };

    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(list);
    return () => ro.disconnect();
  }, [active]);

  return (
    <section
      id="process"
      ref={ref}
      className={`reveal zt-sec px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto grid max-w-[var(--content-max)] grid-cols-1 gap-12 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] md:gap-20">
        <div className="self-start md:sticky md:top-28">
          <SectionHead
            title="Как мы работаем"
            sub="Пять этапов, от знакомства до запуска. Сроки и смета фиксируются до старта."
          />
          <p className="zt-meta mt-8">
            Этап {active + 1} из {PROCESS.length}
          </p>
        </div>

        <ol ref={listRef} className="relative md:pl-10">
          <span ref={railRef} aria-hidden="true" className="proc-rail hidden md:block">
            <i ref={fillRef as React.RefObject<HTMLElement>} />
          </span>
          {PROCESS.map((s, i) => (
            <li
              key={s.n}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-step={i}
              data-active={i === active}
              aria-current={i === active ? "step" : undefined}
              className="proc-step relative pb-12 last:pb-0"
            >
              <span aria-hidden="true" className="proc-dot hidden md:block" style={{ left: "-40px" }} />
              <h3 className="font-display text-[22px] font-medium text-[var(--z-ink)]">
                <span className="proc-num mr-3">{s.n}</span>
                {s.title}
              </h3>
              <p className="mt-2 max-w-[52ch] text-[15px] leading-[1.6] text-[var(--z-muted)]">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
