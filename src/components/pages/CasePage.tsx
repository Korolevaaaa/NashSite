import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CASES, type CaseStoryStep } from "../../data/cases";
import { CONTACT_EMAIL } from "../../data/content";
import { CaseMotion } from "../ui/case-motion";

/** Case detail page — #/case/<slug>
 *  Hero → metrics → story as fullscreen slides (each step is a tall
 *  "slide" with its own screenshot; a floating counter/arrows pill
 *  tracks progress; scroll stays native) → gallery strip → CTA. */
export default function CasePage({ slug }: { slug: string }) {
  const idx = CASES.findIndex((c) => c.slug === slug);
  const c = idx >= 0 ? CASES[idx] : null;
  const next = CASES[(idx + 1) % CASES.length];
  // only filled cases (title present) qualify for the "Ещё проекты" strip
  const related = CASES.filter((x) => x.slug !== slug && x.title).slice(0, 3);

  const steps: CaseStoryStep[] = c?.story ?? [];
  const [activeStep, setActiveStep] = useState(0);
  const [storyInView, setStoryInView] = useState(false);
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

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

  // scoped scroll-snap: only while a case page with steps is mounted
  useEffect(() => {
    const el = document.documentElement;
    el.classList.add("has-case-slides");
    return () => el.classList.remove("has-case-slides");
  }, []);

  // step tracking: which slide is near viewport center → counter + reveal
  useEffect(() => {
    const root = stepsRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>(".case-step"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) {
            el.classList.add("is-in");
            const i = els.indexOf(el);
            if (i >= 0) setActiveStep(i);
          } else if (e.boundingClientRect.bottom < 0) {
            // slide already scrolled past (e.g. deep-link mid-page) — keep it revealed
            el.classList.add("is-in");
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [slug, steps.length]);

  // show the counter/arrows pill only while the story block is on screen
  useEffect(() => {
    const root = stepsRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([e]) => setStoryInView(e.isIntersecting));
    io.observe(root);
    return () => io.disconnect();
  }, [slug]);

  // subtle parallax: each slide's screenshot drifts a few px with scroll
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = stepsRef.current;
    if (reduced || !root) return;
    const shots = Array.from(
      root.querySelectorAll<HTMLElement>(".case-step__shot img"),
    );
    if (!shots.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = innerHeight;
      for (const img of shots) {
        const r = img.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        img.style.transform = `translateY(${(p * -22).toFixed(1)}px)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [slug, steps.length]);

  // metrics cascade-in once the strip enters view
  const metricsRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = metricsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "-20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [slug]);

  const goStep = (i: number) => {
    const root = stepsRef.current;
    if (!root) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
    const els = root.querySelectorAll<HTMLElement>(".case-step");
    if (i < 0 || i >= els.length) {
      const nextEl = (i < 0 ? root.previousElementSibling : root.nextElementSibling) as HTMLElement | null;
      (nextEl ?? root).scrollIntoView({ behavior, block: "start" });
    } else {
      els[i].scrollIntoView({ behavior, block: "start" });
    }
  };

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
            className="btn case-url"
            href={c.url}
            target="_blank"
            rel="noreferrer"
          >
            <span>Открыть сайт</span>
            <i className="btn-arrow">↗</i>
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
          <ul className="case-metrics" ref={metricsRef}>
            {c.metrics.map((m, i) => (
              <li
                key={m.label}
                className="case-metrics__item"
                style={{ "--i": i } as CSSProperties}
              >
                <span className="case-metrics__value">{m.value}</span>
                <span className="case-metrics__label">{m.label}</span>
              </li>
            ))}
          </ul>
        )}

        {steps.length > 0 && (
          <div className="case-story" ref={stepsRef}>
            <div className="case-story__steps">
              {steps.map((s, i) => (
                <section key={s.heading} className="case-step">
                  <div className="case-step__body">
                    <span className="case-step__num">
                      {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                    </span>
                    <h2 className="case-step__head">{s.heading}</h2>
                    <p className="case-step__text">{s.text}</p>
                    {s.motion && (
                      <CaseMotion
                        kind={s.motion}
                        chat={s.chat}
                        items={s.inboxItems}
                        inboxTitle={s.inboxTitle}
                        inboxCaption={s.inboxCaption}
                        bars={s.barLabels}
                        order={s.order}
                      />
                    )}
                  </div>
                  {s.report && (
                    <CaseMotion kind="report" report={s.report} />
                  )}
                  {s.shot && (
                    <button
                      type="button"
                      className="case-step__shot"
                      aria-label={`Увеличить скриншот: ${s.heading}`}
                      onClick={() => setZoom({ src: s.shot!, alt: s.heading })}
                    >
                      <img src={s.shot} alt="" loading="lazy" />
                    </button>
                  )}
                </section>
              ))}
            </div>
          </div>
        )}

        {c.gallery.length > 0 && (
          <section className="case-gallery" aria-label="Экраны проекта">
            <h2 className="case-step__head">Экраны</h2>
            <div className="case-gallery__strip">
              {c.gallery.map((g, i) => (
                <button
                  key={i}
                  type="button"
                  className="case-gallery__item"
                  aria-label={`Увеличить экран ${i + 1}`}
                  onClick={() => setZoom({ src: g, alt: `${c.name} — экран ${i + 1}` })}
                >
                  <img src={g} alt="" loading="lazy" />
                </button>
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

        {related.length > 0 && (
          <section className="case-related" aria-label="Ещё проекты">
            <div className="case-related__head">
              <h2 className="case-step__head">Ещё проекты</h2>
              <a
                href="#/cases"
                className="text-[14px] font-medium text-[var(--z-muted)] no-underline hover:text-[var(--z-ink)]"
              >
                Все кейсы →
              </a>
            </div>
            <ul className="pf-grid">
              {related.map((x) => (
                <li key={x.slug}>
                  <a className="pf-card cs-card" href={`#/case/${x.slug}`}>
                    <span className="pf-card__cover">
                      {x.cover ? (
                        <img src={x.cover} alt="" loading="lazy" />
                      ) : (
                        <span className="pf-card__mark latn-display" aria-hidden="true">
                          {x.name}
                        </span>
                      )}
                      <span className="pf-card__tint" aria-hidden="true" />
                      <span className="cs-card__tags" aria-hidden="true">
                        <span className="cs-card__tag">{x.type}</span>
                        <span className="cs-card__tag cs-card__tag--dim">{x.industry}</span>
                      </span>
                    </span>
                    <span className="pf-card__meta">
                      <span className="pf-card__cat">
                        {x.industry} · {x.year}
                      </span>
                      <span className="pf-card__title latn-display">{x.name}</span>
                      {x.teaser && <span className="cs-card__teaser">{x.teaser}</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {steps.length > 1 && storyInView && (
        <nav className="case-steps-nav" aria-label="Навигация по слайдам кейса">
          <button
            type="button"
            aria-label="Предыдущий слайд"
            disabled={activeStep === 0}
            onClick={() => goStep(activeStep - 1)}
          >
            ↑
          </button>
          <span className="case-steps-nav__count">
            <span className="case-steps-nav__cur-wrap">
              <b key={activeStep} className="case-steps-nav__cur">
                {String(activeStep + 1).padStart(2, "0")}
              </b>
              {" / "}
              {String(steps.length).padStart(2, "0")}
            </span>
            <i className="case-steps-nav__bar">
              <i style={{ transform: `scaleX(${(activeStep + 1) / steps.length})` }} />
            </i>
          </span>
          <button type="button" aria-label="Следующий слайд" onClick={() => goStep(activeStep + 1)}>
            ↓
          </button>
        </nav>
      )}

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
