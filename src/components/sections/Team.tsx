import { TEAM_ROLES } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

export default function Team() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="team"
      ref={ref}
      className={`reveal zt-sec px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHead
          kicker="06 · Команда"
          title="Команда"
          sub="Компактная команда без прокладок: с вами говорят те, кто делает. Знакомим лично на созвоне."
        />

        <p className="mt-12 max-w-[46ch] font-display text-[clamp(22px,2.4vw,32px)] font-medium leading-[1.35] tracking-[-0.005em] text-[var(--z-ink)]">
          {TEAM_ROLES.map((r, i) => (
            <span key={r}>
              {i > 0 && (
                <span aria-hidden="true" className="mx-3 text-[var(--z-action)]">
                  /
                </span>
              )}
              {r}
            </span>
          ))}
        </p>

        <p className="mt-8 inline-flex items-baseline gap-3 border-b border-dashed border-[rgba(13,17,23,0.2)] pb-3">
          <span className="zt-meta">слот</span>
          <span className="text-[14px] text-[var(--z-muted)]">
            имена и фото добавим сюда после знакомства — сетка не меняется
          </span>
        </p>
      </div>
    </section>
  );
}
