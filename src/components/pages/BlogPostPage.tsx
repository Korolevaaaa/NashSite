import { useEffect } from "react";
import { POSTS, type BlogBlock } from "../../data/blog";
import { CONTACT_EMAIL } from "../../data/content";

function Block({ b }: { b: BlogBlock }) {
  switch (b.type) {
    case "h2":
      return <h2 className="post-h2">{b.text}</h2>;
    case "p":
      return <p className="post-p">{b.text}</p>;
    case "list":
      return (
        <ul className="post-list">
          {b.items.map((i) => (
            <li key={i}>{i}</li>
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
  }
}

export default function BlogPostPage({ slug }: { slug: string }) {
  const post = POSTS.find((p) => p.slug === slug);

  useEffect(() => {
    if (!post) return;
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "ld-article";
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: { "@type": "Organization", name: "ZETRONIX" },
    });
    document.head.appendChild(el);
    return () => el.remove();
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
        <a
          href="#/blog"
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--z-muted)] no-underline hover:text-[var(--z-action)]"
        >
          ← Все статьи
        </a>

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
        </p>

        {post.cover && (
          <figure className="post-fig post-fig--hero">
            <img src={post.cover} alt={post.title} />
          </figure>
        )}

        <div className="post-body">
          {post.body.map((b, i) => (
            <Block key={i} b={b} />
          ))}
        </div>

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
