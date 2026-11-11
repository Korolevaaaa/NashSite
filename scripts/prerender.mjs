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
   tags) while the subpages are being rendered. */
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
  "/",
];

const outFile = (route) =>
  route === "/" ? join(DIST, "index.html") : join(DIST, route, "index.html");

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
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
      const html = (await page.content()).replaceAll(
        `http://localhost:${PORT}`,
        SITE,
      );
      const file = outFile(route);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, html, "utf8");
      done++;
      process.stdout.write(`  prerendered ${route}\n`);
    } catch (e) {
      process.stderr.write(`  !! ${route}: ${e.message}\n`);
    }
  }

  // кастомная 404-страница: статик-хосты отдают dist/404.html
  // на неизвестных путях (GitHub Pages, Netlify, nginx и т.п.)
  try {
    await page.goto(`http://localhost:${PORT}/404`, {
      waitUntil: "networkidle2",
    });
    await new Promise((r) => setTimeout(r, 1800));
    const html = (await page.content()).replaceAll(
      `http://localhost:${PORT}`,
      SITE,
    );
    writeFileSync(join(DIST, "404.html"), html, "utf8");
    process.stdout.write("  prerendered /404 → 404.html\n");
  } catch (e) {
    process.stderr.write(`  !! /404: ${e.message}\n`);
  }

  await browser.close();
  await server.close();

  writeFileSync(join(DIST, "sitemap.xml"), sitemap, "utf8");
  writeFileSync(join(DIST, "robots.txt"), robots, "utf8");
  console.log(
    `prerender: ${done}/${routes.length} routes → dist/, sitemap.xml + robots.txt written`,
  );
}

main().catch((e) => {
  // never fail the production build because of prerender
  console.warn("prerender skipped:", e.message ?? e);
  process.exit(0);
});
