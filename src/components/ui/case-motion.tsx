/* Drawn, CSS-driven motion graphics for case story slides.
   Each kind loops a small narrative diagram tied to the slide's point.
   Scripts/labels come from the case data — never hardcoded here.
   Everything is pure DOM/CSS — hidden entirely under reduced-motion. */

import { useEffect, useRef, useState, type CSSProperties } from "react";

export type CaseMotionKind = "chats" | "chat" | "inbox" | "bars" | "order" | "report";

export interface CaseMotionProps {
  kind: CaseMotionKind;
  chat?: { botName: string; u1: string; b1: string; u2: string; b2: string; sent: string };
  items?: { src: string; text: string }[];
  bars?: { old: string; new: string };
  report?: { title: string; scores: { label: string; score: number }[]; note?: string };
}

/* counts 0→to once the parent .case-step enters the middle band */
function useCountUp(to: number) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const step = ref.current?.closest(".case-step");
    if (!step) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setV(to);
          return;
        }
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / 1000);
          setV(Math.round(to * (1 - (1 - p) ** 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    io.observe(step);
    return () => io.disconnect();
  }, [to]);
  return { ref, v };
}

function ScoreRow({ label, score, i }: { label: string; score: number; i: number }) {
  const { ref, v } = useCountUp(score);
  return (
    <div className="cm-rep__row" style={{ "--i": i, "--s": score / 100 } as CSSProperties}>
      <span className="cm-rep__label">{label}</span>
      <span className="cm-rep__track">
        <i className="cm-rep__fill" />
      </span>
      <span ref={ref} className="cm-rep__num">
        {v}
      </span>
    </div>
  );
}

export function CaseMotion({ kind, chat, items, bars, report }: CaseMotionProps) {
  if (kind === "chats") {
    return (
      <div className="cm cm-chats" aria-hidden="true">
        <div className="cm-chats__row">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <i key={i} className="cm-bubble" style={{ "--i": i } as CSSProperties} />
          ))}
        </div>
        <span className="cm-cap">десятки одинаковых диалогов в переписке</span>
      </div>
    );
  }

  if (kind === "chat" && chat) {
    return (
      <div className="cm cm-chat" aria-hidden="true">
        <div className="cm-chat__head">
          <i className="cm-online" /> {chat.botName}
        </div>
        <div className="cm-chat__flow">
          <div className="cm-msg cm-msg--u1">{chat.u1}</div>
          <div className="cm-msg cm-msg--typing cm-msg--t1">
            <i /><i /><i />
          </div>
          <div className="cm-msg cm-msg--b1">{chat.b1}</div>
          <div className="cm-msg cm-msg--u2">{chat.u2}</div>
          <div className="cm-msg cm-msg--typing cm-msg--t2">
            <i /><i /><i />
          </div>
          <div className="cm-msg cm-msg--b2">{chat.b2}</div>
          <div className="cm-msg cm-msg--sent">{chat.sent}</div>
        </div>
      </div>
    );
  }

  if (kind === "inbox" && items?.length) {
    return (
      <div className="cm cm-tg" aria-hidden="true">
        <div className="cm-tg__head">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
            <path
              d="M21.4 4.3 3.7 11.2c-.9.4-.9 1.7.1 2l4.5 1.5 1.7 5.1c.3.9 1.5 1 2 .2l2.4-3.1 4.8 3.5c.8.6 1.9.2 2.1-.8l2.5-13.7c.2-1-.7-1.8-1.7-1.5Z"
              fill="#00a8b0"
            />
          </svg>
          Telegram · входящие
        </div>
        <div className="cm-tg__win">
          {items.map((it, i) => (
            <div key={it.text} className="cm-tgc" style={{ "--i": i } as CSSProperties}>
              <b>Заявка · {it.src}</b>
              <span>{it.text}</span>
            </div>
          ))}
        </div>
        <span className="cm-cap">всё падает в один чат</span>
      </div>
    );
  }

  if (kind === "order") {
    return (
      <div className="cm cm-order" aria-hidden="true">
        {[
          ["Товар", "Свеча-шкатулка + аромат на выбор"],
          ["Доставка", "СДЭК · пункт выдачи по городу"],
          ["Оплата", "ЮKassa · оплачено ✓"],
        ].map(([b, t], i) => (
          <div key={t} className="cm-ord" style={{ "--i": i } as CSSProperties}>
            <b>{b}</b>
            <span>{t}</span>
            <i className="cm-ord__check">✓</i>
          </div>
        ))}
      </div>
    );
  }

  if (kind === "report" && report) {
    return (
      <div className="cm-rep" aria-hidden="true">
        <div className="cm-rep__head">
          <i className="cm-online" /> {report.title}
        </div>
        {report.scores.map((s, i) => (
          <ScoreRow key={s.label} label={s.label} score={s.score} i={i} />
        ))}
        {report.note && <div className="cm-rep__note">{report.note}</div>}
      </div>
    );
  }

  if (kind === "bars" && bars) {
    return (
      <div className="cm cm-bars" aria-hidden="true">
        <div className="cm-bars__row">
          <span className="cm-bars__label">{bars.old}</span>
          <i className="cm-bars__bar cm-bars__bar--old" />
        </div>
        <div className="cm-bars__row">
          <span className="cm-bars__label">{bars.new}</span>
          <i className="cm-bars__bar cm-bars__bar--new" />
        </div>
      </div>
    );
  }
  return null;
}
