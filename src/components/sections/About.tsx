import { ABOUT, STATS } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import WaveShader from "../ui/WaveShader";

export default function About() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="about"
      ref={ref}
      className={`reveal zt-sec px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="relative mx-auto max-w-[var(--content-max)]">
        {/* шёлковые волны — заполняют пустую правую половину секции */}
        <div className="wave-slot wave-slot--about" aria-hidden="true">
          <WaveShader opacity={0.6} seed={0} interactive />
        </div>
        <p className="relative max-w-[30ch] font-display text-[clamp(28px,3vw,40px)] font-normal leading-[1.22] tracking-[-0.01em] text-[var(--z-ink)]">
          ZETRONIX — небольшая веб-студия. Проектируем и разрабатываем сайты,
          интерфейсы и AI-инструменты. Вы говорите{" "}
          <span className="font-medium text-[var(--z-action)]">
            напрямую с теми, кто проектирует и собирает
          </span>
          .
        </p>

        <dl className="mt-14 flex flex-wrap gap-x-14 gap-y-6">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-[clamp(30px,3vw,42px)] font-medium leading-none text-[var(--z-ink)]">
                {s.value}
                {s.suffix}
              </dd>
              <dd className="mt-2 text-[13px] text-[var(--z-muted)]">{s.label}</dd>
            </div>
          ))}
        </dl>

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
