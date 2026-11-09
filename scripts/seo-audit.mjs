/* Post-build SEO audit over prerendered dist/ HTML.
   Checks: title/desc lengths, canonical, OG image, JSON-LD (@graph aware),
   H1 count, images without alt/lazy. Run: node scripts/seo-audit.mjs */
import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import { join, sep } from "path";

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const pages = [];
for (const f of walk("dist")) {
  if (f.endsWith("index.html")) {
    pages.push({ file: f, route: "/" + f.split(sep).slice(1, -1).join("/") });
  }
}
pages.sort((a, b) => a.route.localeCompare(b.route));

const issues = { title: [], desc: [], canonical: [], og: [], ld: [], h1: [], img: [] };

for (const { file, route } of pages) {
  const html = readFileSync(file, "utf8");
  const bodyNoNoscript = html.replace(/<noscript>[\s\S]*?<\/noscript>/g, "");

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  if (title.length > 62 || !title) issues.title.push(`${route}  ${title.length}ch  ${title.slice(0, 70)}`);

  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  if (desc.length > 160 || !desc) issues.desc.push(`${route}  ${desc.length}ch`);

  const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
  if (!canon.startsWith("https://zetronix.ru")) issues.canonical.push(`${route}  ${canon}`);

  const og = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1] ?? "";
  if (!og) issues.og.push(route);

  const ldBlocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)];
  const types = new Set();
  for (const b of ldBlocks) {
    try {
      const j = JSON.parse(b[1]);
      const nodes = j["@graph"] ?? [j];
      nodes.forEach((n) => n["@type"] && types.add(n["@type"]));
    } catch { types.add("PARSE-ERR"); }
  }
  if (types.size === 0) issues.ld.push(route);

  const h1s = bodyNoNoscript.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) issues.h1.push(`${route}  h1:${h1s.length}`);

  const imgs = [...bodyNoNoscript.matchAll(/<img([^>]*)>/g)];
  let noAlt = 0, noLazy = 0;
  for (const [, attrs] of imgs) {
    if (!/alt=/.test(attrs)) noAlt++;
    if (!/loading="lazy"/.test(attrs)) noLazy++;
  }
  if (noAlt) issues.img.push(`${route}  no-alt:${noAlt}`);
  if (noLazy > 1) issues.img.push(`${route}  eager:${noLazy}/${imgs.length}`);
}

console.log(`pages: ${pages.length}`);
for (const [k, v] of Object.entries(issues)) {
  console.log(`\n=== ${k.toUpperCase()} (${v.length}) ===`);
  v.forEach((x) => console.log(" ", x));
}

// big dist assets
console.log("\n=== ASSETS >400KB ===");
for (const f of walk("dist")) {
  if (/\.(png|jpe?g|webp|avif|mp4|webm|js)$/.test(f)) {
    const s = statSync(f).size;
    if (s > 400_000) console.log(`  ${(s / 1024) | 0}kB  ${f}`);
  }
}
