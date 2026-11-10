/* Partner channel config: коммерческие партнёры получают ref-ссылку
   (zetronix.ru/?ref=<ref>) — лид, пришедший по ней, считается их лидом
   (first-touch, окно 60 дней — см. utils/refSource.ts).
   Решение: на сайте единые контакты студии — заявки помечаются
   источником в теле письма, звонки атрибутируются промокодом. */
export interface Partner {
  ref: string; // значение в ?ref= и метка источника в заявках
  name: string;
  role: string;
  promo: string; // промокод для звонков и «живых» рефералов без ссылки
  photo?: string; // /partners/<ref>.jpg — добавить позже
  email?: string; // персональная почта, иначе общая
  login: string; // кабинет /partner (лёгкая авторизация, не банк)
  password: string;
}

export const PARTNERS: Partner[] = [
  {
    ref: "dmitry",
    name: "Дмитрий Нарикаев",
    role: "Коммерческий директор",
    promo: "ZETRO-D",
    login: "dmitry",
    password: "zt-partner-2026",
  },
];

export const partnerOf = (ref?: string | null): Partner | null =>
  ref ? (PARTNERS.find((p) => p.ref === ref) ?? null) : null;

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
