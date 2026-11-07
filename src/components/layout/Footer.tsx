import { CONTACT_EMAIL, DIRECTIONS } from "../../data/content";

export default function Footer() {
  const linkCls =
    "inline-flex min-h-[44px] items-center text-[15px] text-[var(--z-ink)] no-underline transition-colors hover:text-[var(--z-action)] md:min-h-0 md:py-1";

  return (
    <footer className="border-t border-line px-[var(--page-gutter)] py-16 font-body text-[13px] text-[var(--z-muted)]">
      <div className="mx-auto grid max-w-[var(--content-max)] grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-[16px] font-medium tracking-[-0.01em] text-[var(--z-ink)]">
            ZETRONIX<span className="text-[var(--z-action)]">.</span>RU
          </p>
          <p className="mt-3 max-w-[30ch] text-[14px] leading-[1.65]">
            Веб-студия. Сайты, интерфейсы и AI-инструменты.
          </p>
        </div>

        <nav aria-label="Разделы сайта">
          <p className="zt-meta uppercase tracking-[0.14em]">Разделы</p>
          <ul className="mt-4 space-y-1">
            {[
              ["#services", "Услуги"],
              ["#portfolio", "Портфолио"],
              ["#process", "Как мы работаем"],
              ["#faq", "Вопросы"],
            ].map(([href, label]) => (
              <li key={href}>
                <a className={linkCls} href={href}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Направления">
          <p className="zt-meta uppercase tracking-[0.14em]">Направления</p>
          <ul className="mt-4 space-y-1">
            {DIRECTIONS.map((d) => (
              <li key={d.slug}>
                <a className={linkCls} href={`#/napravlenie/${d.slug}`}>
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Связь">
          <p className="zt-meta uppercase tracking-[0.14em]">Связь</p>
          <ul className="mt-4 space-y-1">
            <li>
              <a className={linkCls} href="#contacts">
                Обсудить проект
              </a>
            </li>
            <li>
              <a className={linkCls} href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-14 flex max-w-[var(--content-max)] flex-wrap items-baseline justify-between gap-x-10 gap-y-3 border-t border-line pt-6">
        <span className="zt-meta">© 2026 ZETRONIX.RU</span>
      </div>
    </footer>
  );
}
