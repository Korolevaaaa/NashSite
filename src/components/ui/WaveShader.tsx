import { useEffect, useRef } from "react";

/* «Шёлковая 3D-вуаль» — широкая перекручивающаяся в пространстве лента
   (twisted silk ribbon) как на референсе:
   1. Две огибающие кромки y1(x) и y2(x) перекрещиваются в узлах перекрута.
      Когда лента сжимается в узел (twist), оптическая плотность растёт
      по закону Бера — Ламберта: широкие крылья воздушные и полупрозрачные,
      а сгиб и перекрут уходят в глубокий благородный teal/slate.
   2. Поверх полупрозрачного шёлкового тела идут 44 субпиксельные
      микро-нити (филаменты), которые собираются в плотный жгут на перекруте
      и веером раскрываются на широких дугах.
   3. Вдоль огибающих кромок скользит френелевский блик и тонкая теневая
      складка — лента читается как объёмная ткань в воздухе, а не плоский
      градиент или «щупальце». */

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
uniform float u_flow;
uniform float u_opacity;
uniform float u_dpr;
uniform float u_seed;
uniform float u_variant;   // 0 = wide flow, 1 = editorial arc, 2 = loop-«обойма»
uniform vec2  u_mouse;     // [-1,-1] если вне секции
uniform vec4  u_loop;      // геометрия подковы: xTurn, yMid, rY, rX
uniform vec2  u_loopEnds;  // sPath: x = точка «рождения» ленты, y = начало затухания конца

const int N = 40;

// Единое ядро 3D-перекрученной шёлковой вуали:
// sCoord — координата вдоль ленты (0..1+),
// nCoord — поперечное отклонение от центральной оси (в долях высоты),
// ampScale — масштаб раскрытия крыла (в более высоких контейнерах уменьшается, чтобы толщина в px была одинаковой),
// dSpineBase — наклон центральной оси dy/dx для честной толщины субпиксельных нитей,
// seedOff — фазовый сдвиг.
vec4 evalSilkRibbon(
  float sCoord,
  float nCoord,
  float ampScale,
  float dSpineBase,
  float env,
  float seedOff,
  float t
) {
  float ph = (u_seed + seedOff) * 1.7;

  // угол перекрута ленты в 3D вокруг своей оси:
  // в точках cos(twist)=0 кромки меняются местами (перехлёст как на референсе)
  float twist =
      sCoord * 5.2
    - t * 0.26
    + 0.55 * sin(sCoord * 3.3 + t * 0.14 + ph)
    + (u_seed + seedOff) * 2.1;

  // второй слой вуали (вторичная складка со сдвигом фазы)
  float twist2 =
      sCoord * 4.6
    - t * 0.19
    + 1.25
    + 0.45 * cos(sCoord * 3.8 - t * 0.12 + ph);

  float R1 = (0.19 + 0.07 * sin(sCoord * 3.1 - t * 0.11 + ph)) * env * ampScale;
  float R2 = (0.13 + 0.05 * cos(sCoord * 4.2 + t * 0.09 + ph)) * env * ampScale;

  float c1 = cos(twist);
  float s1 = sin(twist);
  float c2 = cos(twist2);
  float s2 = sin(twist2);

  float off2 = 0.055 * sin(sCoord * 5.6 + t * 0.16 + ph + 1.1) * env * ampScale;

  vec3 accumCol = vec3(0.0);
  float accumA  = 0.0;

  vec3 colMist  = vec3(0.74, 0.81, 0.85);
  vec3 colSlate = vec3(0.24, 0.46, 0.52);
  vec3 colTeal  = vec3(0.00, 0.39, 0.43);
  vec3 colCyan  = vec3(0.02, 0.72, 0.77);

  // ===== СЛОЙ 1 + 2: Непрерывное полупрозрачное тело шёлковой вуали =====
  for (int layer = 0; layer < 2; layer++) {
    float isSecond = float(layer);
    float localN = nCoord - isSecond * off2;
    float cc = mix(c1, c2, isSecond);
    float ss = mix(s1, s2, isSecond);
    float rr = mix(R1, R2, isSecond);

    float halfSpan = max(abs(cc) * rr, 0.004 * ampScale);
    float u = localN / halfSpan;

    float pxAA = 2.0 / max(u_res.y * halfSpan, 1.0);
    float inside = 1.0 - smoothstep(1.0 - pxAA, 1.0 + pxAA, abs(u));

    if (inside > 0.001) {
      float uClamped = clamp(u, -0.995, 0.995);
      float rim = 1.0 / sqrt(1.0 - uClamped * uClamped * 0.88);
      float pinch = 1.0 / sqrt(cc * cc + 0.09);

      float orient = (cc * ss) / sqrt(cc * cc * ss * ss + 0.06);
      float foldBias = 0.5 + 0.5 * clamp(u * orient, -1.0, 1.0);

      float silkWave =
          0.5 + 0.5 * sin(u * 14.0 + sCoord * 10.0 - t * 0.35 + isSecond * 2.4)
                    * cos(u * 6.0  - sCoord * 6.0  + t * 0.21);

      float density = (0.13 * rim + 0.14 * pinch * foldBias + 0.06 * silkWave) * inside;
      density *= mix(1.0, 0.62, isSecond);

      float depthMix = clamp((rim - 1.0) * 0.40 + (pinch - 1.0) * 0.24 + foldBias * 0.24, 0.0, 1.0);
      vec3 bodyCol = mix(colMist, colSlate, smoothstep(0.0, 0.55, depthMix));
      bodyCol = mix(bodyCol, colTeal, smoothstep(0.38, 0.92, depthMix));

      float sSmooth = ss / sqrt(ss * ss + 0.08);
      float crestGlow = smoothstep(0.45, 0.96, -u * sSmooth) * smoothstep(0.15, 0.75, abs(cc));
      bodyCol = mix(bodyCol, colCyan, crestGlow * 0.30);

      float la = clamp(density * 0.68, 0.0, 0.72);
      accumCol += bodyCol * la * (1.0 - accumA);
      accumA   += la * (1.0 - accumA);
    }
  }

  // ===== СЛОЙ 3: 40 субпиксельных шёлковых филаментов (микро-нитей) =====
  float slopeScale = u_res.y / max(u_res.x, 1.0);
  float halfW = 0.58 * u_dpr;
  float aa    = 0.95 * u_dpr;

  for (int i = 0; i < N; i++) {
    float s = (float(i) / float(N - 1)) * 2.0 - 1.0;
    float sWarp = sign(s) * pow(abs(s), 0.74);

    float microPhase = sCoord * (6.8 + s * 1.4) - t * (0.24 + s * 0.04) + s * 2.6 + ph;
    float micro = 0.012 * sin(microPhase) * env * ampScale;

    float nStrand = sWarp * c1 * R1 + s * s * 0.018 * s1 * ampScale + micro;

    float dTwist = -5.2 * s1 * sWarp * R1;
    float dy = (dSpineBase + dTwist) * slopeScale;
    float d  = abs(nCoord - nStrand) * u_res.y / sqrt(1.0 + dy * dy);

    float line = 1.0 - smoothstep(halfW, halfW + aa, d);
    if (line > 0.002) {
      float edgeWeight = 0.25 + 0.75 * pow(abs(s), 1.6);
      float knotBoost = 0.75 + 0.45 * (1.0 - abs(c1));

      vec3 strandCol = mix(colSlate, colTeal, smoothstep(0.15, 0.85, abs(s) + (1.0 - abs(c1)) * 0.4));
      strandCol = mix(strandCol, colCyan, pow(abs(s), 3.0) * (0.5 + 0.5 * sin(sCoord * 3.14159)) * 0.45);

      float la = line * edgeWeight * knotBoost * 0.19;
      accumCol += strandCol * la * (1.0 - accumA);
      accumA   += la * (1.0 - accumA);
    }
  }

  return vec4(accumCol, accumA);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / max(u_res.y, 1.0);
  float t = u_flow;

  float x = uv.x;
  float y = uv.y;

  // мягкое притяжение к курсору (как дуновение воздуха по ткани)
  float mPush = 0.0;
  if (u_mouse.x >= 0.0) {
    float dx = x - u_mouse.x;
    float dy = y - u_mouse.y;
    float dist2 = dx * dx * 2.2 + dy * dy * 4.5;
    mPush = exp(-dist2 * 14.0) * (u_mouse.y - 0.5) * 0.16;
  }

  float ph = u_seed * 1.7;
  vec3 accumCol = vec3(0.0);
  float accumA  = 0.0;

  if (u_variant > 1.5) {
    // ===== VARIANT "loop": C∞ аналитическая U-подкова с точной евклидовой метрикой =====
    float amp   = 0.25;      // изящная полуширина паруса
    float xTurn = u_loop.x;  // начало плавного закругления к правому полю
    float yMid  = u_loop.y;  // середина между верхней и нижней ветвью
    float rY    = u_loop.z;  // вертикальный полуразмах между ветвями
    float rX    = u_loop.w;  // широкий плавный вылет дуги в правое поле

    float dx = x - xTurn;
    // широкий мягкий радиус сопряжения epsX — даёт плавную каллиграфическую дугу без «плеча» на углах
    float epsX    = 0.012;
    float rootX   = sqrt(dx * dx + epsX);
    float qx      = 0.5 * (dx + rootX);
    float dqx_dx  = 0.5 * (1.0 + dx / rootX); // точная производная d(qx)/dx
    float leftLen = 0.5 * (-dx + rootX) / xTurn;

    vec2 uVec = vec2(qx / rX, (y - yMid) / rY);
    float rad = length(uVec);

    // точный экранный градиент ∇rad (в единицах высоты экрана u_res.y):
    // деление (rad - 1.0) на |∇rad| даёт честное евклидово расстояние по нормали к кривой
    // и на горизонталях, и на углах, и на вертикальном спуске справа!
    vec2 gradRad = vec2(
      (uVec.x / (rX * max(rad, 0.001))) * dqx_dx / aspect,
      (uVec.y / (rY * max(rad, 0.001)))
    );
    float gradLen = max(length(gradRad), 0.5);

    // непрерывная продольная координата sPath (0 вверху слева → 0.5 на правом развороте → 1 внизу слева):
    // используем sinTheta = uVec.y / rad вместо ступеньки topBottom, чтобы на экваторе
    // правой дуги (y = yMid) скорость изменения sPath была идеально равномерной
    float theta    = atan(uVec.y, max(uVec.x, 1e-4));
    float sArcPart = (1.5707963 - theta) / 3.1415926;
    float sinTheta = clamp(uVec.y / max(rad, 0.35), -1.0, 1.0);
    float sPath    = 0.50 + (sArcPart - 0.50) * 0.28 - sinTheta * leftLen * 0.36;

    // плавная живая волна вдоль траектории
    float turnCalm = 1.0 - 0.55 * exp(-pow((sPath - 0.50) / 0.18, 2.0));
    float waveOff  = (
        0.026 * sin(sPath * 10.5 - t * 0.22 + ph)
      + 0.011 * cos(sPath * 19.0 - t * 0.15 + ph * 1.4)
    ) * turnCalm;

    // евклидово знаковое расстояние поперёк подковы (+ снаружи, - внутри)
    float nCoord = (rad - 1.0) / gradLen - waveOff + mPush * 0.22 * sinTheta;

    // гасим поле глубоко внутри подковы (rad < 0.55), чтобы на оси симметрии y=yMid
    // никогда не возникало паразитных изолиний, и мягко растворяем левые концы
    float innerMask = smoothstep(0.45, 0.72, rad);
    // концы ленты растворяются мягко по продольной координате sPath:
    // у точки «рождения» ширина ленты раскрывается быстро (entryAmp), а
    // непрозрачность набирается длинным пандусом (entryA) — кончик выглядит
    // лёгкой дымкой, а не тёмной иглой; конец уходит за край с u_loopEnds.y
    float entryAmp = smoothstep(u_loopEnds.x, u_loopEnds.x + 0.05, sPath);
    float entryA   = pow(smoothstep(u_loopEnds.x, u_loopEnds.x + 0.16, sPath), 1.6);
    float exitFade = 1.0 - smoothstep(u_loopEnds.y, 1.0, sPath);
    float envPath  = innerMask * entryAmp * exitFade;
    float alphaMul = entryA * exitFade;

    if (envPath > 0.001 && alphaMul > 0.001) {
      vec4 rib = evalSilkRibbon(sPath * 2.15, nCoord, amp, 0.0, envPath, 0.0, t);
      rib.rgb *= alphaMul;
      rib.a   *= alphaMul;
      accumCol += rib.rgb * (1.0 - accumA);
      accumA   += rib.a   * (1.0 - accumA);
    }
  } else {
    // ===== VARIANT "flow": широкая перекрученная шёлковая лента через секцию =====
    float spine =
        0.50
      + 0.14 * sin(x * 4.4 - t * 0.22 + ph)
      + 0.06 * cos(x * 8.2 - t * 0.15 + ph * 1.6)
      - 0.08 * (x - 0.5) * cos(u_seed + 0.4)
      + mPush;
    float dSpine =
        0.14 * 4.4 * cos(x * 4.4 - t * 0.22 + ph)
      - 0.06 * 8.2 * sin(x * 8.2 - t * 0.15 + ph * 1.6);
    float wingEnv = smoothstep(0.0, 0.22, x) * smoothstep(1.0, 0.86, x);

    vec4 rib = evalSilkRibbon(x, y - spine, 1.0, dSpine, wingEnv, 0.0, t);
    accumCol = rib.rgb;
    accumA   = rib.a;
  }

  // мягкое растворение у краёв контейнера, чтобы никогда не было рамки canvas
  float fadeX = u_variant > 1.5
      ? smoothstep(0.0, 0.06, x) * (1.0 - smoothstep(0.95, 1.0, x))
      : smoothstep(0.0, 0.14, x) * (1.0 - smoothstep(0.86, 1.0, x));
  float fadeY = smoothstep(0.0, 0.08, y) * (1.0 - smoothstep(0.92, 1.0, y));
  float k = fadeX * fadeY * u_opacity;

  gl_FragColor = vec4(accumCol * k, accumA * k); // premultiplied alpha
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

export type WaveVariant = "flow" | "arc" | "loop";

export type LoopGeometry = {
  xTurn?: number;  // начало закругления к правому полю (0..1 в коорд. слота)
  yMid?: number;   // середина между ветвями
  rY?: number;     // вертикальный полуразмах (yMid±rY — ветви)
  rX?: number;     // вылет дуги вправо за xTurn
  entry?: number; // sPath, где лента «рождается» (0..0.36 на верхней ветви); 0 — у левого края
  exit?: number;  // sPath, с которого конец начинает растворяться; 1 — до самого края
};

const LOOP_DEFAULTS: Required<LoopGeometry> = {
  xTurn: 0.855,
  yMid: 0.485,
  rY: 0.335,
  rX: 0.095,
  entry: 0,
  exit: 0.90,
};

type Props = {
  opacity?: number;
  seed?: number;
  variant?: WaveVariant;
  className?: string;
  interactive?: boolean;
  loop?: LoopGeometry;
};

export default function WaveShader({
  opacity = 0.85,
  seed = 0,
  variant = "flow",
  className = "",
  interactive = true,
  loop = {},
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const opRef = useRef(opacity);
  opRef.current = opacity;
  const loopRef = useRef<Required<LoopGeometry>>(LOOP_DEFAULTS);
  loopRef.current = { ...LOOP_DEFAULTS, ...loop };

  const variantNum = variant === "arc" ? 1 : variant === "loop" ? 2 : 0;

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
    let lastNow = performance.now();
    const STATIC_T = 6.4;
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = mq.matches;
    let flow = 3.2;
    let mouseX = -1,
      mouseY = -1,
      targetX = -1,
      targetY = -1;
    let mouseTimeout = 0;

    const fail = () => {
      canvas.style.backgroundImage = "url(/img/silk-about.svg)";
      canvas.style.backgroundSize = "cover";
      canvas.style.backgroundPosition = "center";
    };

    const init = (): boolean => {
      gl =
        gl ??
        canvas.getContext("webgl", {
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
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      );
      const loc = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      for (const n of [
        "u_res",
        "u_flow",
        "u_opacity",
        "u_dpr",
        "u_seed",
        "u_variant",
        "u_mouse",
        "u_loop",
        "u_loopEnds",
      ]) {
        u[n] = gl.getUniformLocation(prog, n);
      }
      gl.clearColor(0, 0, 0, 0);
      return true;
    };

    const resize = () => {
      if (!gl) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
    };

    const draw = (now: number) => {
      if (!gl || !prog || gl.isContextLost()) return;
      if (dirty) {
        resize();
        dirty = false;
      }

      const dt = Math.min(0.05, Math.max(0.001, (now - lastNow) / 1000));
      lastNow = now;
      const breathe = 1.0 + 0.22 * Math.sin(now * 0.00012 + seed);
      flow += breathe * dt;

      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(u.u_res, canvas.width, canvas.height);
      gl.uniform1f(u.u_flow, reduced ? STATIC_T : flow);
      gl.uniform1f(u.u_opacity, opRef.current);
      gl.uniform1f(u.u_dpr, dpr);
      gl.uniform1f(u.u_seed, seed);
      gl.uniform1f(u.u_variant, variantNum);
      gl.uniform2f(u.u_mouse, mouseX, mouseY);
      const lg = loopRef.current;
      gl.uniform4f(u.u_loop, lg.xTurn, lg.yMid, lg.rY, lg.rX);
      gl.uniform2f(u.u_loopEnds, lg.entry, lg.exit);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible || reduced) return;
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const kick = () => {
      if (!visible || !ready) return;
      lastNow = performance.now();
      if (reduced) {
        draw(lastNow);
        return;
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      targetX = (e.clientX - r.left) / r.width;
      targetY = 1.0 - (e.clientY - r.top) / r.height;
      clearTimeout(mouseTimeout);
      mouseTimeout = window.setTimeout(() => {
        targetX = targetY = -1;
      }, 2200);
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
          if (!ready) {
            fail();
            io.disconnect();
            return;
          }
        }
        kick();
      },
      { rootMargin: "240px 0px" },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      dirty = true;
      if (reduced) kick();
    });
    ro.observe(canvas);

    const onMq = () => {
      reduced = mq.matches;
      kick();
    };
    mq.addEventListener("change", onMq);

    const pointerHost: HTMLElement | null = interactive
      ? canvas.closest("section") ?? canvas.parentElement
      : null;
    if (pointerHost) {
      pointerHost.addEventListener("pointermove", onPointer, { passive: true });
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
  }, [seed, variantNum, interactive]);

  return (
    <canvas
      ref={ref}
      className={`wave-shader ${className}`}
      aria-hidden="true"
    />
  );
}
