import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { createBeamMaterial } from "./beamMaterial";
import type { PointerRef, ProgressRef } from "./heroTypes";

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

interface Props {
  progressRef: ProgressRef;
  pointerRef: PointerRef;
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
export default function RobotModel({ progressRef, pointerRef, reducedMotion, onReady }: Props) {
  const { scene, animations } = useGLTF(GLB_URL);
  const rigRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const nodesRef = useRef<Nodes>({});
  const baseRef = useRef<Record<string, { q: THREE.Quaternion; p: THREE.Vector3; s: THREE.Vector3 }>>({});
  const beamMat = useMemo(createBeamMaterial, []);
  const smoothP = useRef(0);
  const smoothMouse = useRef({ x: 0, y: 0 });
  const layout = useRef({ w: 1, h: 1, scale: 1, g0: 0, final: 0 });
  const { size, camera } = useThree();

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
        mesh.material = beamMat;
      }
      if (mesh.isMesh && mesh.name === "Projector_Holo_Grid") {
        mesh.visible = false; // leftover safeguard — removed in current export
      }
    });

    const mixer = new THREE.AnimationMixer(scene);
    mixerRef.current = mixer;
    const clip = THREE.AnimationClip.findByName(animations, CLIP_NAME) ?? null;

    // Chest projector: reparent CTRL_Projector from the eye-gaze chain
    // to the body so the beam rides the torso, not the head. The beam
    // meshes carry their own clip-animated offsets (tuned for the eye
    // origin), so we pose the END state, measure where the fan tip
    // actually lands, and shift the node until it sits on the emblem.
    if (clip) {
      const body = nodesRef.current.idleBody;
      const emblem = scene.getObjectByName("Chest_Emblem");
      const proj = nodesRef.current.projector;
      const beamL = scene.getObjectByName("Projector_Beam_L");
      if (body && emblem && proj && beamL) {
        const endAction = mixer.clipAction(clip);
        endAction.setLoop(THREE.LoopOnce, 1);
        endAction.clampWhenFinished = true;
        endAction.play();
        endAction.time = clip.duration;
        mixer.update(0);
        scene.updateMatrixWorld(true);

        // Chest_Emblem's pivot sits at the body origin — the visible
        // chest triangle lives in its vertex data, so aim at the
        // world-space bbox center of that subtree instead of the node
        const wp = new THREE.Box3()
          .setFromObject(emblem)
          .getCenter(new THREE.Vector3());
        const wq = proj.getWorldQuaternion(new THREE.Quaternion());
        body.add(proj);
        proj.position.copy(body.worldToLocal(wp.clone()));
        const bq = body.getWorldQuaternion(new THREE.Quaternion()).invert();
        proj.quaternion.copy(bq.multiply(wq));
        // aim the projector beam straight across onto the center of the
        // navigation panel
        proj.quaternion.multiply(
          new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.06)
        );

        // exact emission-point fix: the mesh pivot is NOT at the fan
        // tip, so find the real emitter — centroid of the low-z verts —
        // and shift the node until that tip sits on the chest triangle
        scene.updateMatrixWorld(true);
        const geo = (beamL as THREE.Mesh).geometry as THREE.BufferGeometry;
        const posAttr = geo.attributes.position;
        const tip = new THREE.Vector3();
        let tipN = 0;
        for (let i = 0; i < posAttr.count; i++) {
          if (posAttr.getZ(i) < 0.08) {
            tip.x += posAttr.getX(i);
            tip.y += posAttr.getY(i);
            tip.z += posAttr.getZ(i);
            tipN++;
          }
        }
        tip.divideScalar(Math.max(1, tipN));
        // average L and R beam tips so the combined cone starts dead-center on the triangle
        const beamR = scene.getObjectByName("Projector_Beam_R");
        const tipW = beamL.localToWorld(tip.clone());
        if (beamR) {
          tipW.add(beamR.localToWorld(tip.clone())).multiplyScalar(0.5);
        }
        const targetTip = wp.clone();
        targetTip.x += 0.018;
        targetTip.y += 0.004;
        const delta = targetTip.sub(tipW);
        const m = body.matrixWorld.clone().invert();
        const e = m.elements;
        proj.position.add(
          new THREE.Vector3(
            e[0] * delta.x + e[4] * delta.y + e[8] * delta.z,
            e[1] * delta.x + e[5] * delta.y + e[9] * delta.z,
            e[2] * delta.x + e[6] * delta.y + e[10] * delta.z,
          ),
        );
        endAction.stop();
        mixer.uncacheClip(clip);
      }
    }

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
    onReady?.();

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(scene);
      mixerRef.current = null;
      actionRef.current = null;
    };
  }, [scene, animations, beamMat, onReady]);

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
    const p = smoothP.current;

    // pose the baked clip (forward / backward / freeze — all deterministic)
    action.time = p * action.getClip().duration;
    mixer.update(0);

    // screen-space rig placement: slides from hero position to final slot,
    // compensating the baked +X travel of CTRL_Root
    const { scale, g0, final, h } = layout.current;
    rig.scale.setScalar(scale);
    rig.position.x = THREE.MathUtils.lerp(g0, final - BAKED_SHIFT_X * scale, p);
    // the clip already centers the model vertically at frame 0 — only a
    // downward nudge on phones so the copy block stays readable
    // model pivot is at its base (rest AABB y 0.011..0.973) — center it,
    // plus a downward nudge on phones so the copy block stays readable
    const mobileNudge = size.width < 480 ? -h * 0.28 : size.width < 768 ? -h * 0.1 : 0;
    rig.position.y =
      -0.49 * scale +
      mobileNudge * (1 - THREE.MathUtils.smoothstep(p, 0, 0.35));

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

    beamMat.uniforms.uTime.value = state.clock.elapsedTime;
    const proj = nodesRef.current.projector;
    beamMat.uniforms.uIntensity.value = proj
      ? THREE.MathUtils.smoothstep(proj.scale.x, 0, 0.4)
      : 1;
  });

  return (
    <group ref={rigRef}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(GLB_URL);
