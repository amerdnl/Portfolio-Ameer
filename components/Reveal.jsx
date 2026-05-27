"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Shared ScrollTrigger config so every reveal animates both directions —
 * play when entering on the way down, reverse when leaving going down,
 * play again when scrolling back up into view, reverse on leave-back.
 */
const TOGGLE = "play reverse play reverse";

/* ─────────────────────────────────────────────────────────────────── */
/* RevealText — line-mask split with bidirectional GSAP timeline       */
/* ─────────────────────────────────────────────────────────────────── */
export function RevealText({
  as: Tag = "h2",
  lines,
  children,
  className,
  delay = 0,
  stagger = 0.09,
  start = "top 85%",
  end   = "top 25%",
}) {
  const ref = useRef(null);
  const items =
    lines ?? (typeof children === "string" ? [children] : [children]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const spans = node.querySelectorAll(".line-mask > span");

    const ctx = gsap.context(() => {
      gsap.set(spans, { yPercent: 110 });
      gsap.to(spans, {
        yPercent: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger,
        delay,
        scrollTrigger: {
          trigger: node,
          start,
          end,
          toggleActions: TOGGLE,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [delay, stagger, start, end]);

  return (
    <Tag ref={ref} className={className}>
      {items.map((line, i) => (
        <span className="line-mask" key={i}>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* RevealBlock — fade + rise that reverses on scroll-out               */
/* ─────────────────────────────────────────────────────────────────── */
export function RevealBlock({
  children,
  className,
  delay = 0,
  start = "top 85%",
  end   = "top 25%",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const ctx = gsap.context(() => {
      gsap.set(node, { y: 28, opacity: 0 });
      gsap.to(node, {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: "expo.out",
        delay,
        scrollTrigger: {
          trigger: node,
          start,
          end,
          toggleActions: TOGGLE,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [delay, start, end]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* RevealSide — horizontal slide in/out tied to scroll direction       */
/*                                                                     */
/* Images on the left animate in from the left when scrolling down     */
/* and exit back to the left on scroll-up. Right-side elements mirror  */
/* this. Done with a bidirectional ScrollTrigger so the motion always  */
/* matches the user's scroll gesture.                                  */
/* ─────────────────────────────────────────────────────────────────── */
export function RevealSide({
  children,
  className,
  side = "left",        // "left" | "right"
  distance = 90,        // px of off-screen offset
  delay = 0,
  duration = 1.4,
  start = "top 90%",
  end   = "top 28%",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const ctx = gsap.context(() => {
      const fromX = side === "left" ? -distance : distance;
      gsap.set(node, { x: fromX, opacity: 0 });
      gsap.to(node, {
        x: 0,
        opacity: 1,
        duration,
        ease: "expo.out",
        delay,
        scrollTrigger: {
          trigger: node,
          start,
          end,
          toggleActions: TOGGLE,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [side, distance, delay, duration, start, end]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* ImageReveal — clip-mask + inner-scale, bidirectional via class flip */
/* ─────────────────────────────────────────────────────────────────── */
export function ImageReveal({
  children,
  className,
  start = "top 85%",
  end   = "top 30%",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const st = ScrollTrigger.create({
      trigger: node,
      start,
      end,
      onEnter:     () => node.classList.add("is-in"),
      onEnterBack: () => node.classList.add("is-in"),
      onLeave:     () => node.classList.remove("is-in"),
      onLeaveBack: () => node.classList.remove("is-in"),
    });

    return () => st.kill();
  }, [start, end]);

  return (
    <div ref={ref} className={clsx("img-reveal", className)}>
      {children}
    </div>
  );
}
