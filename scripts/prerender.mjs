/* Static prerender: after `vite build`, walks every public route with
   headless Chrome against `vite preview` and writes the fully rendered
   DOM (with injected meta/OG/JSON-LD) to dist/<route>/index.html.
   Result: real indexable URLs for Yandex/Google on any static hosting —
   no server-side fallback needed (the file IS the response).

   Also emits dist/sitemap.xml and dist/robots.txt.
   Run: node scripts/prerender.mjs   (part of `npm run build`) */

import { preview } from "vite";
import puppeteer from "puppeteer-core";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = dirname(fileURLToPath(import.meta.url)) + "/..";
const DIST = join(ROOT, "dist");
const SITE = process.env.SITE_URL ?? "https://zetronix.ru";
const CHROME =
  process.env.CHROME_PATH ??
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 4199;

/* slugs straight from the data files — scoped to a named export so arrays
   in the same file (DIRECTIONS vs NICHES) don't bleed into each other */
const slugsOf = (file, marker) => {
  const src = readFileSync(join(ROOT, file), "utf8");
  const start = src.indexOf(`export const ${marker}`);
  const end = src.indexOf("] as const", start);
  const block = end > start ? src.slice(start, end) : src;
  return [...block.matchAll(/slug: "([\w-]+)"/g)].map((m) => m[1]);
};

/* "/" goes LAST: vite preview serves dist/index.html as the SPA fallback for
   every other route, so it must stay the clean vite build (no baked-in SEO
   tags) while the subpages are being rendered. "/404" goes right before "/"
   for the same reason — it renders on the clean index.html. */
const routes = [
  "/privacy",
  "/oferta",
  "/blog",
  ...slugsOf("src/data/blog.ts", "POSTS").map((s) => `/blog/${s}`),
  "/cases",
  ...slugsOf("src/data/cases.ts", "CASES").map((s) => `/case/${s}`),
  "/templates",
  "/napravlenie",
  ...slugsOf("src/data/content.ts", "DIRECTIONS").map((s) => `/napravlenie/${s}`),
  ...slugsOf("src/data/content.ts", "NICHES").map((s) => `/dlya/${s}`),
  ...slugsOf("src/data/templates.ts", "TEMPLATES").map((s) => `/template/${s}`),
  "/404",
  "/",
];

const outFile = (route) =>
  route === "/404"
    ? join(DIST, "404.html")
    : route === "/"
      ? join(DIST, "index.html")
      : join(DIST, route, "index.html");

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .filter((r) => r !== "/404")
  .map(
    (r) => `  <url><loc>${SITE}${r === "/" ? "/" : r}</loc><lastmod>${today}</lastmod>${r === "/" ? "<priority>1.0</priority>" : ""}</url>`,
  )
  .join("\n")}
</urlset>
`;
const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /partner

Sitemap: ${SITE}/sitemap.xml
`;

async function main() {
  const server = await preview({
    root: ROOT,
    preview: { port: PORT, strictPort: true },
    logLevel: "silent",
  });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-proxy-server"],
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(45000);

  let done = 0;
  for (const route of routes) {
    try {
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: "networkidle2",
      });
      // give React + useSeo effects a beat to mount and inject meta
      await new Promise((r) => setTimeout(r, 1800));
      // canonical/og:url/JSON-LD got the preview origin at render time —
      // rewrite them to the production domain in the emitted file
      const html = (await page.content())
        .replaceAll(`http://localhost:${PORT}`, SITE)
        // prerender добегает до live-состояния робота — в статике PNG должен
        // стартовать видимым, иначе на медленном телефоне робот «исчезает»
        .replace('class="robot-visual is-live"', 'class="robot-visual"');
      const file = outFile(route);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, html, "utf8");
      done++;
      process.stdout.write(`  prerendered ${route}\n`);
    } catch (e) {
      process.stderr.write(`  !! ${route}: ${e.message}\n`);
    }
  }

  await browser.close();
  await server.close();

  writeFileSync(join(DIST, "sitemap.xml"), sitemap, "utf8");
  writeFileSync(join(DIST, "robots.txt"), robots, "utf8");
  console.log(
    `prerender: ${done}/${routes.length} routes → dist/, sitemap.xml + robots.txt written`,
  );
  // неполный пререндер = SEO-регрессия в проде (nginx отдаст 404 на
  // отсутствующие страницы). Падаем, если только PRERENDER_OPTIONAL не задан.
  if (done !== routes.length) {
    if (process.env.PRERENDER_OPTIONAL) {
      console.warn("prerender incomplete, but PRERENDER_OPTIONAL is set");
    } else {
      console.error(`prerender FAILED: ${done}/${routes.length} routes`);
      process.exit(1);
    }
  }
}

main().catch((e) => {
  if (process.env.PRERENDER_OPTIONAL) {
    console.warn("prerender skipped:", e.message ?? e);
    process.exit(0);
  }
  console.error("prerender failed:", e.message ?? e);
  process.exit(1);
});
