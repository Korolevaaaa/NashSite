import { useEffect, useRef } from "react";
import HeroCopy from "./HeroCopy";
import RobotVisual from "./RobotVisual";
import KineticGridCanvas from "./KineticGridCanvas";
import HoloNav from "./HoloNav";
import ProjectorBeam from "./ProjectorBeam";
import type { BeamAnchorState, PointerState } from "./heroTypes";
import { toClipProgress } from "./heroProgress";

/** progress at which the holographic nav turns on (projector fires ~0.68–0.92;
    the beam must visibly reach the panel BEFORE it materializes — 0.8 leaves
    ~0.12 of clip progress where the beam shines alone) */
const NAV_ON = 0.8;
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
