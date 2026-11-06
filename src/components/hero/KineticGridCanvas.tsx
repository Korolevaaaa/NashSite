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

interface Spark {
  active: boolean;
  axis: 0 | 1; // 0 = horizontal grid line, 1 = vertical
  line: number; // row or column index
  u: number; // position along the line, in cells
  dir: 1 | -1;
  speed: number; // cells per second
  age: number;
  life: number;
  delay: number; // respawn countdown while inactive
}

const SPARK_TRAIL = 2.4; // trail length in cells
const SPARK_SAMPLES = 14;
const SPARK_FADE_END = 0.125; // raw progress where sparks are fully gone

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
    let sparks: Spark[] = [];
    let lastT = 0;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const respawn = (s: Spark) => {
      s.axis = Math.random() < 0.5 ? 0 : 1;
      const maxLine = s.axis === 0 ? rows : cols;
      const maxU = s.axis === 0 ? cols - 1 : rows - 1;
      s.line = Math.floor(rand(1, maxLine - 1));
      s.dir = Math.random() < 0.5 ? 1 : -1;
      s.u = rand(1, Math.max(2, maxU - 1));
      s.speed = rand(0.5, 1.1);
      s.age = 0;
      s.life = rand(4, 8);
      s.active = true;
    };

    // point on the VISIBLE (cursor-deformed) line at position u cells —
    // interpolates inside the same node segment the grid draws, so the
    // spark can't drift off a bowed line
    const sparkPoint = (s: Spark, u: number, out: [number, number]) => {
      const maxU = s.axis === 0 ? cols - 1 : rows - 1;
      const cu = Math.max(0, Math.min(maxU - 0.001, u));
      const i0 = Math.floor(cu);
      const t = cu - i0;
      let a: number;
      let b: number;
      if (s.axis === 0) {
        a = (s.line * cols + i0) * 2;
        b = a + 2;
        out[0] = i0 * CELL + disp[a] * (1 - t) + disp[b] * t + t * CELL;
        out[1] = s.line * CELL + disp[a + 1] * (1 - t) + disp[b + 1] * t;
      } else {
        a = (i0 * cols + s.line) * 2;
        b = a + cols * 2;
        out[0] = s.line * CELL + disp[a] * (1 - t) + disp[b] * t;
        out[1] = i0 * CELL + disp[a + 1] * (1 - t) + disp[b + 1] * t + t * CELL;
      }
    };

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
      for (const s of sparks) s.active = false; // grid shape changed — respawn on new lines
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
      const dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0.016;
      lastT = now;
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

      // sparks drifting along the grid lines — first screen only;
      // fades with the same raw progress window as the hero copy
      const pf = 1 - Math.min(1, (progressRef?.current ?? 0) / SPARK_FADE_END);
      if (pf > 0.001 && cols > 2 && rows > 2) {
        const want = w >= 768 ? 3 : 1;
        while (sparks.length < want) {
          sparks.push({
            active: false, axis: 0, line: 0, u: 0, dir: 1,
            speed: 1, age: 0, life: 1, delay: rand(0.2, 2.4),
          });
        }
        if (sparks.length > want) sparks.length = want;

        const dim = w >= 768 ? 1 : 0.6;
        const pt: [number, number] = [0, 0];
        const prev: [number, number] = [0, 0];
        ctx.lineCap = "round";

        for (const s of sparks) {
          if (!s.active) {
            s.delay -= dt;
            if (s.delay <= 0) respawn(s);
            continue;
          }
          s.age += dt;
          s.u += s.dir * s.speed * dt;
          const maxU = s.axis === 0 ? cols - 1 : rows - 1;
          if (s.u < 0.2 || s.u > maxU - 0.2 || s.age > s.life) {
            s.active = false;
            s.delay = rand(0.6, 2.8);
            continue;
          }
          const env = Math.min(s.age * 2, (s.life - s.age) * 2, 1) * pf * dim;
          if (env <= 0.01) continue;

          // fading trail: short connected segments behind the head,
          // sampled ON the deformed line
          let have = false;
          for (let k = 0; k <= SPARK_SAMPLES; k++) {
            const uu = s.u - s.dir * (k / SPARK_SAMPLES) * SPARK_TRAIL;
            if (uu < 0 || uu > maxU) break;
            if (!have) {
              sparkPoint(s, uu, prev);
              have = true;
              continue;
            }
            sparkPoint(s, uu, pt);
            const a = env * 0.42 * Math.pow(1 - k / SPARK_SAMPLES, 1.6);
            if (a > 0.008) {
              ctx.strokeStyle = `rgba(${ACCENT}, ${a.toFixed(3)})`;
              ctx.lineWidth = 1.8 * (1 - (k / SPARK_SAMPLES) * 0.6);
              ctx.beginPath();
              ctx.moveTo(prev[0], prev[1]);
              ctx.lineTo(pt[0], pt[1]);
              ctx.stroke();
            }
            prev[0] = pt[0];
            prev[1] = pt[1];
          }

          // head: bright dot + soft halo
          sparkPoint(s, s.u, pt);
          ctx.fillStyle = `rgba(${ACCENT}, ${(env * 0.14).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(pt[0], pt[1], 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(${ACCENT}, ${(env * 0.85).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(pt[0], pt[1], 1.8, 0, Math.PI * 2);
          ctx.fill();
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
      lastT = 0;
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
