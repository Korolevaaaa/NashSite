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
        <a className="site-logo" href="/#top">
          ZETRONIX<span>.RU</span>
        </a>

        <div className="site-nav">
          {NAV_LINKS.map((link) =>
            "children" in link && link.children.length ? (
              <div key={link.href} className="nav-group">
                <a href={link.href} aria-haspopup="true">
                  {link.label}
                  <i className="nav-caret" aria-hidden="true">
                    ▾
                  </i>
                </a>
                <ul className="nav-drop" aria-label={link.label}>
                  {link.children.map((c) => (
                    <li key={c.href}>
                      <a href={c.href}>
                        <span>{c.label}</span>
                        <span className="nav-drop__price">{c.meta}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ),
          )}
        </div>

        <a className="site-header__cta" href="/#contacts">
          Обсудить проект
          <span aria-hidden="true">→</span>
        </a>
      </nav>
    </header>
  );
}
