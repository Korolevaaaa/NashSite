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
        <div className="cm-msg cm-msg--user">Сколько стоит зеркало 60 см?</div>
        <div className="cm-msg cm-msg--typing">
          <i /><i /><i />
        </div>
        <div className="cm-msg cm-msg--bot">От 7 500 ₽ · RAMCY бот</div>
        <div className="cm-msg cm-msg--sent">Заявка ушла в Telegram ✓</div>
      </div>
    );
  }
  if (kind === "inbox") {
    return (
      <div className="cm cm-inbox" aria-hidden="true">
        {["Тег · 60 см · Москва", "Фраза · 90 см · Казань", "Персонаж · 40 см · СПб"].map(
          (t, i) => (
            <div key={t} className="cm-req" style={{ "--i": i } as CSSProperties}>
              <b>Заявка</b>
              {t}
            </div>
          ),
        )}
        <span className="cm-cap">всё падает в один чат Telegram</span>
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
