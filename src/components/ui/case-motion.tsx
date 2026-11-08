/* Drawn, CSS-driven motion graphics for case story slides.
   Each kind loops a small narrative diagram tied to the slide's point.
   Everything is pure DOM/CSS — hidden entirely under reduced-motion. */

import type { CSSProperties } from "react";

export type CaseMotionKind = "chats" | "chat" | "inbox" | "bars";

export function CaseMotion({ kind }: { kind: CaseMotionKind }) {
  if (kind === "chats") {
    return (
      <div className="cm cm-chats" aria-hidden="true">
        <div className="cm-chats__row">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <i key={i} className="cm-bubble" style={{ "--i": i } as CSSProperties} />
          ))}
        </div>
        <span className="cm-cap">десятки одинаковых диалогов в директе</span>
      </div>
    );
  }
  if (kind === "chat") {
    return (
      <div className="cm cm-chat" aria-hidden="true">
        <div className="cm-chat__head">
          <i className="cm-online" /> RAMCY бот · онлайн
        </div>
        <div className="cm-chat__flow">
          <div className="cm-msg cm-msg--u1">Хочу зеркало с тегом</div>
          <div className="cm-msg cm-msg--typing cm-msg--t1">
            <i /><i /><i />
          </div>
          <div className="cm-msg cm-msg--b1">Какой размер? 40, 60 или 90 см</div>
          <div className="cm-msg cm-msg--u2">60 см, привезти в Москву</div>
          <div className="cm-msg cm-msg--typing cm-msg--t2">
            <i /><i /><i />
          </div>
          <div className="cm-msg cm-msg--b2">Смета: тег · 60 см · Москва — передаю Виталию</div>
          <div className="cm-msg cm-msg--sent">Заявка ушла в Telegram ✓</div>
        </div>
      </div>
    );
  }
  if (kind === "inbox") {
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
          {[
            ["сайт", "Тег · 60 см · Москва"],
            ["бот", "Фраза · 90 см · Казань"],
            ["сайт", "Персонаж · 40 см · СПб"],
          ].map(([src, t], i) => (
            <div key={t} className="cm-tgc" style={{ "--i": i } as CSSProperties}>
              <b>Заявка · {src}</b>
              <span>{t}</span>
            </div>
          ))}
        </div>
        <span className="cm-cap">всё падает в один чат</span>
      </div>
    );
  }
  return (
    <div className="cm cm-bars" aria-hidden="true">
      <div className="cm-bars__row">
        <span className="cm-bars__label">было — вопросы в директе</span>
        <i className="cm-bars__bar cm-bars__bar--old" />
      </div>
      <div className="cm-bars__row">
        <span className="cm-bars__label">стало — готовые сметы</span>
        <i className="cm-bars__bar cm-bars__bar--new" />
      </div>
    </div>
  );
}
