import { useEffect, useRef } from "react";

/* Animated "plasma lines" WebGL background — the flowing wave threads
   extracted from the shader-background demo and re-tuned for this site:
   transparent canvas, light-theme colors (teal + graphite), sized to its
   parent element, paused offscreen, static frame under reduced motion. */

const VS_SOURCE = `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
`;

const FS_SOURCE = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;

  const float overallSpeed = 0.2;
  const float gridSmoothWidth = 0.015;
  const float scale = 4.2;
  const float minLineWidth = 0.012;
  const float maxLineWidth = 0.16;
  const float lineSpeed = 1.0 * overallSpeed;
  const float lineAmplitude = 0.85;
  const float lineFrequency = 0.22;
  const float warpSpeed = 0.2 * overallSpeed;
  const float warpFrequency = 0.5;
  const float warpAmplitude = 0.75;
  const float offsetFrequency = 0.5;
  const float offsetSpeed = 1.33 * overallSpeed;
  const float minOffsetSpread = 0.35;
  const float maxOffsetSpread = 1.35;
  const int linesPerGroup = 16;

  /* site palette: cyan-teal + deep action teal + blueprint graphite */
  const vec3 TEAL_BRIGHT = vec3(0.0, 0.72, 0.76);
  const vec3 TEAL_DEEP   = vec3(0.0, 0.42, 0.44);
  const vec3 INK         = vec3(0.08, 0.11, 0.13);

  #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
  #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
  #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth * 0.7, halfWidth, abs(pos - (t)))

  float random(float t) {
    return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
  }

  float getPlasmaY(float x, float horizontalFade, float offset) {
    return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
  }

  void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

    float horizontalFade = 1.0 - (cos(uv.x * 6.28318) * 0.5 + 0.5);
    float verticalFade = smoothstep(0.0, 0.16, uv.y) * smoothstep(1.0, 0.84, uv.y);

    space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
    space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

    vec3 colorWeighted = vec3(0.0);
    float totalWeight = 0.0;
    float crispAccum = 0.0;
    float auraAccum = 0.0;

    for (int l = 0; l < linesPerGroup; l++) {
      float normalizedLineIndex = float(l) / float(linesPerGroup);
      float offsetTime = iTime * offsetSpeed;
      float offsetPosition = float(l) + space.x * offsetFrequency;
      float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
      float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
      float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
      float linePosition = getPlasmaY(space.x, horizontalFade, offset);

      float aura = drawSmoothLine(linePosition, halfWidth, space.y) * 0.35;
      float crisp = drawCrispLine(linePosition, halfWidth * 0.16, space.y);

      float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
      vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
      float circle = drawCircle(circlePosition, 0.012, space) * 2.5;

      float w = (aura + crisp + circle) * (0.45 + 0.55 * rand);

      vec3 tealMix = mix(TEAL_DEEP, TEAL_BRIGHT, normalizedLineIndex);
      vec3 strandCol = mix(tealMix, INK, step(0.68, fract(float(l) * 0.37)) * 0.65);

      colorWeighted += strandCol * w;
      totalWeight += w;
      crispAccum += (crisp + circle) * (0.5 + 0.5 * rand);
      auraAccum += aura * rand;
    }

    vec3 avgColor = colorWeighted / max(totalWeight, 0.0001);
    float fade = horizontalFade * verticalFade;
    float alpha = clamp((crispAccum * 0.34 + auraAccum * 0.16) * fade, 0.0, 0.46);

    gl_FragColor = vec4(avgColor * alpha, alpha);
  }
`;

function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function ShaderBackground({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
    });
    if (!gl) {
      console.warn("WebGL not supported.");
      return;
    }

    const vs = loadShader(gl, gl.VERTEX_SHADER, VS_SOURCE);
    const fs = loadShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Shader program link error:", gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const aPos = gl.getAttribLocation(program, "aVertexPosition");
    const uRes = gl.getUniformLocation(program, "iResolution");
    const uTime = gl.getUniformLocation(program, "iTime");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const start = performance.now();
    const draw = (now: number) => {
      const t = (now - start) / 1000;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aPos);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        draw(performance.now());
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let visible = true;
    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      cancelAnimationFrame(raf);
      if (reduced.matches || !visible) return;
      raf = requestAnimationFrame(loop);
    };

    // Always render an initial frame so canvas is populated even before scroll
    draw(start + 3500);
    if (!reduced.matches) play();

    const onReduce = () => {
      cancelAnimationFrame(raf);
      if (reduced.matches) draw(start + 3500);
      else play();
    };
    reduced.addEventListener("change", onReduce);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) play();
      else cancelAnimationFrame(raf);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      reduced.removeEventListener("change", onReduce);
      gl.deleteProgram(program);
      gl.deleteBuffer(positionBuffer);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
