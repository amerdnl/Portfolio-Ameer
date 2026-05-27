"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Hero — fullscreen cinematic intro.
 *
 * Stripped of all top-meta chrome so the first thing the viewer sees
 * is the photograph, the liquid fluid wake, and the headline. The
 * Nav is hidden on this screen and fades in only after the user
 * scrolls past the hero (see Nav.jsx).
 */
export default function Hero() {
  const sectionRef = useRef(null);
  const mediaRef   = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax media — subtle drift downward as user scrolls past
      gsap.to(mediaRef.current, {
        yPercent: 25,
        scale:    1.08,
        ease:     "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   "top top",
          end:     "bottom top",
          scrub:   true,
        },
      });
      // Overlay deepens as hero exits so the next section reads cleanly
      gsap.to(overlayRef.current, {
        opacity: 0.65,
        ease:    "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   "top top",
          end:     "bottom top",
          scrub:   true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink-900"
    >
      {/* Background media */}
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero.jpg"
        >
          {/* Drop your reel in /public/hero.mp4 to use a real loop. */}
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        {/* Lighter overlay than before — lets the liquid wake glow through */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-b from-ink-900/25 via-ink-900/15 to-ink-900/70"
        />
      </div>

      {/* Foreground — only the headline + bottom row remain. No top
          meta. The fluid wake is the visible interaction layer. */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end gap-14 px-6 pb-12 md:gap-20 md:px-10 md:pb-16">

        {/* Hero headline */}
        <div className="relative">
          <div className="soft-glow absolute -inset-x-10 -inset-y-20 -z-10 blur-3xl" />
          <h1 className="font-display leading-[0.86] tracking-tightest text-ink-0">
            <span className="block text-[clamp(3.5rem,12vw,12.5rem)]">
              Quiet
            </span>
            <span className="block translate-x-[6vw] text-[clamp(3.5rem,12vw,12.5rem)] italic">
              frames,
            </span>
            <span className="block text-[clamp(3.5rem,12vw,12.5rem)]">
              loud stories.
            </span>
          </h1>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <p className="max-w-md text-sm leading-relaxed text-ink-50/85 md:text-base">
            A photography and direction practice based in Shah Alam, crafting
            cinematic imagery for brands that prefer atmosphere to noise.
          </p>

          <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.32em] text-ink-50/70">
            <span className="hidden md:inline">Scroll</span>
            <span className="relative inline-block h-12 w-px overflow-hidden bg-ink-0/15">
              <span className="absolute left-0 top-0 block h-1/2 w-px animate-[scrollline_2.6s_ease-in-out_infinite] bg-accent" />
            </span>
            <span>01 — 06</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollline {
          0%   { transform: translateY(-100%); }
          60%  { transform: translateY(100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </section>
  );
}
