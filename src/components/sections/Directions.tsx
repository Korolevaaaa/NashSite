import { DIRECTIONS } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

export default function Directions() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="directions"
      ref={ref}
      className={`reveal zt-sec--dense px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHead
          kicker="02 · Направления"
          title="Направления для бизнеса"
          sub="Под каждый тип проекта — отдельная страница для поиска и рекламы."
          split
        />

        <ul className="dir-list mt-12 border-t border-line">
          {DIRECTIONS.map((d, i) => (
            <li key={d.slug} className="border-b border-line transition-opacity duration-200">
              <a
                href={`#/napravlenie/${d.slug}`}
                className="dir-row grid grid-cols-[1fr_44px] items-center gap-x-5 py-7 no-underline outline-none md:grid-cols-[72px_minmax(300px,420px)_minmax(0,44ch)_auto_48px] md:gap-x-8"
                aria-label={`${d.title} — открыть страницу`}
              >
                <span
                  aria-hidden="true"
                  className="dir-ghost col-start-1 row-start-1 mb-2 text-[28px] font-medium leading-none md:col-auto md:row-auto md:mb-0 md:text-[40px]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="col-start-1 row-start-2 min-w-0 md:col-auto md:row-auto">
                  <span className="dir-name block w-fit pb-1 font-display text-[22px] font-medium tracking-[-0.01em] text-[var(--z-ink)] md:text-[28px]">
                    {d.title}
                  </span>
                  <span className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-0.5 text-[13px] leading-[1.55] text-[var(--z-muted)] md:hidden">
                    <span>{d.text}</span>
                    <span className="zt-meta shrink-0 text-[var(--z-action)]">{d.price}</span>
                  </span>
                </span>
                <span className="hidden max-w-[44ch] text-[15px] leading-[1.55] text-[var(--z-muted)] md:block">
                  {d.text}
                </span>
                <span className="zt-meta hidden whitespace-nowrap text-[var(--z-action)] md:block md:justify-self-end">
                  {d.price}
                </span>
                <span className="dir-arrow col-start-2 row-span-2 row-start-1 flex h-11 w-11 items-center justify-center self-start border border-line text-[14px] text-[var(--z-ink)] md:col-auto md:row-auto md:row-span-1 md:h-12 md:w-12 md:self-center">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 13L13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
