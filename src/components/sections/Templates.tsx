import { CONTACT_EMAIL, TEMPLATES } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

export default function Templates() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="templates"
      ref={ref}
      className={`reveal zt-sec px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHead title="Готовые макеты" />

        <div className="tpl-banner">
          <div>
            <p className="zt-lead">
              Запуск за одну-две недели вместо долгого проектирования. Три
              формата появятся первыми — сообщим, когда откроется продажа.
            </p>
          </div>
          <ul className="flex flex-col">
            {TEMPLATES.map((t) => (
              <li key={t.id} className="tpl-row">
                <span className="tpl-name">{t.name}</span>
                <span className="tpl-kind">{t.kind}</span>
                <a
                  className="tpl-notify"
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Сообщите, когда появится: ${t.name}`)}`}
                >
                  Сообщить мне
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
