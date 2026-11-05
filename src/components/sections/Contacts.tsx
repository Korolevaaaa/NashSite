import { CONTACT_EMAIL } from "../../data/content";
import { useInView } from "../../hooks/useInView";

export default function Contacts() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="contacts"
      ref={ref}
      className={`reveal px-[var(--page-gutter)] py-[clamp(80px,12vh,140px)] text-center ${inView ? "is-in" : ""}`}
    >
      <p className="mb-4 font-mono text-xs tracking-[0.2em] text-accent-deep">
        {"03 // CONTACT"}
      </p>
      <h2 className="font-display text-[clamp(34px,5vw,56px)] font-bold tracking-[-0.02em]">
        Готовы к запуску?
      </h2>
      <p className="mb-1.5 mt-3.5 text-ink-muted">
        Напишите нам — ответим в течение часа.
      </p>
      <a className="btn btn--big mt-6" href={`mailto:${CONTACT_EMAIL}`}>
        <span>{CONTACT_EMAIL}</span>
        <i className="btn-arrow">→</i>
      </a>
    </section>
  );
}
