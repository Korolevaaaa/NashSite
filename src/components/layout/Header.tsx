import { useEffect, useState } from "react";
import { NAV_LINKS } from "../../data/content";

export default function Header() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-all duration-400 ${
        solid
          ? "bg-[rgba(244,244,244,0.72)] backdrop-blur-[14px] shadow-[0_1px_0_var(--color-line)]"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Основная навигация"
        className="mx-auto flex max-w-[var(--content-max)] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-[var(--page-gutter)] py-3 md:py-[18px]"
      >
        <a
          href="#top"
          className="font-display text-base font-bold tracking-[0.04em] md:text-[19px]"
        >
          ZETRONIX<span className="font-normal text-ink-faint">.RU</span>
        </a>

        <div className="order-3 flex basis-full justify-center gap-[22px] md:order-none md:basis-auto md:gap-[clamp(18px,3vw,40px)]">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="border-b border-transparent py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted transition-colors duration-250 hover:border-glow hover:text-ink md:text-xs md:tracking-[0.14em]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#contacts"
          className="hidden rounded-full border border-ink px-[18px] py-[9px] font-mono text-xs uppercase tracking-[0.1em] transition-all duration-300 hover:bg-ink hover:text-bg hover:shadow-[0_0_20px_rgba(0,255,255,0.55)] md:inline-block"
        >
          Заказать сайт
        </a>
      </nav>
    </header>
  );
}
