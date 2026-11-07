import { CONTACT_EMAIL, TEMPLATES } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

export default function Templates() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="templates"
      ref={ref}
      className={`reveal zt-sec px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHead
          kicker="04 · Витрина"
          title="Готовые макеты"
          sub="Готовые решения: купить и запустить быстрее, чем проект с нуля. Витрина собирается, состав уточняем."
        />

        <div className="mt-14 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {TEMPLATES.map((t, i) => (
            <article
              key={t.id}
              className={`border border-line bg-[rgba(255,255,255,0.35)] ${
                i === 1 ? "md:mt-10" : i === 2 ? "md:mt-20" : ""
              }`}
            >
              <div className="tile-grid relative h-[220px] border-b border-[var(--z-line-soft)]">
                <span className="zt-meta absolute right-4 top-4">{t.id}</span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-[20px] font-medium text-[var(--z-ink)]">
                  {t.name}
                </h3>
                <p className="mt-2 text-[14px] text-[var(--z-muted)]">{t.kind}</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Уведомите о запуске макета ${t.id}`)}`}
                  className="zt-meta mt-4 inline-flex min-h-[44px] items-center text-[var(--z-action)] underline decoration-[rgba(0,107,112,0.4)] underline-offset-4 transition-colors hover:decoration-[var(--z-action)]"
                >
                  Скоро в продаже — сообщить мне
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
