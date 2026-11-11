import { useMemo, useState } from "react";
import { CASES, CASE_TYPES } from "../../data/cases";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";
import WaveShader from "../ui/WaveShader";

const PREVIEW_COUNT = 8;

export default function Cases() {
  const { ref, inView } = useInView<HTMLElement>();
  const [q, setQ] = useState("");
  const [type, setType] = useState<string | null>(null);

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return CASES.filter(
      (c) =>
        (!type || c.type === type) &&
        (!needle ||
          [c.name, c.title, c.teaser, c.type, c.industry]
            .join(" ")
            .toLowerCase()
            .includes(needle)),
    );
  }, [q, type]);

  const shown = items.slice(0, PREVIEW_COUNT);

  return (
    <section
      id="cases"
      ref={ref}
      className={`reveal zt-sec px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="relative mx-auto max-w-[var(--content-max)]">
        <SectionHead
          title="Кейсы"
          sub="Сайты, сервисы и AI-инструменты — с разбором задачи и результата."
        />

        <div className="cs-filters">
          <input
            className="sf-search"
            type="search"
            placeholder="Поиск по кейсам"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Поиск по кейсам"
          />
          <div className="sf-chips" role="group" aria-label="Фильтр по типу проекта">
            <button
              type="button"
              className={`sf-chip${type === null ? " is-active" : ""}`}
              onClick={() => setType(null)}
            >
              Все
            </button>
            {CASE_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                className={`sf-chip${type === t ? " is-active" : ""}`}
                onClick={() => setType(type === t ? null : t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* шёлковая лента-«обойма»: заходит слева, огибает сетку справа и уходит влево;
            на узких экранах — мягкий поток в полосе над заголовком секции */}
        <div className="wave-slot wave-slot--cases" aria-hidden="true">
          <WaveShader
            opacity={0.9}
            seed={7.7}
            variant={typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches ? "flow" : "loop"}
          />
        </div>

        {shown.length === 0 ? (
          <p className="sf-empty">
            По запросу ничего не нашлось.{" "}
            <a href={`mailto:noreply@zetronix.ru?subject=${encodeURIComponent("Кейс: " + q)}`}>
              Расскажите о вашей задаче
            </a>{" "}
            — покажем похожий проект на созвоне.
          </p>
        ) : (
          <ul className="pf-grid pf-grid--preview">
            {shown.map((c) => (
              <li key={c.slug}>
                <a className="pf-card cs-card" href={`/case/${c.slug}`}>
                  <span className="pf-card__cover">
                    {c.cover ? (
                      <img src={c.cover} alt="" loading="lazy" />
                    ) : (
                      <span className="pf-card__mark latn-display" aria-hidden="true">
                        {c.name}
                      </span>
                    )}
                    <span className="pf-card__tint" aria-hidden="true" />
                    <span className="cs-card__tags" aria-hidden="true">
                      <span className="cs-card__tag">{c.type}</span>
                      <span className="cs-card__tag cs-card__tag--dim">{c.industry}</span>
                    </span>
                  </span>
                  <span className="pf-card__meta">
                    <span className="pf-card__cat">
                      {c.industry} · {c.year}
                    </span>
                    <span className="pf-card__title latn-display">{c.name}</span>
                    {c.teaser && <span className="cs-card__teaser">{c.teaser}</span>}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="cs-more">
          <a className="btn" href="/cases">
            <span>Смотреть все кейсы</span>
            <i className="btn-arrow">→</i>
          </a>
        </div>
      </div>
    </section>
  );
}
