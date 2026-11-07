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
        <SectionHead
          title="Портфолио"
          sub="Часть недавних работ. Полные кейсы с цифрами показываем на созвоне."
        />

        <ul className="pf-grid">
          {WORKS.map((w) => (
            <li key={w.name} className="pf-card">
              <span className="pf-card__cover">
                {w.cover ? (
                  <img src={w.cover} alt="" loading="lazy" />
                ) : (
                  <span className="pf-card__mark latn-display" aria-hidden="true">
                    {w.name}
                  </span>
                )}
                <span className="pf-card__tint" aria-hidden="true" />
              </span>
              <span className="pf-card__meta">
                <span className="pf-card__cat">
                  {w.kind} · {w.year}
                </span>
                <span className="pf-card__title latn-display">{w.name}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
