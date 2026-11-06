import { useEffect, useRef } from "react";
import type { PointerRef } from "./heroTypes";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const CELL = 56; // CSS px grid pitch
const RADIUS = 220; // cursor influence radius, CSS px
const MAX_DISP = 10; // max node displacement, CSS px
const EASE = 0.14; // per-frame spring toward target displacement
const ACCENT = "0, 154, 160";
const INK = "13, 17, 23";

interface Props {
  pointerRef: PointerRef;
}

/**
 * Light kinetic grid for the Hero stage: thin ink lines on the blueprint
 * background that gently bow away from the cursor with a cyan highlight.
 * Canvas 2D, pointer-events: none — never blocks HTML links/buttons.
 */
export default function KineticGridCanvas({ pointerRef }: Props) {
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
