# РАУНД 5 — НОВЫЙ ОБЪЁМ РАБОТ + ЖЁСТКИЙ РЕВЬЮ СПЕКИ

Ты — тот же арт-директор. Прошлая страница принята (9/11 PASS). Владелец дал новый список требований. Твоя работа: дать точную реализационную спеку и СРАЗУ жёстко резать всё, что сломает визуал или утонет в перегрузе. Как обычно — не соглашайся, доказывай кодом.

## НОВЫЕ ТРЕБОВАНИЯ ВЛАДЕЛЬЦА (дословно-пересказанные)

1. **Компетенции**: добавить кнопку «Дипломы» — за ней область со слотами под дипломы (реальных пока нет, будут выгружаться позже).
2. **HoloNav (второй экран)**:
   a. Сделать «прям голограммой» — спецэффекты, иногда рябь, сканлайны. Качественно, не дёшево.
   b. **Секвенция**: сначала появляется ЛУЧ проектора, ПОТОМ блок навигации материализуется. Сейчас наоборот — нереалистично.
   c. Сам луч — качественнее (геометрия, размер, точка выхода из груди НЕ трогаются — только визуальная подача).
3. **Портфолио**: блоки 2×2 громоздки — работ будет МНОГО. Уменьшить карточки. Обложки позже сгенерирует ИИ по промпту + макет сайта, формат ~9:16 (портрет) — либо несколько блоков чисто для обложки.
4. **Готовые макеты → полноценная ВИТРИНА**: карточки-блоки, фильтры, поиск, анимации, категории («интернет-магазины», «суши» и т.д.). **Админ-панель**, где владелец сам добавляет категории и подкатегории. UX-ограничение: обычный посетитель не должен заблудиться — пришёл за макетом → сразу нашёл.
5. **О нас** — «прикольно, но дожать чуть-чуть».
6. **Контакты** — «выглядит как скелет, недоделанный».
7. **hero-copy** — «обыграть, чего-то не хватает» (разрешены тексты/кнопки/шрифты/расположение внутри hero-copy).
8. **Бегающие линии сетки мешают читаемости текста** — решить НЕ трогая сетку (scrim/маска — ок).
9. **Шрифты** — «можно подобрать получше» — предложи ревизию пары. Ограничение: кириллица обязательна, Google Fonts, не позже текущего (Manrope + Inter + JetBrains Mono + Space Grotesk для латиницы).

## НЕПРИКОСНОВЕННО

- Робот (GLB, анимации, rig), кинетическая сетка, cinematic scroll-переход (вся машинерия scroll/auto-scroll в HeroScene.tsx).
- Геометрия и происхождение луча: эмиттер на груди, endpoint = ближайшая точка панели, ширина веера.
- Концепция «робот проецирует навигацию».

## ТЕХНИЧЕСКИЙ КОНТЕКСТ

- Статический Vite+React+TS, Tailwind v4, никакого бэкенда. Админка = клиентская. Данные макетов сейчас — константа TEMPLATES в content.ts. Предложи честную архитектуру админки: localStorage + экспорт JSON? Своя страница #/admin? Важно: данные, добавленные владельцем в его браузере, посетителям сайта не видны — учитывай это в дизайне потока (export → commit, либо честная пометка «черновик»).
- Код ниже: holo/beam/hero механика, секции, контент, маршрутизация.

## ОТ ТЕБЯ НУЖНО

По каждому из 9 пунктов: **реализационная спека с готовым кодом** (CSS-блоки целиком, JSX-структуры, точные значения, не «добавь эффектов»). Особо:

- **Секвенция beam→nav**: точный механизм (пороги clipP, либо привязка панели к beam.intensity, длительности, как реализовать materialize-фликер без JS-рендеров — CSS vars уже пишутся каждый кадр на stage, можно добавить ещё одну).
- **Голограмма**: конкретный набор слоёв (edge, сканлайны, рябь, хроматизм, idle-эффекты) + точные CSS keyframes. Частота и интенсивность ряби — чтобы «иногда», а не рейв.
- **Луч**: какие визуальные слои добавить (энергетические пакеты вдоль луча? микро-фликер opacity? свечение в точке попадания?) — в рамках того же SVG/JS-цикла.
- **Витрина + админка**: структура данных (категория/подкатегория/карточка), разметка фильтров (как сделать, чтобы клиент не заблудился: chips + поиск? сколько уровней?), карточка (пропорции под 9:16?), админ-панель (отдельный hash-роут? состав полей? экспорт?).
- **Компетенции-дипломы**: механика раскрытия + слоты.
- **Контакты**: чем достроить «скелет» — форма-бриф (mailto-compose), телеграм, блок «что будет дальше», реквизиты? Дай макет.
- **О нас**: что именно дожать.
- **hero-copy**: что добавить (помни: ≤4 текстовых элемента, CTA без скролла — свои же правила).
- **Шрифты**: конкретная пара Google Fonts с кириллицей + что на что меняется.
- **Читаемость под сеткой**: точный scrim.

Также прогоняй все свои предложения через скилы (eyebrow restraint, repetition ban, shape lock, density, touch 44px, reduced-motion — голограмма ОБЯЗАНА иметь статичный reduced-motion вариант).



## FILE: src/app/App.tsx
```
import { useEffect, useState } from "react";
import Boot from "../components/Boot";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroScene from "../components/hero/HeroScene";
import Services from "../components/sections/Services";
import Directions from "../components/sections/Directions";
import Portfolio from "../components/sections/Portfolio";
import Templates from "../components/sections/Templates";
import About from "../components/sections/About";
import Team from "../components/sections/Team";
import Competencies from "../components/sections/Competencies";
import Process from "../components/sections/Process";
import Faq from "../components/sections/Faq";
import Contacts from "../components/sections/Contacts";
import DirectionPage from "../components/pages/DirectionPage";

// tiny hash router: #/napravlenie/<slug> → direction landing page,
// anything else → the main one-pager
function routeOf(): { dir: string | null; anchor: string | null } {
  const h = window.location.hash;
  const m = h.match(/^#\/napravlenie\/([\w-]+)/);
  if (m) return { dir: m[1], anchor: null };
  return { dir: null, anchor: h.length > 1 && !h.startsWith("#/") ? h : null };
}

export default function App() {
  const [route, setRoute] = useState(routeOf);

  useEffect(() => {
    const onHash = () => setRoute(routeOf());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (route.dir) {
      window.scrollTo(0, 0);
    } else if (route.anchor) {
      // coming back from a subpage to a section anchor
      const anchor = route.anchor;
      requestAnimationFrame(() => {
        document.querySelector(anchor)?.scrollIntoView();
      });
    }
  }, [route]);

  return (
    <>
      <Boot />
      <Header />
      {route.dir ? (
        <DirectionPage slug={route.dir} />
      ) : (
        <main>
          <HeroScene />
          <Services />
          <Directions />
          <Portfolio />
          <Templates />
          <About />
          <Team />
          <Competencies />
          <Process />
          <Faq />
          <Contacts />
        </main>
      )}
      <Footer />
    </>
  );
}

```

## FILE: src/components/hero/HeroScene.tsx
```
import { useEffect, useRef } from "react";
import HeroCopy from "./HeroCopy";
import RobotVisual from "./RobotVisual";
import KineticGridCanvas from "./KineticGridCanvas";
import HoloNav from "./HoloNav";
import ProjectorBeam from "./ProjectorBeam";
import type { BeamAnchorState, PointerState } from "./heroTypes";
import { toClipProgress } from "./heroProgress";

/** progress at which the holographic nav turns on (projector fires ~0.68–0.92) */
const NAV_ON = 0.7;
const COPY_OUT = 0.14;

/**
 * Hero: one cinematic scroll transition, then the normal page.
 *
 * The outer section is ~280vh tall; the inner stage is sticky.
 * Progress p = 0..1 is derived from the section's real rect — no
 * wheel hijacking, works forward/backward and survives mid-scene reload.
 * Decorative layers (grid, robot canvas, copy, nav) all read the same
 * refs each frame — no React state churn on scroll.
 */
export default function HeroScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, active: false });
  const beamRef = useRef<BeamAnchorState>({ x: 0, y: 0, intensity: 0, valid: false });

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const nav = navRef.current;
    if (!section || !stage) return;
    const copy = stage.querySelector<HTMLElement>(".hero-copy");

    // dev/screenshot hook: ?scrub=0.55 freezes progress at 0.55
    const scrubParam = new URLSearchParams(window.location.search).get("scrub");
    const scrub = scrubParam === null ? null : Number.parseFloat(scrubParam);

    let raf = 0;
    const update = () => {
      raf = 0;
      let p: number;
      if (scrub !== null && Number.isFinite(scrub)) {
        p = Math.min(1, Math.max(0, scrub));
      } else {
        const r = section.getBoundingClientRect();
        const travel = Math.max(1, r.height - window.innerHeight);
        p = Math.min(1, Math.max(0, -r.top / travel));
      }
      progressRef.current = p;
      stage.style.setProperty("--hero-p", p.toFixed(4));
      // nav timing keys off the CLIP progress — the first RETURN_PORTION
      // of scroll is the robot's return flight, not the clip
      const clipP = toClipProgress(p);
      stage.classList.toggle("is-nav", clipP >= NAV_ON);
      stage.classList.toggle("is-copy-out", p > COPY_OUT);
      if (nav) (nav as HTMLElement & { inert: boolean }).inert = clipP < NAV_ON;
      if (copy) copy.inert = p > COPY_OUT;
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    /* ---- one-gesture cinematic -------------------------------------
       A single wheel / swipe inside the hero eases the real scroll to
       the next boundary, so the robot always completes its 360° +
       projector move instead of freezing mid-spin.

       Single owner of scrollY: while an auto transition runs, wheel and
       touch events are preventDefault'ed (non-passive listeners) so the
       browser's native scroll cannot fight our rAF writes. If scrollY
       still moves without us writing it (keyboard, scrollbar, anchor
       navigation), the transition yields immediately. Outside the
       transition — and once the stage no longer fills the viewport —
       scrolling is 100% native. */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stageStart = () => section.offsetTop;
    const stageEnd = () =>
      section.offsetTop + Math.max(1, section.offsetHeight - window.innerHeight);
    // near-boundary hysteresis: the last ~1.5% of travel is finished by
    // native scrolling — no 2.6 s animation for a 20 px tail
    const P_HI = 0.985;
    const P_LO = 0.015;
    let autoRaf = 0;
    let autoDir = 0;
    let lastSetY = -1;
    let lastInputAt = 0;
    let lastScrollY = window.scrollY;
    let lastScrollDir = 1;
    let idleTimer = 0;
    let suspendUntil = 0;
    const isAuto = () => autoRaf !== 0;

    const cancelAuto = () => {
      if (autoRaf) cancelAnimationFrame(autoRaf);
      autoRaf = 0;
      autoDir = 0;
      lastSetY = -1;
    };

    const autoScrollTo = (target: number, dur = 4600) => {
      cancelAuto();
      const from = window.scrollY;
      if (Math.abs(target - from) < 2 || reduced) {
        window.scrollTo(0, target);
        return;
      }
      // duration scales with the remaining runway, so the robot's
      // angular speed is the same whether the transition starts at
      // p=0 or halfway through — no speed-up on a partial trip
      const effDur =
        (dur * Math.abs(target - from)) /
        Math.max(1, stageEnd() - stageStart());
      autoDir = target > from ? 1 : -1;
      let t0 = performance.now();
      // smoothstep: motion starts immediately (no dead lead-in like
      // quintic ease) and the middle — where the robot turns — takes
      // the bulk of the duration, so the spin reads slower
      const ease = (k: number) => k * k * (3 - 2 * k);
      const easeInv = (e: number) => {
        let lo = 0, hi = 1;
        for (let i = 0; i < 16; i++) {
          const m = (lo + hi) / 2;
          if (ease(m) < e) lo = m; else hi = m;
        }
        return (lo + hi) / 2;
      };
      const step = (now: number) => {
        const y = window.scrollY;
        if (lastSetY >= 0 && Math.abs(y - lastSetY) > 8) {
          // scrollY changed without us writing it. A wheel/touch event we
          // just swallowed may still have applied natively — merge its
          // delta into the easing instead of snapping back (no fight).
          const prog = (y - from) / (target - from);
          if (
            now - lastInputAt < 150 &&
            (y - target) * autoDir < 0 &&
            prog > 0 &&
            prog < 1
          ) {
            t0 = now - easeInv(prog) * effDur;
          } else {
            // keyboard, scrollbar drag or anchor navigation — input wins
            cancelAuto();
            return;
          }
        }
        const k = Math.min(1, (now - t0) / effDur);
        lastSetY = from + (target - from) * ease(k);
        window.scrollTo({ top: lastSetY, behavior: "instant" });
        if (k < 1) {
          autoRaf = requestAnimationFrame(step);
        } else {
          cancelAuto();
        }
      };
      lastSetY = -1;
      step(performance.now());
    };

    const stageCoversViewport = () => {
      const r = section.getBoundingClientRect();
      return r.top <= 0 && r.bottom >= window.innerHeight;
    };

    const onWheel = (e: WheelEvent) => {
      if (scrub !== null || reduced) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      lastInputAt = performance.now();

      if (isAuto()) {
        // our rAF owns scrollY — native wheel scroll must not add to it
        if (stageCoversViewport() && e.cancelable) e.preventDefault();
        // clear opposite gesture → retarget the transition smoothly
        if (dir !== autoDir) {
          autoScrollTo(dir > 0 ? stageEnd() : stageStart(), 3800);
          return;
        }
        // same direction in the last stretch → release early so the
        // native scroll takes over seamlessly instead of waiting out
        // the slow ease tail (this is the "stuck at the boundary" fix).
        // Brief suspension prevents the release position (p ≈ 0.98) from
        // immediately re-triggering the transition on the next tick.
        if (Math.abs((autoDir > 0 ? stageEnd() : stageStart()) - window.scrollY) < 70) {
          cancelAuto();
          suspendUntil = performance.now() + 700;
        }
        return;
      }

      if (!stageCoversViewport() || performance.now() < suspendUntil) return;
      const p = progressRef.current;
      if ((dir > 0 && p < P_HI) || (dir < 0 && p > P_LO)) {
        if (e.cancelable) e.preventDefault();
        autoScrollTo(dir > 0 ? stageEnd() : stageStart());
      }
      // otherwise (at a boundary, heading out of the hero) the event
      // passes through untouched — normal page scrolling
    };

    let touchY = 0;
    let touchUsed = false;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
      touchUsed = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (scrub !== null || reduced) return;
      const y = e.touches[0]?.clientY ?? touchY;
      const dy = touchY - y;
      const dir = dy > 0 ? 1 : dy < 0 ? -1 : 0;
      lastInputAt = performance.now();

      if (isAuto()) {
        // keep native touch scroll out of the animation for this gesture
        if (stageCoversViewport() && e.cancelable) e.preventDefault();
        if (dir !== 0 && dir !== autoDir && !touchUsed && Math.abs(dy) > 12) {
          touchUsed = true;
          autoScrollTo(dir > 0 ? stageEnd() : stageStart(), 4000);
        } else if (
          dir === autoDir &&
          Math.abs((autoDir > 0 ? stageEnd() : stageStart()) - window.scrollY) < 70
        ) {
          cancelAuto();
          suspendUntil = performance.now() + 700;
        }
        return;
      }

      if (
        touchUsed ||
        Math.abs(dy) < 12 ||
        dir === 0 ||
        !stageCoversViewport() ||
        performance.now() < suspendUntil
      )
        return;
      const p = progressRef.current;
      if ((dir > 0 && p < P_HI) || (dir < 0 && p > P_LO)) {
        touchUsed = true;
        if (e.cancelable) e.preventDefault();
        autoScrollTo(dir > 0 ? stageEnd() : stageStart(), 4400);
      }
    };

    // if the user stops mid-transition (scrollbar drag, keyboard), ease
    // to the boundary in the direction they were last moving
    const onScrollSnap = () => {
      window.clearTimeout(idleTimer);
      const sy = window.scrollY;
      if (sy !== lastScrollY) lastScrollDir = sy > lastScrollY ? 1 : -1;
      lastScrollY = sy;
      idleTimer = window.setTimeout(() => {
        if (
          scrub !== null ||
          reduced ||
          isAuto() ||
          performance.now() < suspendUntil
        )
          return;
        const p = progressRef.current;
        if (p > 0.08 && p < 0.92) {
          autoScrollTo(lastScrollDir > 0 ? stageEnd() : stageStart(), 3600);
        }
      }, 240);
    };

    // in-page anchor navigation (holo links, header links) owns the
    // scroll while the browser smooth-scrolls to the target — release
    // any running transition and suspend snap/trigger so nothing fights
    const onDocClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]');
      if (!a) return;
      suspendUntil = performance.now() + 1600;
      window.clearTimeout(idleTimer);
      cancelAuto();
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      pointerRef.current.active = true;
    };
    const onPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) pointerRef.current.active = false;
    };

    update();
    const onScroll = () => {
      request();
      onScrollSnap();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", request);
    // wheel/touchmove must be cancelable — they own scrollY during transitions
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("click", onDocClick);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerOut);
    window.addEventListener("blur", () => (pointerRef.current.active = false));
    return () => {
      if (raf) cancelAnimationFrame(raf);
      cancelAuto();
      window.clearTimeout(idleTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", request);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("click", onDocClick);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerOut);
    };
  }, []);

  return (
    <section id="top" ref={sectionRef} className="hero-section" aria-label="ZETRONIX — веб-студия">
      <div ref={stageRef} className="hero-stage" style={{ "--hero-p": 0 } as React.CSSProperties}>
        <KineticGridCanvas pointerRef={pointerRef} />
        <HeroCopy />
        <RobotVisual progressRef={progressRef} pointerRef={pointerRef} beamRef={beamRef} />
        <ProjectorBeam beamRef={beamRef} navRef={navRef} />
        <HoloNav ref={navRef} />
        <div className="scroll-hint" aria-hidden="true">
          SCROLL<span className="scroll-hint-line" />
        </div>
      </div>
    </section>
  );
}

```

## FILE: src/components/hero/HoloNav.tsx
```
import { forwardRef } from "react";
import { NAV_LINKS } from "../../data/content";

/**
 * Holographic navigation projected by the robot at the end of the
 * scroll transition. Real HTML links — keyboard and touch accessible,
 * removed from the tab order via `inert` while hidden (toggled by
 * HeroScene against the same progress threshold as the CSS reveal).
 */
const HoloNav = forwardRef<HTMLElement>(function HoloNav(_, ref) {
  return (
    <nav ref={ref} className="holo-nav" aria-label="Навигация по разделам">
      <div className="holo-panel">
        <span className="holo-tag">{"// NAVIGATION"}</span>
        <ul className="holo-list">
          {NAV_LINKS.map((l, i) => (
            <li key={l.href}>
              <a className="holo-link" href={l.href}>
                <span className="holo-idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="holo-label">{l.label}</span>
                <i className="holo-arrow" aria-hidden="true">
                  →
                </i>
              </a>
            </li>
          ))}
        </ul>
        <a className="holo-cta" href="#contacts">
          Обсудить проект
        </a>
      </div>
    </nav>
  );
});

export default HoloNav;

```

## FILE: src/components/hero/ProjectorBeam.tsx
```
import { useEffect, useRef } from "react";
import type { BeamRef } from "./heroTypes";

interface Props {
  beamRef: BeamRef;
  /** wrapper element that contains .holo-panel */
  navRef: React.RefObject<HTMLElement | null>;
}

/**
 * Screen-space projector beam: a soft fan drawn in an SVG layer between
 * the chest emitter (projected by RobotModel into beamRef) and the
 * nearest border point of .holo-panel. Because both endpoints live in
 * CSS pixels, the beam stays glued to the real DOM panel on every
 * resolution, layout and resize — no world-space angle guessing.
 *
 * Performance: rects are cached on scroll/resize instead of forcing
 * layout reads every frame, and the loop idles once the stage leaves
 * the viewport.
 */
export default function ProjectorBeam({ beamRef, navRef }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const haloRef = useRef<SVGPathElement>(null);
  const bodyRef = useRef<SVGPathElement>(null);
  const coreRef = useRef<SVGPathElement>(null);
  const emitRef = useRef<SVGCircleElement>(null);
  const hitRef = useRef<SVGEllipseElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const halo = haloRef.current;
    const body = bodyRef.current;
    const core = coreRef.current;
    const emit = emitRef.current;
    const hit = hitRef.current;
    if (!svg || !halo || !body || !core || !emit || !hit) return;

    // rects change only on scroll (stage unpinning) and resize — reading
    // getBoundingClientRect every frame would force synchronous layout
    let sr = svg.getBoundingClientRect();
    let pr: DOMRect | null = null;
    const panel = () => navRef.current?.querySelector<HTMLElement>(".holo-panel");
    const refreshRects = () => {
      sr = svg.getBoundingClientRect();
      pr = panel()?.getBoundingClientRect() ?? null;
    };
    refreshRects();

    // no work once the stage leaves the viewport
    let onScreen = true;
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    if (svg.parentElement) io.observe(svg.parentElement);

    window.addEventListener("scroll", refreshRects, { passive: true });
    window.addEventListener("resize", refreshRects);

    let raf = 0;
    let hidden = true;
    const quad = (
      sx: number, sy: number, tx: number, ty: number,
      nx: number, ny: number, wS: number, wT: number,
    ) =>
      `M${(sx + nx * wS).toFixed(1)} ${(sy + ny * wS).toFixed(1)}` +
      `L${(tx + nx * wT).toFixed(1)} ${(ty + ny * wT).toFixed(1)}` +
      `L${(tx - nx * wT).toFixed(1)} ${(ty - ny * wT).toFixed(1)}` +
      `L${(sx - nx * wS).toFixed(1)} ${(sy - ny * wS).toFixed(1)}Z`;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!onScreen) return;
      const beam = beamRef.current;
      const power = beam.valid ? beam.intensity : 0;
      if (!pr || pr.width < 8 || power <= 0.02) {
        if (!hidden) {
          svg.style.opacity = "0";
          hidden = true;
        }
        return;
      }

      const sx = beam.x - sr.left;
      const sy = beam.y - sr.top;
      // nearest border point of the panel — right edge on desktop,
      // top edge for the bottom mobile sheet, all handled by clamping
      const tx = Math.min(Math.max(sx, pr.left - sr.left + 10), pr.right - sr.left - 10);
      const ty = Math.min(Math.max(sy, pr.top - sr.top + 14), pr.bottom - sr.top - 14);
      const dx = tx - sx;
      const dy = ty - sy;
      const len = Math.hypot(dx, dy);
      if (len < 12) {
        if (!hidden) {
          svg.style.opacity = "0";
          hidden = true;
        }
        return;
      }
      const ux = dx / len;
      const uy = dy / len;
      const nx = -uy;
      const ny = ux;
      const w0 = 3;
      const w1 = Math.min(Math.max(len * 0.17, 26), 78);

      // pull the core a touch short of the border so it kisses the edge
      // rather than overshooting into the panel's text
      const cx2 = tx - ux * 4;
      const cy2 = ty - uy * 4;

      halo.setAttribute("d", quad(sx, sy, tx, ty, nx, ny, w0 * 2.4, w1 * 1.9));
      body.setAttribute("d", quad(sx, sy, tx, ty, nx, ny, w0, w1));
      core.setAttribute("d", quad(sx, sy, cx2, cy2, nx, ny, 1.6, w1 * 0.22));
      emit.setAttribute("cx", sx.toFixed(1));
      emit.setAttribute("cy", sy.toFixed(1));
      emit.setAttribute("r", "13");
      hit.setAttribute("cx", tx.toFixed(1));
      hit.setAttribute("cy", ty.toFixed(1));
      hit.setAttribute("rx", (w1 * 1.05).toFixed(1));
      hit.setAttribute("ry", Math.min(30, w1 * 0.7).toFixed(1));
      svg.style.opacity = power.toFixed(3);
      hidden = false;
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", refreshRects);
      window.removeEventListener("resize", refreshRects);
      svg.style.opacity = "0";
    };
  }, [beamRef, navRef]);

  return (
    <div className="projector-beam" aria-hidden="true">
      <svg ref={svgRef}>
        <defs>
          <filter id="pb-b14" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="pb-b7" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="pb-b3" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        {/* wide atmospheric halo → soft cone body → bright thin core */}
        <path ref={haloRef} fill="#3fd7e6" opacity="0.10" filter="url(#pb-b14)" />
        <path ref={bodyRef} fill="#59e7f4" opacity="0.20" filter="url(#pb-b7)" />
        <ellipse ref={hitRef} fill="#7ff1fb" opacity="0.16" filter="url(#pb-b7)" />
        <path ref={coreRef} fill="#c9fbff" opacity="0.55" filter="url(#pb-b3)" />
        <circle ref={emitRef} fill="#b7f8ff" opacity="0.6" filter="url(#pb-b7)" />
      </svg>
    </div>
  );
}

```

## FILE: src/components/hero/HeroCopy.tsx
```
const EXPERTISE = [
  { label: "Сайты", href: "#services" },
  { label: "Дизайн интерфейсов", href: "#services" },
  { label: "AI и боты", href: "#services" },
];

export default function HeroCopy() {
  return (
    <div className="hero-copy">
      <div className="hero-intro">
        <p className="hero-kicker">Веб-студия ZETRONIX</p>

        <h1 className="hero-title">Сайты и цифровые продукты для бизнеса</h1>

        <p className="hero-sub">
          Проектируем интерфейсы, разрабатываем сайты и подключаем AI-инструменты.
        </p>
      </div>

      <div className="hero-actions">
        <a className="hero-primary" href="#contacts">
          Обсудить проект
          <span aria-hidden="true">→</span>
        </a>

        <a className="hero-secondary" href="#portfolio">
          Смотреть примеры
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <nav className="hero-expertise" aria-label="Направления работы">
        <span className="hero-expertise__label">Направления</span>
        <ul>
          {EXPERTISE.map((e) => (
            <li key={e.label}>
              <a href={e.href}>{e.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

```

## FILE: src/components/hero/heroTypes.ts
```
/** Shared mutable state written by HeroScene listeners, read by canvases per frame. */
export interface PointerState {
  /** clientX / clientY in CSS pixels; consumers normalize against their own rect */
  x: number;
  y: number;
  /** false when the pointer is absent / left the window — effects ease back to neutral */
  active: boolean;
}

export type ProgressRef = { readonly current: number };
export type PointerRef = { readonly current: PointerState };

/** Chest-emitter anchor projected to viewport CSS px by the 3D scene. */
export interface BeamAnchorState {
  x: number;
  y: number;
  /** 0..1 — driven by the clip's CTRL_Projector scale channel */
  intensity: number;
  /** false until the GLB scene supplies a real anchor (fallback mode) */
  valid: boolean;
}
export type BeamRef = { readonly current: BeamAnchorState };

```

## FILE: src/components/sections/Portfolio.tsx
```
import { WORKS } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

export default function Portfolio() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="portfolio"
      ref={ref}
      className={`reveal zt-sec px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHead
          title="Портфолио"
          sub="Четыре формата, в которых мы сильнее всего. Полные версии с цифрами — на первом созвоне."
        />

        <ul className="case-grid">
          {WORKS.map((w) => (
            <li key={w.name} className="case-card">
              {/* cover is a reserved slot — owner drops real screenshots here later */}
              <div className="case-card__cover" aria-hidden="true">
                <span className="case-card__mark latn-display">{w.name}</span>
              </div>
              <div className="case-card__meta">
                <h3 className="case-card__title latn-display">{w.name}</h3>
                <p className="case-card__kind">{w.kind}</p>
                <p className="case-card__year">{w.year}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

```

## FILE: src/components/sections/Templates.tsx
```
import { CONTACT_EMAIL, TEMPLATES } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

export default function Templates() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="templates"
      ref={ref}
      className={`reveal zt-sec px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHead title="Готовые макеты" />

        <div className="tpl-banner">
          <div>
            <p className="zt-lead">
              Запуск за одну-две недели вместо долгого проектирования. Три
              формата появятся первыми — сообщим, когда откроется продажа.
            </p>
          </div>
          <ul className="flex flex-col">
            {TEMPLATES.map((t) => (
              <li key={t.id} className="tpl-row">
                <span className="tpl-name">{t.name}</span>
                <span className="tpl-kind">{t.kind}</span>
                <a
                  className="tpl-notify"
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Сообщите, когда появится: ${t.name}`)}`}
                >
                  Сообщить мне
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

```

## FILE: src/components/sections/Competencies.tsx
```
import { COMPETENCIES } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

export default function Competencies() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="competencies"
      ref={ref}
      className={`reveal zt-sec--dense px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHead
          title="Компетенции"
          sub="Стек и практики, которые мы применяем в каждом проекте."
        />

        <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
          {COMPETENCIES.map((c) => (
            <div key={c.title} className="border-t border-line pt-6">
              <h3 className="font-display text-[24px] font-medium text-[var(--z-ink)]">
                {c.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {c.items.map((t) => (
                  <li key={t} className="zt-chip">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

```

## FILE: src/components/sections/About.tsx
```
import { ABOUT } from "../../data/content";
import { useInView } from "../../hooks/useInView";

export default function About() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="about"
      ref={ref}
      className={`reveal zt-sec px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <p className="max-w-[30ch] font-display text-[clamp(28px,3vw,40px)] font-normal leading-[1.22] tracking-[-0.01em] text-[var(--z-ink)]">
          ZETRONIX — небольшая веб-студия. Проектируем и разрабатываем сайты,
          интерфейсы и AI-инструменты. Вы говорите{" "}
          <span className="font-medium text-[var(--z-action)]">
            напрямую с теми, кто проектирует и собирает
          </span>
          .
        </p>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-line pt-8 md:grid-cols-3">
          {ABOUT.points.map((p) => (
            <div key={p.title}>
              <h3 className="font-display text-[20px] font-medium text-[var(--z-ink)]">
                {p.title}
              </h3>
              <p className="mt-3 max-w-[36ch] text-[15px] leading-[1.55] text-[var(--z-muted)]">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

```

## FILE: src/components/sections/Contacts.tsx
```
import { CONTACT_EMAIL } from "../../data/content";
import { useInView } from "../../hooks/useInView";

export default function Contacts() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="contacts"
      ref={ref}
      className={`reveal px-[var(--page-gutter)] pb-[var(--z-sec-pad)] pt-[clamp(96px,11vw,144px)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto grid max-w-[var(--content-max)] grid-cols-1 items-end gap-12 md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="zt-kicker">Следующий шаг</p>
          <h2 className="mt-6 font-display text-[clamp(44px,5.6vw,72px)] font-medium leading-[1.02] tracking-[-0.02em] text-[var(--z-ink)]">
            Обсудим
            <br />
            ваш проект<span className="text-[var(--z-action)]">?</span>
          </h2>
          <p className="zt-lead mt-6 max-w-[44ch]">
            Расскажите о задаче, обсудим формат и следующие шаги. Отвечаем в тот же или
            следующий рабочий день.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Заявка с сайта zetronix.ru")}`}
            className="group mt-10 inline-flex items-center gap-4 text-[clamp(24px,2.6vw,36px)] font-medium text-[var(--z-ink)] underline decoration-[rgba(13,17,23,0.24)] decoration-1 underline-offset-[10px] transition-colors hover:decoration-[var(--z-action)]"
          >
            {CONTACT_EMAIL}
            <svg
              className="text-[var(--z-action)] transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1"
              width="22"
              height="22"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path d="M3 13L13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </a>
        </div>

        <dl className="zt-meta space-y-2 md:pb-3 md:text-right">
          <div>
            <dt className="inline">ответ — </dt>
            <dd className="inline text-[var(--z-ink)]">тот же или следующий рабочий день</dd>
          </div>
          <div>
            <dt className="inline">смета и сроки — </dt>
            <dd className="inline text-[var(--z-ink)]">фиксируются до старта</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

```

## FILE: index.html
```
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZETRONIX — сайты и цифровые решения для бизнеса</title>
  <meta name="description" content="Сайты, интерфейсы и AI-продукты: веб-разработка, дизайн интерфейсов и AI-интеграции от ZETRONIX.">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Manrope:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <noscript>
    <div style="max-width:560px;margin:80px auto;padding:0 24px;font-family:system-ui,sans-serif;color:#0d1117;text-align:center">
      <h1>ZETRONIX — цифровое агентство</h1>
      <p>Для просмотра сайта включите JavaScript в браузере.</p>
      <p>Связаться с нами: <a href="mailto:hello@zetronix.ru">hello@zetronix.ru</a></p>
    </div>
  </noscript>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>

```

## FILE: src/styles/global.css — hero/holo/beam slice (lines 44-333)
```
}

/* ---- editorial type system ---- */
:root {
  --z-ink: #151b20;
  --z-muted: #4e5b60;
  --z-action: #006b70;
}

/* ---- hero copy ---- */
.hero-copy {
  position: absolute;
  z-index: 6;
  inset: auto var(--page-gutter) clamp(62px, 10vh, 100px);
  max-width: none;
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 32px;
  /* the empty part of the strip doesn't eat pointer events */
  pointer-events: none;
  /* fade+lift driven by --hero-p; no JS re-render needed */
  opacity: calc(1 - min(1, var(--hero-p, 0) * 7));
  translate: 0 calc(var(--hero-p, 0) * -44px);
}
.hero-stage.is-copy-out .hero-copy {
  pointer-events: none;
}
.hero-intro {
  max-width: 380px;
}
.hero-kicker {
  margin: 0 0 14px;
  color: var(--z-action);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.hero-title {
  margin: 0;
  color: var(--z-ink);
  font-family: var(--font-display);
  font-size: clamp(26px, 2.5vw, 36px);
  font-weight: 500;
  line-height: 1.13;
  letter-spacing: -0.035em;
  text-wrap: balance;
}
.hero-sub {
  max-width: 34ch;
  margin-top: 12px;
  color: var(--z-muted);
  font-size: 15px;
  line-height: 1.5;
}
.hero-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  min-width: 212px;
  /* links stay clickable inside the non-interactive strip */
  pointer-events: auto;
}
.hero-primary,
.hero-secondary {
  min-height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 0 16px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  text-decoration: none;
  border-radius: 999px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}
.hero-primary {
  color: #fff;
  background: var(--z-ink);
  border: 1px solid var(--z-ink);
}
.hero-primary:hover {
  color: #fff;
  background: var(--z-action);
  border-color: var(--z-action);
}
.hero-secondary {
  color: var(--z-ink);
  border: 1px solid rgba(21, 27, 32, 0.32);
}
.hero-secondary:hover {
  color: var(--z-ink);
  border-color: var(--z-ink);
  background: rgba(255, 255, 255, 0.5);
}
.hero-primary:focus-visible,
.hero-secondary:focus-visible,
.site-header a:focus-visible {
  outline: 3px solid var(--z-action);
  outline-offset: 3px;
}

/* ---- robot: canvas + static fallback ---- */
.robot-visual {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}
.robot-canvas,
.robot-canvas canvas {
  position: absolute;
  inset: 0;
}
.robot-canvas {
  pointer-events: none; /* gaze comes from the shared stage listener */
}
.robot-fallback {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(52vw, 340px);
  transform: translate(-38%, -50%);
  height: auto;
  user-select: none;
  transition: opacity 0.6s ease;
}
.robot-visual.is-live .robot-fallback {
  opacity: 0;
}
@media (min-width: 1200px) {
  .robot-fallback {
    transform: translate(-8%, -50%); /* approx. the GLB hero slot */
  }
}
@media (max-width: 767px) {
  .robot-fallback {
    transform: translate(-50%, -44%);
    width: min(66vw, 300px);
  }
}

/* ---- screen-space projector beam (SVG fan chest→nav) ---- */
.projector-beam {
  position: absolute;
  inset: 0;
  z-index: 6; /* above the robot canvas, below .holo-nav (z7) */
  pointer-events: none;
}
.projector-beam svg {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.12s linear;
}

/* ---- holographic navigation (end state of the transition) ---- */
.holo-nav {
  position: absolute;
  z-index: 7;
  left: 30%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  visibility: hidden;
  translate: -18px 0;
  scale: 0.96;
  transition:
    opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    translate 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    scale 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    visibility 0.7s;
}
.hero-stage.is-nav .holo-nav {
  opacity: 1;
  visibility: visible;
  translate: 0 0;
  scale: 1;
}
.holo-panel {
  position: relative;
  min-width: min(380px, 62vw);
  padding: 30px 34px;
  border: 1px solid rgba(0, 201, 212, 0.35);
  border-radius: 16px;
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.75), rgba(230, 252, 253, 0.55));
  backdrop-filter: blur(14px) saturate(1.2);
  -webkit-backdrop-filter: blur(14px) saturate(1.2);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.6) inset,
    0 18px 44px rgba(0, 140, 150, 0.14),
    0 0 34px rgba(0, 201, 212, 0.12);
}
.holo-panel::before {
  /* scanline sweep — decorative only */
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: repeating-linear-gradient(
    180deg,
    rgba(0, 201, 212, 0.045) 0 1px,
    transparent 1px 5px
  );
  pointer-events: none;
}
.holo-tag {
  display: block;
  margin-bottom: 16px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--color-accent-deep);
}
.holo-list {
  display: grid;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.holo-link {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 12px 12px;
  border-radius: 10px;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--color-ink);
  transition: background 0.25s, color 0.25s, translate 0.25s;
}
.holo-link:hover {
  background: rgba(0, 201, 212, 0.12);
  translate: 4px 0;
}
.holo-idx {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--color-ink-faint);
}
.holo-arrow {
  margin-left: auto;
  font-style: normal;
  color: var(--color-accent-deep);
  opacity: 0;
  transition: opacity 0.25s, translate 0.25s;
}
.holo-link:hover .holo-arrow {
  opacity: 1;
  translate: 3px 0;
}
.holo-cta {
  display: inline-block;
  margin-top: 20px;
  padding: 13px 22px;
  border-radius: 999px;
  border: 1px solid rgba(0, 154, 160, 0.5);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--color-accent-deep);
  transition: background 0.25s, color 0.25s, box-shadow 0.3s;
}
.holo-cta:hover {
  background: var(--color-accent-deep);
  color: #fff;
  box-shadow: 0 0 24px rgba(0, 201, 212, 0.4);
}

@media (max-width: 767px) {
  .hero-section {
    height: 230vh;
  }
  .hero-copy {
    inset: 112px var(--page-gutter) auto;

```

## FILE: src/styles/tokens.css
```
/* Design tokens — light "blueprint" palette of the current site.
   Values are initial, not a final approved brandbook. */
@theme {
  --color-bg: #f4f4f4;
  --color-ink: #0d1117;
  --color-ink-muted: rgba(13, 17, 23, 0.65);
  --color-ink-faint: rgba(13, 17, 23, 0.28);
  --color-line: rgba(13, 17, 23, 0.12);
  --color-accent: #00c9d4;
  --color-accent-deep: #009aa0;
  --color-glow: #00ffff; /* decorative glow only — not for body text */

  --font-display: "Manrope", sans-serif;
  --font-display-latn: "Space Grotesk", "Manrope", sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Consolas", monospace;
}

:root {
  --content-max: 1440px;
  --page-gutter: clamp(20px, 4vw, 64px);
  --r-pill: 999px; /* interactive: buttons, links, chips, arrows */
  --r-card: 12px; /* containers: banners, covers */

  /* runtime vars driven by JS */
  --gx: -500px;
  --gy: -500px;
}

```
