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
    slug: "graffiti-zerkalo",
    name: "RAMCY",
    title: "Сайт для художника с ИИ-ботом и заявками в Telegram",
    client: "Vitaliy RAMCY · художник-граффитист, Москва",
    type: "Веб-сервис",
    industry: "Услуги",
    year: 2025,
    teaser:
      "Витрина граффити-зеркал, админка для портфолио и бот, который собирает смету в чате и выгрузил личку автора от одинаковых вопросов.",
    cover: "/cases/instabarter/cover.png",
    hero: "/cases/instabarter/hero.png",
    url: "https://graffiti-zerkalo.ru",
    metrics: [
      { value: "1 чат", label: "заявки и сметы приходят в один Telegram-диалог вместо десятков в директе" },
      { value: "24/7", label: "бот-помощник отвечает на вопросы и собирает бриф без участия автора" },
      { value: "3 размера", label: "цены на 40, 60 и 90 см видны сразу — типовые вопросы отпали ещё до формы" },
    ],
    story: [
      {
        heading: "Задача",
        text: "Виталий делает зеркала с авторским граффити в единственном экземпляре и продавал их через соцсети. Каждый пост приносил волну сообщений: сколько стоит, какие размеры, сделаешь такое, привезёте в другой город. Один и тот же диалог размножался на десятки чатов в директе и личке, вопросы тонули, часть клиентов уходила без ответа. Нужна была точка входа, которая снимет с художника рутину переписки.",
        shot: "/cases/instabarter/mobile-hero.png",
      },
      {
        heading: "Сайт-витрина с живым портфолио",
        text: "Собрали одностраничник в его собственной эстетике: чёрный фон, кислотно-оранжевый акцент, крупная рубленая типографика и бегущая строка. Работы, автор и цены на три размера видны сразу — три самых частых вопроса закрыты до того, как человек дошёл до формы. Отзывы собраны из настоящих сторис клиентов, поэтому доверие не выглядит нарисованным.",
        shot: "/cases/instabarter/portfolio.png",
      },
      {
        heading: "ИИ-бот вместо лички",
        text: "В углу экрана живёт помощник RAMCY. Он мгновенно отвечает на типовые вопросы о ценах, размерах и материалах, а главное — прямо в чате проводит человека по брифу: что нарисовать, какого размера, куда доставить. На выходе клиент получает ответ за секунды, а не часы ожидания в директе.",
        shot: "/cases/instabarter/bot-open.png",
      },
      {
        heading: "Админка и заявки в Telegram",
        text: "Заявки с сайта и от бота падают Виталию в личные сообщения Telegram — в один чат, уже собранными по пунктам. В админ-панели он сам добавляет работы в портфолио и следит за входящими, кода при этом не касается. Оплату и доставку намеренно не делали: их Виталий согласует лично, и автоматика здесь бы только мешала.",
        shot: "/cases/instabarter/contact.png",
      },
      {
        heading: "Результат",
        text: "Сайт работает тремя способами сразу. Это портфолио для соцсетей, продавец, который показывает работы и цены круглосуточно, и фильтр перед личными сообщениями. В директ теперь приходят готовые сметы, а не вопросы — Виталий тратит время на эскизы и зеркала, а не на копипаст одинаковых ответов. SEO настроено с первого дня, поэтому сайт приводит и тех, кто никогда не видел посты.",
        shot: "/cases/instabarter/reviews.png",
      },
    ],
    gallery: [
      "/cases/instabarter/about.png",
      "/cases/instabarter/services.png",
      "/cases/instabarter/reviews.png",
      "/cases/instabarter/contact.png",
      "/cases/instabarter/mobile-portfolio.png",
    ],
  },
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
