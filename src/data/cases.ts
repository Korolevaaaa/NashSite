/* Case studies data model.
   Fill the slots below with real project data. Images live in
   /public/cases/<slug>/ — cover is the AI-generated card poster (4:5 crop),
   hero + gallery + story shots are real site screenshots (16:10 or taller).
   A case appears on the main page and at #/case/<slug> as soon as it is
   listed here. Empty `story`/`metrics`/`gallery` simply render less
   sections — the page still works. */

export const CASE_TYPES = [
  "Лендинг",
  "Корп. сайт",
  "Интернет-магазин",
  "Веб-сервис",
  "Приложение",
  "Бот / AI",
] as const;

export const CASE_INDUSTRIES = [
  "Финансы",
  "Технологии",
  "Медицина",
  "Авиация",
  "Ритейл",
  "Услуги",
] as const;

export interface CaseMetric {
  value: string;
  label: string;
}

export interface CaseStoryStep {
  heading: string; // "Задача" / "Решение" / "Результат" or free-form
  text: string;
  shot?: string; // sticky screenshot shown while this step is in view
}

export interface CaseStudy {
  slug: string; // latin, used in #/case/<slug>
  name: string; // short display name, e.g. NEOBANK
  title: string; // human headline for the case page
  client?: string;
  type: (typeof CASE_TYPES)[number];
  industry: string; // one of CASE_INDUSTRIES (or free string)
  year: number;
  teaser: string; // 1-2 sentences for cards and case-page lead
  cover?: string; // /cases/<slug>/cover.jpg — AI poster (renders 4:5)
  hero?: string; // /cases/<slug>/hero.jpg — big first screen
  metrics: CaseMetric[]; // 3-4 numbers, may stay empty
  story: CaseStoryStep[]; // narrative steps, shot optional per step
  gallery: string[]; // extra screenshots for the bottom strip
  url?: string; // live project link, optional
}

export const CASES: CaseStudy[] = [
  {
    slug: "neobank",
    name: "NEOBANK",
    title: "",
    type: "Веб-сервис",
    industry: "Финансы",
    year: 2025,
    teaser: "",
    // cover: "/cases/neobank/cover.jpg",
    // hero: "/cases/neobank/hero.jpg",
    metrics: [],
    story: [],
    gallery: [],
  },
  {
    slug: "orbital",
    name: "ORBITAL",
    title: "",
    type: "Веб-сервис",
    industry: "Технологии",
    year: 2025,
    teaser: "",
    metrics: [],
    story: [],
    gallery: [],
  },
  {
    slug: "biotech",
    name: "BIO/TECH",
    title: "",
    type: "Корп. сайт",
    industry: "Медицина",
    year: 2025,
    teaser: "",
    metrics: [],
    story: [],
    gallery: [],
  },
  {
    slug: "aeron",
    name: "AERON",
    title: "",
    type: "Приложение",
    industry: "Авиация",
    year: 2024,
    teaser: "",
    metrics: [],
    story: [],
    gallery: [],
  },
];
