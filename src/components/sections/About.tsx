import { ABOUT } from "../../data/content";
import { useInView } from "../../hooks/useInView";

export default function About() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="about"
      ref={ref}
      className={`reveal zt-sec px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <p className="max-w-[30ch] font-display text-[clamp(28px,3vw,40px)] font-normal leading-[1.22] tracking-[-0.01em] text-[var(--z-ink)]">
          ZETRONIX — небольшая веб-студия. Проектируем и разрабатываем сайты,
          интерфейсы и AI-инструменты. Вы говорите{" "}
          <span className="font-medium text-[var(--z-action)]">
            напрямую с теми, кто проектирует и собирает
          </span>
          .
        </p>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-line pt-8 md:grid-cols-3">
          {ABOUT.points.map((p) => (
            <div key={p.title}>
              <h3 className="font-display text-[20px] font-medium text-[var(--z-ink)]">
                {p.title}
              </h3>
              <p className="mt-3 max-w-[36ch] text-[15px] leading-[1.55] text-[var(--z-muted)]">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
