import { useMemo, useState } from "react";
import { CONTACT_EMAIL } from "../../data/content";
import {
  publishedItems,
  taxonomy,
  type StoreItem,
} from "../../data/storefront";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

const priceFmt = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

export default function Templates() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="templates"
      ref={ref}
      className={`reveal zt-sec px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHead
          title="Готовые макеты"
          sub="Проверенные дизайны, которые адаптируем под ваш бизнес за одну-две недели — быстрее и дешевле проекта с нуля."
        />
        <StorefrontGrid preview />
      </div>
    </section>
  );
}

/* Витрина без заголовка секции — используется и на главной (preview: 4 карточки,
   без фильтров), и на /templates (полный каталог) */
export function StorefrontGrid({ preview = false }: { preview?: boolean }) {
  const [items] = useState(publishedItems);
  const [cat, setCat] = useState("all");
  const [sub, setSub] = useState("all");
  const [q, setQ] = useState("");

  const cats = useMemo(() => taxonomy(items), [items]);

  const subs = useMemo(() => {
    if (cat === "all") return [];
    const current = cats.find((c) => c.name === cat);
    if (!current) return [];
    return current.subs.filter((s) =>
      items.some((i) => i.cat === cat && i.sub === s),
    );
  }, [cat, cats, items]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items
      .filter((i) => cat === "all" || i.cat === cat)
      .filter((i) => sub === "all" || i.sub === sub)
      .filter((i) => {
        if (!query) return true;
        return [i.name, i.cat, i.sub, i.kind]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
  }, [items, cat, sub, q]);

  const visible = preview ? filtered.slice(0, 8) : filtered;

  return (
    <>
      {!preview && (
      <div className="sf-filters">
          <input
            className="sf-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск — «суши», «лендинг», «магазин»…"
            aria-label="Поиск по витрине"
          />

          <div className="sf-chips" role="group" aria-label="Категории">
            <button
              type="button"
              className={`sf-chip${cat === "all" ? " is-active" : ""}`}
              onClick={() => {
                setCat("all");
                setSub("all");
              }}
            >
              Все
            </button>
            {cats.map((c) => (
              <button
                key={c.name}
                type="button"
                className={`sf-chip${cat === c.name ? " is-active" : ""}`}
                onClick={() => {
                  setCat(c.name);
                  setSub("all");
                }}
              >
                {c.name}
              </button>
            ))}
          </div>

          {cat !== "all" && subs.length > 0 && (
            <div className="sf-chips sf-chips--sub" role="group" aria-label="Подкатегории">
              <button
                type="button"
                className={`sf-chip${sub === "all" ? " is-active" : ""}`}
                onClick={() => setSub("all")}
              >
                Все
              </button>
              {subs.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`sf-chip${sub === s ? " is-active" : ""}`}
                  onClick={() => setSub(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

        {visible.length > 0 ? (
          <ul className={preview ? "sf-grid sf-grid--preview" : "sf-grid"}>
            {visible.map((item) => (
              <TemplateCard key={item.id} item={item} />
            ))}
          </ul>
        ) : (
          <p className="sf-empty">
            По этому запросу ничего нет. Попробуйте другую категорию — или{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Нужен макет: не нашёл на витрине")}`}
            >
              напишите нам
            </a>
            , подберём под задачу.
          </p>
        )}

      {preview && filtered.length > 4 && (
        <div className="cs-more">
          <a className="btn" href="/templates">
            <span>Смотреть все макеты</span>
            <i className="btn-arrow">→</i>
          </a>
        </div>
      )}
    </>
  );
}

export function TemplateCard({ item }: { item: StoreItem }) {
  const cta = item.kind === "Макет" ? "Купить" : "Заказать";
  const subject = encodeURIComponent(
    item.kind === "Макет"
      ? `Хочу купить макет: ${item.name}`
      : `Хочу заказать: ${item.name}`,
  );

  const href = item.slug ? `/template/${item.slug}` : null;

  return (
    <li className="sf-card">
      {href ? (
        <a className="sf-card__media" href={href}>
          {item.cover ? (
            <img src={item.cover} alt="" loading="lazy" />
          ) : (
            <span className="sf-card__placeholder" aria-hidden="true">
              {item.name}
            </span>
          )}
          <span className="sf-card__badge">{item.kind}</span>
          {item.badge && <span className="sf-card__badge sf-card__badge--alt">{item.badge}</span>}
        </a>
      ) : (
        <div className="sf-card__media">
          {item.cover ? (
            <img src={item.cover} alt="" loading="lazy" />
          ) : (
            <span className="sf-card__placeholder" aria-hidden="true">
              {item.name}
            </span>
          )}
          <span className="sf-card__badge">{item.kind}</span>
          {item.badge && <span className="sf-card__badge sf-card__badge--alt">{item.badge}</span>}
        </div>
      )}
      <div className="sf-card__body">
        <p className="sf-card__meta">
          {item.cat}
          {item.sub ? ` / ${item.sub}` : ""}
        </p>
        <h3 className="sf-card__title">
          {href ? <a href={href}>{item.name}</a> : item.name}
        </h3>
        <div className="sf-card__row">
          <strong className="sf-card__price">
            {item.priceText ?? priceFmt.format(item.price)}
          </strong>
          <a
            className="sf-card__cta"
            href={
              item.slug
                ? `/template/${item.slug}`
                : `mailto:${CONTACT_EMAIL}?subject=${subject}`
            }
          >
            {cta}
          </a>
        </div>
      </div>
    </li>
  );
}
