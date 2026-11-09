import { forwardRef } from "react";
import { NAV_LINKS } from "../../data/content";

/**
 * Holographic navigation projected by the robot at the end of the
 * scroll transition. Real HTML links — keyboard and touch accessible,
 * removed from the tab order via `inert` while hidden (toggled by
 * HeroScene against the same progress threshold as the CSS reveal).
 */
const HoloNav = forwardRef<HTMLElement>(function HoloNav(_, ref) {
  return (
    <nav ref={ref} className="holo-nav" aria-label="Навигация по разделам">
      <div className="holo-panel">
        <span className="holo-tag">{"// NAVIGATION"}</span>
        <ul className="holo-list">
          {NAV_LINKS.map((l, i) => (
            <li key={l.href}>
              <a className="holo-link" href={l.href}>
                <span className="holo-idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="holo-label">{l.label}</span>
                <i className="holo-arrow" aria-hidden="true">
                  →
                </i>
              </a>
            </li>
          ))}
        </ul>
        <a className="holo-cta" href="/#contacts">
          Обсудить проект
        </a>
      </div>
    </nav>
  );
});

export default HoloNav;
