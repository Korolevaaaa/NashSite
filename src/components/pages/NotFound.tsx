import { useSeo } from "../../hooks/useSeo";

export default function NotFound() {
  useSeo({
    description: "Страница не найдена — ZETRONIX.",
    path: location.pathname,
    robots: "noindex,follow",
  });

  return (
    <main className="px-[var(--page-gutter)] py-[160px]">
      <div className="mx-auto max-w-[var(--content-max)]">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--z-action)]">
          404
        </p>
        <h1 className="mt-4 font-body text-[clamp(34px,4.6vw,62px)] font-medium leading-[1.05] tracking-[-0.045em] text-[var(--z-ink)]">
          Страница не найдена
        </h1>
        <p className="mt-6 max-w-[44ch] text-[16px] leading-[1.65] text-[var(--z-muted)]">
          Такого адреса на сайте нет — возможно, ссылка устарела или в ней опечатка.
        </p>
        <a className="btn mt-10" href="/">
          ← На главную
        </a>
      </div>
    </main>
  );
}
