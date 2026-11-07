import { useMemo, useState } from "react";
import {
  DRAFT_KEY,
  PUBLISHED_KEY,
  TAX_KEY,
  SEED_ITEMS,
  downloadJSON,
  draftItems,
  readLS,
  taxonomy,
  writeLS,
  type StoreItem,
  type TaxCat,
} from "../../data/storefront";

/* Owner-only page at #/admin — an honest draft tool, not a fake secure
   backend: items live in this browser's localStorage and can be exported
   as JSON. "draft" items never appear on the public storefront. */

const NEW = "__new__";

interface FormState {
  name: string;
  cat: string;
  sub: string;
  kind: string;
  price: string;
  cover: string;
  status: "draft" | "published";
  newCat: string;
  newSub: string;
}

const emptyForm: FormState = {
  name: "",
  cat: "",
  sub: "",
  kind: "Макет",
  price: "",
  cover: "",
  status: "draft",
  newCat: "",
  newSub: "",
};

const uid = () =>
  crypto.randomUUID?.() || `card_${Date.now()}_${Math.random().toString(36).slice(2)}`;

export default function StorefrontAdmin() {
  const [draft, setDraft] = useState<StoreItem[]>(draftItems);
  const [published, setPublished] = useState<StoreItem[]>(() =>
    readLS<StoreItem[]>(PUBLISHED_KEY, []),
  );
  const [extraTax, setExtraTax] = useState<TaxCat[]>(() =>
    readLS<TaxCat[]>(TAX_KEY, []),
  );
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [newCat, setNewCat] = useState("");
  const [newSub, setNewSub] = useState("");

  const all = useMemo(
    () => [...draft, ...published, ...SEED_ITEMS],
    [draft, published],
  );
  const cats = useMemo(() => taxonomy(all, extraTax), [all, extraTax]);
  const selectedCat = cats.find((c) => c.name === form.cat);
  const currentCatForSub = form.cat === NEW ? form.newCat : form.cat;

  const set = (patch: Partial<FormState>) =>
    setForm((f) => ({ ...f, ...patch }));

  const persist = (nextDraft: StoreItem[], nextPublished: StoreItem[]) => {
    setDraft(nextDraft);
    setPublished(nextPublished);
    writeLS(DRAFT_KEY, nextDraft);
    writeLS(PUBLISHED_KEY, nextPublished);
  };

  const persistTax = (next: TaxCat[]) => {
    setExtraTax(next);
    writeLS(TAX_KEY, next);
  };

  const upsertCard = () => {
    const cat = form.cat === NEW ? form.newCat : form.cat;
    const sub = form.sub === NEW ? form.newSub : form.sub;
    if (!form.name.trim()) {
      alert("Нужно название карточки.");
      return;
    }
    if (!cat?.trim()) {
      alert("Нужно выбрать или создать категорию.");
      return;
    }
    const card: StoreItem = {
      id: editId || uid(),
      name: form.name.trim(),
      cat: cat.trim(),
      sub: sub?.trim() || "",
      kind: form.kind.trim() || "Макет",
      price: Number(form.price || 0),
      cover: form.cover.trim() || undefined,
      status: form.status,
      updatedAt: new Date().toISOString(),
    };
    let nextDraft = draft.filter((i) => i.id !== card.id);
    let nextPublished = published.filter((i) => i.id !== card.id);
    if (card.status === "published") {
      nextPublished = [card, ...nextPublished];
    } else {
      nextDraft = [card, ...nextDraft];
    }
    persist(nextDraft, nextPublished);
    setForm(emptyForm);
    setEditId(null);
  };

  const removeCard = (id: string) => {
    if (!window.confirm("Удалить карточку?")) return;
    persist(
      draft.filter((i) => i.id !== id),
      published.filter((i) => i.id !== id),
    );
  };

  const editCard = (card: StoreItem) => {
    setEditId(card.id);
    setForm({
      name: card.name || "",
      cat: card.cat || "",
      sub: card.sub || "",
      kind: card.kind || "Макет",
      price: String(card.price ?? ""),
      cover: card.cover || "",
      status: card.status || "draft",
      newCat: "",
      newSub: "",
    });
  };

  const addCategory = (name: string) => {
    const value = name.trim();
    if (!value) return;
    persistTax(
      extraTax.some((c) => c.name === value)
        ? extraTax
        : [...extraTax, { name: value, subs: [] }],
    );
    set({ cat: value, sub: "", newSub: "" });
  };

  const addSubcategory = (catName: string, subName: string) => {
    const catValue = catName.trim();
    const subValue = subName.trim();
    if (!catValue || !subValue) return;
    const idx = extraTax.findIndex((c) => c.name === catValue);
    persistTax(
      idx >= 0
        ? extraTax.map((c, i) =>
            i !== idx || c.subs.includes(subValue)
              ? c
              : { ...c, subs: [...c.subs, subValue] },
          )
        : [...extraTax, { name: catValue, subs: [subValue] }],
    );
    set({ cat: catValue, sub: subValue, newSub: "" });
  };

  return (
    <main className="sf-admin px-[var(--page-gutter)]">
      <div className="mx-auto max-w-[var(--content-max)]">
        <div className="sf-admin__head">
          <div>
            <h1 className="zt-title">Витрина — управление</h1>
            <p className="sf-admin__note">
              Черновой инструмент владельца: данные живут в этом браузере
              (localStorage). «Черновик» посетители не видят. «Экспорт»
              скачивает JSON — пришлите его нам, и карточки попадут в код сайта.
            </p>
          </div>
          <div className="sf-admin__head-actions">
            <button
              className="sf-btn"
              type="button"
              onClick={() =>
                downloadJSON(
                  `storefront-${new Date().toISOString().slice(0, 10)}.json`,
                  { draft, published, extraTax },
                )
              }
            >
              Экспорт JSON
            </button>
            <a className="sf-btn sf-btn--ghost" href="#top">
              ← На сайт
            </a>
          </div>
        </div>

        <form
          className="sf-form"
          onSubmit={(e) => {
            e.preventDefault();
            upsertCard();
          }}
        >
          <div className="sf-form__grid">
            <label className="sf-field">
              <span>Название</span>
              <input
                className="sf-input"
                value={form.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="Например: Магазин цветов"
              />
            </label>

            <label className="sf-field">
              <span>Категория</span>
              <select
                className="sf-select"
                value={form.cat}
                onChange={(e) =>
                  set({ cat: e.target.value, sub: "", newSub: "" })
                }
              >
                <option value="">Выбрать</option>
                {cats.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
                <option value={NEW}>Новая…</option>
              </select>
            </label>

            {form.cat === NEW && (
              <label className="sf-field">
                <span>Имя новой категории</span>
                <input
                  className="sf-input"
                  value={form.newCat}
                  onChange={(e) => set({ newCat: e.target.value })}
                  placeholder="Например: Telegram Mini Apps"
                />
              </label>
            )}

            <label className="sf-field">
              <span>Подкатегория</span>
              <select
                className="sf-select"
                value={form.sub}
                onChange={(e) => set({ sub: e.target.value })}
                disabled={!form.cat}
              >
                <option value="">Без подкатегории</option>
                {selectedCat?.subs.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
                <option value={NEW}>Новая…</option>
              </select>
            </label>

            {form.sub === NEW && (
              <label className="sf-field">
                <span>Имя новой подкатегории</span>
                <input
                  className="sf-input"
                  value={form.newSub}
                  onChange={(e) => set({ newSub: e.target.value })}
                  placeholder="Например: Суши"
                />
              </label>
            )}

            <label className="sf-field">
              <span>Тип</span>
              <input
                className="sf-input"
                list="sf-kind"
                value={form.kind}
                onChange={(e) => set({ kind: e.target.value })}
              />
              <datalist id="sf-kind">
                <option value="Макет" />
                <option value="Сервис" />
              </datalist>
            </label>

            <label className="sf-field">
              <span>Цена, ₽</span>
              <input
                className="sf-input"
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => set({ price: e.target.value })}
                placeholder="0"
              />
            </label>

            <label className="sf-field">
              <span>Обложка, URL</span>
              <input
                className="sf-input"
                value={form.cover}
                onChange={(e) => set({ cover: e.target.value })}
                placeholder="/covers/card.jpg"
              />
            </label>

            <label className="sf-field">
              <span>Статус</span>
              <select
                className="sf-select"
                value={form.status}
                onChange={(e) =>
                  set({ status: e.target.value as FormState["status"] })
                }
              >
                <option value="draft">Черновик</option>
                <option value="published">Опубликовано</option>
              </select>
            </label>
          </div>

          {form.status === "draft" && (
            <p className="sf-warn">Черновик — посетители не видят.</p>
          )}

          <div className="sf-form__actions">
            <button className="sf-btn" type="submit">
              {editId ? "Сохранить карточку" : "Добавить карточку"}
            </button>
            {editId && (
              <button
                className="sf-btn sf-btn--ghost"
                type="button"
                onClick={() => {
                  setForm(emptyForm);
                  setEditId(null);
                }}
              >
                Отменить правку
              </button>
            )}
          </div>
        </form>

        <div className="sf-tax">
          <div className="sf-form__grid">
            <label className="sf-field">
              <span>Новая категория</span>
              <input
                className="sf-input"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="Например: Услуги"
              />
            </label>
            <button
              className="sf-btn"
              type="button"
              onClick={() => {
                addCategory(newCat);
                setNewCat("");
              }}
            >
              Добавить категорию
            </button>

            <label className="sf-field">
              <span>Новая подкатегория для выбранной категории</span>
              <input
                className="sf-input"
                value={newSub}
                onChange={(e) => setNewSub(e.target.value)}
                placeholder="Например: Аудит"
              />
            </label>
            <button
              className="sf-btn"
              type="button"
              disabled={!currentCatForSub?.trim()}
              onClick={() => {
                addSubcategory(currentCatForSub, newSub);
                setNewSub("");
              }}
            >
              Добавить подкатегорию
            </button>
          </div>
        </div>

        <ul className="sf-list">
          {[...draft, ...published].length === 0 && (
            <li className="sf-empty-item">Своих карточек пока нет.</li>
          )}
          {[...draft, ...published].map((card) => (
            <li key={card.id} className="sf-item">
              {card.cover ? (
                <img className="sf-item__thumb" src={card.cover} alt="" />
              ) : (
                <span className="sf-item__thumb sf-item__thumb--empty" />
              )}
              <div className="sf-item__meta">
                <strong>{card.name}</strong>
                <span>
                  {card.cat}
                  {card.sub ? ` / ${card.sub}` : ""} · {card.kind} ·{" "}
                  {card.price ? `${card.price.toLocaleString("ru-RU")} ₽` : "—"}
                </span>
              </div>
              {card.status === "draft" ? (
                <span className="sf-badge sf-badge--draft">Черновик</span>
              ) : (
                <span className="sf-badge sf-badge--live">Опубликовано</span>
              )}
              <div className="sf-item__actions">
                <button
                  className="sf-btn sf-btn--sm"
                  type="button"
                  onClick={() => editCard(card)}
                >
                  Правка
                </button>
                <button
                  className="sf-btn sf-btn--sm sf-btn--danger"
                  type="button"
                  onClick={() => removeCard(card.id)}
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
