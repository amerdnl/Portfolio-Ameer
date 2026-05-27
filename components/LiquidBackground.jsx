"use client";

import { useEffect, useRef } from "react";

/**
 * LiquidBackground — Lusion-style WebGL fluid simulation that reacts
 * to the cursor across the entire site.
 *
 * Powered by webgl-fluid-enhanced (a Navier–Stokes solver running on
 * the GPU). We drive splats manually from a window-level mousemove
 * listener so the container can stay `pointer-events: none` — content
 * underneath remains fully interactive.
 *
 * The dye palette is tuned to the brand's warm-gold accent so the
 * trail glows softly against the dark ink backdrops rather than the
 * default rainbow look of the demo.
 */
export default function LiquidBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const el = containerRef.current;
    if (!el) return;

    let sim;
    let cancelled = false;
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;

    // Brand palette — warm golds + a deeper amber for variety.
    const PALETTE = ["#c7a878", "#d9b489", "#b18c5a", "#e2c79a"];
    let colorIdx = 0;
    let movedSinceLastSplat = 0;

    const onMove = (e) => {
      if (!sim) {
        lastX = e.clientX;
        lastY = e.clientY;
        return;
      }
      const ex = e.clientX;
      const ey = e.clientY;
      const dx = ex - lastX;
      const dy = ey - lastY;
      const dist = Math.hypot(dx, dy);

      // Only splat when there's actual movement, and amortise the
      // force so a slow drag leaves a thin elegant wake while a fast
      // sweep produces a wider plume.
      if (dist > 1.2) {
        movedSinceLastSplat += dist;
        // Color cycles slowly through the palette as the user moves.
        if (movedSinceLastSplat > 220) {
          colorIdx = (colorIdx + 1) % PALETTE.length;
          movedSinceLastSplat = 0;
        }
        sim.splatAtLocation(ex, ey, dx * 6, dy * 6, PALETTE[colorIdx]);
      }
      lastX = ex;
      lastY = ey;
    };

    // Dynamic import — keeps the WebGL bundle out of the initial JS
    // payload and skips it entirely on touch devices (early return).
    import("webgl-fluid-enhanced").then(({ default: WebGLFluidEnhanced }) => {
      if (cancelled) return;
      sim = new WebGLFluidEnhanced(el);
      sim.setConfig({
        // Resolution — balance between fidelity and frame-rate
        simResolution:       128,
        dyeResolution:       1024,
        // Dissipation — how quickly the wake fades. Lower = longer trail.
        densityDissipation:  1.9,
        velocityDissipation: 1.5,
        // Pressure solver
        pressure:            0.82,
        pressureIterations:  20,
        // Vorticity / swirl — gives the wake those organic curls
        curl:                30,
        // Splat shape & strength — wider for confident presence
        splatRadius:         0.24,
        splatForce:          6500,
        // Look & feel
        shading:             true,
        colorful:            false,
        colorPalette:        PALETTE,
        transparent:         true,
        // Brightness pumped — the wake glows confidently over the hero
        // photograph and across every section background.
        brightness:          0.9,
        // We feed splats ourselves, so disable the lib's built-in hover
        // (it would bind to the container and we want pointer-events:none).
        hover:               false,
        // Bloom turned up for the premium liquid-gold glow
        bloom:               true,
        bloomIterations:     8,
        bloomResolution:     256,
        bloomIntensity:      0.85,
        bloomThreshold:      0.5,
        bloomSoftKnee:       0.7,
        sunrays:             false,
      });
      sim.start();
      window.addEventListener("mousemove", onMove, { passive: true });
    });

    return () => {
      cancelled = true;
      window.removeEventListener("mousemove", onMove);
      try { sim?.stop(); } catch {}
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2] hidden h-full w-full md:block"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
