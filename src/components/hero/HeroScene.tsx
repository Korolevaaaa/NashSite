import { useEffect, useRef } from "react";
import HeroCopy from "./HeroCopy";
import RobotVisual from "./RobotVisual";
import KineticGridCanvas from "./KineticGridCanvas";
import HoloNav from "./HoloNav";
import ProjectorBeam from "./ProjectorBeam";
import type { BeamAnchorState, PointerState } from "./heroTypes";

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
      stage.classList.toggle("is-nav", p >= NAV_ON);
      stage.classList.toggle("is-copy-out", p > COPY_OUT);
      if (nav) (nav as HTMLElement & { inert: boolean }).inert = p < NAV_ON;
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    /* ---- one-gesture cinematic -------------------------------------
       A single wheel / swipe inside the hero eases the real scroll to
       the next boundary (~1.7 s), so the robot always completes its
       360° + projector move instead of freezing mid-spin. The clip is
       scrubbed by the actual scroll position, so it stays in sync and
       any user gesture cancels the auto-play instantly (no hijack). */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stageStart = () => section.offsetTop;
    const stageEnd = () =>
      section.offsetTop + Math.max(1, section.offsetHeight - window.innerHeight);
    let autoRaf = 0;
    let autoDir = 0;
    let lastDir = 1;
    let idleTimer = 0;
    const isAuto = () => autoRaf !== 0;

    const cancelAuto = () => {
      if (autoRaf) cancelAnimationFrame(autoRaf);
      autoRaf = 0;
      autoDir = 0;
    };

    const autoScrollTo = (target: number, dur = 2600) => {
      cancelAuto();
      const from = window.scrollY;
      if (Math.abs(target - from) < 2 || reduced) {
        window.scrollTo(0, target);
        return;
      }
      autoDir = target > from ? 1 : -1;
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / dur);
        // smooth quintic ease-in-out — gentle launch, silky landing
        const e =
          k < 0.5
            ? 16 * k * k * k * k * k
            : 1 - Math.pow(-2 * k + 2, 5) / 2;
        window.scrollTo({ top: from + (target - from) * e, behavior: "instant" });
        if (k < 1) {
          autoRaf = requestAnimationFrame(step);
        } else {
          autoRaf = 0;
          autoDir = 0;
        }
      };
      autoRaf = requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      if (scrub !== null || reduced) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      lastDir = dir;
      if (isAuto()) {
        // same-direction ticks are trackpad/mouse inertia — let the
        // smooth transition finish; opposite direction cancels & reverses
        if (dir === autoDir) return;
        autoScrollTo(dir > 0 ? stageEnd() : stageStart(), 2200);
        return;
      }
      const p = progressRef.current;
      const r = section.getBoundingClientRect();
      // only capture gestures while the sticky stage actually fills the
      // viewport — below the hero the page must scroll normally
      const inStage = r.top <= 0 && r.bottom >= window.innerHeight;
      if (!inStage) return;
      if (dir > 0 && p < 1) autoScrollTo(stageEnd());
      else if (dir < 0 && p > 0) autoScrollTo(stageStart());
    };

    let touchY = 0;
    let touchUsed = false;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
      touchUsed = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (scrub !== null || reduced || touchUsed) return;
      const y = e.touches[0]?.clientY ?? touchY;
      const dy = touchY - y;
      if (Math.abs(dy) < 12) return;
      touchUsed = true;
      lastDir = dy > 0 ? 1 : -1;
      if (isAuto()) {
        cancelAuto();
        return;
      }
      const p = progressRef.current;
      const r = section.getBoundingClientRect();
      if (!(r.top <= 0 && r.bottom >= window.innerHeight)) return;
      if (dy > 0 && p < 1) autoScrollTo(stageEnd(), 2600);
      else if (dy < 0 && p > 0) autoScrollTo(stageStart(), 2600);
    };

    // if the user stops mid-transition (scrollbar drag, keyboard), ease
    // to the boundary in the direction they were last moving
    const onScrollSnap = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        if (scrub !== null || reduced || isAuto()) return;
        const p = progressRef.current;
        if (p > 0.1 && p < 0.9) {
          autoScrollTo(lastDir > 0 ? stageEnd() : stageStart(), 1900);
        }
      }, 220);
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
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
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
