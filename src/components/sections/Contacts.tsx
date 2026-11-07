import { useState } from "react";
import { CONTACT_EMAIL, TELEGRAM_URL } from "../../data/content";
import { useInView } from "../../hooks/useInView";

export default function Contacts() {
  const { ref, inView } = useInView<HTMLElement>();
  const [brief, setBrief] = useState({ name: "", budget: "", task: "" });

  const subject = encodeURIComponent("Заявка с сайта zetronix.ru");
  const body = encodeURIComponent(
    [
      "Заявка с сайта",
      `Имя: ${brief.name || "—"}`,
      `Бюджет: ${brief.budget || "—"}`,
      `Задача: ${brief.task || "—"}`,
    ].join("\n"),
  );
  const mailHref = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

  return (
    <section
      id="contacts"
      ref={ref}
      className={`reveal px-[var(--page-gutter)] pb-[var(--z-sec-pad)] pt-[clamp(96px,11vw,144px)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto grid max-w-[var(--content-max)] grid-cols-1 gap-12 md:grid-cols-[minmax(0,1fr)_minmax(320px,440px)]">
        <div>
          <p className="zt-kicker">Следующий шаг</p>
          <h2 className="mt-6 font-display text-[clamp(44px,5.6vw,72px)] font-medium leading-[1.02] tracking-[-0.02em] text-[var(--z-ink)]">
            Обсудим
            <br />
            ваш проект<span className="text-[var(--z-action)]">?</span>
          </h2>
          <p className="zt-lead mt-6 max-w-[44ch]">
            Расскажите о задаче, обсудим формат и следующие шаги. Отвечаем в тот же или
            следующий рабочий день.
          </p>
          <a
            href={mailHref}
            className="group mt-10 inline-flex items-center gap-4 text-[clamp(22px,2.4vw,32px)] font-medium text-[var(--z-ink)] underline decoration-[rgba(13,17,23,0.24)] decoration-1 underline-offset-[10px] transition-colors hover:decoration-[var(--z-action)]"
          >
            {CONTACT_EMAIL}
            <svg
              className="text-[var(--z-action)] transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1"
              width="22"
              height="22"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path d="M3 13L13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </a>

          <dl className="zt-meta mt-12 space-y-2">
            <div>
              <dt className="inline">ответ — </dt>
              <dd className="inline text-[var(--z-ink)]">тот же или следующий рабочий день</dd>
            </div>
            <div>
              <dt className="inline">смета и сроки — </dt>
              <dd className="inline text-[var(--z-ink)]">фиксируются до старта</dd>
            </div>
          </dl>
        </div>

        <div className="contact-brief">
          <p className="contact-brief__title">Короткий бриф</p>
          <p className="contact-brief__hint">
            Три поля — и письмо уже наполовину написано.
          </p>
          <label className="contact-brief__field">
            <span>Имя</span>
            <input
              type="text"
              value={brief.name}
              onChange={(e) => setBrief({ ...brief, name: e.target.value })}
              placeholder="Как к вам обращаться"
              autoComplete="name"
            />
          </label>
          <label className="contact-brief__field">
            <span>Бюджет</span>
            <input
              type="text"
              value={brief.budget}
              onChange={(e) => setBrief({ ...brief, budget: e.target.value })}
              placeholder="Например: до 100 000 ₽"
            />
          </label>
          <label className="contact-brief__field">
            <span>Задача</span>
            <textarea
              rows={4}
              value={brief.task}
              onChange={(e) => setBrief({ ...brief, task: e.target.value })}
              placeholder="Что нужно сделать, в двух словах"
            />
          </label>
          <div className="contact-brief__actions">
            <a className="btn" href={mailHref}>
              Открыть письмо
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </a>
            {TELEGRAM_URL && (
              <a
                className="contact-brief__tg"
                href={TELEGRAM_URL}
                target="_blank"
                rel="noreferrer"
              >
                Написать в Telegram
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
