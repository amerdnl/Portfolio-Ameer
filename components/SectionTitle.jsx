"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * SectionTitle — oversized chapter heading that drifts horizontally as
 * the user scrolls through the section. Direction is scrub-tied to the
 * scroll position, so it animates symmetrically when scrolling either way.
 *
 * Props:
 *   children   — the title text (e.g. "SELECTED")
 *   from       — "left" | "right" — entry side
 *   variant    — "outline" | "fill" — visual style
 */
export default function SectionTitle({
  children,
  from = "left",
  variant = "outline",
}) {
  const wrapRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const text = textRef.current;
    if (!wrap || !text) return;

    const ctx = gsap.context(() => {
      // Start fully off-screen on the chosen side and drift toward the
      // opposite side as the user scrolls through the section.
      const startX = from === "left" ? "-55vw" : "55vw";
      const endX   = from === "left" ?  "15vw" : "-15vw";

      gsap.fromTo(
        text,
        { x: startX },
        {
          x: endX,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }
      );
    }, wrap);

    return () => ctx.revert();
  }, [from]);

  const styleFill =
    variant === "outline"
      ? {
          color: "transparent",
          WebkitTextStroke: "1px rgba(199,168,120,0.32)",
        }
      : {
          color: "rgba(246,245,241,0.05)",
        };

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none relative my-8 w-full select-none overflow-hidden md:my-14"
    >
      <div
        ref={textRef}
        className="font-display whitespace-nowrap leading-[0.82] tracking-tightest will-change-transform"
        style={{
          fontSize: "clamp(6rem, 22vw, 22rem)",
          ...styleFill,
        }}
      >
        {children}
      </div>
    </div>
  );
}
