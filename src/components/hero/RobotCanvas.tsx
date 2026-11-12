import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import RobotModel from "./RobotModel";
import type { BeamRef, PointerRef, ProgressRef } from "./heroTypes";

interface Props {
  progressRef: ProgressRef;
  pointerRef: PointerRef;
  beamRef: BeamRef;
  reducedMotion: boolean;
  onReady?: () => void;
}

/**
 * Transparent R3F canvas for the hero robot. No scene background —
 * the CSS blueprint grid shows through alpha. A procedural studio
 * environment (Lightformers) replaces the Blender World that glTF
 * cannot export; it lights the shell and feeds glossy reflections
 * without becoming a visible background.
 */
export default function RobotCanvas({ progressRef, pointerRef, beamRef, reducedMotion, onReady }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  // stop the render loop entirely once the sticky stage leaves the viewport
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(
      (entries) => setActive(entries[0]?.isIntersecting ?? true),
      { threshold: 0 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="robot-canvas" aria-hidden="true">
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        // на телефонах 1x — 1.5x DPR это ~2.3x пикселей каждого кадра на слабом GPU
        dpr={typeof window !== "undefined" && window.innerWidth < 768 ? 1 : [1, 2]}
        camera={{ position: [0, 0.06, 2.7], fov: 30 }}
        frameloop={active ? "always" : "never"}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Suspense fallback={null}>
          <RobotModel
            progressRef={progressRef}
            pointerRef={pointerRef}
            beamRef={beamRef}
            reducedMotion={reducedMotion}
            onReady={onReady}
          />
          <ambientLight intensity={0.35} />
          <directionalLight position={[3, 4, 5]} intensity={1.1} />
          <Environment resolution={256}>
            {/* soft key, top-front-left */}
            <Lightformer intensity={2.4} position={[0, 3, 4]} scale={[5, 3, 1]} />
            {/* cool fill from the left */}
            <Lightformer
              intensity={0.9}
              position={[-4, 1, 2]}
              rotation-y={Math.PI / 3}
              scale={[3, 4, 1]}
              color="#dff6ff"
            />
            {/* cyan-tinged rim from back-right for edge separation */}
            <Lightformer
              intensity={1.5}
              position={[4, 2, -3]}
              rotation-y={-Math.PI / 2.4}
              scale={[4, 2, 1]}
              color="#bffcff"
            />
            {/* faint floor bounce */}
            <Lightformer
              intensity={0.45}
              position={[0, -3, 1]}
              rotation-x={Math.PI / 2}
              scale={[6, 2, 1]}
              color="#e8eef4"
            />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}
