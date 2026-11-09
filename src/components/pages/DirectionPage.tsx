import { CONTACT_EMAIL, DIRECTIONS } from "../../data/content";
import { CASES } from "../../data/cases";
import { publishedItems } from "../../data/storefront";
import { TemplateCard } from "../sections/Templates";
import { useSeo } from "../../hooks/useSeo";

/**
 * SEO landing for a single business direction: /napravlenie/<slug>.
 * Each direction gets unique meta + Service/Breadcrumb JSON-LD +
 * related storefront templates and case studies.
 */
export default function DirectionPage({ slug }: { slug: string }) {
  const d = DIRECTIONS.find((x) => x.slug === slug);

  const lowPrice = d
    ? Number(d.price.replace(/[^\d]/g, "")) || undefined
    : undefined;

  useSeo({
    description: d?.page.lead ?? "",
    path: d ? `/napravlenie/${d.slug}` : "/",
    title: d ? `${d.title} — разработка от ZETRONIX` : undefined,
    jsonLd: d
      ? [
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `${d.title} — ZETRONIX`,
            description: d.page.lead,
            provider: {
              "@type": "Organization",
              name: "ZETRONIX",
              url: location.origin,
            },
            ...(lowPrice
              ? {
                  offers: {
                    "@type": "Offer",
                    price: lowPrice,
                    priceCurrency: "RUB",
                    availability: "https://schema.org/InStock",
                  },
                }
              : {}),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Главная",
                item: `${location.origin}/`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Направления",
                item: `${location.origin}/#services`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: d.title,
                item: `${location.origin}/napravlenie/${d.slug}`,
              },
            ],
          },
        ]
      : undefined,
  });

  if (!d) {
    return (
      <main className="px-[var(--page-gutter)] py-[160px]">
        <div className="mx-auto max-w-[var(--content-max)]">
          <p className="text-[var(--z-muted)]">Направление не найдено.</p>
          <a className="btn mt-6" href="/">
            ← На главную
          </a>
        </div>
      </main>
    );
  }

  const rel = d.related as unknown as
    | { templates?: string[]; cases?: string[] }
    | undefined;
  const relTemplates = (rel?.templates ?? [])
    .map((s) => publishedItems().find((i) => i.slug === s))
    .filter(Boolean);
  const relCases = (rel?.cases ?? [])
    .map((s) => CASES.find((c) => c.slug === s))
    .filter(Boolean);

  return (
    <main className="px-[var(--page-gutter)] pb-[clamp(80px,12vh,140px)] pt-[calc(var(--header-h,110px)+56px)]">
      <div className="mx-auto max-w-[var(--content-max)]">
        <a
          href="/#services"
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

        {relTemplates.length > 0 && (
          <div className="mt-16 border-t border-line pt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="font-body text-[clamp(20px,2.4vw,28px)] font-semibold tracking-[-0.02em] text-[var(--z-ink)]">
                Готовые макеты по этому направлению
              </h2>
              <a
                href="/#templates"
                className="text-[13px] font-medium text-[var(--z-action)] no-underline hover:underline"
              >
                Вся витрина →
              </a>
            </div>
            <ul className="sf-grid mt-8">
              {relTemplates.map((item) => (
                <TemplateCard key={item!.id} item={item!} />
              ))}
            </ul>
          </div>
        )}

        {relCases.length > 0 && (
          <div className="mt-16 border-t border-line pt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="font-body text-[clamp(20px,2.4vw,28px)] font-semibold tracking-[-0.02em] text-[var(--z-ink)]">
                Кейсы по этому направлению
              </h2>
              <a
                href="/cases"
                className="text-[13px] font-medium text-[var(--z-action)] no-underline hover:underline"
              >
                Все кейсы →
              </a>
            </div>
            <ul className="pf-grid mt-8">
              {relCases.map((c) => (
                <li key={c!.slug}>
                  <a className="pf-card cs-card" href={`/case/${c!.slug}`}>
                    <span className="pf-card__cover">
                      {c!.cover ? (
                        <img src={c!.cover} alt="" loading="lazy" />
                      ) : (
                        <span className="pf-card__mark latn-display" aria-hidden="true">
                          {c!.name}
                        </span>
                      )}
                      <span className="pf-card__tint" aria-hidden="true" />
                      <span className="cs-card__tags" aria-hidden="true">
                        <span className="cs-card__tag">{c!.type}</span>
                        <span className="cs-card__tag cs-card__tag--dim">{c!.industry}</span>
                      </span>
                    </span>
                    <span className="pf-card__meta">
                      <span className="pf-card__cat">
                        {c!.industry} · {c!.year}
                      </span>
                      <span className="pf-card__title latn-display">{c!.name}</span>
                      {c!.teaser && <span className="cs-card__teaser">{c!.teaser}</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-line pt-10">
          <a className="btn btn--big" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(d.title)}`}>
            <span>{d.page.cta}</span>
            <i className="btn-arrow">↗</i>
          </a>
          <a
            href="/#cases"
            className="text-[14px] font-medium text-[var(--z-muted)] no-underline hover:text-[var(--z-ink)]"
          >
            Сначала посмотреть работы
          </a>
        </div>
      </div>
    </main>
  );
}
