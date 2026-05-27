"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const RINGS   = 3;
const STAGGER = 0.85; // seconds between each ring's birth

export default function HeroCursor() {
  const wrapRef  = useRef(null);
  const ringsRef = useRef([]);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const wrap  = wrapRef.current;
    const rings = ringsRef.current;
    if (!wrap) return;

    let mx = window.innerWidth  / 2;
    let my = window.innerHeight / 2;
    let cx = mx, cy = my;
    let raf;

    gsap.set(wrap, { xPercent: -50, yPercent: -50, opacity: 0 });

    // Each ring: born small + visible → grows large + invisible, loops forever
    rings.forEach((ring, i) => {
      gsap.timeline({ repeat: -1, delay: i * STAGGER })
        .fromTo(
          ring,
          { scale: 0.08, opacity: 0.65 },
          { scale: 4.2, opacity: 0, duration: 2.6, ease: "power2.out" }
        );
    });

    // Follow cursor — medium lerp so the origin drifts smoothly
    const tick = () => {
      cx += (mx - cx) * 0.11;
      cy += (my - cy) * 0.11;
      gsap.set(wrap, { x: cx, y: cy });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e) => { mx = e.clientX; my = e.clientY; };

    const hero    = document.getElementById("top");
    const onEnter = () =>
      gsap.to(wrap, { opacity: 1, duration: 0.7, ease: "power2.out" });
    const onLeave = () =>
      gsap.to(wrap, { opacity: 0, duration: 0.45, ease: "power2.in" });

    window.addEventListener("mousemove", onMove);
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
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
      style={{ width: 44, height: 44 }}
    >
      {/* Concentric expanding rings */}
      {Array.from({ length: RINGS }, (_, i) => (
        <div
          key={i}
          ref={(el) => { ringsRef.current[i] = el; }}
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px solid rgba(199,168,120,0.55)",
            transformOrigin: "center",
          }}
        />
      ))}

      {/* Steady centre dot */}
      <div className="absolute left-1/2 top-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_6px_2px_rgba(199,168,120,0.5)]" />
    </div>
  );
}
