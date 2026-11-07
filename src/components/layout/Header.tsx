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
    <header className={`site-header${solid ? " is-solid" : ""}`}>
      <nav className="site-header__inner" aria-label="Основная навигация">
        <a className="site-logo" href="#top">
          ZETRONIX<span>.RU</span>
        </a>

        <div className="site-nav">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>

        <a className="site-header__cta" href="#contacts">
          Обсудить проект
          <span aria-hidden="true">→</span>
        </a>
      </nav>
    </header>
  );
}
