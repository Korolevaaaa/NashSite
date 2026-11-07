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
  status: "published" | "draft";
  cover?: string;
  updatedAt?: string;
}

export const SEED_ITEMS: StoreItem[] = [
  {
    id: "tpl-shop-sushi",
    name: "Доставка суши",
    cat: "Интернет-магазины",
    sub: "Еда и доставка",
    kind: "Макет",
    price: 45000,
    status: "published",
  },
  {
    id: "tpl-shop-goods",
    name: "Магазин товаров",
    cat: "Интернет-магазины",
    sub: "Каталог",
    kind: "Макет",
    price: 55000,
    status: "published",
  },
  {
    id: "tpl-site-landing",
    name: "Лендинг продукта",
    cat: "Сайты",
    sub: "Лендинги",
    kind: "Макет",
    price: 25000,
    status: "published",
  },
  {
    id: "tpl-site-corp",
    name: "Сайт компании",
    cat: "Сайты",
    sub: "Корпоративные",
    kind: "Макет",
    price: 80000,
    status: "published",
  },
  {
    id: "tpl-site-studio",
    name: "Лендинг студии",
    cat: "Сайты",
    sub: "Лендинги",
    kind: "Макет",
    price: 20000,
    status: "published",
  },
  {
    id: "tpl-ui-dashboard",
    name: "Дашборд аналитики",
    cat: "Интерфейсы",
    sub: "Дашборды",
    kind: "Макет",
    price: 60000,
    status: "published",
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
