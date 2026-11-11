import { SERVICES } from "../../data/content";
import { ArrowUpRight } from "../ui/icons";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";
import WaveShader from "../ui/WaveShader";

export default function Services() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="services"
      ref={ref}
      className={`reveal zt-sec--dense px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="relative mx-auto max-w-[var(--content-max)]">
        <div className="wave-slot wave-slot--services" aria-hidden="true">
          <WaveShader opacity={0.84} seed={6.1} interactive />
        </div>
        <div className="relative z-[1]">
          <SectionHead
            title="Услуги"
            sub="Сайты, боты и приложения. Цены указаны за стартовый пакет. Точную смету считаем после брифа."
          />
        </div>

        <ul className="svc-acc mt-8 md:hidden">
          {SERVICES.map((s, i) => (
            <li key={s.id}>
              <details>
                <summary>
                  <span className="svc-acc__n" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="svc-acc__main">
                    <span className="svc-acc__title">{s.title}</span>
                    <span className="svc-acc__price">{s.price}</span>
                  </span>
                  <span className="svc-acc__plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="svc-acc__body">
                  <p>{s.text}</p>
                  <a href="/napravlenie" className="svc-acc__link">
                    Подробнее
                    <ArrowUpRight size={15} weight="regular" />
                  </a>
                </div>
              </details>
            </li>
          ))}
        </ul>

        <ul className="mt-12 hidden border-t border-line md:block">
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
