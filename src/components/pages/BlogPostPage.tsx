import { useEffect, useMemo } from "react";
import { POSTS, type BlogBlock } from "../../data/blog";
import { CONTACT_EMAIL } from "../../data/content";
import PriceLadder from "../blog/PriceLadder";
import HiddenCosts from "../blog/HiddenCosts";
import CostQuiz from "../blog/CostQuiz";

/* Inline [text](#/href) links inside plain body text. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!m) return part;
        return (
          <a key={i} href={m[2]} className="post-link">
            {m[1]}
          </a>
        );
      })}
    </>
  );
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/gi, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);

function Block({ b }: { b: BlogBlock }) {
  switch (b.type) {
    case "h2":
      return (
        <h2 id={slugify(b.text)} className="post-h2">
          {b.text}
        </h2>
      );
    case "p":
      return (
        <p className="post-p">
          <RichText text={b.text} />
        </p>
      );
    case "list":
      return (
        <ul className="post-list">
          {b.items.map((i) => (
            <li key={i}>
              <RichText text={i} />
            </li>
          ))}
        </ul>
      );
    case "img":
      return (
        <figure className="post-fig">
          <img src={b.src} alt={b.alt} loading="lazy" />
          {b.caption && <figcaption>{b.caption}</figcaption>}
        </figure>
      );
    case "quote":
      return (
        <blockquote className="post-quote">
          <p>{b.text}</p>
          {b.author && <cite>{b.author}</cite>}
        </blockquote>
      );
    case "table":
      return (
        <figure className="post-table-wrap">
          <table className="post-table">
            <thead>
              <tr>
                {b.head.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {b.caption && <figcaption>{b.caption}</figcaption>}
        </figure>
      );
    case "faq":
      return (
        <div className="post-faq">
          {b.items.map((f) => (
            <details key={f.q} className="post-faq__item">
              <summary>
                <span>{f.q}</span>
                <i aria-hidden="true">+</i>
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      );
    case "cta":
      return (
        <aside className="post-cta">
          <p className="post-cta__title">{b.title}</p>
          <p className="post-cta__text">{b.text}</p>
          <a className="btn" href={b.href}>
            <span>{b.label}</span>
            <i className="btn-arrow">→</i>
          </a>
        </aside>
      );
    case "viz":
      return b.name === "priceLadder" ? (
        <PriceLadder />
      ) : b.name === "hiddenCosts" ? (
        <HiddenCosts />
      ) : (
        <CostQuiz />
      );
  }
}

const faqItems = (post: (typeof POSTS)[number]) =>
  post.body.flatMap((b) => (b.type === "faq" ? b.items : []));

const readingMin = (post: (typeof POSTS)[number]) => {
  const chars = post.body.reduce((n, b) => {
    if (b.type === "p" || b.type === "h2" || b.type === "quote")
      return n + b.text.length;
    if (b.type === "list") return n + b.items.join(" ").length;
    if (b.type === "table") return n + b.rows.flat().join(" ").length;
    if (b.type === "faq")
      return n + b.items.map((f) => f.q + f.a).join(" ").length;
    return n;
  }, 0);
  return Math.max(1, Math.round(chars / 1400)); // ~1400 знаков/мин для русского
};

export default function BlogPostPage({ slug }: { slug: string }) {
  const post = POSTS.find((p) => p.slug === slug);
  const toc = useMemo(
    () =>
      post
        ? post.body.flatMap((b) =>
            b.type === "h2" ? [{ id: slugify(b.text), text: b.text }] : [],
          )
        : [],
    [post],
  );

  /* SEO: meta description + OG + JSON-LD (Article, Breadcrumb, FAQ). */
  useEffect(() => {
    if (!post) return;

    const metas: { el: HTMLMetaElement; prev: string | null }[] = [];
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(
        `meta[${attr}="${key}"]`,
      );
      let prev: string | null = null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      } else {
        prev = el.getAttribute("content");
      }
      el.setAttribute("content", content);
      metas.push({ el, prev });
    };

    const url = `${location.origin}${location.pathname}#/blog/${post.slug}`;
    const coverAbs = post.cover
      ? `${location.origin}${post.cover}`
      : undefined;

    setMeta("name", "description", post.excerpt);
    setMeta("property", "og:title", post.title);
    setMeta("property", "og:description", post.excerpt);
    setMeta("property", "og:type", "article");
    setMeta("property", "og:url", url);
    if (coverAbs) setMeta("property", "og:image", coverAbs);
    setMeta("name", "twitter:card", "summary_large_image");

    const mk = (id: string, data: object) => {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = id;
      el.textContent = JSON.stringify(data);
      document.head.appendChild(el);
      return el;
    };

    const lds = [
      mk("ld-article", {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.date,
        image: coverAbs,
        author: { "@type": "Organization", name: "ZETRONIX" },
        publisher: {
          "@type": "Organization",
          name: "ZETRONIX",
          logo: {
            "@type": "ImageObject",
            url: `${location.origin}/favicon.svg`,
          },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      }),
      mk("ld-breadcrumb", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: `${location.origin}${location.pathname}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Блог",
            item: `${location.origin}${location.pathname}#/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: url,
          },
        ],
      }),
    ];

    const faq = faqItems(post);
    if (faq.length) {
      lds.push(
        mk("ld-faq", {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      );
    }

    return () => {
      lds.forEach((el) => el.remove());
      metas.forEach(({ el, prev }) =>
        prev === null ? el.remove() : el.setAttribute("content", prev),
      );
    };
  }, [post]);

  if (!post) {
    return (
      <main className="px-[var(--page-gutter)] py-[160px]">
        <div className="mx-auto max-w-[var(--content-max)]">
          <p className="text-[var(--z-muted)]">Статья не найдена.</p>
          <a className="btn mt-6" href="#/blog">
            ← Все статьи
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="px-[var(--page-gutter)] pb-[clamp(80px,12vh,140px)] pt-[calc(var(--header-h,110px)+56px)]">
      <article className="mx-auto max-w-[720px]">
        <nav aria-label="Хлебные крошки" className="post-crumbs">
          <a href="#/blog">← Все статьи</a>
        </nav>

        <p className="mt-10 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--z-action)]">
          {post.tags.join(" · ")}
        </p>
        <h1 className="mt-4 font-body text-[clamp(30px,4vw,50px)] font-medium leading-[1.1] tracking-[-0.04em] text-[var(--z-ink)]">
          {post.title}
        </h1>
        <p className="mt-5 text-[14px] text-[var(--z-muted)]">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          {" · "}
          {readingMin(post)} мин чтения
        </p>

        {post.cover && (
          <figure className="post-fig post-fig--hero">
            <img src={post.cover} alt={post.title} />
            {post.coverHook && (
              <figcaption className="post-fig__hook">
                {post.coverHook}
              </figcaption>
            )}
          </figure>
        )}

        {toc.length > 1 && (
          <nav className="post-toc" aria-label="Содержание">
            <p className="post-toc__title">Содержание</p>
            <ul>
              {toc.map((t) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById(t.id)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    {t.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="post-body">
          {post.body.map((b, i) => (
            <Block key={i} b={b} />
          ))}
        </div>

        {post.author && (
          <div className="post-author">
            {post.author.photo ? (
              <img
                src={post.author.photo}
                alt={post.author.name}
                className="post-author__img"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <span className="post-author__img post-author__img--initials">
                {post.author.name.slice(0, 1)}
              </span>
            )}
            <div>
              <p className="post-author__name">{post.author.name}</p>
              <p className="post-author__role">{post.author.role}</p>
            </div>
          </div>
        )}

        <div className="mt-14 border-t border-line pt-8">
          <a
            className="btn"
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Вопрос по статье «${post.title}»`)}`}
          >
            <span>Обсудить тему</span>
            <i className="btn-arrow">↗</i>
          </a>
        </div>
      </article>
    </main>
  );
}
