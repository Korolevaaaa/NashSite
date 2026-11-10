/* Partner attribution: захват ?ref= / utm-меток, first-touch, окно 60 дней.
   Метка живёт в localStorage и переживает возврат «напрямую» в пределах окна.
   Используется для маршрутизации CTA и маркировки заявок. */
import { partnerOf, type Partner } from "../data/partners";

const LS_KEY = "zt_ref";
const TTL_MS = 60 * 24 * 60 * 60 * 1000; // 60 дней

interface Stored {
  v: string;
  ts: number;
}

let cached: string | null | undefined;

function readStored(): string | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Stored;
    if (Date.now() - s.ts > TTL_MS) {
      localStorage.removeItem(LS_KEY);
      return null;
    }
    return partnerOf(s.v) ? s.v : null;
  } catch {
    return null;
  }
}

/** Вызывается один раз при загрузке приложения. */
export function captureRef(): void {
  try {
    const q = new URLSearchParams(location.search);
    const v =
      q.get("ref") ??
      (q.get("utm_campaign") === "partner" ? q.get("utm_content") : null);
    if (!v || !partnerOf(v)) return;
    // first-touch wins: не перезаписываем существующую метку
    if (readStored()) return;
    localStorage.setItem(LS_KEY, JSON.stringify({ v, ts: Date.now() }));
    cached = v;
  } catch {
    /* SSR/приватный режим — без метки */
  }
}

/** Активный партнёр по сохранённой метке или null. */
export function activePartner(): Partner | null {
  if (cached === undefined) cached = readStored();
  return partnerOf(cached ?? null);
}

/** Добавляет метку источника в mailto-ссылку (в body письма). */
export function tagMailto(href: string, p: Partner): string {
  try {
    const u = new URL(href);
    const body = u.searchParams.get("body") ?? "";
    const tag = `\n\n—\nИсточник: ${p.name} (ref: ${p.ref})`;
    u.searchParams.set("body", body ? body + tag : tag.trimStart());
    return u.toString();
  } catch {
    const sep = href.includes("?") ? "&" : "?";
    return `${href}${sep}body=${encodeURIComponent(`Источник: ${p.name} (ref: ${p.ref})`)}`;
  }
}
