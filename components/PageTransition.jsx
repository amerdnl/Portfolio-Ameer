"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * PageTransition — cinematic full-screen wipe between anchor jumps.
 *
 * Mirrors the LoadingScreen aesthetic:
 *   1. Single dark panel rises from below, covering the screen.
 *   2. Section name + accent line appear (same style as the intro wordmark).
 *   3. Scroll snaps to destination via Lenis instant-scroll (bypasses smooth lerp).
 *   4. Panel zoom-dissolves away — identical to the loading screen exit.
 *
 * Triggered by any component dispatching:
 *   window.dispatchEvent(new CustomEvent("page:transition", {
 *     detail: { id: "works", label: "Works" }
 *   }));
 */
export default function PageTransition() {
  const panelRef   = useRef(null);
  const labelRef   = useRef(null);
  const lineRef    = useRef(null);
  const runningRef = useRef(false);

  useEffect(() => {
    // Off-screen below — matches the inline style so no flash on first paint.
    gsap.set(panelRef.current,  { yPercent: 100 });
    gsap.set(labelRef.current,  { opacity: 0, y: 28 });
    gsap.set(lineRef.current,   { scaleX: 0, opacity: 0 });

    const handler = (e) => {
      if (runningRef.current) return;
      runningRef.current = true;

      const id    = e.detail?.id    ?? "top";
      const label = e.detail?.label ?? "";
      if (labelRef.current) labelRef.current.textContent = label;

      const tl = gsap.timeline({
        onComplete: () => { runningRef.current = false; },
      });

      // 1 — Panel rises immediately (power4.out = fast start, no perceived delay).
      //     expo.inOut was the culprit: its slow "in" phase made the panel
      //     barely move for the first ~200 ms after the click.
      tl.to(panelRef.current, {
        yPercent: 0,
        duration: 0.48,
        ease: "power4.out",
      });

      // 2 — Label + accent line rise in while panel is still settling
      tl.to(labelRef.current, {
        opacity: 1, y: 0,
        duration: 0.38, ease: "power2.out",
      }, "-=0.18");

      tl.fromTo(lineRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.4, ease: "power3.out" },
        "<"
      );

      // 3 — Snap to destination while hidden behind the panel.
      // Lenis's immediate scroll prevents the smooth-lerp from fighting the
      // jump; falls back to window.scrollTo if Lenis isn't ready yet.
      tl.add(() => {
        const el = document.getElementById(id);
        const y  = el
          ? Math.round(el.getBoundingClientRect().top + window.scrollY)
          : 0;
        const lenis = window["__lenis"];
        if (lenis) {
          lenis.scrollTo(y, { immediate: true, force: true });
        } else {
          window.scrollTo({ top: y, behavior: "instant" });
        }
      });

      // 4 — Hold so the label is readable
      tl.to({}, { duration: 0.2 });

      // 5 — Label + line fade out
      tl.to([labelRef.current, lineRef.current], {
        opacity: 0,
        duration: 0.22, ease: "power2.in",
      });

      // 6 — Panel zoom-dissolves — mirrors the loading screen exit
      tl.to(panelRef.current, {
        scale: 1.1, opacity: 0,
        duration: 0.72, ease: "power2.in",
      }, "-=0.06");

      // 7 — Reset for next use
      tl.set(panelRef.current, { yPercent: 100, scale: 1, opacity: 1 });
      tl.set(labelRef.current,  { opacity: 0, y: 28 });
      tl.set(lineRef.current,   { scaleX: 0, opacity: 0 });
    };

    window.addEventListener("page:transition", handler);
    return () => window.removeEventListener("page:transition", handler);
  }, []);

  return (
    <div
      ref={panelRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9000] flex flex-col items-center justify-center gap-5 bg-ink-900"
      style={{ transform: "translateY(100%)" }}
    >
      {/* Accent line — matches the loading screen hairline */}
      <div
        ref={lineRef}
        className="h-px w-16 origin-center bg-accent"
        style={{ opacity: 0 }}
      />

      {/* Section name — same typeface and sizing as the intro wordmark */}
      <span
        ref={labelRef}
        className="font-display lowercase italic leading-[0.85] tracking-tightest text-ink-0"
        style={{ fontSize: "clamp(2.8rem, 9vw, 8rem)", opacity: 0 }}
      />
    </div>
  );
}
