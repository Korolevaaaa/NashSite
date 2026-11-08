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
  shot?: string; // screenshot shown on the slide
  motion?: "chats" | "chat" | "inbox" | "bars" | "order"; // drawn animated diagram
  /** scripted bot dialog for motion "chat" — per-case, never hardcoded */
  chat?: { botName: string; u1: string; b1: string; u2: string; b2: string; sent: string };
  /** rotating entries for motion "inbox" */
  inboxItems?: { src: string; text: string }[];
  /** before/after labels for motion "bars" */
  barLabels?: { old: string; new: string };
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
    year: 2026,
    teaser:
      "Витрина граффити-зеркал, админка для портфолио и бот, который собирает смету в чате и выгрузил личку автора от одинаковых вопросов.",
    cover: "/cases/instabarter/cover.jpg",
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
        shot: "/cases/instabarter/services.png",
        motion: "chats",
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
        motion: "chat",
        chat: {
          botName: "RAMCY бот · онлайн",
          u1: "Хочу зеркало с тегом",
          b1: "Какой размер? 40, 60 или 90 см",
          u2: "60 см, привезти в Москву",
          b2: "Смета: тег · 60 см · Москва — передаю Виталию",
          sent: "Заявка ушла в Telegram ✓",
        },
      },
      {
        heading: "Админка и заявки в Telegram",
        text: "Заявки с сайта и от бота падают Виталию в личные сообщения Telegram — в один чат, уже собранными по пунктам. В админ-панели он сам добавляет работы в портфолио и следит за входящими, кода при этом не касается. Оплату и доставку намеренно не делали: их Виталий согласует лично, и автоматика здесь бы только мешала.",
        shot: "/cases/instabarter/contact.png",
        motion: "inbox",
        inboxItems: [
          { src: "сайт", text: "Тег · 60 см · Москва" },
          { src: "бот", text: "Фраза · 90 см · Казань" },
          { src: "сайт", text: "Персонаж · 40 см · СПб" },
        ],
      },
      {
        heading: "Результат",
        text: "Сайт работает тремя способами сразу. Это портфолио для соцсетей, продавец, который показывает работы и цены круглосуточно, и фильтр перед личными сообщениями. В директ теперь приходят готовые сметы, а не вопросы — Виталий тратит время на эскизы и зеркала, а не на копипаст одинаковых ответов. SEO настроено с первого дня, поэтому сайт приводит и тех, кто никогда не видел посты.",
        shot: "/cases/instabarter/reviews.png",
        motion: "bars",
        barLabels: { old: "было — вопросы в директе", new: "стало — готовые сметы" },
      },
    ],
    gallery: [
      "/cases/instabarter/about.png",
      "/cases/instabarter/hero-narrow.png",
      "/cases/instabarter/services.png",
      "/cases/instabarter/reviews.png",
      "/cases/instabarter/contact.png",
    ],
  },
  {
    slug: "yaruska",
    name: "YARUSKA",
    title: "Интернет-магазин свечей ручной работы с оплатой ЮKassa и доставкой СДЭК",
    client: "Яруска · мастерская авторских свечей",
    type: "Интернет-магазин",
    industry: "Ритейл",
    year: 2026,
    teaser:
      "Магазин свечей-шкатулок: каталог с выбором аромата, оплата ЮKassa, доставка СДЭК до пункта выдачи, личный кабинет покупателя и заказы в Telegram владельца.",
    cover: "/cases/yaruska/cover.png",
    hero: "/cases/yaruska/hero.png",
    url: "https://yaruska.ru",
    metrics: [
      { value: "1 заказ", label: "аромат, доставка СДЭК до ПВЗ и оплата ЮKassa — в одном чек-ауте, без переписки" },
      { value: "ЛК", label: "личный кабинет: покупатель сам смотрит свои заказы и их статус" },
      { value: "1 чат", label: "новые заказы приходят владельцу в личные сообщения Telegram" },
    ],
    story: [
      {
        heading: "Задача",
        text: "Мастерская делает авторские свечи-шкатулки из гипса и соевого воска и продавала через соцсети и ярмарки. Каждая покупка шла через переписку: какой аромат есть, сколько стоит доставка, как оплатить, куда привезти. Один заказ — десятки сообщений, а вопросы повторялись у каждого нового клиента. Нужен был магазин, который продаёт сам — от выбора аромата до оплаты и доставки.",
        shot: "/cases/yaruska/collections.png",
        motion: "chats",
      },
      {
        heading: "Каталог в эстетике бренда",
        text: "Собрали интернет-магазин в том же тёплом, «ручном» характере: кремовый фон, шрифтовая роскошь, крупная фотография. В каталоге — поиск по названию и аромату, категории и избранное; на карточке сразу цена и кнопка в корзину. Клиент выбирает свечу и аромат самостоятельно, как в обычном магазине — без сообщений «а что есть в наличии».",
        shot: "/cases/yaruska/catalog.png",
      },
      {
        heading: "Заказ без переписки",
        text: "В чек-ауте клиент выбирает аромат к каждой свече, указывает получателя и город — доставка рассчитывается через API СДЭК до пункта выдачи, а оплата проходит через ЮKassa. То, что раньше занимало переписку на день, теперь делается за пару минут и без участия владельца.",
        shot: "/cases/yaruska/cart.png",
        motion: "order",
      },
      {
        heading: "Кабинет клиента и админка владельца",
        text: "Покупатель заходит в личный кабинет и видит свои заказы и их статус — вопрос «а где моя посылка» отпадает сам. Владелец управляет магазином из админ-панели: добавляет и правит товары, обновляет ароматы и категории, следит за заявками — кода при этом не касается. Каждый новый заказ прилетает ему в личные сообщения Telegram.",
        shot: "/cases/yaruska/login.png",
        motion: "inbox",
        inboxItems: [
          { src: "сайт", text: "Свеча Царица · Екатеринбург" },
          { src: "сайт", text: "Шкатулка Ёлка · Москва" },
          { src: "сайт", text: "2 свечи + аромат · Казань" },
        ],
      },
      {
        heading: "Результат",
        text: "Магазин закрыл всю цепочку, которая раньше держалась на переписке: каталог показывает ассортимент, чек-аут собирает заказ с доставкой, ЮKassa принимает оплату, Telegram доставляет заявку владельцу, а личный кабинет отвечает на вопросы о статусе. Владелец тратит время на воск и гипс, а не на копипаст одинаковых ответов.",
        shot: "/cases/yaruska/popular.png",
        motion: "bars",
        barLabels: { old: "было — переписка по каждому заказу", new: "стало — заказ оформляется сам" },
      },
    ],
    gallery: [
      "/cases/yaruska/fragrances.png",
      "/cases/yaruska/product.png",
      "/cases/yaruska/delivery-page.png",
      "/cases/yaruska/checkout.png",
      "/cases/yaruska/delivery.png",
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
