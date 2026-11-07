import { useState } from "react";
import { COMPETENCIES } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import ShaderBackground from "../ui/shader-background";
import SectionHead from "./SectionHead";

const DIPLOMA_SLOTS = 6;

export default function Competencies() {
  const { ref, inView } = useInView<HTMLElement>();
  const [open, setOpen] = useState(false);

  return (
    <section
      id="competencies"
      ref={ref}
      className={`reveal zt-sec--dense relative overflow-hidden px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <ShaderBackground className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
      <div className="relative mx-auto max-w-[var(--content-max)]">
        <SectionHead
          title="Компетенции"
          sub="Стек и практики, которые мы применяем в каждом проекте."
        />

        <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
          {COMPETENCIES.map((c) => (
            <div key={c.title} className="border-t border-line pt-6">
              <h3 className="font-display text-[24px] font-medium text-[var(--z-ink)]">
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

        <button
          className="comp-toggle"
          aria-expanded={open}
          aria-controls="diplomas"
          onClick={() => setOpen((v) => !v)}
        >
          Дипломы и сертификаты
          <span className="comp-toggle__note">{DIPLOMA_SLOTS} шт.</span>
          <i className="comp-toggle__ico" aria-hidden="true">
            +
          </i>
        </button>

        <div
          id="diplomas"
          className={`comp-diplomas${open ? " is-open" : ""}`}
        >
          <div className="comp-diplomas__clip">
            <ul className="dipl-grid">
              {Array.from({ length: DIPLOMA_SLOTS }, (_, i) => (
                <li key={i} className="dipl-slot">
                  {/* slot for a future <img> — same frame, no markup change */}
                  <span className="dipl-slot__label">
                    Диплом {String(i + 1).padStart(2, "0")} — скоро
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
