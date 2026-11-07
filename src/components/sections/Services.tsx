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
          title="Услуги"
          sub="Сайты, боты и приложения. Цена справа — стартовый пакет, точную смету считаем после брифа."
        />

        <ul className="mt-12 border-t border-line">
          {SERVICES.map((s) => (
            <li
              key={s.id}
              className="svc-row grid grid-cols-1 items-baseline gap-x-8 gap-y-2 border-b border-line py-9 md:grid-cols-[minmax(300px,420px)_minmax(0,44ch)_auto]"
            >
              <h3 className="svc-title font-display text-[26px] font-medium leading-tight tracking-[-0.01em] text-[var(--z-ink)]">
                {s.title}
              </h3>
              <p className="max-w-[46ch] text-[15px] leading-[1.55] text-[var(--z-muted)]">
                {s.text}
              </p>
              <p className="price md:justify-self-end">{s.price}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
