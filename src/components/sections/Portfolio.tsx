import { WORKS } from "../../data/content";
import { useInView } from "../../hooks/useInView";

export default function Portfolio() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="portfolio"
      ref={ref}
      className={`reveal bg-[linear-gradient(180deg,transparent,rgba(0,255,255,0.03)_30%,transparent)] px-[var(--page-gutter)] py-[clamp(80px,12vh,140px)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <header className="mb-14">
          <span className="mb-2.5 block font-mono text-xs tracking-[0.2em] text-accent-deep">
            02
          </span>
          <h2 className="font-display text-[clamp(34px,5vw,56px)] font-bold tracking-[-0.02em]">
            Портфолио
          </h2>
          <p className="mt-2 text-[15px] text-ink-muted">Избранные запуски</p>
        </header>

        <div className="grid border-t border-line">
          {WORKS.map((w) => (
            <a
              key={w.name}
              href="#contacts"
              className="group grid grid-cols-[1fr_auto] items-baseline gap-5 border-b border-line px-1.5 py-[26px] transition-all duration-300 hover:bg-[rgba(255,255,255,0.6)] hover:pl-5 md:grid-cols-[1fr_2fr_auto]"
            >
              <b className="font-display text-[clamp(20px,2.4vw,30px)] tracking-[0.02em] transition group-hover:[text-shadow:0_0_18px_rgba(0,255,255,0.55)]">
                {w.name}
              </b>
              <span className="hidden text-sm text-ink-muted md:inline">
                {w.kind}
              </span>
              <i className="font-mono text-xs not-italic text-ink-faint">{w.year}</i>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
