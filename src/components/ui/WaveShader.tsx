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

const int N = 40;

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / max(u_res.y, 1.0);
  float t = u_flow;

  // координаты вдоль потока: на широких баннерах даём 1.15 периода,
  // чтобы были видны раскрытие → узел перекрута → крутая дуга с гребнем
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

  // палитра ZETRONIX: воздушный серебристо-голубой → глубокий морской teal →
  // чистый бирюзовый блик на гребне
  vec3 colMist  = vec3(0.74, 0.81, 0.85); // воздушная вуаль на широких крыльях
  vec3 colSlate = vec3(0.24, 0.46, 0.52); // холодный сине-стальной в полутени
  vec3 colTeal  = vec3(0.00, 0.39, 0.43); // #006b70 — глубокий сгиб ткани
  vec3 colCyan  = vec3(0.02, 0.72, 0.77); // #00c9d4 — каустический блик на кромке

  float halfW = 0.58 * u_dpr;
  float aa    = 0.95 * u_dpr;

  if (u_variant > 1.5) {
    // ===== ЛЕНТА-«ОБОЙМА»: вход слева сверху → дуга-разворот у правого края
    // → выход слева снизу. Всё строится на поле расстояния до траектории,
    // поэтому тело ленты и все филаменты огибают разворот автоматически =====
    float yT = 0.30
      + 0.040 * sin(x * 5.2 - t * 0.20 + ph)
      + 0.014 * cos(x * 9.0 - t * 0.13);
    float yB = 0.70
      + 0.040 * sin(x * 4.6 + t * 0.16 + ph * 1.3)
      + 0.013 * cos(x * 8.0 + t * 0.11 + 1.7);

    // разворот — полуокружность; x домножаем на aspect, чтобы дуга была круглой
    float xc  = 0.86;
    float yTc = 0.30 + 0.040 * sin(xc * 5.2 - t * 0.20 + ph)
                   + 0.014 * cos(xc * 9.0 - t * 0.13);
    float yBc = 0.70 + 0.040 * sin(xc * 4.6 + t * 0.16 + ph * 1.3)
                   + 0.013 * cos(xc * 8.0 + t * 0.11 + 1.7);
    float midC = 0.5 * (yTc + yBc);
    float rC   = max(0.5 * (yBc - yTc), 0.03);

    vec2 rel = vec2((x - xc) * aspect, y - midC);
    float dArc = rel.x > 0.0 ? abs(length(rel) - rC) : 1e3;
    float dTop = x <= xc ? abs(y - yT) : 1e3;
    float dBot = x <= xc ? abs(y - yB) : 1e3;
    float dPath = min(min(dTop, dBot), dArc);

    // координата вдоль пути: 0 — левый вход, ~0.5 — разворот, 1 — левый выход
    float sPath;
    if (dArc <= dTop && dArc <= dBot) {
      float ang = atan(rel.y, rel.x);
      sPath = 0.40 + (1.5708 - ang) / 3.1416 * 0.18;
    } else if (dTop <= dBot) {
      sPath = x * 0.42;
    } else {
      sPath = 0.58 + (xc - x) / xc * 0.40;
    }

    // перекрут идёт вдоль пути — узлы плотности плывут через разворот
    float twL    = sPath * 9.0 - t * 0.22 + u_seed * 2.0;
    float cL     = cos(twL);
    float pinchL = 1.0 / sqrt(cL * cL + 0.09);

    float halfTh  = 0.028 + 0.010 * (0.5 + 0.5 * sin(sPath * 7.0 + u_seed));
    float uu      = dPath / halfTh;
    float insideL = 1.0 - smoothstep(0.55, 1.0, uu);
    float uC      = clamp(uu, 0.0, 0.995);
    float rimL    = 1.0 / sqrt(1.0 - uC * uC * 0.88);
    float silkW   = 0.5 + 0.5 * sin(uu * 10.0 + sPath * 40.0 - t * 0.3);
    float densityL = (0.14 * rimL + 0.16 * pinchL + 0.06 * silkW) * insideL;
    float depthL  = clamp((rimL - 1.0) * 0.40 + (pinchL - 1.0) * 0.26, 0.0, 1.0);
    vec3 bodyL = mix(colMist, colSlate, smoothstep(0.0, 0.55, depthL));
    bodyL = mix(bodyL, colTeal, smoothstep(0.38, 0.92, depthL));
    float la = clamp(densityL * 0.72, 0.0, 0.75);
    accumCol += bodyL * la * (1.0 - accumA);
    accumA   += la * (1.0 - accumA);

    // 40 филаментов — изолинии поля расстояния: сами огибают разворот
    // и сгущаются в узлах перекрута
    for (int i = 0; i < N; i++) {
      float s = (float(i) / float(N - 1)) * 2.0 - 1.0;
      float sWarp = sign(s) * pow(abs(s), 0.74);
      float off = sWarp * halfTh * 0.85
                + 0.005 * sin(sPath * 30.0 + s * 3.0 + t * 0.2);
      float dd   = abs(dPath - off) * u_res.y;
      float line = 1.0 - smoothstep(halfW, halfW + aa, dd);
      if (line > 0.002) {
        float edgeWeight = 0.25 + 0.75 * pow(abs(s), 1.6);
        float knotBoost  = 0.75 + 0.45 * (1.0 - abs(cL));
        vec3 strandCol = mix(colSlate, colTeal,
            smoothstep(0.15, 0.85, abs(s) + (1.0 - abs(cL)) * 0.4));
        strandCol = mix(strandCol, colCyan, pow(abs(s), 3.0) * 0.4);
        float la2 = line * edgeWeight * knotBoost * 0.18;
        accumCol += strandCol * la2 * (1.0 - accumA);
        accumA   += la2 * (1.0 - accumA);
      }
    }
  } else {
  // ===== ШИРОКИЙ ПОТОК: перекрученная шёлковая лента через всю секцию =====
  // центральная траектория ленты — длинная каллиграфическая S-дуга
  float spine =
      0.50
    + 0.14 * sin(x * 4.4 - t * 0.22 + ph)
    + 0.06 * cos(x * 8.2 - t * 0.15 + ph * 1.6)
    - 0.08 * (x - 0.5) * cos(u_seed + 0.4)
    + mPush;

  // угол перекрута ленты в 3D вокруг своей оси:
  // в точках cos(twist)=0 кромки меняются местами (перехлёст как на референсе)
  float twist =
      x * 5.2
    - t * 0.26
    + 0.55 * sin(x * 3.3 + t * 0.14 + ph)
    + u_seed * 2.1;

  // второй слой вуали (вторичная складка со сдвигом фазы)
  float twist2 =
      x * 4.6
    - t * 0.19
    + 1.25
    + 0.45 * cos(x * 3.8 - t * 0.12 + ph);

  // полуширина раскрытой ленты: в центре и справа раскрывается в широкий парус,
  // к краям сходится в тонкое перо
  float wingEnv = smoothstep(0.0, 0.22, x) * smoothstep(1.0, 0.86, x);
  float R1 = (0.19 + 0.07 * sin(x * 3.1 - t * 0.11 + ph)) * wingEnv;
  float R2 = (0.13 + 0.05 * cos(x * 4.2 + t * 0.09 + ph)) * wingEnv;

  // проекция перекрута на плоскость экрана
  float c1 = cos(twist);
  float s1 = sin(twist); // глубина (Z-нормаль складки)

  float c2 = cos(twist2);
  float s2 = sin(twist2);

  // вторичная ось чуть смещена, создавая двойной шёлковый шлейф
  float spine2 = spine + 0.055 * sin(x * 5.6 + t * 0.16 + ph + 1.1) * wingEnv;

  // ===== СЛОЙ 1 + 2: Непрерывное полупрозрачное тело шёлковой вуали =====
  for (int layer = 0; layer < 2; layer++) {
    float isSecond = float(layer);
    float sp = mix(spine, spine2, isSecond);
    float cc = mix(c1, c2, isSecond);
    float ss = mix(s1, s2, isSecond);
    float rr = mix(R1, R2, isSecond);

    // видимая толщина проекции ленты (в узле перекрута сжимается, но не в ноль)
    float halfSpan = max(abs(cc) * rr, 0.006);
    float u = (y - sp) / halfSpan; // -1..1 поперёк видимой проекции

    // мягкая маска внутри границ ленты с антиалиасингом в экранных пикселях
    float pxAA = 2.0 / max(u_res.y * halfSpan, 1.0);
    float inside = 1.0 - smoothstep(1.0 - pxAA, 1.0 + pxAA, abs(u));

    if (inside > 0.001) {
      // цилиндрический профиль ткани: на краях (|u|→1) луч проходит сквозь
      // сгиб ткани по касательной → оптический путь длиннее (Fresnel / rim density)
      float uClamped = clamp(u, -0.995, 0.995);
      float rim = 1.0 / sqrt(1.0 - uClamped * uClamped * 0.88); // 1.0 в центре → ~2.9 на кромке

      // сжатие в узле перекрута: когда |cc| мало, вся ширина ленты собралась в жгут
      float pinch = 1.0 / sqrt(cc * cc + 0.09); // гладкий пик в узле без излома производной

      // гладкая асимметрия сгиба без ступеньки sign():
      // плавно перетекающая ориентация складки при вращении ленты в 3D
      float orient = (cc * ss) / sqrt(cc * cc * ss * ss + 0.06);
      float foldBias = 0.5 + 0.5 * clamp(u * orient, -1.0, 1.0);

      // продольные шёлковые волны внутри самой ткани (муар)
      float silkWave =
          0.5 + 0.5 * sin(u * 14.0 + x * 10.0 - t * 0.35 + isSecond * 2.4)
                    * cos(u * 6.0  - x * 6.0  + t * 0.21);

      // итоговая оптическая плотность участка вуали
      float density = (0.13 * rim + 0.14 * pinch * foldBias + 0.06 * silkWave) * inside;
      density *= mix(1.0, 0.62, isSecond);

      // цвет зависит от плотности: тонкая вуаль = светлый mist, сгиб/узел = насыщенный teal
      float depthMix = clamp((rim - 1.0) * 0.40 + (pinch - 1.0) * 0.24 + foldBias * 0.24, 0.0, 1.0);
      vec3 bodyCol = mix(colMist, colSlate, smoothstep(0.0, 0.55, depthMix));
      bodyCol = mix(bodyCol, colTeal, smoothstep(0.38, 0.92, depthMix));

      // гладкий cyan-отлив на освещённом гребне без скачка знака
      float sSmooth = ss / sqrt(ss * ss + 0.08);
      float crestGlow = smoothstep(0.45, 0.96, -u * sSmooth) * smoothstep(0.15, 0.75, abs(cc));
      bodyCol = mix(bodyCol, colCyan, crestGlow * 0.30);

      float la = clamp(density * 0.68, 0.0, 0.72);
      accumCol += bodyCol * la * (1.0 - accumA);
      accumA   += la * (1.0 - accumA);
    }
  }

  // ===== СЛОЙ 3: 40 субпиксельных шёлковых филаментов (микро-нитей) =====
  // Нити лежат ВНУТРИ геометрии перекручивающейся ленты, поэтому они
  // собираются в каустический узел на перегибе и дают ту самую текстуру с референса
  float slopeScale = u_res.y / max(u_res.x, 1.0);

  for (int i = 0; i < N; i++) {
    float s = (float(i) / float(N - 1)) * 2.0 - 1.0; // -1..1 по ширине ленты

    // нелинейное сгущение нитей к кромкам ленты (cos-распределение),
    // чтобы кромка дуги звенела чётким контуром, а середина оставалась воздушной
    float sWarp = sign(s) * pow(abs(s), 0.74);

    // собственная микро-рябь каждой нити
    float microPhase = x * (6.8 + s * 1.4) - t * (0.24 + s * 0.04) + s * 2.6 + ph;
    float micro = 0.012 * sin(microPhase) * wingEnv;

    // положение нити на перекрученной 3D-ленте
    float yStrand = spine + sWarp * c1 * R1 + s * s * 0.018 * s1 + micro;

    // производная dy/dx для честной субпиксельной толщины на крутых изгибах
    float dSpine = 0.14 * 4.4 * cos(x * 4.4 - t * 0.22 + ph)
                 - 0.06 * 8.2 * sin(x * 8.2 - t * 0.15 + ph * 1.6);
    float dTwist = -5.2 * s1 * sWarp * R1;
    float dy = (dSpine + dTwist) * slopeScale;
    float d  = abs(y - yStrand) * u_res.y / sqrt(1.0 + dy * dy);

    float line = 1.0 - smoothstep(halfW, halfW + aa, d);
    if (line > 0.002) {
      // крайние нити (|s|→1) — самые чёткие (огибающая кромка как на референсе)
      float edgeWeight = 0.25 + 0.75 * pow(abs(s), 1.6);
      // в узле перекрута нити накладываются, создавая глубокий каустический тон
      float knotBoost = 0.75 + 0.45 * (1.0 - abs(c1));

      vec3 strandCol = mix(colSlate, colTeal, smoothstep(0.15, 0.85, abs(s) + (1.0 - abs(c1)) * 0.4));
      strandCol = mix(strandCol, colCyan, pow(abs(s), 3.0) * smoothstep(0.3, 0.9, x) * 0.45);

      float la = line * edgeWeight * knotBoost * 0.19;
      accumCol += strandCol * la * (1.0 - accumA);
      accumA   += la * (1.0 - accumA);
    }
  }
  } // end flow/loop branch

  // мягкое растворение у краёв контейнера, чтобы никогда не было рамки canvas
  // для «обоймы» правый фейд короче — разворот должен остаться видимым
  float fadeX = u_variant > 1.5
      ? smoothstep(0.0, 0.08, x) * (1.0 - smoothstep(0.965, 1.0, x))
      : smoothstep(0.0, 0.14, x) * (1.0 - smoothstep(0.86, 1.0, x));
  float fadeY = smoothstep(0.0, 0.12, y) * (1.0 - smoothstep(0.88, 1.0, y));
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

type Props = {
  opacity?: number;
  seed?: number;
  variant?: WaveVariant;
  className?: string;
  interactive?: boolean;
};

export default function WaveShader({
  opacity = 0.85,
  seed = 0,
  variant = "flow",
  className = "",
  interactive = true,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const opRef = useRef(opacity);
  opRef.current = opacity;

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
