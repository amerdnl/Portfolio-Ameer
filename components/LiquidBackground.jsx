"use client";

import { useEffect, useRef } from "react";

/**
 * LiquidBackground — a Lusion-inspired fluid trail that reacts to the
 * cursor across the entire page (not just the hero).
 *
 * How it works:
 *   • A fullscreen, fixed-position <canvas> renders into a 2D context.
 *   • Each animation frame we apply a soft "destination-out" wash —
 *     this gently fades whatever was painted before, creating the
 *     trailing-ink decay you see in fluid sims.
 *   • A chain of N nodes lerps toward the cursor with progressively
 *     softer springs. Each node paints a radial gradient blob using
 *     the "lighter" composite mode (additive), so multiple blobs
 *     accumulate into a glowing, viscous trail.
 *   • The canvas itself uses `mix-blend-mode: screen` so the warm
 *     accent glow lifts dark backdrops without ever obscuring text
 *     or images.
 *
 * Performance:
 *   • GPU-friendly: only radial gradients + alpha-blend rectangles,
 *     no per-pixel JS.
 *   • Capped at devicePixelRatio = 2.
 *   • Suspends when window loses focus and on touch-only devices.
 */

const NODE_COUNT = 9;

export default function LiquidBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Lerp chain — head follows cursor, tail follows previous node.
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: w / 2,
      y: h / 2,
    }));

    let mx = w / 2;
    let my = h / 2;
    let visible = true;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onVis  = () => { visible = !document.hidden; };
    const onBlur = () => { visible = false; };
    const onFocus = () => { visible = true; };

    window.addEventListener("mousemove",   onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur",        onBlur);
    window.addEventListener("focus",       onFocus);

    let raf;
    const tick = () => {
      if (visible) {
        // Trail decay — semi-transparent erase, very gentle so the
        // glow lingers (gives the "fluid" memory effect).
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, w, h);

        // Update chain positions
        for (let i = 0; i < NODE_COUNT; i++) {
          const target = i === 0 ? { x: mx, y: my } : nodes[i - 1];
          const lerp   = 0.22 - i * 0.018;       // 0.22, 0.20, ...
          const k      = Math.max(0.06, lerp);
          nodes[i].x  += (target.x - nodes[i].x) * k;
          nodes[i].y  += (target.y - nodes[i].y) * k;
        }

        // Paint glowing blobs additively
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < NODE_COUNT; i++) {
          const r = 160 - i * 11;                // 160, 149, ...
          const alpha = 0.085 - i * 0.0065;
          const { x, y } = nodes[i];
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0,    `rgba(217, 180, 137, ${alpha})`);
          g.addColorStop(0.45, `rgba(199, 168, 120, ${alpha * 0.55})`);
          g.addColorStop(1,    "rgba(199, 168, 120, 0)");
          ctx.fillStyle = g;
          ctx.fillRect(x - r, y - r, r * 2, r * 2);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove",      onMove);
      window.removeEventListener("resize",         resize);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur",           onBlur);
      window.removeEventListener("focus",          onFocus);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2] hidden md:block"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
