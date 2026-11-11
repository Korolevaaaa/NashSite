import { useEffect, useRef, useState } from "react";
import { NAV_LINKS, TELEGRAM_URL } from "../../data/content";
import { LEGAL } from "../../data/legal";
import { ArrowUpRight, X, Phone, TelegramLogo } from "../ui/icons";

/* Mobile OS chrome: scroll beam + bottom-sheet menu.
   The menu trigger lives in the header (`.site-header__menu`) and opens
   the sheet via the "ztx:open-menu" event — the bottom-right corner is
   reserved for the upcoming chat-bot button.
   CSS hides this component at ≥768px. */

function useScrollBeam(beamRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const max = document.documentElement.scrollHeight - innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        if (beamRef.current) beamRef.current.style.transform = `scaleX(${p})`;
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [beamRef]);
}

/* Sheet hints: only where the hint carries data, not an echo of the label. */
const SHEET_HINTS: Record<string, string> = {
  "Услуги и цены": "от 5 000 ₽",
  "Готовые сайты": "запуск за 1–2 недели",
};

const TEL_HREF = `tel:${LEGAL.phone.replace(/[^\d+]/g, "")}`;

function MenuSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const [dragY, setDragY] = useState(0);
  const drag = useRef({ active: false, startY: 0, lastY: 0, lastT: 0, vel: 0 });

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => {
    setLeaving(true);
    setTimeout(() => {
      setLeaving(false);
      setDragY(0);
      onClose();
    }, 340);
  };

  const down = (e: React.PointerEvent) => {
    drag.current = {
      active: true,
      startY: e.clientY,
      lastY: e.clientY,
      lastT: performance.now(),
      vel: 0,
    };
  };
  const move = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const d = Math.max(0, e.clientY - drag.current.startY);
    const now = performance.now();
    const dt = now - drag.current.lastT;
    if (dt > 0) drag.current.vel = ((e.clientY - drag.current.lastY) / dt) * 1000;
    drag.current.lastY = e.clientY;
    drag.current.lastT = now;
    if (d > 4) setDragY(d);
  };
  const up = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (dragY > 110 || drag.current.vel > 550) {
      navigator.vibrate?.(8);
      close();
    } else setDragY(0);
  };

  if (!open) return null;

  return (
    <div className={`m-sheet${leaving ? " is-leaving" : ""}`}>
      <div className="m-sheet__backdrop" onClick={close} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Меню"
        className="m-sheet__panel"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: dragY ? "none" : undefined,
        }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <div className="m-sheet__bg" aria-hidden="true" />
        <div className="m-sheet__handle" aria-hidden="true" />
        <div className="m-sheet__head">
          <span className="m-sheet__label">{"// Меню"}</span>
          <button className="m-sheet__close" onClick={close} aria-label="Закрыть меню">
            <X size={16} weight="bold" />
          </button>
        </div>
        <nav aria-label="Меню">
          <ul className="m-sheet__list">
            {NAV_LINKS.map((l, i) => {
              const hint = SHEET_HINTS[l.label];
              return (
                <li key={l.href} style={{ animationDelay: `${60 + i * 45}ms` }}>
                  <a href={l.href} onClick={onClose}>
                    <span className="m-sheet__n">{String(i + 1).padStart(2, "0")}</span>
                    <span className="m-sheet__t">
                      <span className="m-sheet__name">{l.label}</span>
                      {hint && <span className="m-sheet__hint">{hint}</span>}
                    </span>
                    <ArrowUpRight size={16} weight="regular" className="m-sheet__arrow" />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="m-sheet__actions">
          {TELEGRAM_URL && (
            <a className="m-sheet__action" href={TELEGRAM_URL} target="_blank" rel="noreferrer">
              <TelegramLogo size={17} weight="fill" />
              Telegram
            </a>
          )}
          <a className="m-sheet__action m-sheet__action--solid" href={TEL_HREF}>
            <Phone size={15} weight="bold" />
            Позвонить
          </a>
        </div>
        <div className="m-sheet__safe" />
      </div>
    </div>
  );
}

export default function MobileChrome() {
  const beamRef = useRef<HTMLDivElement | null>(null);
  useScrollBeam(beamRef);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const open = () => setMenuOpen(true);
    document.addEventListener("ztx:open-menu", open);
    return () => document.removeEventListener("ztx:open-menu", open);
  }, []);

  return (
    <div className="m-chrome">
      <div ref={beamRef} className="m-beam" aria-hidden="true" />
      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
