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

## 3D Silk Wave Shader System (`src/components/ui/WaveShader.tsx`)

The decorative wave across the site is a **3D Twisted Silk Ribbon + 40 Subpixel Caustic Micro-Strands** rendered on a lightweight WebGL `<canvas>` (no Three.js) with premultiplied alpha, lazy `IntersectionObserver` activation, `prefers-reduced-motion` static frame, and SVG fallback (`/img/silk-about.svg`, `/img/silk-process.svg`).

### 1. Core GLSL function (`evalSilkRibbon`)
All wave variants MUST call the shared GLSL core `evalSilkRibbon(sCoord, nCoord, ampScale, dSpineBase, env, seedOff, t)` in `src/components/ui/WaveShader.tsx` so every ribbon across the site shares the exact same visual material:
- **3D twist projection**: `c1 = cos(twist)`, `s1 = sin(twist)` where `c1 = 0` flips the top/bottom envelope edges (creating 3D Möbius-like crossovers).
- **Two translucent veil layers**: cylindrical Fresnel rim density `1.0 / sqrt(1.0 - u*u*0.88)` + knot pinch density `1.0 / sqrt(cc*cc + 0.09)` + smooth fold orientation `(cc*ss)/sqrt(cc*cc*ss*ss + 0.06)` (never use raw `sign()`, which creates hard vertical seams).
- **40 caustic micro-filaments (`N = 40`)**: cosine-warped across the ribbon width (`sWarp = sign(s) * pow(abs(s), 0.74)`), positioned along the twisted 3D surface `nStrand = sWarp * c1 * R1 + s*s*0.018*s1*ampScale + micro`, with slope-corrected pixel distance `abs(nCoord - nStrand) * u_res.y / sqrt(1.0 + dy*dy)`.

### 2. Available `variant` modes
- `variant="flow"` (default, `u_variant = 0`): single wide calligraphic S-ribbon flowing left-to-right across a section header or open field.
- `variant="loop"` (`u_variant = 2`, used in `#cases`): hairpin ribbon that enters from the left (`spineTop ≈ 0.81`), reaches the right edge (`xTurn ≈ 0.87`), wraps around a smooth right-hand arc (`pArc`), and flows back right-to-left (`xRev = 1.0 - x`) along mid-height (`spineBot ≈ 0.47`) between the 1st and 2nd card rows before exiting left.

### 3. How to ADD a wave to a section
1. Make sure the section container has `position: relative` (e.g., `className="relative mx-auto max-w-[var(--content-max)]"`).
2. Insert the slot with `aria-hidden="true"`:
```tsx
import WaveShader from "../ui/WaveShader";

<div className="wave-slot wave-slot--my-section" aria-hidden="true">
  <WaveShader opacity={0.85} seed={3.1} variant="flow" />
</div>
```
3. Add positioning and soft edge masks in `src/styles/global.css` so the canvas border is never visible and headline text stays unobstructed:
```css
.wave-slot--my-section {
  left: 34%;
  right: -8vw;
  top: -48px;
  height: 260px;
  -webkit-mask-image:
    linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.28) 18%, #000 38%, #000 92%, transparent 100%),
    linear-gradient(180deg, transparent 0%, #000 16%, #000 82%, transparent 100%);
  mask-image:
    linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.28) 18%, #000 38%, #000 92%, transparent 100%),
    linear-gradient(180deg, transparent 0%, #000 16%, #000 82%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
}
```
4. If the wave passes behind interactive cards/chips, keep foreground elements on `position: relative; z-index: 1` with a semi-opaque surface (`background: rgba(250, 251, 252, 0.94); backdrop-filter: blur(4px)`).
5. Hide or simplify the slot on mobile (`@media (max-width: 767px)`) in `src/styles/global.css` so mobile screens stay clean and GPU-light.

### 4. How to REMOVE a wave from a section
1. Remove the `<div className="wave-slot wave-slot--...">` block and unused `WaveShader` import from the section `.tsx` file.
2. Optionally remove the corresponding `.wave-slot--...` rule in `src/styles/global.css`.

### 5. How to CREATE a new trajectory (`variant`)
1. Add the variant name to `export type WaveVariant = "flow" | "arc" | "loop" | "yourVariant"` in `src/components/ui/WaveShader.tsx` and map it to a number in `variantNum`.
2. Inside `main()` in `FRAG`, define your spine trajectory `spine(x)` (or parametric curve `(sCoord, nCoord)`) and pass it to `evalSilkRibbon(sCoord, nCoord, ampScale, dSpine, env, seedOff, t)`:
```glsl
float spine = 0.52 + 0.12 * sin(x * 4.0 - t * 0.22 + ph);
float dSpine = 0.12 * 4.0 * cos(x * 4.0 - t * 0.22 + ph);
float env = smoothstep(0.0, 0.15, x) * (1.0 - smoothstep(0.85, 1.0, x));
vec4 rib = evalSilkRibbon(x, y - spine, 0.85, dSpine, env, 0.0, t);
accumCol += rib.rgb * (1.0 - accumA);
accumA   += rib.a   * (1.0 - accumA);
```
3. Never use `WEBGL_lose_context` in React cleanup (breaks under StrictMode remounts), and always output premultiplied alpha (`gl_FragColor = vec4(accumCol * k, accumA * k)`).

