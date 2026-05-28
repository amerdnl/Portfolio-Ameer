"use client";

import { useEffect, useRef } from "react";

/**
 * FluidBackground — Lusion-style interactive fluid layer.
 *
 * A self-contained <canvas> that paints a smooth, chain-following
 * blob trail under the cursor. The result reads as a slow, liquid
 * wake — premium and cinematic rather than reactive/twitchy.
 *
 * How it works (no WebGL — pure 2D, GPU-composited via CSS):
 *   1. We keep a chain of N "blobs" (trailSize).
 *   2. Blob[0] eases toward the live cursor each frame (speed).
 *   3. Each subsequent blob eases toward the previous blob — a
 *      lagging chain that gives the trail its viscous, ropy feel.
 *   4. Each blob is drawn as a soft radial gradient using the
 *      additive 'lighter' composite op so overlapping blobs glow
 *      brighter at the head and dissolve toward the tail.
 *   5. A CSS `filter: blur(Npx)` then melts the discrete circles
 *      into a single continuous liquid surface (the classic
 *      "gooey" / metaball look) without any SVG filter cost.
 *   6. `mix-blend-mode: screen` lifts the gold trail off the dark
 *      hero video without ever darkening any pixel — at idle the
 *      canvas is *fully transparent*, so it can never produce the
 *      pale wash the previous site-wide WebGL fluid sim caused.
 *
 * Performance:
 *   • Touch devices: short-circuited at mount, no canvas, no RAF.
 *   • prefers-reduced-motion: short-circuited, the cursor wake is
 *     decorative and not required to understand the page.
 *   • DPR capped at 2 — retina sharpness without melting GPUs.
 *   • The whole thing is ~14 cheap radial gradients per frame,
 *     stays at 60fps on integrated graphics.
 *
 * Tuning knobs (all live on the component's props — see Hero.jsx):
 *   intensity   — multiplier on blob radius (0.5–1.5 sensible)
 *   opacity     — head blob alpha 0–1 (tail fades from here)
 *   blur        — CSS blur in px (30–60 → liquid; 0 → discrete dots)
 *   speed       — lerp factor toward cursor 0–1 (lower = slower wake)
 *   color       — "r,g,b" string used to build rgba() per blob
 *   trailSize   — number of blobs in the chain (more = longer wake)
 *   blobRadius  — head blob size in px before intensity multiplier
 */
export default function FluidBackground({
  intensity  = 1,
  opacity    = 0.55,
  blur       = 42,
  speed      = 0.18,
  color      = "199, 168, 120", // accent #c7a878
  trailSize  = 14,
  blobRadius = 220,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Hard skips — touch devices and reduced-motion users get the
    // hero exactly as-is, no canvas mounted, no RAF, no listeners.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch   = window.matchMedia("(hover: none)").matches;
    if (reduced || touch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width  = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Chain of blobs — start collapsed at center so the first frame
    // is empty (transparent) rather than a giant burst at (0,0).
    const trail = Array.from({ length: trailSize }, () => ({
      x: w / 2,
      y: h / 2,
    }));

    // Idle target = canvas center; updated by mousemove.
    let mouseX  = w / 2;
    let mouseY  = h / 2;
    let primed  = false; // becomes true after first mousemove

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Only react while the cursor is inside the hero rectangle.
      if (x < 0 || y < 0 || x > w || y > h) return;
      mouseX = x;
      mouseY = y;
      if (!primed) {
        // Snap the whole chain to the cursor on first contact —
        // avoids a long sweeping intro line from the center.
        trail.forEach((p) => { p.x = x; p.y = y; });
        primed = true;
      }
    };

    const onResize = () => resize();

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", onResize);

    let raf = 0;
    const tick = () => {
      // Lead blob eases toward the cursor.
      trail[0].x += (mouseX - trail[0].x) * speed;
      trail[0].y += (mouseY - trail[0].y) * speed;
      // Each subsequent blob eases toward the one ahead of it —
      // creates the ropy, viscous trail without any springs.
      for (let i = 1; i < trail.length; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * speed * 0.85;
        trail[i].y += (trail[i - 1].y - trail[i].y) * speed * 0.85;
      }

      ctx.clearRect(0, 0, w, h);

      // Until the cursor has actually entered the hero, draw nothing —
      // guarantees the layer contributes zero light at page load.
      if (!primed) {
        raf = requestAnimationFrame(tick);
        return;
      }

      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        const t = 1 - i / trail.length;        // head=1, tail→0
        const r = blobRadius * t * intensity;
        const a = opacity   * t * 0.6;
        if (r < 1 || a < 0.002) continue;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        grad.addColorStop(0, `rgba(${color}, ${a})`);
        grad.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, [intensity, opacity, blur, speed, color, trailSize, blobRadius]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
      style={{
        // The CSS blur is what turns the discrete radial gradients
        // into one continuous liquid surface. Drop blur to 0 to see
        // the underlying chain of dots; raise to 60+ for a softer fog.
        filter: `blur(${blur}px)`,
        // 'screen' guarantees the layer can only lighten — at idle
        // the canvas is fully cleared so it contributes nothing.
        mixBlendMode: "screen",
      }}
    />
  );
}
