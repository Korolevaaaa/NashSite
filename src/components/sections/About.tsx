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
        <p className="zt-kicker">05 · О нас</p>
        <p className="mt-8 max-w-[30ch] font-display text-[clamp(28px,3vw,40px)] font-normal leading-[1.22] tracking-[-0.01em] text-[var(--z-ink)]">
          ZETRONIX — небольшая веб-студия. Проектируем и разрабатываем сайты, интерфейсы
          и AI-инструменты —{" "}
          <span className="font-medium text-[var(--z-action)]">
            без бюрократии и лишних посредников
          </span>{" "}
          между вами и теми,{" "}
          <span className="font-medium text-[var(--z-action)]">кто делает работу</span>.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-line pt-8 md:grid-cols-3">
          {ABOUT.points.map((p, i) => (
            <div key={p.title}>
              <p className="zt-meta text-[var(--z-action)]">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 font-display text-[20px] font-medium text-[var(--z-ink)]">
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
