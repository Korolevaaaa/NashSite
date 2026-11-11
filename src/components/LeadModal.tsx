import { useEffect, useState } from "react";
import { submitLead } from "../lib/leads";
import { activePartner } from "../utils/refSource";

/* Модальная лид-форма: открывается по клику на любую mailto-CTA.
   Поля: имя*, контакт*, комментарий + обязательное согласие ПДн.
   Источник (ref-партнёр) прикрепляется автоматически. */

const inputCls =
  "w-full rounded-xl border border-[var(--z-line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--z-action)]";

export default function LeadModal({
  open,
  onClose,
  context,
}: {
  open: boolean;
  onClose: () => void;
  context: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [social, setSocial] = useState("");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const partner = activePartner();

  useEffect(() => {
    if (open) setState("idle");
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || state === "sending") return;
    setState("sending");
    const r = await submitLead({
      name: name.trim(),
      phone: phone.trim(),
      social: social.trim() || undefined,
      comment: comment.trim(),
      page: location.pathname,
    });
    if (r === "error") setState("error");
    else setState("done"); // "mailto" тоже завершает успехом — почтовик открылся
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Оставить заявку"
      className="fixed inset-0 z-50 grid place-items-center bg-[var(--z-ink)]/40 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {state === "done" ? (
          <div className="py-6 text-center">
            <p className="font-display text-xl font-semibold text-[var(--z-ink)]">
              Заявка отправлена
            </p>
            <p className="mt-2 text-sm text-[var(--z-ink)]/60">
              Ответим в течение рабочего дня.
            </p>
            <button
              onClick={onClose}
              className="mt-5 rounded-xl bg-[var(--z-ink)] px-6 py-2.5 text-sm text-white hover:opacity-85"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-[var(--z-ink)]">
                  {context}
                </h2>
                {partner && (
                  <p className="mt-1 text-xs text-[var(--z-ink)]/55">
                    Ваш менеджер: {partner.name}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть"
                className="text-2xl leading-none text-[var(--z-ink)]/40 hover:text-[var(--z-ink)]"
              >
                ×
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className={inputCls}
              />
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Телефон *"
                autoComplete="tel"
                className={inputCls}
              />
              <input
                value={social}
                onChange={(e) => setSocial(e.target.value)}
                placeholder="Telegram / WhatsApp — не обязательно"
                autoComplete="off"
                className={inputCls}
              />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Пара слов о задаче (необязательно)"
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </div>

            <label className="z-consent mt-4">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="z-check"
              />
              <span>
                Соглашаюсь с{" "}
                <a href="/privacy" className="underline" target="_blank">
                  политикой обработки персональных данных
                </a>
              </span>
            </label>

            {state === "error" && (
              <p className="mt-3 text-sm text-red-600">
                Не отправилось — попробуйте ещё раз или напишите на почту.
              </p>
            )}

            <button
              type="submit"
              disabled={!consent || state === "sending"}
              className="mt-5 w-full rounded-xl bg-[var(--z-ink)] py-3 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-40"
            >
              {state === "sending" ? "Отправляем…" : "Отправить заявку"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
