"use client";

import { useEffect, useRef } from "react";

const W    = 256;
const H    = 256;
const DAMP = 0.970;
const IDLE = 350;

// Directional Gaussian splat — elongated along cursor direction, very thin perp.
const SCAN       = 10;  // pixel search radius in sim-space
const SIGMA_ALONG = 7;  // loose along movement → leaves a streak
const SIGMA_PERP  = 1;  // tight perpendicular → thin as a finger

export default function WaterRipple() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = W;
    canvas.height = H;

    const ctx     = canvas.getContext("2d");
    const imgData = ctx.createImageData(W, H);
    const px      = imgData.data;

    let cur = new Float32Array(W * H);
    let prv = new Float32Array(W * H);

    // Each splat now carries movement direction (nx, ny)
    const queue        = [];
    let lastX          = -1;
    let lastY          = -1;
    let lastMoveAt     = 0;
    let displayOpacity = 0;

    const onMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      lastMoveAt = performance.now();

      if (lastX >= 0) {
        const dx  = x - lastX;
        const dy  = y - lastY;
        const spd = Math.hypot(dx, dy);
        if (spd > 0.001) {
          queue.push({
            x, y,
            str: Math.min(spd * 3500, 500),
            nx: dx / spd,   // unit direction vector
            ny: dy / spd,
          });
        }
      }
      lastX = x;
      lastY = y;
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const sa2 = 2 * SIGMA_ALONG * SIGMA_ALONG;
    const sp2 = 2 * SIGMA_PERP  * SIGMA_PERP;

    let raf;

    const tick = () => {
      // ── Idle fade ─────────────────────────────────────────────────────
      const idle      = performance.now() - lastMoveAt > IDLE;
      const targetOp  = idle ? 0 : 0.55;
      const lerpSpeed = idle ? 0.055 : 0.18;
      displayOpacity += (targetOp - displayOpacity) * lerpSpeed;
      canvas.style.opacity = displayOpacity < 0.002 ? "0" : displayOpacity.toFixed(3);

      if (displayOpacity < 0.002 && idle) {
        raf = requestAnimationFrame(tick);
        return;
      }

      // ── Directional splats ────────────────────────────────────────────
      while (queue.length) {
        const { x, y, str, nx, ny } = queue.pop();
        const cx = Math.round(x * (W - 1));
        const cy = Math.round(y * (H - 1));

        for (let dy = -SCAN; dy <= SCAN; dy++) {
          for (let dx = -SCAN; dx <= SCAN; dx++) {
            const gx = cx + dx;
            const gy = cy + dy;
            if (gx < 1 || gx > W - 2 || gy < 1 || gy > H - 2) continue;

            // Project offset onto movement direction and its perpendicular
            const along =  dx * nx + dy * ny;
            const perp  = -dx * ny + dy * nx;

            const falloff = Math.exp(-(along * along) / sa2 - (perp * perp) / sp2);
            if (falloff < 0.01) continue;

            cur[gy * W + gx] += falloff * str;
          }
        }
      }

      // ── Wave propagation ──────────────────────────────────────────────
      for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
          const i = y * W + x;
          const v = (cur[i-1] + cur[i+1] + cur[i-W] + cur[i+W]) * 0.5 - prv[i];
          prv[i]  = v * DAMP;
        }
      }
      const tmp = prv; prv = cur; cur = tmp;

      // ── Render — prismatic shimmer ────────────────────────────────────
      for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
          const i  = y * W + x;
          const gx = (cur[i+1] - cur[i-1]) * 0.0006;
          const gy = (cur[i+W] - cur[i-W]) * 0.0006;
          const nz = 1.0;
          const nl = Math.sqrt(gx*gx + gy*gy + nz*nz);

          const diff     = Math.max((gx/nl)*0.19 + (gy/nl)*0.29 + (nz/nl)*0.94, 0);
          const spec     = Math.pow(diff, 64);
          const presence = Math.min(Math.abs(cur[i]) / 110, 1.0);
          const lum      = (spec * 0.50 + diff * 0.05) * presence;

          // Hue from gradient angle → prismatic rainbow
          const angle = Math.atan2(gx, gy);
          const h6    = ((angle / Math.PI) + 1) * 3;
          const hi    = h6 | 0;
          const f     = h6 - hi;
          let r, g, b;
          switch (hi % 6) {
            case 0: r=1;   g=f;   b=0;   break;
            case 1: r=1-f; g=1;   b=0;   break;
            case 2: r=0;   g=1;   b=f;   break;
            case 3: r=0;   g=1-f; b=1;   break;
            case 4: r=f;   g=0;   b=1;   break;
            default:r=1;   g=0;   b=1-f; break;
          }

          // Desaturate 30% toward white — airy, not garish
          const s = 0.70, w = 0.30;
          r = r * s + w;
          g = g * s + w;
          b = b * s + w;

          const idx   = i * 4;
          px[idx]     = (r * 255) | 0;
          px[idx + 1] = (g * 255) | 0;
          px[idx + 2] = (b * 255) | 0;
          px[idx + 3] = (Math.min(lum, 1.0) * 175) | 0;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      raf = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[10000] hidden h-full w-full md:block"
      style={{ opacity: 0, mixBlendMode: "screen" }}
    />
  );
}
