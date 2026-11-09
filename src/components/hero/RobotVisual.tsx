import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from "react";
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

  useEffect(() => setWebgl(detectWebGL()), []);

  return (
    <div className={`robot-visual${live ? " is-live" : ""}`}>
      <img
        className="robot-fallback"
        src="/assets/robot/robot-fallback.webp"
        alt="Робот-ассистент ZETRONIX — белый парящий андроид с бирюзовой оптикой"
        draggable={false}
      />
      {webgl && !failed && (
        <CanvasBoundary onError={() => setFailed(true)}>
          <Suspense fallback={null}>
            <RobotCanvas
              progressRef={progressRef}
              pointerRef={pointerRef}
              beamRef={beamRef}
              reducedMotion={reducedMotion}
              onReady={() => setLive(true)}
            />
          </Suspense>
        </CanvasBoundary>
      )}
    </div>
  );
}
