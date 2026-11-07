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

interface Spark {
  axis: 0 | 1; // 0 = horizontal grid line, 1 = vertical
  line: number; // row or column index
  u: number; // position along the line, in cells
  dir: 1 | -1;
  speed: number; // cells per second
  age: number;
  life: number;
  delay: number; // spawn countdown while inactive
  on: boolean;
}

const SPARK_TRAIL = 3.2; // laser-streak length in cells
const SPARK_SAMPLES = 28; // dense sampling → smooth taper, no segmentation

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
    let sparks: Spark[] = [];
    let lastT = 0;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const respawn = (s: Spark) => {
      s.axis = Math.random() < 0.5 ? 0 : 1;
      const maxLine = s.axis === 0 ? rows : cols;
      const maxU = s.axis === 0 ? cols - 1 : rows - 1;
      s.line = Math.floor(rand(1, maxLine - 1));
      s.dir = Math.random() < 0.5 ? 1 : -1;
      s.u = rand(1.5, Math.max(2.5, maxU - 1.5));
      s.speed = rand(2.2, 3.6); // brisk laser glide, not a slow crawl
      s.age = 0;
      s.life = rand(3.5, 6);
      s.on = true;
    };

    // point on the VISIBLE (cursor-deformed) line at position u cells —
    // interpolates inside the same node segment the grid draws, so the
    // spark stays glued to a bowed line
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
        out[0] = i0 * CELL + t * CELL + disp[a] * (1 - t) + disp[b] * t;
        out[1] = s.line * CELL + disp[a + 1] * (1 - t) + disp[b + 1] * t;
      } else {
        a = (i0 * cols + s.line) * 2;
        b = a + cols * 2;
        out[0] = s.line * CELL + disp[a] * (1 - t) + disp[b] * t;
        out[1] = i0 * CELL + t * CELL + disp[a + 1] * (1 - t) + disp[b + 1] * t;
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
      for (const s of sparks) s.on = false; // grid shape changed — respawn on new lines
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

      // neon laser streaks gliding along the grid lines — real canvas
      // shadowBlur bloom + tapered cyan body + razor-thin hot core,
      // no blob circles or segmented caterpillar look. Points sample
      // the displaced nodes so streaks follow cursor-bowed lines.
      // Visible in BOTH hero states — the grid is the same canvas
      // under the holo nav; the loop stops off-screen via the
      // IntersectionObserver below.
      if (cols > 2 && rows > 2) {
        const want = w >= 768 ? 4 : 2;
        while (sparks.length < want) {
          sparks.push({
            on: false, axis: 0, line: 0, u: 0, dir: 1,
            speed: 2.8, age: 0, life: 4.5, delay: rand(0.1, 1.8),
          });
        }
        if (sparks.length > want) sparks.length = want;

        const dim = w >= 768 ? 1 : 0.7;
        const pts: [number, number][] = [];
        for (let k = 0; k <= SPARK_SAMPLES; k++) pts.push([0, 0]);

        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (const s of sparks) {
          if (!s.on) {
            s.delay -= dt;
            if (s.delay <= 0) respawn(s);
            continue;
          }
          s.age += dt;
          s.u += s.dir * s.speed * dt;
          const maxU = s.axis === 0 ? cols - 1 : rows - 1;
          if (s.u < -0.5 || s.u > maxU + SPARK_TRAIL || s.age > s.life) {
            s.on = false;
            s.delay = rand(0.4, 2.0);
            continue;
          }
          const env =
            Math.min(1, Math.min(s.age * 2.2, (s.life - s.age) * 2.2)) * dim;
          if (env <= 0.01) continue;

          // sample the streak along the deformed line from tail → head
          let n = 0;
          for (let k = SPARK_SAMPLES; k >= 0; k--) {
            const uu = s.u - s.dir * (k / SPARK_SAMPLES) * SPARK_TRAIL;
            if (uu < 0 || uu > maxU) continue;
            sparkPoint(s, uu, pts[n]);
            n++;
          }
          if (n < 2) continue;

          const x0 = pts[0][0], y0 = pts[0][1]; // tail
          const x1 = pts[n - 1][0], y1 = pts[n - 1][1]; // head
          if (Math.hypot(x1 - x0, y1 - y0) < 2) continue;

          const trace = (fromIdx: number) => {
            ctx.beginPath();
            ctx.moveTo(pts[fromIdx][0], pts[fromIdx][1]);
            for (let i = fromIdx + 1; i < n; i++) ctx.lineTo(pts[i][0], pts[i][1]);
          };

          // 1) wide atmospheric bloom — tapered at BOTH ends so the
          //    streak is a clean laser needle, no lollipop bulb at the tip
          const gBloom = ctx.createLinearGradient(x0, y0, x1, y1);
          gBloom.addColorStop(0, "rgba(0, 215, 225, 0)");
          gBloom.addColorStop(0.55, `rgba(0, 210, 220, ${(env * 0.25).toFixed(3)})`);
          gBloom.addColorStop(0.88, `rgba(0, 235, 245, ${(env * 0.72).toFixed(3)})`);
          gBloom.addColorStop(1, "rgba(0, 235, 245, 0)");
          ctx.shadowColor = `rgba(0, 220, 230, ${(env * 0.9).toFixed(3)})`;
          ctx.shadowBlur = 12;
          ctx.strokeStyle = gBloom;
          ctx.lineWidth = 2.2;
          trace(0);
          ctx.stroke();

          // 2) saturated neon body — peak just behind the tip, razor taper at 1
          const gBody = ctx.createLinearGradient(x0, y0, x1, y1);
          gBody.addColorStop(0, "rgba(0, 185, 195, 0)");
          gBody.addColorStop(0.4, `rgba(0, 195, 205, ${(env * 0.35).toFixed(3)})`);
          gBody.addColorStop(0.86, `rgba(0, 235, 245, ${(env * 0.92).toFixed(3)})`);
          gBody.addColorStop(0.95, `rgba(200, 255, 255, ${(env * 0.98).toFixed(3)})`);
          gBody.addColorStop(1, "rgba(200, 255, 255, 0)");
          ctx.shadowBlur = 5;
          ctx.strokeStyle = gBody;
          ctx.lineWidth = 1.1;
          trace(0);
          ctx.stroke();

          // 3) razor-hot white-cyan filament in the front section —
          //    what makes a line read as emitting light on a light bg
          const coreStart = Math.floor(n * 0.5);
          if (n - coreStart >= 2) {
            const gCore = ctx.createLinearGradient(
              pts[coreStart][0], pts[coreStart][1], x1, y1,
            );
            gCore.addColorStop(0, "rgba(255, 255, 255, 0)");
            gCore.addColorStop(0.72, `rgba(235, 255, 255, ${(env * 0.95).toFixed(3)})`);
            gCore.addColorStop(0.93, `rgba(255, 255, 255, ${(env * 0.98).toFixed(3)})`);
            gCore.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.shadowColor = `rgba(0, 240, 250, ${(env * 0.95).toFixed(3)})`;
            ctx.shadowBlur = 6;
            ctx.strokeStyle = gCore;
            ctx.lineWidth = 0.65;
            trace(coreStart);
            ctx.stroke();
          }
        }
        ctx.restore();
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
