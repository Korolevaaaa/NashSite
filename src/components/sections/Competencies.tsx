import { useState } from "react";
import { COMPETENCIES } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";
import WaveShader from "../ui/WaveShader";

const DIPLOMA_SLOTS = 6;

export default function Competencies() {
  const { ref, inView } = useInView<HTMLElement>();
  const [open, setOpen] = useState(false);

  return (
    <section
      id="competencies"
      ref={ref}
      className={`reveal zt-sec--dense px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="relative mx-auto max-w-[var(--content-max)]">
        <div className="wave-slot wave-slot--competencies" aria-hidden="true">
          <WaveShader
          opacity={0.82}
          seed={3.8}
          variant="loop"
          interactive
          loop={{ xTurn: 0.87, yMid: 0.50, rY: 0.33, rX: 0.10, entry: 0.155, exit: 0.96 }}
        />
        </div>
        <div className="relative z-[1]">
          <SectionHead
            title="Компетенции"
            sub="Стек и практики, которые мы применяем в каждом проекте."
          />
        </div>

        <div className="relative z-[1] mt-12 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
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
