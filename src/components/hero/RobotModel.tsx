import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { BeamRef, PointerRef, ProgressRef } from "./heroTypes";
import { RETURN_PORTION, toClipProgress } from "./heroProgress";

const GLB_URL = "/assets/robot/zetronix_robot_web.glb";
const CLIP_NAME = "Scene"; // verified in zetronix_robot_web.glb (4.0 s, 20 channels)

// baked horizontal travel of CTRL_Root inside the clip (Blender → glTF +X)
const BAKED_SHIFT_X = 0.44;



// gaze limits verified in Blender: ±7.5° yaw, ±5.7° pitch
const GAZE_YAW = THREE.MathUtils.degToRad(7.5);
const GAZE_PITCH = THREE.MathUtils.degToRad(5.7);

// scratch objects for procedural offsets — never stored
const tmpQ = new THREE.Quaternion();
const tmpE = new THREE.Euler();
const tmpV = new THREE.Vector3();

interface Props {
  progressRef: ProgressRef;
  pointerRef: PointerRef;
  beamRef: BeamRef;
  reducedMotion: boolean;
  onReady?: () => void;
}

interface Nodes {
  idleBody?: THREE.Object3D;
  idleHead?: THREE.Object3D;
  idleArmL?: THREE.Object3D;
  idleArmR?: THREE.Object3D;
  gaze?: THREE.Object3D;
  eyeL?: THREE.Object3D;
  eyeR?: THREE.Object3D;
  projector?: THREE.Object3D;
}

/**
 * Loads the GLB, scrubs the baked "Scene" clip by normalized scroll progress
 * and layers procedural idle / gaze / blink on top of the mixer-written pose.
 *
 * Transform safety: every channel we touch (CTRL_Gaze rotation, CTRL_Idle_*
 * rotation/translation, CTRL_Eye_* scale) IS animated in the clip, so
 * mixer.update(0) rewrites it every frame — adding an offset on top is
 * deterministic and cannot accumulate. Channels absent from the clip are
 * never touched.
 */
export default function RobotModel({ progressRef, pointerRef, beamRef, reducedMotion, onReady }: Props) {
  const { scene, animations } = useGLTF(GLB_URL);
  const rigRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const nodesRef = useRef<Nodes>({});
  const baseRef = useRef<Record<string, { q: THREE.Quaternion; p: THREE.Vector3; s: THREE.Vector3 }>>({});
  const emblemRef = useRef<THREE.Object3D | null>(null);
  const anchorLocal = useRef(new THREE.Vector3());
  const anchorOk = useRef(false);
  const smoothP = useRef(0);
  const idlePhase = useRef(0);
  const smoothMouse = useRef({ x: 0, y: 0 });
  const layout = useRef({ w: 1, h: 1, scale: 1, g0: 0, final: 0 });
  const { size, camera, gl } = useThree();

  useEffect(() => {
    const get = (n: string) => scene.getObjectByName(n);
    nodesRef.current = {
      idleBody: get("CTRL_Idle_Body"),
      idleHead: get("CTRL_Idle_Head"),
      idleArmL: get("CTRL_Idle_Arm_L"),
      idleArmR: get("CTRL_Idle_Arm_R"),
      gaze: get("CTRL_Gaze"),
      eyeL: get("CTRL_Eye_L"),
      eyeR: get("CTRL_Eye_R"),
      projector: get("CTRL_Projector"),
    };

    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh && (mesh.name === "Projector_Beam_L" || mesh.name === "Projector_Beam_R")) {
        // baked fan meshes stay hidden — the beam is drawn by the
        // screen-space ProjectorBeam SVG layer glued to .holo-panel
        mesh.visible = false;
      }
      if (mesh.isMesh && mesh.name === "Projector_Holo_Grid") {
        mesh.visible = false; // leftover safeguard — removed in current export
      }
    });

    const mixer = new THREE.AnimationMixer(scene);
    mixerRef.current = mixer;
    const clip = THREE.AnimationClip.findByName(animations, CLIP_NAME) ?? null;

    if (clip) {
      const action = mixer.clipAction(clip);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
      actionRef.current = action;
      mixer.update(1e-4);
      // Capture the clip-driven base pose of every node the procedural
      // layer touches. The mixer's PropertyMixer.apply() skips writes
      // whenever the evaluated value equals the previous frame — i.e. at
      // any static scroll position it stops overwriting local transforms,
      // so accumulating on top (+= or multiply) would drift forever.
      // Restoring base each frame keeps the composite deterministic.
      for (const [key, node] of Object.entries(nodesRef.current)) {
        if (node) {
          baseRef.current[key] = {
            q: node.quaternion.clone(),
            p: node.position.clone(),
            s: node.scale.clone(),
          };
        }
      }
    }

    // Chest-emitter anchor: Chest_Emblem's node pivot sits at the body
    // origin, so take the bbox center of its subtree (the visible chest
    // triangle) and convert it ONCE into emblem-local space. Per frame
    // localToWorld(anchorLocal) then tracks the triangle through the
    // whole animation — no fixed-angle guesswork.
    const emblem = scene.getObjectByName("Chest_Emblem");
    if (emblem) {
      scene.updateMatrixWorld(true);
      const center = new THREE.Box3()
        .setFromObject(emblem)
        .getCenter(new THREE.Vector3());
      anchorLocal.current.copy(emblem.worldToLocal(center));
      emblemRef.current = emblem;
      anchorOk.current = true;
    }
    onReady?.();

    return () => {
      beamRef.current.intensity = 0;
      beamRef.current.valid = false;
      mixer.stopAllAction();
      mixer.uncacheRoot(scene);
      mixerRef.current = null;
      actionRef.current = null;
    };
  }, [scene, animations, beamRef, onReady]);

  // recompute responsive layout whenever the viewport size changes
  useEffect(() => {
    const persp = camera as THREE.PerspectiveCamera;
    const dist = Math.abs(persp.position.z);
    const frH = 2 * Math.tan(THREE.MathUtils.degToRad(persp.fov / 2)) * dist;
    const frW = frH * (size.width / Math.max(1, size.height));
    const wide = size.width >= 1200;
    const mid = size.width >= 768 && size.width < 1200;
    const tiny = size.width < 480;
    const scale = wide ? 1 : mid ? 0.82 : tiny ? 0.46 : 0.56;
    layout.current = {
      w: frW,
      h: frH,
      scale,
      g0: frW * (wide ? 0.13 : mid ? 0.1 : 0),
      final: frW * (wide ? 0.3 : mid ? 0.26 : 0.1),
    };
  }, [size, camera]);

  useFrame((state, delta) => {
    const mixer = mixerRef.current;
    const action = actionRef.current;
    const rig = rigRef.current;
    if (!mixer || !action || !rig) return;

    const target = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    smoothP.current = reducedMotion
      ? target
      : THREE.MathUtils.damp(smoothP.current, target, 4.5, delta);
    const rawP = smoothP.current;
    // first RETURN_PORTION of the runway is the return flight — the
    // baked clip only starts scrubbing after the robot is home
    const p = toClipProgress(rawP);

    // pose the baked clip (forward / backward / freeze — all deterministic)
    action.time = p * action.getClip().duration;
    mixer.update(0);

    // screen-space rig placement: slides from hero position to final slot,
    // compensating the baked +X travel of CTRL_Root
    const { w, scale, g0, final, h } = layout.current;

    // free-flight phase advances ONLY on the hero state — frozen while
    // scrolling so the return flight starts from the current drift
    // point instead of sliding along a moving trajectory
    if (!reducedMotion && target <= 0.0001 && rawP <= 0.0001) {
      idlePhase.current += Math.min(delta, 0.05);
    }
    const returnWeight = reducedMotion
      ? 0
      : 1 - THREE.MathUtils.smoothstep(rawP, 0, RETURN_PORTION);
    // drift amplitude by breakpoint — smaller where the model is big
    // relative to the viewport so it can't reach the copy or edges
    const xFactor =
      size.width >= 1200 ? 0.07 : size.width >= 768 ? 0.03 : 0.015;
    const yFactor = size.width >= 768 ? 0.035 : 0.02;
    const phase = idlePhase.current;
    const idleX =
      Math.sin((phase * Math.PI * 2) / 18) * w * xFactor * returnWeight;
    const idleY =
      Math.sin((phase * Math.PI * 2) / 22) * h * yFactor * returnWeight;

    rig.scale.setScalar(scale);
    rig.position.x =
      THREE.MathUtils.lerp(g0, final - BAKED_SHIFT_X * scale, p) + idleX;
    // model pivot is at its base (rest AABB y 0.011..0.973) — center it,
    // plus a downward nudge on phones so the copy block stays readable
    const mobileNudge = size.width < 480 ? -h * 0.28 : size.width < 768 ? -h * 0.1 : 0;
    rig.position.y =
      -0.49 * scale +
      mobileNudge * (1 - THREE.MathUtils.smoothstep(p, 0, 0.35)) +
      idleY;

    // procedural layer — fades out while the cinematic runs, then comes
    // back at reduced amplitude for the projection state so the robot
    // stays alive (sway / gaze / blink) while beaming the nav
    const heroWeight = reducedMotion
      ? 0
      : Math.max(
          1 - THREE.MathUtils.smoothstep(p, 0, 0.18),
          0.4 * THREE.MathUtils.smoothstep(p, 0.7, 1),
        );
    if (heroWeight > 0.001) {
      const t = state.clock.elapsedTime;
      const { idleBody, idleHead, idleArmL, idleArmR, gaze, eyeL, eyeR } =
        nodesRef.current;

      const nx = pointerRef.current.active
        ? (pointerRef.current.x / Math.max(1, size.width)) * 2 - 1
        : 0;
      const ny = pointerRef.current.active
        ? -((pointerRef.current.y / Math.max(1, size.height)) * 2 - 1)
        : 0;
      smoothMouse.current.x = THREE.MathUtils.damp(smoothMouse.current.x, nx, 6, delta);
      smoothMouse.current.y = THREE.MathUtils.damp(smoothMouse.current.y, ny, 6, delta);
      const mx = smoothMouse.current.x;
      const my = smoothMouse.current.y;

      const B = baseRef.current;
      const qOff = tmpQ;
      if (idleBody && B.idleBody) {
        idleBody.position.copy(B.idleBody.p);
        idleBody.position.y += Math.sin(t * 1.8) * 0.012 * heroWeight;
        idleBody.quaternion
          .copy(B.idleBody.q)
          .multiply(qOff.setFromEuler(tmpE.set(Math.sin(t * 0.9) * 0.01 * heroWeight, 0, 0)));
      }
      if (idleHead && B.idleHead) {
        idleHead.quaternion
          .copy(B.idleHead.q)
          .multiply(
            qOff.setFromEuler(
              tmpE.set(
                -my * 0.03 * heroWeight + Math.sin(t * 1.15) * 0.012 * heroWeight,
                mx * 0.05 * heroWeight,
                0,
              ),
            ),
          );
      }
      if (idleArmL && B.idleArmL) {
        idleArmL.quaternion
          .copy(B.idleArmL.q)
          .multiply(qOff.setFromEuler(tmpE.set(0, 0, Math.sin(t * 1.8 + 0.6) * 0.045 * heroWeight)));
      }
      if (idleArmR && B.idleArmR) {
        idleArmR.quaternion
          .copy(B.idleArmR.q)
          .multiply(qOff.setFromEuler(tmpE.set(0, 0, Math.sin(t * 1.8 + 1.4) * 0.045 * heroWeight)));
      }
      if (gaze && B.gaze) {
        gaze.quaternion
          .copy(B.gaze.q)
          .multiply(
            qOff.setFromEuler(
              tmpE.set(-my * GAZE_PITCH * heroWeight, mx * GAZE_YAW * heroWeight, 0),
            ),
          );
      }

      // gentle blink every ~4.4 s — composed from the captured base
      // scale so it cannot accumulate on a static clip pose
      const blinkPeriod = 4.4;
      const bt = (t % blinkPeriod) / blinkPeriod;
      if (eyeL && eyeR && B.eyeL && B.eyeR) {
        eyeL.scale.copy(B.eyeL.s);
        eyeR.scale.copy(B.eyeR.s);
        if (bt > 0.945) {
          const k = (bt - 0.945) / 0.055;
          const blink = Math.max(0.08, 1 - Math.sin(k * Math.PI) * 0.92);
          eyeL.scale.y *= blink;
          eyeR.scale.y *= blink;
        }
      }
    }

    // beam anchor for the screen-space ProjectorBeam layer: project
    // the chest-triangle point through the camera into viewport CSS px
    const beam = beamRef.current;
    const proj = nodesRef.current.projector;
    beam.intensity = proj
      ? THREE.MathUtils.smoothstep(proj.scale.x, 0, 0.4)
      : 0;
    const emblem = emblemRef.current;
    if (emblem && anchorOk.current) {
      scene.updateMatrixWorld(true);
      tmpV.copy(anchorLocal.current);
      emblem.localToWorld(tmpV);
      tmpV.project(camera);
      const r = gl.domElement.getBoundingClientRect();
      beam.x = r.left + (tmpV.x * 0.5 + 0.5) * r.width;
      beam.y = r.top + (1 - (tmpV.y * 0.5 + 0.5)) * r.height;
      beam.valid = true;
    } else {
      beam.valid = false;
    }
  });

  return (
    <group ref={rigRef}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(GLB_URL);
