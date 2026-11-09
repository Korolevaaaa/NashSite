/* Storefront data layer — static site, no backend.
   Seed items live here in code; owner additions are kept in localStorage
   and can be exported/imported as JSON from the admin page (#/admin).
   "draft" items are visible only in the admin — never on the page. */

export interface StoreItem {
  id: string;
  name: string;
  cat: string;
  sub: string;
  kind: string; // "Макет" → «Купить», anything else → «Заказать»
  price: number;
  priceText?: string; // override display, e.g. "от 40 000 ₽"
  badge?: string; // extra chip on the card, e.g. "Анимированный"
  status: "published" | "draft";
  cover?: string;
  slug?: string; // → #/template/<slug> detail page
  updatedAt?: string;
}

export const SEED_ITEMS: StoreItem[] = [
  {
    id: "tpl-shop-sushi",
    name: "Доставка суши",
    cat: "Интернет-магазины",
    sub: "Еда и доставка",
    kind: "Макет",
    price: 40000,
    priceText: "от 40 000 ₽",
    status: "published",
    slug: "dostavka-sushi",
    badge: "Анимированный",
    cover: "/templates/dostavka-sushi/cover.jpg",
  },
  {
    id: "tpl-camp",
    name: "База отдыха",
    cat: "Туризм и отдых",
    sub: "Базы отдыха и глэмпинги",
    kind: "Макет",
    price: 25000,
    priceText: "от 25 000 ₽",
    status: "published",
    slug: "baza-otdyha",
    cover: "/templates/baza-otdyha/cover.jpg",
  },
  {
    id: "tpl-glamping",
    name: "Глэмпинг и турбаза",
    cat: "Туризм и отдых",
    sub: "Глэмпинги и эко-отели",
    kind: "Макет",
    price: 25000,
    priceText: "от 25 000 ₽",
    status: "published",
    slug: "glamping-gory",
    cover: "/templates/glamping-gory/cover.jpg",
  },
  {
    id: "tpl-shtory",
    name: "Умные шторы",
    cat: "Интернет-магазины",
    sub: "Дом и интерьер",
    kind: "Макет",
    price: 45000,
    priceText: "от 45 000 ₽",
    status: "published",
    slug: "umnye-shtory",
    badge: "С конфигуратором",
    cover: "/templates/umnye-shtory/cover.jpg",
  },
  {
    id: "tpl-sfera",
    name: "Дом-сфера у леса",
    cat: "Туризм и отдых",
    sub: "Глэмпинги и эко-отели",
    kind: "Макет",
    price: 35000,
    priceText: "от 35 000 ₽",
    status: "published",
    slug: "sfera-dom",
    badge: "Кино-лендинг",
    cover: "/templates/sfera-dom/cover.jpg",
  },
  {
    id: "tpl-kartoshka",
    name: "Крошка-картошка",
    cat: "Еда и доставка",
    sub: "Кафе и стритфуд",
    kind: "Макет",
    price: 20000,
    priceText: "от 20 000 ₽",
    status: "published",
    slug: "kroshka-kartoshka",
    cover: "/templates/kroshka-kartoshka/cover.jpg",
  },
  {
    id: "tpl-smash",
    name: "Смэш-бургерная",
    cat: "Еда и доставка",
    sub: "Бургерные и фастфуд",
    kind: "Макет",
    price: 20000,
    priceText: "от 20 000 ₽",
    status: "published",
    slug: "smash-burgery",
    badge: "Видео-хиро",
    cover: "/templates/smash-burgery/cover.jpg",
  },
];

export const DRAFT_KEY = "storefront.draft.v1";
export const PUBLISHED_KEY = "storefront.published.v1";
export const TAX_KEY = "storefront.tax.v1";

const isBrowser = typeof window !== "undefined";

export function readLS<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLS(key: string, value: unknown) {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
}

/* what the public catalog sees: published seed + published owner items */
export function publishedItems(): StoreItem[] {
  return [
    ...SEED_ITEMS.filter((i) => i.status === "published"),
    ...readLS<StoreItem[]>(PUBLISHED_KEY, []),
  ];
}

export function draftItems(): StoreItem[] {
  return readLS<StoreItem[]>(DRAFT_KEY, []);
}

export interface TaxCat {
  name: string;
  subs: string[];
}

/* categories come from real items plus owner-created taxonomy —
   categories with no published items are hidden from the catalog */
export function taxonomy(items: StoreItem[], extra: TaxCat[] = []): TaxCat[] {
  const map = new Map<string, Set<string>>();
  const put = (cat?: string, sub?: string) => {
    const c = cat?.trim();
    if (!c) return;
    if (!map.has(c)) map.set(c, new Set());
    const s = sub?.trim();
    if (s) map.get(c)!.add(s);
  };
  items.forEach((i) => put(i.cat, i.sub));
  extra.forEach((t) => {
    put(t.name);
    (t.subs || []).forEach((s) => put(t.name, s));
  });
  return [...map.entries()]
    .map(([name, subs]) => ({
      name,
      subs: [...subs].sort((a, b) => a.localeCompare(b, "ru")),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "ru"));
}

export function downloadJSON(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
