import { useEffect, useRef } from "react";
import type { BeamRef } from "./heroTypes";

interface Props {
  beamRef: BeamRef;
  /** wrapper element that contains .holo-panel */
  navRef: React.RefObject<HTMLElement | null>;
}

/**
 * Screen-space projector beam: a soft fan drawn in an SVG layer between
 * the chest emitter (projected by RobotModel into beamRef) and the
 * nearest border point of .holo-panel. Because both endpoints live in
 * CSS pixels, the beam stays glued to the real DOM panel on every
 * resolution, layout and resize — no world-space angle guessing.
 *
 * Performance: rects are cached on scroll/resize instead of forcing
 * layout reads every frame, and the loop idles once the stage leaves
 * the viewport.
 */
export default function ProjectorBeam({ beamRef, navRef }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const haloRef = useRef<SVGPathElement>(null);
  const bodyRef = useRef<SVGPathElement>(null);
  const coreRef = useRef<SVGPathElement>(null);
  const emitRef = useRef<SVGCircleElement>(null);
  const hitRef = useRef<SVGEllipseElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const halo = haloRef.current;
    const body = bodyRef.current;
    const core = coreRef.current;
    const emit = emitRef.current;
    const hit = hitRef.current;
    if (!svg || !halo || !body || !core || !emit || !hit) return;

    // rects change only on scroll (stage unpinning) and resize — reading
    // getBoundingClientRect every frame would force synchronous layout
    let sr = svg.getBoundingClientRect();
    let pr: DOMRect | null = null;
    const panel = () => navRef.current?.querySelector<HTMLElement>(".holo-panel");
    const refreshRects = () => {
      sr = svg.getBoundingClientRect();
      pr = panel()?.getBoundingClientRect() ?? null;
    };
    refreshRects();

    // no work once the stage leaves the viewport
    let onScreen = true;
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    if (svg.parentElement) io.observe(svg.parentElement);

    window.addEventListener("scroll", refreshRects, { passive: true });
    window.addEventListener("resize", refreshRects);

    let raf = 0;
    let hidden = true;
    const quad = (
      sx: number, sy: number, tx: number, ty: number,
      nx: number, ny: number, wS: number, wT: number,
    ) =>
      `M${(sx + nx * wS).toFixed(1)} ${(sy + ny * wS).toFixed(1)}` +
      `L${(tx + nx * wT).toFixed(1)} ${(ty + ny * wT).toFixed(1)}` +
      `L${(tx - nx * wT).toFixed(1)} ${(ty - ny * wT).toFixed(1)}` +
      `L${(sx - nx * wS).toFixed(1)} ${(sy - ny * wS).toFixed(1)}Z`;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!onScreen) return;
      const beam = beamRef.current;
      const power = beam.valid ? beam.intensity : 0;
      if (!pr || pr.width < 8 || power <= 0.02) {
        if (!hidden) {
          svg.style.opacity = "0";
          hidden = true;
        }
        return;
      }

      const sx = beam.x - sr.left;
      const sy = beam.y - sr.top;
      // nearest border point of the panel — right edge on desktop,
      // top edge for the bottom mobile sheet, all handled by clamping
      const tx = Math.min(Math.max(sx, pr.left - sr.left + 10), pr.right - sr.left - 10);
      const ty = Math.min(Math.max(sy, pr.top - sr.top + 14), pr.bottom - sr.top - 14);
      const dx = tx - sx;
      const dy = ty - sy;
      const len = Math.hypot(dx, dy);
      if (len < 12) {
        if (!hidden) {
          svg.style.opacity = "0";
          hidden = true;
        }
        return;
      }
      const ux = dx / len;
      const uy = dy / len;
      const nx = -uy;
      const ny = ux;
      const w0 = 3;
      const w1 = Math.min(Math.max(len * 0.17, 26), 78);

      // pull the core a touch short of the border so it kisses the edge
      // rather than overshooting into the panel's text
      const cx2 = tx - ux * 4;
      const cy2 = ty - uy * 4;

      halo.setAttribute("d", quad(sx, sy, tx, ty, nx, ny, w0 * 2.4, w1 * 1.9));
      body.setAttribute("d", quad(sx, sy, tx, ty, nx, ny, w0, w1));
      core.setAttribute("d", quad(sx, sy, cx2, cy2, nx, ny, 1.6, w1 * 0.22));
      emit.setAttribute("cx", sx.toFixed(1));
      emit.setAttribute("cy", sy.toFixed(1));
      emit.setAttribute("r", "13");
      hit.setAttribute("cx", tx.toFixed(1));
      hit.setAttribute("cy", ty.toFixed(1));
      hit.setAttribute("rx", (w1 * 1.05).toFixed(1));
      hit.setAttribute("ry", Math.min(30, w1 * 0.7).toFixed(1));
      svg.style.opacity = power.toFixed(3);
      hidden = false;
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", refreshRects);
      window.removeEventListener("resize", refreshRects);
      svg.style.opacity = "0";
    };
  }, [beamRef, navRef]);

  return (
    <div className="projector-beam" aria-hidden="true">
      <svg ref={svgRef}>
        <defs>
          <filter id="pb-b14" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="pb-b7" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="pb-b3" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        {/* wide atmospheric halo → soft cone body → bright thin core */}
        <path ref={haloRef} fill="#3fd7e6" opacity="0.10" filter="url(#pb-b14)" />
        <path ref={bodyRef} fill="#59e7f4" opacity="0.20" filter="url(#pb-b7)" />
        <ellipse ref={hitRef} fill="#7ff1fb" opacity="0.16" filter="url(#pb-b7)" />
        <path ref={coreRef} fill="#c9fbff" opacity="0.55" filter="url(#pb-b3)" />
        <circle ref={emitRef} fill="#b7f8ff" opacity="0.6" filter="url(#pb-b7)" />
      </svg>
    </div>
  );
}
