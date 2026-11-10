import { TEAM_ROLES } from "../../data/content";
import { PARTNERS, initialsOf } from "../../data/partners";
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
          title="Команда"
          sub="Шесть ролей закрывают проект целиком. С вами говорят те, кто делает работу."
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
        <p className="zt-meta mt-8 max-w-[46ch]">
          Знакомим лично на первом созвоне — с теми, кто будет делать ваш проект.
        </p>

        {PARTNERS.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-4">
            {PARTNERS.map((p) => (
              <li
                key={p.ref}
                className="flex items-center gap-3 rounded-2xl border border-[var(--z-line)] bg-white px-4 py-3"
              >
                {p.photo ? (
                  <img
                    src={p.photo}
                    alt={p.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 place-items-center rounded-full bg-[var(--z-ink)] text-[12px] font-semibold text-white"
                  >
                    {initialsOf(p.name)}
                  </span>
                )}
                <span>
                  <span className="block text-[14px] font-medium text-[var(--z-ink)]">
                    {p.name}
                  </span>
                  <span className="block text-[11px] text-[var(--z-ink)]/55">
                    {p.role}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
