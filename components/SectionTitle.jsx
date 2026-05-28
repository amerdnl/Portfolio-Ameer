"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * SectionTitle — oversized centered chapter word.
 *
 * Centered both visually (text-center + inline-block) and structurally
 * across every breakpoint. The entrance is a *scrub-tied* three-phase
 * timeline so the title fades and rises into place as the user scrolls
 * the section into view, holds dead-still while they read, then drifts
 * back out as the section leaves — pausing the moment the user stops
 * scrolling. High `scrub` value gives the slow, premium Lusion pacing.
 *
 *   ┌───── enter ─────┬───── hold ─────┬───── exit ─────┐
 *   │ fade + rise +   │ dead-still     │ fade + drift   │
 *   │ subtle scale    │ centered       │ + slight scale │
 *   └─────────────────┴────────────────┴────────────────┘
 */
export default function SectionTitle({
  children,
  variant = "outline",     // "outline" | "fill"
  className = "",
}) {
  const wrapRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const text = textRef.current;
    if (!wrap || !text) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger:             wrap,
          start:               "top bottom",
          end:                 "bottom top",
          scrub:               2.4,           // very slow, premium
          invalidateOnRefresh: true,
        },
      });

      // 1 — Enter: rise + fade + soft scale-up
      tl.fromTo(
        text,
        { opacity: 0, y: 90, scale: 0.92 },
        { opacity: 1, y:  0, scale: 1,    duration: 0.32, ease: "power2.out" },
        0
      );

      // 2 — Hold completely still while it's in the reading zone
      tl.to(text, { opacity: 1, y: 0, scale: 1, duration: 0.36 }, 0.32);

      // 3 — Exit: gentle drift up + fade out + slight scale-down
      tl.to(
        text,
        { opacity: 0, y: -70, scale: 0.96, duration: 0.32, ease: "power2.in" },
        0.68
      );
    }, wrap);

    return () => ctx.revert();
  }, []);

  const styleFill =
    variant === "outline"
      ? {
          color:            "transparent",
          WebkitTextStroke: "1px rgba(199,168,120,0.38)",
        }
      : {
          color: "rgba(246,245,241,0.06)",
        };

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none relative my-8 w-full select-none overflow-hidden text-center md:my-10 ${className}`}
    >
      <span
        ref={textRef}
        className="font-display inline-block whitespace-nowrap leading-[0.82] tracking-tightest will-change-transform"
        style={{
          // Fits within viewport at every breakpoint — narrow enough
          // on phones to stay centered without overflow.
          fontSize: "clamp(3.5rem, 16vw, 16rem)",
          ...styleFill,
        }}
      >
        {children}
      </span>
    </div>
  );
}
