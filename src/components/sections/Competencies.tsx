import { COMPETENCIES } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

export default function Competencies() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="competencies"
      ref={ref}
      className={`reveal zt-sec--dense px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHead
          kicker="07 · Компетенции"
          title="Компетенции"
          sub="Чем занимаемся каждый день. Дипломы и сертификаты покажем на созвоне."
          split
        />

        <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
          {COMPETENCIES.map((c, i) => (
            <div key={c.title} className="border-t border-line pt-6">
              <p className="zt-meta text-[var(--z-action)]">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 font-display text-[24px] font-medium text-[var(--z-ink)]">
                {c.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {c.items.map((t) => (
                  <li key={t} className="zt-chip">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
