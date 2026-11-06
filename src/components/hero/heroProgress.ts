/**
 * Shared mapping between the raw scroll progress (0..1 across the
 * hero runway) and the GLB clip progress.
 *
 * The first RETURN_PORTION of travel is reserved for the robot's
 * return from its free idle drift to the hero start pose — the clip
 * stays frozen at frame 0 while the drift offset fades out. The clip
 * (360° turn + move to the projection slot) only plays afterwards.
 */
export const RETURN_PORTION = 0.12;

export function toClipProgress(rawProgress: number): number {
  const p = Math.max(0, Math.min(1, rawProgress));
  return Math.max(0, Math.min(1, (p - RETURN_PORTION) / (1 - RETURN_PORTION)));
}
