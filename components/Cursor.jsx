"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Cursor — minimal precision cursor.
 *
 * One small dot at the exact pointer position, one slightly-larger ring
 * that lerps softly behind it. The ring grows / fades on interactive
 * elements. No ambient blob — the LiquidBackground handles atmosphere.
 */
export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;

    let mx = window.innerWidth  / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      gsap.to(dot, { x: mx, y: my, duration: 0.12, ease: "power2.out" });
    };

    let raf;
    const tick = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      gsap.set(ring, { x: rx, y: ry });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const enterables = () =>
      document.querySelectorAll("a, button, [data-cursor='hover'], input, textarea");

    const enter = () => {
      gsap.to(ring, { scale: 1.8, opacity: 0.45, duration: 0.35, ease: "power2.out" });
      gsap.to(dot,  { scale: 0,   duration: 0.25, ease: "power2.out" });
    };
    const leave = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.to(dot,  { scale: 1, duration: 0.25, ease: "power2.out" });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    const els = enterables();
    els.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });
    const obs = new MutationObserver(() => {
      enterables().forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      els.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[120] hidden h-8 w-8 rounded-full border border-ink-0/55 mix-blend-difference md:block"
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[120] hidden h-[5px] w-[5px] rounded-full bg-ink-0 mix-blend-difference md:block"
      />
    </>
  );
}
