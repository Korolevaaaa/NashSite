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
          sub="Четыре формата, в которых мы сильнее всего. Полные версии с цифрами — на первом созвоне."
        />

        <ul className="case-grid">
          {WORKS.map((w) => (
            <li key={w.name} className="case-card">
              {/* cover is a reserved slot — owner drops real screenshots here later */}
              <div className="case-card__cover" aria-hidden="true">
                <span className="case-card__mark latn-display">{w.name}</span>
              </div>
              <div className="case-card__meta">
                <h3 className="case-card__title latn-display">{w.name}</h3>
                <p className="case-card__kind">{w.kind}</p>
                <p className="case-card__year">{w.year}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
