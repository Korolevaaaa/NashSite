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
          ...(d.page.faq?.length
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: d.page.faq.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                },
              ]
            : []),
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

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
          {/* заголовок */}
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--z-action)]">
              Направление ZETRONIX
            </p>
            <h1 className="mt-4 font-body text-[clamp(34px,4.6vw,62px)] font-medium leading-[1.05] tracking-[-0.045em] text-[var(--z-ink)]">
              {d.title}
            </h1>
            <p className="mt-6 max-w-[52ch] text-[16px] leading-[1.65] text-[var(--z-muted)]">
              {d.page.lead}
            </p>

            <ul className="mt-7 flex flex-wrap gap-2">
              {["Разовая оплата", "Смета фиксируется до старта", "Сайт остаётся вашим"].map(
                (t) => (
                  <li
                    key={t}
                    className="rounded-full border border-line bg-white/60 px-4 py-2 text-[12.5px] font-medium text-[var(--z-ink)]"
                  >
                    <span className="mr-1.5 text-[var(--z-action)]">✓</span>
                    {t}
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* липкая цена: на десктопе — справа на всю высоту, на мобиле — сразу после чипов */}
          <aside className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-[calc(var(--header-h,110px)+24px)] lg:self-start">
            <div className="rounded-[var(--r-card)] border border-line bg-white/70 p-6 shadow-[0_18px_40px_-24px_rgba(13,17,23,0.18)]">
              <p className="font-body text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--z-muted)]">
                Стоимость
              </p>
              <ul className="mt-4 space-y-3">
                {d.tiers.map((t) => (
                  <li
                    key={t.name}
                    className="flex items-baseline justify-between gap-4 border-b border-line pb-3 text-[14px]"
                  >
                    <span className="text-[var(--z-ink)]">{t.name}</span>
                    <span className="shrink-0 font-mono text-[12.5px] tracking-[0.03em] text-[var(--z-action)]">
                      {t.price}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                className="btn mt-5 w-full justify-center"
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(d.title)}`}
              >
                <span>{d.page.cta}</span>
                <i className="btn-arrow">↗</i>
              </a>
              <p className="mt-4 text-[12.5px] leading-[1.55] text-[var(--z-muted)]">
                Точная смета — после короткого брифа, фиксируется до старта. Платите один раз — сайт ваш навсегда.
              </p>
              <a
                href="/blog/skolko-stoit-sayt"
                className="mt-4 block text-[12.5px] font-medium text-[var(--z-action)] no-underline hover:underline"
              >
                Как складываются цены на сайты в 2026 →
              </a>
            </div>
          </aside>

          {/* состав + шаги */}
          <div>
            <h2 className="font-body text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--z-muted)]">
              Что входит
            </h2>
            <ul className="mt-5 space-y-4">
              {d.page.tasks.map((t) => (
                <li key={t} className="flex gap-3 text-[15px] leading-[1.6] text-[var(--z-ink)]">
                  <span aria-hidden="true" className="mt-[3px] text-[var(--z-action)]">
                    →
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            {d.page.fit?.length ? (
              <>
                <h2 className="mt-12 font-body text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--z-muted)]">
                  Кому подходит
                </h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {d.page.fit.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-line bg-white/50 px-4 py-2 text-[13px] font-medium text-[var(--z-ink)]"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <h2 className="mt-12 font-body text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--z-muted)]">
              Как стартуем
            </h2>
            <ol className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["01", "Короткий бриф", "15 минут созвона или переписки — цели, объём, референсы."],
                ["02", "Смета и план", "Фиксируем состав и цену до старта — без сюрпризов в середине."],
                ["03", "Запуск", "Публикуем на вашем домене, подключаем заявки и аналитику."],
              ].map(([n, t, txt]) => (
                <li
                  key={n}
                  className="rounded-[var(--r-card)] border border-line bg-white/50 p-5"
                >
                  <span className="font-mono text-[11px] font-semibold tracking-[0.1em] text-[var(--z-action)]">
                    {n}
                  </span>
                  <p className="mt-2 text-[14.5px] font-semibold text-[var(--z-ink)]">{t}</p>
                  <p className="mt-1.5 text-[13px] leading-[1.55] text-[var(--z-muted)]">{txt}</p>
                </li>
              ))}
            </ol>

            {d.page.faq?.length ? (
              <>
                <h2 className="mt-12 font-body text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--z-muted)]">
                  Частые вопросы
                </h2>
                <div className="post-faq mt-5">
                  {d.page.faq.map((f) => (
                    <details key={f.q} className="post-faq__item">
                      <summary>
                        {f.q}
                        <i aria-hidden="true">+</i>
                      </summary>
                      <p>{f.a}</p>
                    </details>
                  ))}
                </div>
              </>
            ) : null}
          </div>
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
