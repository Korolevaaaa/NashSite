import { CONTACT_EMAIL, DIRECTIONS } from "../../data/content";

/**
 * SEO/Direct landing for a single business direction.
 * Routed by hash: #/napravlenie/<slug>
 */
export default function DirectionPage({ slug }: { slug: string }) {
  const d = DIRECTIONS.find((x) => x.slug === slug);
  if (!d) {
    return (
      <main className="px-[var(--page-gutter)] py-[160px]">
        <div className="mx-auto max-w-[var(--content-max)]">
          <p className="text-[var(--z-muted)]">Направление не найдено.</p>
          <a className="btn mt-6" href="#">
            ← На главную
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="px-[var(--page-gutter)] pb-[clamp(80px,12vh,140px)] pt-[calc(var(--header-h,110px)+56px)]">
      <div className="mx-auto max-w-[var(--content-max)]">
        <a
          href="#top"
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--z-muted)] no-underline hover:text-[var(--z-action)]"
        >
          ← Все направления
        </a>

        <p className="mt-10 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--z-action)]">
          Направление ZETRONIX
        </p>
        <h1 className="mt-4 font-body text-[clamp(34px,4.6vw,62px)] font-medium leading-[1.05] tracking-[-0.045em] text-[var(--z-ink)]">
          {d.title}
        </h1>
        <p className="mt-6 max-w-[52ch] text-[16px] leading-[1.65] text-[var(--z-muted)]">
          {d.page.lead}
        </p>

        <div className="mt-14 grid gap-y-8 border-t border-line pt-10 md:grid-cols-2 md:gap-x-10">
          <h2 className="font-body text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--z-muted)]">
            Стоимость
          </h2>
          <div>
            <ul className="space-y-3">
              {d.tiers.map((t) => (
                <li
                  key={t.name}
                  className="flex items-baseline justify-between gap-6 border-b border-line pb-3 text-[15px]"
                >
                  <span className="text-[var(--z-ink)]">{t.name}</span>
                  <span className="shrink-0 font-mono text-[13px] tracking-[0.04em] text-[var(--z-action)]">
                    {t.price}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] leading-[1.6] text-[var(--z-muted)]">
              Точная смета — после короткого брифа, фиксируется до старта.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-y-8 border-t border-line pt-10 md:grid-cols-2 md:gap-x-10">
          <h2 className="font-body text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--z-muted)]">
            Что входит
          </h2>
          <ul className="space-y-4">
            {d.page.tasks.map((t) => (
              <li key={t} className="flex gap-3 text-[15px] leading-[1.6] text-[var(--z-ink)]">
                <span aria-hidden="true" className="mt-[3px] text-[var(--z-action)]">
                  →
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-line pt-10">
          <a className="btn btn--big" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(d.title)}`}>
            <span>{d.page.cta}</span>
            <i className="btn-arrow">↗</i>
          </a>
          <a
            href="#top"
            className="text-[14px] font-medium text-[var(--z-muted)] no-underline hover:text-[var(--z-ink)]"
          >
            Сначала посмотреть работы
          </a>
        </div>
      </div>
    </main>
  );
}
