import { POSTS } from "../../data/blog";

export default function BlogPage() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className="px-[var(--page-gutter)] pb-[clamp(80px,12vh,140px)] pt-[calc(var(--header-h,110px)+56px)]">
      <div className="mx-auto max-w-[760px]">
        <a
          href="#top"
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--z-muted)] no-underline hover:text-[var(--z-action)]"
        >
          ← На главную
        </a>

        <h1 className="mt-10 font-body text-[clamp(34px,4.6vw,62px)] font-medium leading-[1.05] tracking-[-0.045em] text-[var(--z-ink)]">
          Блог
        </h1>
        <p className="mt-5 max-w-[52ch] text-[16px] leading-[1.65] text-[var(--z-muted)]">
          Разбираем решения, которыми пользуемся сами: выбор технологий,
          ошибки в интерфейсах, реальные кейсы из проектов.
        </p>

        {posts.length === 0 ? (
          <p className="sf-empty">Статьи скоро появятся — сейчас пишем первую серию.</p>
        ) : (
          <ul className="blog-list">
            {posts.map((p) => (
              <li key={p.slug}>
                <a
                  className={`blog-item ${p.cover ? "blog-item--cover" : ""}`}
                  href={`#/blog/${p.slug}`}
                >
                  <span className="blog-item__body">
                    <span className="blog-item__meta">
                      <time dateTime={p.date}>
                        {new Date(p.date).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                      {p.tags.map((t) => (
                        <span key={t} className="blog-item__tag">
                          {t}
                        </span>
                      ))}
                    </span>
                    <span className="blog-item__title">{p.title}</span>
                    <span className="blog-item__excerpt">{p.excerpt}</span>
                    <span className="blog-item__more">Читать →</span>
                  </span>
                  {p.cover && (
                    <span className="blog-item__cover">
                      <img src={p.cover} alt="" loading="lazy" />
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
