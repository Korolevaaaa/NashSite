import { useEffect, useRef, useState } from "react";

/* «Шёлковые волны» — декоративный WebGL-фон в пустых зонах секций.
   19 нитей с индивидуальными частотами/амплитудами (переплетение,
   а не параллельный чертёж), трёхступенчатый градиент mist→teal→cyan,
   premultiplied-вывод с композитингом «over» внутри шейдера,
   перпендикулярное расстояние до кривой через аналитическую
   производную, «дыхание» скорости течения, реакция на курсор
   (только interactive=true), ленивая инициализация, SVG-фолбэк,
   reduced-motion → статичный кадр. */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2  u_res;
uniform float u_flow;      // интегрированное время с «дыханием»
uniform float u_opacity;
uniform float u_dpr;
uniform float u_seed;
uniform vec2  u_mouse;     // [-1,-1] если курсор вне/неактивен

vec3 sheetColor(float x) {
  vec3 mist = vec3(0.80, 0.84, 0.86);
  vec3 teal = vec3(0.00, 0.50, 0.52);
  vec3 cyan = vec3(0.00, 0.82, 0.87);
  float t1 = smoothstep(0.18, 0.55, x);
  vec3 c = mix(mist, teal, t1);
  float t2 = smoothstep(0.62, 0.95, x);
  return mix(c, cyan, t2 * 0.8);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;

  // лёгкая перспективная деформация: лист не лежит фронтально
  vec2 w = uv;
  w.y += 0.035 * (uv.x - 0.5) * (uv.y - 0.5);
  w.x += 0.018 * sin(uv.y * 3.14) * smoothstep(0.0, 1.0, uv.x);

  float drift = sin(u_flow * 0.07 + u_seed) * 0.6;
  float swell = sin(w.x * 3.14 - u_flow * 0.08 + u_seed) * 0.045;

  float env = smoothstep(0.0, 0.24, w.x) * (1.0 - 0.30 * smoothstep(0.7, 1.0, w.x));

  // центральная ось листа
  float p1 = 6.0  * w.x - u_flow * 0.17 + drift;
  float p2 = 11.5 * w.x - u_flow * 0.11 + u_seed * 2.5;
  float wave = 0.095 * sin(p1) + 0.028 * sin(p2);
  float yc = 0.52 + (w.x - 0.5) * 0.10 + swell + wave * env;

  // курсор тянет лист к себе (только по x-весу — лист «приподнимается»)
  float lift = 0.0;
  if (u_mouse.x >= 0.0) {
    lift = exp(-pow(uv.x - u_mouse.x, 2.0) * 28.0);
    yc += lift * (u_mouse.y - yc) * 0.14;
  }

  // толщина листа: широкий слева, сходится в остриё справа (+15% массы по критике)
  float halfTh = mix(0.212, 0.039, smoothstep(0.0, 1.0, w.x));
  halfTh *= 0.85 + 0.15 * sin(p2 * 0.5 + u_seed);

  vec3 col = vec3(0.0);
  float a = 0.0;

  // внутренняя складка под основным листом — перегиб ткани, не вторая волна
  {
    float ycF = yc + (0.095 * sin(p1 + 2.1) + 0.028 * sin(p2 + 2.1)) * env * 0.45
              - halfTh * 0.25;
    float dNF = (w.y - ycF) / max(halfTh * 0.55, 1e-4);
    float insideF = (1.0 - smoothstep(0.55, 1.0, abs(dNF))) * env;
    float aF = insideF * 0.14;
    vec3 colF = sheetColor(w.x) * 0.78; // темнее основного
    col = colF * aF;
    a = aF;
  }

  float dN = (w.y - yc) / max(halfTh, 1e-4); // -1..1 поперёк листа
  float ad = abs(dN);
  float inside = 1.0 - smoothstep(0.80, 0.95, ad); // кромки чётче: -20% размытия

  // яркое ядро + бегущие шёлковые разводы внутри листа
  float core = exp(-ad * ad * 2.0);
  float sheen = sin(dN * 7.0 + w.x * 9.0 - u_flow * 0.40)
              * sin(w.x * 4.0 + u_flow * 0.23 + u_seed);
  float lum = 0.84 + 0.16 * sheen;

  vec3 colM = sheetColor(w.x);
  colM = mix(colM * 1.08, colM, ad); // центр чуть светлее — объём
  colM *= lum;

  float aM = inside * (0.55 + 0.36 * core);

  // тонкая блестящая кромка по краям листа
  float edge = exp(-pow((ad - 0.90) * 12.0, 2.0));
  aM += edge * inside * 0.20;

  // блик-нить вдоль верхней кромки — «сгиб» шёлка (узкая, ~10% толщины)
  float topEdge = exp(-pow((dN - 0.82) * 22.0, 2.0));
  colM += vec3(0.0, 0.85, 0.90) * topEdge * inside * 0.18;
  aM   += topEdge * inside * 0.10;

  // бегущие спекулярные полосы — читаемая шёлковая фактура
  float spec = pow(0.5 + 0.5 * sin(w.x * 14.0 + dN * 5.0 - u_flow * 0.55), 3.0);
  colM += sheetColor(w.x) * spec * inside * 0.10;

  // курсор: мягкий cyan-блик на уже видимой части листа
  if (u_mouse.x >= 0.0) {
    aM += lift * aM * 0.30;
    colM = mix(colM, vec3(0.0, 0.72, 0.78), lift * 0.22);
  }

  // основной лист поверх складки — композитинг «over»
  col = col + colM * (1.0 - a);
  a   = a + aM * (1.0 - a);

  float fade = smoothstep(0.0, 0.18, uv.x) * (1.0 - smoothstep(0.86, 1.0, uv.x))
             * smoothstep(0.0, 0.12, uv.y) * (1.0 - smoothstep(0.88, 1.0, uv.y));
  float k = fade * u_opacity;

  gl_FragColor = vec4(col * a * k, a * k); // premultiplied
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("WaveShader:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

type Props = { opacity?: number; seed?: number; className?: string; interactive?: boolean };

export default function WaveShader({ opacity = 0.6, seed = 0, className = "", interactive = false }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const opRef = useRef(opacity);
  opRef.current = opacity;

  const [fallbackSrc] = useState(() => (seed === 0 ? "/img/silk-about.svg" : "/img/silk-process.svg"));

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    let prog: WebGLProgram | null = null;
    let buf: WebGLBuffer | null = null;
    const u: Record<string, WebGLUniformLocation | null> = {};
    let raf = 0;
    let visible = false;
    let ready = false;
    let dirty = true;
    let dpr = 1;
    const t0 = performance.now();
    const STATIC_T = 8.5;
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = mq.matches;
    let flow = 0;
    let mouseX = -1, mouseY = -1, targetX = -1, targetY = -1;
    let mouseTimeout = 0;

    const fail = () => {
      if (fallbackSrc) canvas.style.backgroundImage = `url(${fallbackSrc})`;
      canvas.style.backgroundSize = "cover";
      canvas.style.backgroundPosition = "center";
    };

    const init = (): boolean => {
      gl = gl ?? canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      });
      if (!gl || gl.isContextLost()) return false;

      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return false;

      prog = gl.createProgram();
      if (!prog) return false;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
      gl.useProgram(prog);

      buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      for (const n of ["u_res", "u_flow", "u_opacity", "u_dpr", "u_seed", "u_mouse"]) {
        u[n] = gl.getUniformLocation(prog, n);
      }
      gl.clearColor(0, 0, 0, 0);
      return true;
    };

    const resize = () => {
      if (!gl) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
    };

    const draw = (t: number) => {
      if (!gl || !prog || gl.isContextLost()) return;
      if (dirty) { resize(); dirty = false; }

      const dt = 1 / 60;
      const breathe = 1.0 + 0.3 * Math.sin(t * 0.09);
      flow += breathe * dt;

      mouseX += (targetX - mouseX) * 0.15;
      mouseY += (targetY - mouseY) * 0.15;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(u.u_res, canvas.width, canvas.height);
      gl.uniform1f(u.u_flow, reduced ? STATIC_T : flow);
      gl.uniform1f(u.u_opacity, opRef.current);
      gl.uniform1f(u.u_dpr, dpr);
      gl.uniform1f(u.u_seed, seed);
      gl.uniform2f(u.u_mouse, mouseX, mouseY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = () => {
      raf = 0;
      if (!visible || reduced) return;
      draw((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };

    const kick = () => {
      if (!visible || !ready) return;
      if (reduced) { draw(STATIC_T); return; }
      if (!raf) raf = requestAnimationFrame(loop);
    };

    // canvas лежит под текстом с pointer-events:none — слушаем секцию,
    // а координаты считаем относительно canvas
    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      targetX = (e.clientX - r.left) / r.width;
      targetY = 1.0 - (e.clientY - r.top) / r.height;
      clearTimeout(mouseTimeout);
      mouseTimeout = window.setTimeout(() => { targetX = targetY = -1; }, 2000);
    };
    const onPointerLeave = () => {
      targetX = targetY = -1;
      clearTimeout(mouseTimeout);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !ready) {
          ready = init();
          dirty = true;
          if (!ready) { fail(); io.disconnect(); return; }
        }
        kick();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      dirty = true;
      if (reduced) kick();
    });
    ro.observe(canvas);

    const onMq = () => { reduced = mq.matches; kick(); };
    mq.addEventListener("change", onMq);

    const pointerHost: HTMLElement | null = interactive
      ? canvas.closest("section") ?? canvas.parentElement
      : null;
    if (pointerHost) {
      pointerHost.addEventListener("pointermove", onPointer);
      pointerHost.addEventListener("pointerleave", onPointerLeave);
    }

    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      raf = 0;
      prog = null;
      buf = null;
      ready = false;
    };
    const onRestored = () => {
      ready = init();
      dirty = true;
      if (!ready) fail();
      else kick();
    };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    // loseContext не вызываем: StrictMode перемонтирует эффект
    return () => {
      io.disconnect();
      ro.disconnect();
      mq.removeEventListener("change", onMq);
      if (pointerHost) {
        pointerHost.removeEventListener("pointermove", onPointer);
        pointerHost.removeEventListener("pointerleave", onPointerLeave);
      }
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      clearTimeout(mouseTimeout);
      cancelAnimationFrame(raf);
      if (gl && !gl.isContextLost()) {
        if (prog) gl.deleteProgram(prog);
        if (buf) gl.deleteBuffer(buf);
      }
    };
  }, [seed, interactive, fallbackSrc]);

  return <canvas ref={ref} className={`wave-shader ${className}`} aria-hidden="true" />;
}
