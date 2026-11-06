import { WORKS } from "../../data/content";
import { useInView } from "../../hooks/useInView";

export default function Portfolio() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="portfolio"
      ref={ref}
      className={`reveal px-[var(--page-gutter)] py-[clamp(80px,12vh,140px)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <header className="mb-12">
          <h2 className="font-body text-[clamp(28px,3.4vw,42px)] font-medium tracking-[-0.035em] text-[var(--z-ink)]">
            Портфолио
          </h2>
          <p className="mt-2 text-[15px] text-[var(--z-muted)]">
            Направления и форматы, в которых мы работаем. Примеры оформления —
            реальные кейсы покажем на созвоне.
          </p>
        </header>

        <div className="grid border-t border-line">
          {WORKS.map((w) => (
            <article
              key={w.name}
              className="grid grid-cols-[1fr_auto] items-baseline gap-5 border-b border-line px-1.5 py-[26px] md:grid-cols-[1fr_2fr_auto]"
            >
              <b className="font-body text-[clamp(20px,2.4vw,30px)] font-medium tracking-[-0.02em] text-[var(--z-ink)]">
                {w.name}
              </b>
              <span className="hidden text-sm text-[var(--z-muted)] md:inline">
                {w.kind}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
                Пример оформления
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
