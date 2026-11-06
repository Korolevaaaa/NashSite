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
      <h2 className="font-body text-[clamp(28px,3.4vw,42px)] font-medium tracking-[-0.035em] text-[var(--z-ink)]">
        Обсудим ваш проект?
      </h2>
      <p className="mb-1.5 mt-3.5 text-[15px] text-[var(--z-muted)]">
        Расскажите о задаче — обсудим формат и следующие шаги.
      </p>
      <a className="btn btn--big mt-7" href={`mailto:${CONTACT_EMAIL}`}>
        <span>{CONTACT_EMAIL}</span>
        <i className="btn-arrow">→</i>
      </a>
    </section>
  );
}
