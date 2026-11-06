/** Shared mutable state written by HeroScene listeners, read by canvases per frame. */
export interface PointerState {
  /** clientX / clientY in CSS pixels; consumers normalize against their own rect */
  x: number;
  y: number;
  /** false when the pointer is absent / left the window — effects ease back to neutral */
  active: boolean;
}

export type ProgressRef = { readonly current: number };
export type PointerRef = { readonly current: PointerState };

/** Chest-emitter anchor projected to viewport CSS px by the 3D scene. */
export interface BeamAnchorState {
  x: number;
  y: number;
  /** 0..1 — driven by the clip's CTRL_Projector scale channel */
  intensity: number;
  /** false until the GLB scene supplies a real anchor (fallback mode) */
  valid: boolean;
}
export type BeamRef = { readonly current: BeamAnchorState };
