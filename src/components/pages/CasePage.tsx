import { useEffect, useRef, useState } from "react";
import { CASES, type CaseStoryStep } from "../../data/cases";
import { CONTACT_EMAIL } from "../../data/content";

/** Case detail page — #/case/<slug>
 *  Hero → metrics → story steps with a sticky screenshot column
 *  (shot swaps as the reader scrolls) → full gallery strip → CTA + next case. */
export default function CasePage({ slug }: { slug: string }) {
  const idx = CASES.findIndex((c) => c.slug === slug);
  const c = idx >= 0 ? CASES[idx] : null;
  const next = CASES[(idx + 1) % CASES.length];

  const steps: CaseStoryStep[] = c?.story ?? [];
  const shotSteps = steps.filter((s) => s.shot);
  const [activeShot, setActiveShot] = useState<string | null>(shotSteps[0]?.shot ?? null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = stepsRef.current;
    if (!root || shotSteps.length < 2) return;
    const els = root.querySelectorAll<HTMLElement>("[data-shot]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveShot((e.target as HTMLElement).dataset.shot ?? null);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [slug, shotSteps.length]);

  useEffect(() => {
    if (!c) return;
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "ld-case";
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: c.title || c.name,
      description: c.teaser,
      dateCreated: String(c.year),
      creator: { "@type": "Organization", name: "ZETRONIX", url: "https://zetronix.ru" },
      ...(c.url ? { url: c.url } : {}),
    });
    document.head.appendChild(el);
    return () => el.remove();
  }, [c]);

  if (!c) {
    return (
      <main className="px-[var(--page-gutter)] py-[160px]">
        <div className="mx-auto max-w-[var(--content-max)]">
          <p className="text-[var(--z-muted)]">Кейс не найден.</p>
          <a className="btn mt-6" href="#/cases">
            ← Все кейсы
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="px-[var(--page-gutter)] pb-[clamp(80px,12vh,140px)] pt-[calc(var(--header-h,110px)+56px)]">
      <div className="mx-auto max-w-[var(--content-max)]">
        <a
          href="#/cases"
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--z-muted)] no-underline hover:text-[var(--z-action)]"
        >
          ← Все кейсы
        </a>

        <p className="mt-10 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--z-action)]">
          {c.type} · {c.industry} · {c.year}
          {c.client ? ` · ${c.client}` : ""}
        </p>
        <h1 className="mt-4 font-body text-[clamp(34px,4.6vw,62px)] font-medium leading-[1.05] tracking-[-0.045em] text-[var(--z-ink)]">
          {c.title || c.name}
        </h1>
        {c.teaser && (
          <p className="mt-6 max-w-[52ch] text-[16px] leading-[1.65] text-[var(--z-muted)]">
            {c.teaser}
          </p>
        )}
        {c.url && (
          <a
            className="mt-4 inline-block text-[14px] font-medium text-[var(--z-action)]"
            href={c.url}
            target="_blank"
            rel="noreferrer"
          >
            Открыть сайт ↗
          </a>
        )}

        {c.hero && (
          <figure className="case-hero">
            <span className="case-hero__chrome" aria-hidden="true">
              <i /><i /><i />
            </span>
            <img src={c.hero} alt={`Скриншот проекта ${c.name}`} />
          </figure>
        )}

        {c.metrics.length > 0 && (
          <ul className="case-metrics">
            {c.metrics.map((m) => (
              <li key={m.label} className="case-metrics__item">
                <span className="case-metrics__value">{m.value}</span>
                <span className="case-metrics__label">{m.label}</span>
              </li>
            ))}
          </ul>
        )}

        {steps.length > 0 && (
          <div className={`case-story${shotSteps.length > 0 ? " case-story--shots" : ""}`} ref={stepsRef}>
            <div className="case-story__steps">
              {steps.map((s) => (
                <section key={s.heading} className="case-step" data-shot={s.shot ?? undefined}>
                  <h2 className="case-step__head">{s.heading}</h2>
                  <p className="case-step__text">{s.text}</p>
                  {s.shot && (
                    <img className="case-step__shotmob" src={s.shot} alt="" loading="lazy" />
                  )}
                </section>
              ))}
            </div>
            {shotSteps.length > 0 && (
              <div className="case-story__sticky" aria-hidden="true">
                {shotSteps.map((s) => (
                  <img
                    key={s.shot}
                    src={s.shot}
                    alt=""
                    className={`case-story__shot${activeShot === s.shot ? " is-active" : ""}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {c.gallery.length > 0 && (
          <section className="case-gallery" aria-label="Экраны проекта">
            <h2 className="case-step__head">Экраны</h2>
            <div className="case-gallery__strip">
              {c.gallery.map((g, i) => (
                <img key={i} src={g} alt={`${c.name} — экран ${i + 1}`} loading="lazy" />
              ))}
            </div>
          </section>
        )}

        <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-line pt-10">
          <a
            className="btn btn--big"
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Проект как ${c.name}`)}`}
          >
            <span>Обсудить похожий проект</span>
            <i className="btn-arrow">↗</i>
          </a>
          {next && next.slug !== c.slug && (
            <a
              href={`#/case/${next.slug}`}
              className="text-[14px] font-medium text-[var(--z-muted)] no-underline hover:text-[var(--z-ink)]"
            >
              Следующий кейс: {next.name} →
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
