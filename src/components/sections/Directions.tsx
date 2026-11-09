import { DIRECTIONS } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

export default function Directions() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="directions"
      ref={ref}
      className={`reveal zt-sec--dense px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHead
          eyebrow="Специализация"
          title="Направления для бизнеса"
          sub="Семь направлений — в каждом свои сроки, цены и примеры работ."
        />

        <ul className="dir-grid">
          {DIRECTIONS.map((d) => (
            <li key={d.slug} className="dir-cell">
              <a
                href={`/napravlenie/${d.slug}`}
                className="dir-cell__link"
                aria-label={`${d.title} — открыть страницу`}
              >
                <h3 className="dir-cell__title">{d.title}</h3>
                <p className="dir-cell__text">{d.text}</p>
                <span className="dir-cell__foot">
                  <span className="price">{d.price}</span>
                  <span className="dir-cell__arrow" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 13L13 3M13 3H6M13 3v7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
