import { useMemo, useState } from "react";
import { CASES, CASE_INDUSTRIES, CASE_TYPES } from "../../data/cases";
import { CONTACT_EMAIL } from "../../data/content";

type Sort = "new" | "old" | "name";

function plural(n: number): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return `${n} проект`;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return `${n} проекта`;
  return `${n} проектов`;
}

export default function CasesPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("new");

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = CASES.filter(
      (c) =>
        (!type || c.type === type) &&
        (!industry || c.industry === industry) &&
        (!needle ||
          [c.name, c.title, c.teaser, c.type, c.industry, c.client ?? ""]
            .join(" ")
            .toLowerCase()
            .includes(needle)),
    );
    return [...list].sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "old"
          ? a.year - b.year
          : b.year - a.year,
    );
  }, [q, type, industry, sort]);

  return (
    <main className="px-[var(--page-gutter)] pb-[clamp(80px,12vh,140px)] pt-[calc(var(--header-h,110px)+56px)]">
      <div className="mx-auto max-w-[var(--content-max)]">
        <a
          href="#top"
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--z-muted)] no-underline hover:text-[var(--z-action)]"
        >
          ← На главную
        </a>

        <h1 className="mt-10 font-body text-[clamp(34px,4.6vw,62px)] font-medium leading-[1.05] tracking-[-0.045em] text-[var(--z-ink)]">
          Все кейсы
        </h1>
        <p className="mt-5 max-w-[52ch] text-[16px] leading-[1.65] text-[var(--z-muted)]">
          {plural(CASES.length)} — сайты, сервисы, приложения и AI-инструменты.
          В каждом кейсе: задача, решение и результат с экранами.
        </p>

        <div className="csp-filters">
          <div className="csp-filters__top">
            <input
              className="sf-search"
              type="search"
              placeholder="Поиск по кейсам"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Поиск по кейсам"
            />
            <select
              className="csp-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              aria-label="Сортировка"
            >
              <option value="new">Сначала новые</option>
              <option value="old">Сначала старые</option>
              <option value="name">По названию</option>
            </select>
          </div>

          <div className="csp-group">
            <span className="csp-group__label">Тип проекта</span>
            <div className="sf-chips">
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

          <div className="csp-group">
            <span className="csp-group__label">Сфера</span>
            <div className="sf-chips">
              <button
                type="button"
                className={`sf-chip${industry === null ? " is-active" : ""}`}
                onClick={() => setIndustry(null)}
              >
                Все
              </button>
              {CASE_INDUSTRIES.map((i) => (
                <button
                  key={i}
                  type="button"
                  className={`sf-chip${industry === i ? " is-active" : ""}`}
                  onClick={() => setIndustry(industry === i ? null : i)}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="sf-empty">
            Под эти фильтры ничего не подходит.{" "}
            <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Подобрать кейс")}`}>
              Напишите нам
            </a>{" "}
            — покажем похожий проект на созвоне.
          </p>
        ) : (
          <ul className="pf-grid csp-grid">
            {items.map((c) => (
              <li key={c.slug}>
                <a className="pf-card cs-card" href={`#/case/${c.slug}`}>
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
      </div>
    </main>
  );
}
