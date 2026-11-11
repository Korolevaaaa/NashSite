import { useEffect, useRef, useState, type FormEvent } from "react";
import { ChatCircle, Robot, PaperPlaneRight, X } from "@phosphor-icons/react";

/* AI-ассистент в правом нижнем углу — тот самый «чат с ботом».
   Бэкенд: POST /api/chat (server/chat.mjs, GigaChat + LEAD-протокол).
   Стили — .zc-* в global.css, в духе Mobile OS: светлая панель,
   teal-акценты, пилюли. */

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const GREETING =
  "Привет! Я AI-ассистент ZETRONIX. Отвечу на вопросы и помогу оформить заявку — что вас интересует?";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>();
  const [leadDone, setLeadDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, open]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading || leadDone) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Ошибка сервера");
      setSessionId(data.sessionId);
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      if (data.leadCreated) setLeadDone(true);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Не удалось получить ответ — напишите нам на почту, и мы ответим лично.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="zc">
      {open ? (
        <div className="zc-panel" role="dialog" aria-label="Чат с AI-ассистентом">
          <header className="zc-head">
            <span className="zc-avatar" aria-hidden="true">
              <Robot size={18} weight="fill" />
            </span>
            <span className="zc-id">
              <strong>ZTRX</strong>
              <em>онлайн · отвечает сразу</em>
            </span>
            <button
              type="button"
              className="zc-close"
              onClick={() => setOpen(false)}
              aria-label="Закрыть чат"
            >
              <X size={16} weight="bold" />
            </button>
          </header>

          <div className="zc-msgs" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`zc-msg zc-msg--${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="zc-msg zc-msg--assistant zc-typing" aria-label="Печатает">
                <i /><i /><i />
              </div>
            )}
            {leadDone && (
              <div className="zc-lead" role="status">
                Заявка у менеджера — ответим в течение рабочего дня.
              </div>
            )}
          </div>

          <form className="zc-form" onSubmit={send}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={leadDone ? "Заявка отправлена" : "Напишите сообщение…"}
              disabled={loading || leadDone}
              aria-label="Сообщение ассистенту"
            />
            <button
              type="submit"
              disabled={loading || !input.trim() || leadDone}
              aria-label="Отправить"
            >
              <PaperPlaneRight size={16} weight="fill" />
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          className="zc-fab"
          onClick={() => setOpen(true)}
          aria-label="Открыть чат с AI-ассистентом"
        >
          <ChatCircle size={24} weight="fill" />
          <span className="zc-fab__dot" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
