/* Blog posts model. Each entry renders at #/blog/<slug>.
   Body is a flat list of blocks — write plain Russian, no markup needed.
   Covers live in /public/blog/<slug>/cover.jpg (wide, ~16:9).
   Inline shots: /public/blog/<slug>/<name>.jpg */

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "img"; src: string; alt: string; caption?: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; author?: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string; // 1-2 sentences for the list and meta description
  date: string; // ISO, e.g. "2026-11-20"
  tags: string[];
  cover?: string;
  body: BlogBlock[];
}

export const POSTS: BlogPost[] = [
  /* Example entry — copy, fill, and it appears in the feed:
  {
    slug: "kak-vybrat-cms",
    title: "Как выбрать CMS и не переплатить",
    excerpt: "Разбираем, когда хватит конструктора, а когда нужен код.",
    date: "2026-11-20",
    tags: ["Выбор технологий"],
    body: [
      { type: "p", text: "..." },
      { type: "h2", text: "..." },
      { type: "img", src: "/blog/kak-vybrat-cms/screen.jpg", alt: "..." },
      { type: "list", items: ["...", "..."] },
    ],
  },
  */
];
