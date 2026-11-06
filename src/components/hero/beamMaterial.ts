import * as THREE from "three";

/**
 * Custom shader for the GLB projector-beam fans (Projector_Beam_L/R).
 *
 * The Blender material used procedural Wave/Noise/Voronoi nodes which glTF
 * cannot export — only a flat Principled BSDF arrives in the file.
 * This recreates the "sandy god-ray" look in object space:
 *   - vPos.z runs along the beam (0 at the eyes → ~0.82 at the far end)
 *   - theta around the beam axis yields radial ray modulation
 *   - a hashed grain layer drifts outward like sparkling dust
 *   - fresnel + head/tail fades keep every edge soft
 */
export function createBeamMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uColor: { value: new THREE.Color(0x52e5ef) },
      uSpread: { value: 1.05 },
      uStretch: { value: 1.55 },
    },
    vertexShader: /* glsl */ `
      uniform float uSpread;
      uniform float uStretch;
      varying vec3 vPos;
      varying vec3 vNormalW;
      varying vec3 vViewW;

      void main() {
        vPos = position;
        float a01 = clamp(position.z / 0.82, 0.0, 1.0);
        // tight pinpoint at the chest emitter (~16% width), opening into
        // a clean projector cone that frames the nav panel
        vec3 p = position;
        p.xy *= mix(0.16, uSpread, pow(a01, 0.9));
        p.z *= uStretch;
        vec4 wp = modelMatrix * vec4(p, 1.0);
        vNormalW = normalize(mat3(modelMatrix) * normal);
        vViewW = cameraPosition - wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;

      uniform float uTime;
      uniform float uIntensity;
      uniform vec3 uColor;

      varying vec3 vPos;
      varying vec3 vNormalW;
      varying vec3 vViewW;

      void main() {
        float along = clamp(vPos.z / 0.82, 0.0, 1.0);
        float theta = atan(vPos.y, vPos.x);

        // clean projector optics: bright axial core + subtle scan streaks,
        // no noisy hash grain (which looked like visual mush)
        float rNorm = length(vPos.xy) / max(0.015, along * 0.28);
        float core = exp(-rNorm * rNorm * 1.9);
        float streaks = 0.82 + 0.18 * sin(theta * 24.0 + uTime * 0.6);

        float head = smoothstep(0.0, 0.03, along);
        float tail = pow(1.0 - along, 1.75);
        float fres = pow(abs(dot(normalize(vNormalW), normalize(vViewW))), 1.9);

        // bright focused emitter → calm translucent falloff at the panel
        float axial = mix(1.4, 0.45, smoothstep(0.0, 0.7, along));
        float a = head * tail * fres * (0.45 + 0.55 * core) * streaks * axial * uIntensity;
        vec3 col = mix(uColor, vec3(0.88, 0.99, 1.0), core * (1.0 - along * 0.7) * 0.55);
        float alpha = a * 0.34;
        if (alpha < 0.002) discard;
        gl_FragColor = vec4(col, alpha);
      }
    `,
  });
}
