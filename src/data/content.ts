/* Content ported 1:1 from the previous static site.
   Values below are UNCONFIRMED — owner must verify prices, terms,
   stats and portfolio names before publishing. */

export const CONTACT_EMAIL = "hello@zetronix.ru";

export const STATS = [
  { value: 120, suffix: "+", label: "проектов запущено" },
  { value: 7, suffix: "+", label: "лет на рынке" },
  { value: 18, suffix: "+", label: "наград за дизайн" },
  { value: 96, suffix: "%", label: "клиентов возвращаются" },
] as const;

export const SERVICES = [
  {
    id: "S-01",
    title: "Веб-разработка",
    text: "Лендинги, корпоративные сайты и веб-приложения — от проектирования до запуска.",
  },
  {
    id: "S-02",
    title: "Дизайн интерфейсов",
    text: "Фирменный стиль, дизайн-системы и прототипы в Figma. Минимализм, который не выглядит шаблоном.",
  },
  {
    id: "S-03",
    title: "AI-интеграции",
    text: "Чат-боты, персонализация и автоматизация на базе нейросетей. Ваш сайт начинает работать как ZTRX-07.",
  },
] as const;

export const WORKS = [
  { name: "NEOBANK", kind: "Финтех-платформа", year: "2026" },
  { name: "ORBITAL", kind: "Marketplace спутниковых данных", year: "2025" },
  { name: "BIO/TECH", kind: "Сайт лаборатории", year: "2025" },
  { name: "AERON", kind: "Конфигуратор дронов", year: "2024" },
] as const;

export const NAV_LINKS = [
  { href: "#services", label: "Услуги" },
  { href: "#portfolio", label: "Портфолио" },
  { href: "#contacts", label: "Контакты" },
] as const;

export const TICKER_ITEMS =
  "WEB-DEVELOPMENT · UI/UX DESIGN · AI INTEGRATION · BRANDING · MOTION · 3D · ";
