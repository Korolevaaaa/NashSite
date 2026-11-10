import { useState } from "react";
import { PARTNERS, initialsOf } from "../../data/partners";
import { useSeo } from "../../hooks/useSeo";

/* Кабинет партнёра /partner — лёгкая авторизация (логин/пароль в
   data/partners.ts, сессия в sessionStorage). Честный инструмент:
   заявки идут партнёру напрямую через его контакты и помеченные
   mailto-письма, здесь — его ссылка, промокод и правила атрибуции.
   Не индексируется: Disallow в robots.txt, вне sitemap. */

const AUTH_KEY = "zt_partner_auth";

export default function PartnerPage() {
  useSeo({ title: "Кабинет партнёра", description: "", path: "/partner" });

  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === "1",
  );
  const [login, setLogin] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);

  const partner = PARTNERS.find(
    (p) => p.login === login.trim().toLowerCase() && p.password === pass,
  );
  const current = PARTNERS.find(
    (p) => sessionStorage.getItem(`${AUTH_KEY}_who`) === p.ref,
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (partner) {
      sessionStorage.setItem(AUTH_KEY, "1");
      sessionStorage.setItem(`${AUTH_KEY}_who`, partner.ref);
      setAuthed(true);
    } else {
      setErr("Неверный логин или пароль");
    }
  };

  if (!authed || !current) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-24">
        <h1 className="font-display text-2xl font-semibold text-[var(--z-ink)]">
          Кабинет партнёра
        </h1>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Логин"
            autoComplete="username"
            className="w-full rounded-xl border border-[var(--z-line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--z-action)]"
          />
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type="password"
            placeholder="Пароль"
            autoComplete="current-password"
            className="w-full rounded-xl border border-[var(--z-line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--z-action)]"
          />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-[var(--z-ink)] py-3 text-sm font-medium text-white hover:opacity-85"
          >
            Войти
          </button>
        </form>
      </main>
    );
  }

  const refLink = `https://zetronix.ru/?ref=${current.ref}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(refLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard недоступен — ссылка выделима вручную */
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center gap-4">
        {current.photo ? (
          <img
            src={current.photo}
            alt={current.name}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--z-ink)] text-base font-semibold text-white">
            {initialsOf(current.name)}
          </span>
        )}
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--z-ink)]">
            {current.name}
          </h1>
          <p className="text-sm text-[var(--z-ink)]/55">{current.role}</p>
        </div>
      </div>

      <section className="mt-10 rounded-2xl border border-[var(--z-line)] bg-white p-6">
        <h2 className="text-sm font-semibold text-[var(--z-ink)]">
          Ваша реферальная ссылка
        </h2>
        <p className="mt-1 text-xs text-[var(--z-ink)]/55">
          Все, кто перешёл по ней (или по вашей рекламе на неё), — ваши лиды.
          Метка живёт 60 дней с первого визита.
        </p>
        <div className="mt-3 flex gap-2">
          <code className="flex-1 truncate rounded-lg bg-[var(--z-bg)] px-3 py-2.5 text-sm">
            {refLink}
          </code>
          <button
            onClick={copy}
            className="rounded-lg bg-[var(--z-ink)] px-4 text-sm text-white hover:opacity-85"
          >
            {copied ? "Скопировано" : "Копировать"}
          </button>
        </div>
        <p className="mt-3 text-xs text-[var(--z-ink)]/55">
          В Яндекс Директ указывайте эту ссылку как URL объявления.
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--z-line)] bg-white p-6">
        <h2 className="text-sm font-semibold text-[var(--z-ink)]">
          Ваш промокод
        </h2>
        <p className="mt-1 text-xs text-[var(--z-ink)]/55">
          Для клиентов, которые пришли не по ссылке — назвали код при звонке
          или в заявке.
        </p>
        <p className="mt-3 font-mono text-xl font-semibold tracking-wider text-[var(--z-action)]">
          {current.promo}
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--z-line)] bg-white p-6">
        <h2 className="text-sm font-semibold text-[var(--z-ink)]">
          Как считаются ваши лиды
        </h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-[var(--z-ink)]/70">
          <li>Перешёл по вашей ссылке и написал вам — ваш лид (кнопки сайта ведут на вас).</li>
          <li>Оставил заявку через общую форму — письмо приходит с пометкой «Источник: {current.name}».</li>
          <li>Вернулся без ссылки в течение 60 дней — метка сохраняется, лид всё равно ваш.</li>
          <li>Назвал промокод <b>{current.promo}</b> — ваш лид без вопросов.</li>
          <li>Реклама в Яндекс Директ — отчёт по кампаниям в Метрике покажет ваши переходы отдельно.</li>
        </ul>
      </section>

      <button
        onClick={() => {
          sessionStorage.removeItem(AUTH_KEY);
          sessionStorage.removeItem(`${AUTH_KEY}_who`);
          setAuthed(false);
        }}
        className="mt-6 text-sm text-[var(--z-ink)]/50 underline-offset-2 hover:underline"
      >
        Выйти
      </button>
    </main>
  );
}
