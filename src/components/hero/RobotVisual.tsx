import { Component, lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { BeamRef, PointerRef, ProgressRef } from "./heroTypes";

// three.js stays out of the main bundle — loaded only when WebGL exists
const RobotCanvas = lazy(() => import("./RobotCanvas"));

interface Props {
  progressRef: ProgressRef;
  pointerRef: PointerRef;
  beamRef: BeamRef;
}

/** Catches WebGL/GLB failures and keeps the static PNG robot visible. */
class CanvasBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function detectWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(
      c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

/**
 * Robot slot inside the hero stage: transparent WebGL canvas on top of a
 * static transparent PNG (Cycles render) that stays visible while the GLB
 * loads — and permanently if WebGL or the model is unavailable.
 */
export default function RobotVisual({ progressRef, pointerRef, beamRef }: Props) {
  const reducedMotion = useReducedMotion();
  const [webgl, setWebgl] = useState(false);
  const [failed, setFailed] = useState(false);
  const [live, setLive] = useState(false);
  // stable — an inline fn in RobotModel's init deps would re-create the
  // whole mixer/procedural state on every parent rerender
  const handleReady = useCallback(() => setLive(true), []);
  const handleFail = useCallback(() => setFailed(true), []);

  useEffect(() => {
    if (!detectWebGL()) return;
    // На телефонах откладываем тяжёлый WebGL-чанк до idle — иначе его
    // парсинг/оценка отодвигает LCP (fallback img) на слабом железе.
    if (window.innerWidth >= 768) {
      setWebgl(true);
      return;
    }
    const ric =
      (window as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    const id = ric(() => setWebgl(true), { timeout: 2500 });
    return () => {
      const cic = (window as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (cic) cic(id); else clearTimeout(id);
    };
  }, []);

  return (
    <div className={`robot-visual${live ? " is-live" : ""}`}>
      <img
        className="robot-fallback"
        src="/assets/robot/robot-fallback-680.webp"
        srcSet="/assets/robot/robot-fallback-680.webp 680w, /assets/robot/robot-fallback.webp 900w"
        sizes="(max-width: 767px) min(62vw, 300px), min(52vw, 340px)"
        alt="Робот-ассистент ZETRONIX — белый парящий андроид с бирюзовой оптикой"
        draggable={false}
        decoding="async"
        fetchPriority="high"
      />
      {webgl && !failed && (
        <CanvasBoundary onError={handleFail}>
          <Suspense fallback={null}>
            <RobotCanvas
              progressRef={progressRef}
              pointerRef={pointerRef}
              beamRef={beamRef}
              reducedMotion={reducedMotion}
              onReady={handleReady}
            />
          </Suspense>
        </CanvasBoundary>
      )}
    </div>
  );
}
