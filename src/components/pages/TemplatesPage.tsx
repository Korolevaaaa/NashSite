import { CONTACT_EMAIL } from "../../data/content";
import { publishedItems } from "../../data/storefront";
import { StorefrontGrid } from "../sections/Templates";
import { useSeo } from "../../hooks/useSeo";
import WaveShader from "../ui/WaveShader";

/**
 * Витрина готовых макетов — /templates.
 * Коммерческая посадочная: «купить готовый сайт» → карточки товаров
 * с Product-офферами в ItemList JSON-LD.
 */
export default function TemplatesPage() {
  const items = publishedItems().filter((i) => i.slug);

  useSeo({
    description:
      "Витрина готовых сайтов ZETRONIX: лендинги, магазины и букинги от 20 000 ₽. Адаптируем макет под ваш бренд за 1–2 недели — дешевле разработки с нуля.",
    path: "/templates",
    title: "Готовые сайты и макеты — купить от 20 000 ₽ | ZETRONIX",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Готовые сайты и макеты — ZETRONIX",
        url: `${location.origin}/templates`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: items.map((i, n) => ({
            "@type": "ListItem",
            position: n + 1,
            item: {
              "@type": "Product",
              name: i.name,
              url: `${location.origin}/template/${i.slug}`,
              image: i.cover ? `${location.origin}${i.cover}` : undefined,
              offers: {
                "@type": "Offer",
                price: i.price,
                priceCurrency: "RUB",
                availability: "https://schema.org/InStock",
              },
            },
          })),
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: `${location.origin}/` },
          { "@type": "ListItem", position: 2, name: "Готовые макеты", item: `${location.origin}/templates` },
        ],
      },
    ],
  });

  return (
    <main className="px-[var(--page-gutter)] pb-[clamp(80px,12vh,140px)] pt-[calc(var(--header-h,110px)+56px)]">
      <div className="relative mx-auto max-w-[var(--content-max)]">
        <div className="wave-slot wave-slot--page-hero" aria-hidden="true">
          <WaveShader opacity={0.86} seed={2.8} interactive />
        </div>
        <div className="relative z-[1]">
          <a
            href="/#top"
            className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--z-muted)] no-underline hover:text-[var(--z-action)]"
          >
            ← На главную
          </a>
          <p className="mt-10 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--z-action)]">
            Витрина ZETRONIX
          </p>
          <h1 className="mt-4 font-body text-[clamp(34px,4.6vw,62px)] font-medium leading-[1.05] tracking-[-0.045em] text-[var(--z-ink)]">
            Готовые сайты и макеты
          </h1>
          <p className="mt-6 max-w-[60ch] text-[16px] leading-[1.65] text-[var(--z-muted)]">
            Проверенные дизайны, которые адаптируем под ваш бизнес за одну-две недели — быстрее
            и дешевле проекта с нуля. Выбираете макет, мы подставляем ваш бренд, тексты,
            фото и город — и сайт готов принимать заявки. Разовая оплата, сайт остаётся вашим.
          </p>
        </div>

        <div className="mt-10">
          <StorefrontGrid />
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-line pt-8">
          <a
            className="btn btn--big"
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Подобрать макет")}`}
          >
            <span>Не нашли свой вариант — подберём</span>
            <i className="btn-arrow">↗</i>
          </a>
          <a
            href="/blog/skolko-stoit-sayt"
            className="text-[14px] font-medium text-[var(--z-muted)] no-underline hover:text-[var(--z-ink)]"
          >
            Сколько стоит сайт в 2026 →
          </a>
        </div>
      </div>
    </main>
  );
}
