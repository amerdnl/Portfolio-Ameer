"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * PageTransition — cinematic fullscreen wipe used between
 * navigation/anchor jumps (Home, Works, About, Process, Contact).
 *
 * Wire-up:
 *   • Any component dispatches a global event:
 *       window.dispatchEvent(new CustomEvent("page:transition", {
 *         detail: { id: "works", label: "Selected" }
 *       }));
 *   • This component listens, runs the curtain timeline, and inside
 *     the held middle frame snaps the document to the target anchor
 *     (so the new section is already in place when the curtain lifts).
 *
 * Visual recipe:
 *   • 5 vertical panels rise from below to cover the screen with a
 *     soft stagger and a subtle filter-blur, fading a chapter label
 *     in mid-transition. They then lift upward together, revealing
 *     the destination.
 *   • All animation is GSAP-driven for cinematic easing and timing.
 */

const PANELS = 5;

export default function PageTransition() {
  const overlayRef = useRef(null);
  const panelsRef  = useRef([]);
  const labelRef   = useRef(null);
  const lineRef    = useRef(null);
  const runningRef = useRef(false);

  useEffect(() => {
    // Set initial state — fully off-screen below
    gsap.set(panelsRef.current, { yPercent: 100 });
    gsap.set([labelRef.current, lineRef.current], { opacity: 0 });

    const handler = (e) => {
      if (runningRef.current) return;
      runningRef.current = true;

      const id    = e.detail?.id    ?? "top";
      const label = e.detail?.label ?? "";

      if (labelRef.current) labelRef.current.textContent = label;

      // Cinematic curtain timeline
      const tl = gsap.timeline({
        onComplete: () => { runningRef.current = false; },
      });

      // 1 — curtain rises from below
      tl.to(panelsRef.current, {
        yPercent: 0,
        duration: 0.85,
        ease: "expo.inOut",
        stagger: { each: 0.04, from: "start" },
      })
        // 2 — label + hairline fade in over the held curtain
        .to(labelRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        }, "-=0.35")
        .fromTo(lineRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.6, ease: "power3.out" },
          "<")
        // 3 — at peak, jump the document to the target instantly
        .add(() => {
          const el = document.getElementById(id);
          if (el) {
            // Bypass Lenis smooth — we're hidden behind the curtain
            const rect = el.getBoundingClientRect();
            const y = rect.top + window.scrollY - (id === "top" ? 0 : 0);
            window.scrollTo({ top: y, behavior: "instant" });
          }
        })
        // 4 — short hold so the label reads
        .to({}, { duration: 0.18 })
        // 5 — fade label + line back out
        .to([labelRef.current, lineRef.current], {
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
        })
        // 6 — curtain lifts upward, revealing the new section
        .to(panelsRef.current, {
          yPercent: -100,
          duration: 0.95,
          ease: "expo.inOut",
          stagger: { each: 0.045, from: "end" },
        }, "-=0.1")
        // 7 — reset for next run (off-screen below)
        .set(panelsRef.current, { yPercent: 100 });
    };

    window.addEventListener("page:transition", handler);
    return () => window.removeEventListener("page:transition", handler);
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[150]"
    >
      {/* Vertical curtain panels */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: PANELS }).map((_, i) => (
          <div
            key={i}
            ref={(el) => { panelsRef.current[i] = el; }}
            className="relative h-full flex-1 will-change-transform"
            style={{
              background:
                i === 0 || i === PANELS - 1
                  ? "linear-gradient(180deg, #050504 0%, #0a0a08 100%)"
                  : "linear-gradient(180deg, #0a0a08 0%, #050504 100%)",
            }}
          />
        ))}
      </div>

      {/* Center label — chapter name fades in mid-transition */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <span
            ref={lineRef}
            className="block h-px w-16 origin-left bg-accent"
            style={{ opacity: 0 }}
          />
          <span
            ref={labelRef}
            className="font-display text-[clamp(2.4rem,6vw,5rem)] italic tracking-tight text-ink-0"
            style={{ opacity: 0 }}
          />
        </div>
      </div>
    </div>
  );
}
