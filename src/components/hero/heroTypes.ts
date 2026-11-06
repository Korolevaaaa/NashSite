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
