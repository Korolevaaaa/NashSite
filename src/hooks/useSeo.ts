import { useEffect } from "react";

/* Per-page SEO: meta description, Open Graph, twitter card, canonical,
   JSON-LD scripts. Sets tags on mount, restores defaults on unmount.
   Works with prerendered static HTML (tags baked into each route's file). */

export interface SeoOptions {
  description: string;
  path: string; // canonical path, e.g. "/blog/skolko-stoit-sayt"
  title?: string; // og:title; document.title задаёт роутер
  image?: string; // og:image, относительный путь ок
  type?: string; // og:type, default "website"
  jsonLd?: object | object[];
}

export function useSeo({
  description,
  path,
  title,
  image,
  type = "website",
  jsonLd,
}: SeoOptions) {
  useEffect(() => {
    if (!description || !path) return;
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

    const url = `${location.origin}${path}`;
    const imgAbs = image ? `${location.origin}${image}` : undefined;

    setMeta("name", "description", description);
    setMeta("property", "og:title", title ?? document.title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", url);
    if (imgAbs) setMeta("property", "og:image", imgAbs);
    setMeta("name", "twitter:card", "summary_large_image");

    // canonical
    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    let canonicalPrev: string | null = null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    } else {
      canonicalPrev = canonical.getAttribute("href");
    }
    canonical.setAttribute("href", url);

    // JSON-LD — wipe any baked-in scripts from the prerendered file first
    // (vite preview serves dist/index.html as SPA fallback, so its serialized
    // ld-auto scripts would otherwise linger on every page)
    document.head
      .querySelectorAll("script.ld-auto")
      .forEach((el) => el.remove());
    const lds: HTMLScriptElement[] = [];
    const ldList = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
    ldList.forEach((data, i) => {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.className = "ld-auto";
      el.dataset.seo = String(i);
      el.textContent = JSON.stringify(data);
      document.head.appendChild(el);
      lds.push(el);
    });

    return () => {
      lds.forEach((el) => el.remove());
      metas.forEach(({ el, prev }) =>
        prev === null ? el.remove() : el.setAttribute("content", prev),
      );
      if (canonicalPrev === null) canonical.remove();
      else canonical.setAttribute("href", canonicalPrev);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, description]);
}
