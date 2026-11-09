import { useEffect, useState } from "react";
import { TEMPLATES } from "../../data/templates";
import { CONTACT_EMAIL } from "../../data/content";

const priceFmt = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

/** Template detail page — #/template/<slug>. Product + FAQ JSON-LD. */
export default function TemplatePage({ slug }: { slug: string }) {
  const t = TEMPLATES.find((x) => x.slug === slug);
  const mailSubject = encodeURIComponent(`Хочу купить макет: ${t?.name ?? slug}`);
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoom]);

  useEffect(() => {
    if (!t) return;
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Product",
          name: t.name,
          description: t.description,
          image: `https://zetronix.ru${t.hero}`,
          category: t.category,
          brand: { "@type": "Organization", name: "ZETRONIX" },
          offers: {
            "@type": "Offer",
            price: t.price,
            priceCurrency: "RUB",
            availability: "https://schema.org/InStock",
          },
        },
        {
          "@type": "FAQPage",
          mainEntity: t.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
      ],
    });
    document.head.appendChild(el);
    return () => el.remove();
  }, [t]);

  if (!t) {
    return (
      <main className="px-[var(--page-gutter)] py-[160px]">
        <div className="mx-auto max-w-[var(--content-max)]">
          <p className="text-[var(--z-muted)]">Макет не найден.</p>
          <a className="btn mt-6" href="#templates">
            ← Все макеты
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="px-[var(--page-gutter)] pb-[clamp(80px,12vh,140px)] pt-[calc(var(--header-h,110px)+56px)]">
      <div className="mx-auto max-w-[var(--content-max)]">
        <a
          href="#templates"
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--z-muted)] no-underline hover:text-[var(--z-action)]"
        >
          ← Готовые макеты
        </a>

        <p className="mt-10 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--z-action)]">
          Готовый макет · {t.category}
        </p>
        <h1 className="mt-4 max-w-[22ch] font-body text-[clamp(30px,4.2vw,54px)] font-medium leading-[1.08] tracking-[-0.04em] text-[var(--z-ink)]">
          {t.title}
        </h1>
        <p className="mt-6 max-w-[56ch] text-[16px] leading-[1.65] text-[var(--z-muted)]">
          {t.description}
        </p>

        <button
          type="button"
          className="case-hero tpl-zoom"
          aria-label={`Увеличить скриншот: ${t.name}`}
          onClick={() => setZoom({ src: t.hero, alt: `Скриншот макета «${t.name}»` })}
        >
          <span className="case-hero__chrome" aria-hidden="true">
            <i /><i /><i />
          </span>
          <img src={t.hero} alt={`Скриншот макета «${t.name}»`} />
        </button>

        <div className="tpl-layout">
          <div className="tpl-main">
            <section aria-label="Что внутри">
              <h2 className="tpl-h2">Что внутри</h2>
              <ul className="tpl-features">
                {t.features.map((f) => (
                  <li key={f.t} className="tpl-feature">
                    <h3 className="tpl-feature__t">{f.t}</h3>
                    <p className="tpl-feature__d">{f.d}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-label="Экраны макета">
              <h2 className="tpl-h2">Экраны</h2>
              <div className="tpl-shots">
                {t.shots.map((s) => (
                  <figure key={s.src} className="tpl-shot">
                    <button
                      type="button"
                      className="tpl-zoom"
                      aria-label={`Увеличить скриншот: ${s.label}`}
                      onClick={() => setZoom({ src: s.src, alt: s.label })}
                    >
                      <img src={s.src} alt={s.label} loading="lazy" />
                    </button>
                    <figcaption>{s.label}</figcaption>
                  </figure>
                ))}
              </div>
            </section>

            <section aria-label="Можно подключить дополнительно">
              <h2 className="tpl-h2">Можно подключить дополнительно</h2>
              <ul className="tpl-features tpl-features--upsell">
                {t.upsells.map((f) => (
                  <li key={f.t} className="tpl-feature">
                    <h3 className="tpl-feature__t">{f.t}</h3>
                    <p className="tpl-feature__d">{f.d}</p>
                  </li>
                ))}
              </ul>
              <p className="tpl-upsell-note">
                Стоимость доработок считаем отдельно — после короткого обсуждения задачи.
              </p>
            </section>

            <section aria-label="Кому подходит">
              <h2 className="tpl-h2">Кому подходит</h2>
              <ul className="tpl-fit">
                {t.fitFor.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </section>

            <section aria-label="Вопросы о макете">
              <h2 className="tpl-h2">Вопросы и ответы</h2>
              <div className="tpl-faq">
                {t.faq.map((f) => (
                  <details key={f.q} className="tpl-faq__item">
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside className="tpl-aside">
            <div className="tpl-buy">
              <p className="tpl-buy__label">Готовый макет</p>
              <p className="tpl-buy__price">от {priceFmt.format(t.price)}</p>
              {t.priceNote && <p className="tpl-buy__note">{t.priceNote}</p>}
              <a
                className="btn tpl-buy__cta"
                href={`mailto:${CONTACT_EMAIL}?subject=${mailSubject}`}
              >
                <span>Купить макет</span>
                <i className="btn-arrow">↗</i>
              </a>
              <ul className="tpl-buy__list">
                {t.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {zoom && (
        <div
          className="case-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={zoom.alt}
          onClick={() => setZoom(null)}
        >
          <button
            type="button"
            className="case-lightbox__close"
            aria-label="Закрыть"
            onClick={() => setZoom(null)}
          >
            ×
          </button>
          <img src={zoom.src} alt={zoom.alt} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </main>
  );
}
