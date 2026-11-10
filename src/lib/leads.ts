/* Лид-формы: отправка в Supabase endpoint (VITE_LEADS_ENDPOINT, появится
   после подключения БД) → fallback на mailto с пометкой источника.
   Трекинг событий: ym() (Метрика, когда будет счётчик) + буфер для
   собственной аналитики. */
import { activePartner } from "../utils/refSource";
import { CONTACT_EMAIL } from "../data/content";

export interface LeadPayload {
  name: string;
  contact: string;
  comment: string;
  page: string;
}

const ENDPOINT = import.meta.env.VITE_LEADS_ENDPOINT as string | undefined;

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

/** Отправка заявки. Возвращает "ok" | "mailto" | "error". */
export async function submitLead(p: LeadPayload): Promise<"ok" | "mailto" | "error"> {
  const partner = activePartner();
  const body = {
    ...p,
    source: partner?.ref ?? "organic",
    sourceName: partner?.name ?? "Органика",
    ua: navigator.userAgent,
    ts: new Date().toISOString(),
  };

  ymGoal("lead_submit", { source: body.source });

  if (!ENDPOINT) {
    // Пока бэкенда нет — mailto с пометкой источника (поведение как раньше)
    const text = [
      `Имя: ${p.name}`,
      `Контакт: ${p.contact}`,
      p.comment && `Комментарий: ${p.comment}`,
      ``,
      `—`,
      `Источник: ${body.sourceName} (${body.source})`,
      `Страница: ${p.page}`,
    ]
      .filter(Boolean)
      .join("\n");
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `Заявка с сайта — ${p.name}`,
    )}&body=${encodeURIComponent(text)}`;
    return "mailto";
  }

  try {
    const r = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return r.ok ? "ok" : "error";
  } catch {
    return "error";
  }
}
