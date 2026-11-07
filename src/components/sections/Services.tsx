import { SERVICES } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

export default function Services() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="services"
      ref={ref}
      className={`reveal zt-sec--dense px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHead
          kicker="01 · Услуги"
          title="Услуги"
          sub="Полный цикл, от идеи до запуска. Сайты, боты и приложения — одна команда."
        />

        <ul className="mt-12 border-t border-line">
          {SERVICES.map((s, i) => (
            <li
              key={s.id}
              className="svc-row grid grid-cols-1 items-baseline gap-x-8 gap-y-2 border-b border-line py-9 md:grid-cols-[72px_minmax(300px,420px)_minmax(0,44ch)_auto]"
            >
              <span className="zt-meta text-[var(--z-action)]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="svc-title font-display text-[26px] font-medium leading-tight tracking-[-0.01em] text-[var(--z-ink)]">
                {s.title}
              </h3>
              <p className="max-w-[46ch] text-[15px] leading-[1.55] text-[var(--z-muted)]">
                {s.text}
              </p>
              <p className="zt-meta whitespace-nowrap text-[var(--z-action)] md:justify-self-end">
                {s.price}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
