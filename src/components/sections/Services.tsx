import { SERVICES } from "../../data/content";
import { useInView } from "../../hooks/useInView";

export default function Services() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="services"
      ref={ref}
      className={`reveal px-[var(--page-gutter)] py-[clamp(80px,12vh,140px)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <header className="mb-12">
          <h2 className="font-body text-[clamp(28px,3.4vw,42px)] font-medium tracking-[-0.035em] text-[var(--z-ink)]">
            Услуги
          </h2>
          <p className="mt-2 text-[15px] text-[var(--z-muted)]">
            Полный цикл: от идеи до запуска
          </p>
        </header>

        <div className="grid gap-y-8 border-t border-line md:grid-cols-3 md:gap-x-10 md:gap-y-0">
          {SERVICES.map((s, i) => (
            <article
              key={s.id}
              className={`border-b border-line pb-8 pt-8 md:border-b-0 md:pb-0 md:pt-9 ${
                i > 0 ? "md:border-l md:border-line md:pl-10" : ""
              }`}
            >
              <h3 className="font-body text-[19px] font-medium tracking-[-0.02em] text-[var(--z-ink)]">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-[1.6] text-[var(--z-muted)]">
                {s.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
