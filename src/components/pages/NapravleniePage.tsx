import { DIRECTIONS, NICHES } from "../../data/content";
import { useSeo } from "../../hooks/useSeo";

/**
 * Каталог направлений — /napravlenie.
 * Хаб для страниц услуг: каждая ссылка отдаёт краулеру путь к своему
 * SEO-лендингу.
 */
export default function NapravleniePage() {
  useSeo({
    description:
      "Все направления ZETRONIX: интернет-магазины, корпоративные сайты, лендинги, веб-сервисы, боты, приложения и бронирование — с ценами и примерами.",
    path: "/napravlenie",
    title: "Направления разработки — цены и примеры | ZETRONIX",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Направления разработки — ZETRONIX",
        url: `${location.origin}/napravlenie`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: DIRECTIONS.map((d, n) => ({
            "@type": "ListItem",
            position: n + 1,
            item: {
              "@type": "Service",
              name: d.title,
              url: `${location.origin}/napravlenie/${d.slug}`,
            },
          })),
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: `${location.origin}/` },
          { "@type": "ListItem", position: 2, name: "Направления", item: `${location.origin}/napravlenie` },
        ],
      },
    ],
  });

  return (
    <main className="px-[var(--page-gutter)] pb-[clamp(80px,12vh,140px)] pt-[calc(var(--header-h,110px)+56px)]">
      <div className="mx-auto max-w-[var(--content-max)]">
        <p className="mt-10 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--z-action)]">
          Специализация
        </p>
        <h1 className="mt-4 font-body text-[clamp(34px,4.6vw,62px)] font-medium leading-[1.05] tracking-[-0.045em] text-[var(--z-ink)]">
          Направления для бизнеса
        </h1>
        <p className="mt-6 max-w-[52ch] text-[16px] leading-[1.65] text-[var(--z-muted)]">
          Семь направлений — в каждом свои сроки, цены и примеры работ.
          Откройте своё, чтобы посмотреть состав работ и частые вопросы.
        </p>

        <ul className="dir-grid mt-10">
          {DIRECTIONS.map((d) => (
            <li key={d.slug} className="dir-cell">
              <a
                href={`/napravlenie/${d.slug}`}
                className="dir-cell__link"
                aria-label={`${d.title} — открыть страницу`}
              >
                <h2 className="dir-cell__title">{d.title}</h2>
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

        <h2 className="mt-16 font-body text-[clamp(20px,2.4vw,28px)] font-semibold tracking-[-0.02em] text-[var(--z-ink)]">
          По отрасли — для кого делаем
        </h2>
        <p className="mt-3 max-w-[56ch] text-[15px] leading-[1.6] text-[var(--z-muted)]">
          Если вам удобнее искать по своей нише — здесь собраны макеты и кейсы под конкретный бизнес.
        </p>
        <ul className="dir-grid dir-grid--uniform mt-8">
          {NICHES.map((n) => (
            <li key={n.slug} className="dir-cell">
              <a
                href={`/dlya/${n.slug}`}
                className="dir-cell__link"
                aria-label={`${n.title} — открыть страницу`}
              >
                <h3 className="dir-cell__title">{n.title}</h3>
                <p className="dir-cell__text">{n.text}</p>
                <span className="dir-cell__foot">
                  <span className="price">{n.price}</span>
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
    </main>
  );
}
