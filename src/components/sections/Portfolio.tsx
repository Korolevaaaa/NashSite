import { WORKS } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

export default function Portfolio() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="portfolio"
      ref={ref}
      className={`reveal zt-sec px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <div className="flex items-end justify-between gap-6">
          <SectionHead
            kicker="03 · Портфолио"
            title="Портфолио"
            sub="Направления и форматы, в которых работаем. Примеры оформления, реальные кейсы покажем на созвоне."
          />
          <p className="zt-meta hidden pb-2 md:block">04 примера</p>
        </div>

        <ul className="mt-12">
          {WORKS.map((w, i) => (
            <li
              key={w.name}
              style={{ "--i": i } as React.CSSProperties}
              className="case flex flex-col gap-3 border-b border-[var(--z-line-soft)] py-9 last:border-b-0 md:flex-row md:items-baseline md:justify-between"
            >
              <div>
                <span aria-hidden="true" className="mb-5 block h-px w-16 bg-line" />
                <h3 className="latn-display text-[clamp(28px,2.8vw,40px)] font-medium leading-none tracking-[-0.01em] text-[var(--z-ink)]">
                  {w.name}
                </h3>
              </div>
              <div className="md:text-right">
                <p className="text-[15px] text-[var(--z-muted)]">{w.kind}</p>
                <p className="zt-meta mt-2 text-[11px] uppercase tracking-[0.12em]">
                  {w.year} · пример оформления
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
