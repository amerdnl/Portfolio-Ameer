"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * LiquidCursor — Lusion-style metaball cursor for the hero section.
 *
 * Implementation:
 *   • A chain of N small circles, each lerping toward the cursor with a
 *     progressively slower spring. When the cursor sits still they all
 *     converge to a single blob; when it moves they spread into a tail.
 *   • An SVG `goo` filter (Gaussian blur + alpha-contrast color matrix)
 *     fuses neighbouring circles into one organic, liquid silhouette.
 *   • The whole layer uses `mix-blend-mode: screen` so the warm accent
 *     glow reads beautifully against the dark hero footage without
 *     covering it.
 *
 * Performance: GPU-only `translate3d` per frame, no React re-renders,
 * filter region clipped to viewport, hidden on touch devices.
 */

const NODE_COUNT = 10;

export default function LiquidCursor() {
  const wrapRef  = useRef(null);
  const nodesRef = useRef([]);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const wrap  = wrapRef.current;
    const nodes = nodesRef.current.filter(Boolean);
    if (!wrap || nodes.length === 0) return;

    // Each node has its own position + lerp speed
    const state = nodes.map((_, i) => ({
      x: window.innerWidth  / 2,
      y: window.innerHeight / 2,
      // Spring stiffness fades from snappy (head) to languid (tail)
      lerp: gsap.utils.mapRange(0, NODE_COUNT - 1, 0.28, 0.045, i),
    }));

    let mx = window.innerWidth  / 2;
    let my = window.innerHeight / 2;
    let raf;

    gsap.set(wrap, { opacity: 0 });

    const tick = () => {
      for (let i = 0; i < state.length; i++) {
        const s = state[i];
        s.x += (mx - s.x) * s.lerp;
        s.y += (my - s.y) * s.lerp;
        // Translate first, then center via -50%/-50% (in node CSS)
        nodes[i].style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const hero = document.getElementById("top");

    const onEnter = () =>
      gsap.to(wrap, { opacity: 1, duration: 0.9, ease: "power2.out" });
    const onLeave = () =>
      gsap.to(wrap, { opacity: 0, duration: 0.55, ease: "power2.in" });

    window.addEventListener("mousemove", onMove, { passive: true });
    hero?.addEventListener("mouseenter", onEnter);
    hero?.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      hero?.removeEventListener("mouseenter", onEnter);
      hero?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      {/* Goo filter — fuses neighbouring blurred circles into one shape */}
      <svg
        aria-hidden
        width="0"
        height="0"
        className="pointer-events-none absolute"
        style={{ position: "absolute" }}
      >
        <defs>
          <filter id="liquid-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="11" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 22 -11"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        ref={wrapRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] hidden md:block"
        style={{
          filter: "url(#liquid-goo)",
          mixBlendMode: "screen",
        }}
      >
        {Array.from({ length: NODE_COUNT }).map((_, i) => {
          // Head node largest, tail nodes smaller — emphasises the trail
          const size = 56 - i * 3.4;
          // Slight alpha falloff along the tail
          const alpha = 0.78 - i * 0.05;
          return (
            <div
              key={i}
              ref={(el) => {
                nodesRef.current[i] = el;
              }}
              className="absolute left-0 top-0 rounded-full"
              style={{
                width: size,
                height: size,
                marginLeft: -size / 2,
                marginTop:  -size / 2,
                background: `radial-gradient(circle at 35% 35%, rgba(217,180,137,${alpha}) 0%, rgba(199,168,120,${alpha * 0.7}) 55%, rgba(199,168,120,0) 100%)`,
                willChange: "transform",
              }}
            />
          );
        })}
      </div>
    </>
  );
}
