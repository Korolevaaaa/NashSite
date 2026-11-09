# NashSite — ZETRONIX studio site

## Stack
React 19 + TS + Vite + Tailwind v4 (`@tailwindcss/vite`), Three.js/r3f/drei.
Hash routing (no React Router): `#/cases`, `#/case/:slug`, `#/blog`, `#/blog/:slug`, `#/napravlenie/:slug`, `#/admin`, anchors `#services`/`#competencies`/…

## Commands
- `npm run build` → `tsc --noEmit && vite build` (RobotCanvas chunk >500 kB warning is OK)
- dev server: `localhost:5310`
- Puppeteer via `puppeteer-core`, Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`

## Hard design constraints
- NEVER touch: Hero robot, Hero kinetic grid, cinematic transition,
  holographic projector nav (beam origin/dimensions/source).
- Light, calm, premium; bg `#f4f4f4`, ink `#151b20`, teal `#006b70`/`#00c9d4`.
- Audience = business clients, not devs. No dark slop, no block-ladders.

## Case covers — working workflow (validated 2025)
AI generators CANNOT reproduce a real website screenshot (Cyrillic → garble,
layout melts). What works, final Seedream 5.0 Pro recipe:
1. Screenshot the real site FIRST (long full-page shot + narrow 1024px hero)
   via `scripts/graffiti-*.mjs` pattern.
2. Feed the long screenshot as REFERENCE image with this prompt shape:
   - "tall floating browser window filling ~85% of canvas, showing the entire
     attached layout top to bottom" (name each visible block so nothing crops)
   - physical product "breaks out" of the frame into foreground (liquid-chrome
     object, soft shadow)
   - bg `#f4f4f4` + faint technical grid + one `#00c9d4` accent line
   - "Preserve the exact layout, proportions, photos and sharp Russian
     typography of the reference — no cropping, no zooming into one block"
3. Save as `public/cases/<slug>/cover.jpg`, set `cover:` in `cases.ts`.

Rejected approaches: programmatic browser-frame cover (clean but boring —
user vetoed), AI cover with tiny site mockup (illegible), AI cover with
empty dark screen for compositing (too empty).
Helper scripts: `scripts/cover.mjs` (programmatic fallback),
`scripts/graffiti-narrow.mjs` (narrow-viewport capture → readable hero).

## Gotchas
- Neighbor folder `C:\Проекты WEB\Наш сайт` is a DIFFERENT project — never touch.
- `file://` images fail inside puppeteer `setContent` → embed as base64 data URI.
- Bash: `$(` in `node -e` strings gets eaten → write scripts to files.
- Check `git status` before edits (IDE buffer overwrites happened before).

## SEO architecture (Nov 2026)
- Path routing, NOT hash: routeOf() reads location.pathname; legacy `/#/x`
  URLs are replaceState-redirected to `/x`. Internal links: pages `/blog/x`,
  sections `/#anchor`. Global click interceptor in App.tsx does pushState +
  popstate — no full reloads.
- `npm run build` also runs `scripts/prerender.mjs`: vite preview + headless
  Chrome → writes rendered HTML (meta/OG/JSON-LD included) to
  `dist/<route>/index.html` for ALL routes → real indexable pages on any
  static host, no server fallback needed. Also emits sitemap.xml + robots.txt.
  SITE_URL env overrides the default https://zetronix.ru.
- Per-page SEO via `src/hooks/useSeo.ts` (description/OG/canonical/JSON-LD,
  restores defaults on unmount). Used by every page component.
- Direction pages (`/napravlenie/<slug>`) carry `related:` in
  content.ts → templates + cases rendered on the page.
