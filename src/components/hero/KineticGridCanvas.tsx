import { useEffect, useRef } from "react";
import type { PointerRef, ProgressRef } from "./heroTypes";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const CELL = 56; // CSS px grid pitch
const RADIUS = 220; // cursor influence radius, CSS px
const MAX_DISP = 10; // max node displacement, CSS px
const EASE = 0.14; // per-frame spring toward target displacement
const ACCENT = "0, 154, 160";
const INK = "13, 17, 23";

interface Props {
  pointerRef: PointerRef;
  /** raw hero scroll progress — used to fade the sparks out as the
   *  first screen leaves (no sparks in the hologram state) */
  progressRef?: ProgressRef;
}

const PULSE_FADE_END = 0.125; // raw progress where the pulses are gone
// energy field ported from the cybernetic-grid shader:
//   e = sin(u·F + t·W1) · sin(v·F + t·W2),  lit where e > 0.8
// evaluated per grid node, so the glowing patches travel along our
// lines the same way the shader's pulses slide along its lines
const P_F = 2.1;  // spatial frequency, rad per cell (shader: 20 / ~10 cells)
const P_W1 = 1.2; // along-x travel speed, rad/s (shader: 5·0.2)
const P_W2 = 0.7; // along-y travel speed, rad/s (shader: 3·0.2)

/**
 * Light kinetic grid for the Hero stage: thin ink lines on the blueprint
 * background that gently bow away from the cursor with a cyan highlight.
 * Canvas 2D, pointer-events: none — never blocks HTML links/buttons.
 */
export default function KineticGridCanvas({ pointerRef, progressRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const host = canvas.parentElement;
    if (!host) return;

    let raf = 0;
    let running = false;
    let visible = true;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    // smoothed per-node displacement (index = row * cols + col)
    let disp = new Float32Array(0);
    let base: HTMLCanvasElement | null = null;
    // per-axis wave terms for the pulse field (recomputed per frame)
    let sx: number[] = []; // sin(col·F + t·W1)
    let sy: number[] = []; // sin(row·F + t·W2)

    const drawBase = () => {
      if (!base) base = document.createElement("canvas");
      base.width = Math.max(1, Math.round(w * dpr));
      base.height = Math.max(1, Math.round(h * dpr));
      const bctx = base.getContext("2d")!;
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.clearRect(0, 0, w, h);
      bctx.strokeStyle = `rgba(${INK}, 0.055)`;
      bctx.lineWidth = 1;
      bctx.beginPath();
      for (let x = 0.5; x <= w; x += CELL) {
        bctx.moveTo(x, 0);
        bctx.lineTo(x, h);
      }
      for (let y = 0.5; y <= h; y += CELL) {
        bctx.moveTo(0, y);
        bctx.lineTo(w, y);
      }
      bctx.stroke();
    };

    const resize = () => {
      const r = host.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      cols = Math.floor(w / CELL) + 2;
      rows = Math.floor(h / CELL) + 2;
      disp = new Float32Array(cols * rows * 2);
      sx = new Array(cols).fill(0);
      sy = new Array(rows).fill(0);
      drawBase();
      if (!running) {
        // static single paint (reduced motion / paused)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        if (base) ctx.drawImage(base, 0, 0, w, h);
      }
    };

    const frame = () => {
      raf = running ? requestAnimationFrame(frame) : 0;
      const now = performance.now();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (base) ctx.drawImage(base, 0, 0, w, h);

      const rect = canvas.getBoundingClientRect();
      const p = pointerRef.current;
      const mx = p.x - rect.left;
      const my = p.y - rect.top;
      const hasMouse = p.active && mx > -RADIUS && my > -RADIUS && mx < w + RADIUS && my < h + RADIUS;

      // update smoothed node displacements
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = (r * cols + c) * 2;
          let tx = 0;
          let ty = 0;
          if (hasMouse) {
            const nx = c * CELL;
            const ny = r * CELL;
            const dx = nx - mx;
            const dy = ny - my;
            const d = Math.hypot(dx, dy);
            if (d < RADIUS && d > 0.001) {
              const f = 1 - d / RADIUS;
              const k = f * f * MAX_DISP;
              tx = (dx / d) * k;
              ty = (dy / d) * k;
            }
          }
          disp[i] += (tx - disp[i]) * EASE;
          disp[i + 1] += (ty - disp[i + 1]) * EASE;
        }
      }

      // accent overlay: deformed grid segments near the cursor
      if (hasMouse) {
        ctx.lineWidth = 1;
        const seg = (x1: number, y1: number, x2: number, y2: number, a: number) => {
          if (a < 0.02) return;
          ctx.strokeStyle = `rgba(${ACCENT}, ${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        };
        const alphaAt = (i: number) => {
          const mag = Math.hypot(disp[i], disp[i + 1]) / MAX_DISP;
          return Math.min(0.55, mag * 0.7);
        };
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const i = (r * cols + c) * 2;
            const x = c * CELL + disp[i];
            const y = r * CELL + disp[i + 1];
            const a = alphaAt(i);
            if (c + 1 < cols) {
              const j = i + 2;
              seg(x, y, (c + 1) * CELL + disp[j], r * CELL + disp[j + 1], (a + alphaAt(j)) * 0.5);
            }
            if (r + 1 < rows) {
              const j = i + cols * 2;
              seg(x, y, c * CELL + disp[j], (r + 1) * CELL + disp[j + 1], (a + alphaAt(j)) * 0.5);
            }
          }
        }
      }

      // energy pulses gliding along the grid lines — same field as the
      // cybernetic-grid shader: e = sin(x·F + t·W1)·sin(y·F + t·W2) with
      // smoothstep(0.8, 1), evaluated per node so the glowing patches
      // travel along OUR lines. Segments drawn between displaced node
      // positions — pulses stay glued to the visible (cursor-bowed)
      // line. First screen only, fades with the copy.
      const pf = 1 - Math.min(1, (progressRef?.current ?? 0) / PULSE_FADE_END);
      if (pf > 0.001 && cols > 2 && rows > 2) {
        const dim = (w >= 768 ? 1 : 0.6) * pf;
        const t = now * 0.001;
        for (let c = 0; c < cols; c++) sx[c] = Math.sin(c * P_F + t * P_W1);
        for (let r = 0; r < rows; r++) sy[r] = Math.sin(r * P_F + t * P_W2);
        ctx.lineCap = "round";

        const soft = (v: number) => {
          const k = Math.min(1, Math.max(0, (v - 0.72) / 0.28));
          return k * k * (3 - 2 * k); // smoothstep(0.72, 1, v)
        };
        const pulse = (
          x1: number, y1: number, x2: number, y2: number,
          v1: number, v2: number,
        ) => {
          const a = (soft(v1) + soft(v2)) * 0.5 * dim;
          if (a < 0.015) return;
          // halo pass + hot core — reads as light, not a tinted line
          ctx.strokeStyle = `rgba(${ACCENT}, ${(a * 0.35).toFixed(3)})`;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.strokeStyle = `rgba(${ACCENT}, ${Math.min(0.9, a * 0.95).toFixed(3)})`;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        };

        for (let r = 0; r < rows; r++) {
          const ey = sy[r];
          if (ey < 0.4) continue; // line outside the lit band — skip
          for (let c = 0; c + 1 < cols; c++) {
            const i = (r * cols + c) * 2;
            const j = i + 2;
            pulse(
              c * CELL + disp[i], r * CELL + disp[i + 1],
              (c + 1) * CELL + disp[j], r * CELL + disp[j + 1],
              sx[c] * ey, sx[c + 1] * ey,
            );
          }
        }
        for (let c = 0; c < cols; c++) {
          const ex = sx[c];
          if (ex < 0.4) continue;
          for (let r = 0; r + 1 < rows; r++) {
            const i = (r * cols + c) * 2;
            const j = i + cols * 2;
            pulse(
              c * CELL + disp[i], r * CELL + disp[i + 1],
              c * CELL + disp[j], (r + 1) * CELL + disp[j + 1],
              sy[r] * ex, sy[r + 1] * ex,
            );
          }
        }
      }
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(host);

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    if (reduced) {
      // reduced motion: static grid, no animation loop
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (base) ctx.drawImage(base, 0, 0, w, h);
    } else if (visible) {
      start();
    }

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
    };
  }, [pointerRef, reduced]);

  return <canvas ref={canvasRef} className="kinetic-grid" aria-hidden="true" />;
}
