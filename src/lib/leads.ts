/* Лид-формы: отправка на /api/leads (server/index.mjs — Telegram +
   почта) → fallback на mailto с пометкой источника, если API недоступен.
   Трекинг: ym() (Метрика, когда будет счётчик). */
import { activePartner } from "../utils/refSource";
import { CONTACT_EMAIL } from "../data/content";

export interface LeadPayload {
  name: string;
  phone: string; // обязательный контакт
  social?: string; // опционально — telegram/whatsapp ник
  comment: string;
  page: string;
}

const ENDPOINT =
  (import.meta.env.VITE_LEADS_ENDPOINT as string | undefined) ?? "/api/leads";

/** Цель в Метрике — безопасно вызывать до подключения счётчика. */
export function ymGoal(goal: string, params?: Record<string, unknown>) {
  try {
    const ym = (window as unknown as { ym?: (id: number, m: string, g: string, p?: unknown) => void }).ym;
    const counterId = import.meta.env.VITE_YM_COUNTER as string | undefined;
    if (ym && counterId) ym(Number(counterId), "reachGoal", goal, params);
  } catch {
    /* метрика не подключена */
  }
}

function mailtoFallback(p: LeadPayload, sourceName: string, source: string) {
  const text = [
    `Имя: ${p.name}`,
    `Телефон: ${p.phone}`,
    p.social && `Соцсеть: ${p.social}`,
    p.comment && `Комментарий: ${p.comment}`,
    ``,
    `—`,
    `Источник: ${sourceName} (${source})`,
    `Страница: ${p.page}`,
  ]
    .filter(Boolean)
    .join("\n");
  location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Заявка с сайта — ${p.name}`,
  )}&body=${encodeURIComponent(text)}`;
}

/** Отправка заявки. Возвращает "ok" | "mailto" | "error". */
export async function submitLead(
  p: LeadPayload,
): Promise<"ok" | "mailto" | "error"> {
  const partner = activePartner();
  const body = {
    ...p,
    source: partner?.ref ?? "organic",
    sourceName: partner?.name ?? "Органика",
    ua: navigator.userAgent,
    ts: new Date().toISOString(),
  };

  ymGoal("lead_submit", { source: body.source });

  try {
    const r = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    // API ответил JSON-ошибкой (нет такого роута на статике) — не fallback-им,
    // а отдаём честную ошибку, чтобы не гонять людей в почтовик зря.
    const ct = r.headers.get("content-type") || "";
    if (r.ok && ct.includes("json")) return "ok";
    if (!ct.includes("json")) {
      // статический хостинг без API — index.html вместо ответа
      mailtoFallback(p, body.sourceName, body.source);
      return "mailto";
    }
    return "error";
  } catch {
    // API мёртв — всё равно не теряем заявку
    mailtoFallback(p, body.sourceName, body.source);
    return "mailto";
  }
}
