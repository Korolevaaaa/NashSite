import { useEffect, useRef } from "react";
import HeroCopy from "./HeroCopy";
import RobotVisual from "./RobotVisual";

/**
 * Hero stage: blueprint grid + cursor glow + grid-snapped coordinate sparks.
 * Static composition for now — the exploded-view disassembly was dropped
 * on purpose; a new cinematic transition is planned for a later stage.
 */
export default function HeroScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLDivElement>(null);
  const sparksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const glow = glowRef.current;
    const coords = coordsRef.current;
    const sparks = sparksRef.current;
    if (!stage || !glow || !coords || !sparks) return;

    let lastSpark = { x: -999, y: -999, t: 0 };

    const maybeSpark = (x: number, y: number) => {
      const now = performance.now();
      const dx = x - lastSpark.x;
      const dy = y - lastSpark.y;
      if (dx * dx + dy * dy < 3600 || now - lastSpark.t < 110) return;
      lastSpark = { x, y, t: now };
      const r = stage.getBoundingClientRect();
      const gx = Math.round((x - r.left) / 12) * 12;
      const gy = Math.round((y - r.top) / 12) * 12;
      const s = document.createElement("div");
      s.className = "spark";
      s.style.left = `${gx}px`;
      s.style.top = `${gy}px`;
      s.textContent = `${String(gx).padStart(3, "0")}:${String(gy).padStart(3, "0")}`;
      sparks.appendChild(s);
      window.setTimeout(() => s.remove(), 1150);
    };

    const onMove = (e: PointerEvent) => {
      glow.style.setProperty("--gx", `${e.clientX}px`);
      glow.style.setProperty("--gy", `${e.clientY}px`);
      coords.textContent =
        `X:${String(e.clientX).padStart(4, "0")}\u00a0\u00a0Y:${String(e.clientY).padStart(4, "0")}`;
      maybeSpark(e.clientX, e.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section id="top" aria-label="Zetronix — цифровое агентство">
      <div
        ref={stageRef}
        className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden px-[var(--page-gutter)] pb-24 pt-28 lg:grid lg:place-items-center lg:gap-0 lg:pb-0 lg:pt-0"
      >
        <div className="stage-grid" aria-hidden="true" />
        <div ref={glowRef} className="stage-glow" aria-hidden="true" />

        <div className="hud left-[var(--page-gutter)] top-24 hidden md:grid" aria-hidden="true">
          <span className="hud-tag">UNIT&nbsp;ZTRX-07</span>
          <span>
            STATUS: <b className="font-medium text-accent-deep">ONLINE</b>
          </span>
        </div>
        <div
          ref={coordsRef}
          className="hud bottom-[70px] right-[var(--page-gutter)] hidden md:grid"
          aria-hidden="true"
        >
          X:0000&nbsp;&nbsp;Y:0000
        </div>

        {/* flex order on mobile: headline, robot, CTA — on lg both cards go absolute */}
        <HeroCopy />
        <div className="order-2 lg:order-none">
          <RobotVisual />
        </div>

        <div className="scroll-hint absolute bottom-[30px] left-1/2 -translate-x-1/2" aria-hidden="true">
          SCROLL<span className="scroll-hint-line" />
        </div>

        <div ref={sparksRef} className="sparks" aria-hidden="true" />
      </div>
    </section>
  );
}
