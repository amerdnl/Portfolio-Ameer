"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Reveal toolkit
 *
 *   RevealText  — line-mask split-text reveal (bidirectional toggle).
 *   RevealBlock — fade + rise for text blocks (bidirectional toggle).
 *   RevealSide  — *scrub-tied* directional slide for images. Three
 *                 phases inside one timeline (enter → hold → exit) so
 *                 the image stays fully visible while it's in the
 *                 viewer's reading zone and only animates out when the
 *                 user intentionally scrolls past.
 *   ImageReveal — one-way clip-mask + scale reveal. Once a frame is
 *                 lifted it stays lifted (no more blank placeholders).
 */

const TOGGLE = "play reverse play reverse";

/* ─────────────────────────────────────────────────────────────────── */
/* RevealText                                                          */
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
/* RevealBlock                                                         */
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
/* RevealSide — scrub-tied "in → hold → out" timeline for images       */
/*                                                                     */
/* The full passage from "image enters viewport" → "image leaves       */
/* viewport" is mapped to one GSAP timeline with three phases:         */
/*                                                                     */
/*   ┌───── enterPct ─────┬────── hold ──────┬───── exitPct ──────┐    */
/*   │ slide in from side │ stable, visible  │ slide back to side │    */
/*   └────────────────────┴──────────────────┴────────────────────┘    */
/*                                                                     */
/* `scrub` ties timeline progress to scroll progress so the animation  */
/* pauses exactly when the user pauses, plays forward as they scroll   */
/* down, and reverses as they scroll up — a true physical link.        */
/* ─────────────────────────────────────────────────────────────────── */
export function RevealSide({
  children,
  className,
  side       = "left",       // "left" | "right"
  distance   = 140,          // px the element travels off-screen
  start      = "top 95%",    // begin animating slightly before entry
  end        = "bottom 5%",  // finish slightly after exit
  scrub      = 1.2,          // smoothing — higher = silkier lag
  enterPct   = 0.22,         // 0–22 % of timeline = enter phase
  exitPct    = 0.78,         // 78–100 % of timeline = exit phase
}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const ctx = gsap.context(() => {
      const fromX = side === "left" ? -distance : distance;

      // Three-phase timeline; durations are relative because the
      // timeline progress is driven entirely by scroll position.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: node,
          start,
          end,
          scrub,
          invalidateOnRefresh: true,
        },
      });

      // 1 — Enter from the side
      tl.fromTo(
        node,
        { x: fromX, opacity: 0 },
        { x: 0, opacity: 1, duration: enterPct, ease: "power2.out" },
        0
      );

      // 2 — Hold completely still while the image is in the viewer's
      // reading zone. A long, motion-free middle gives the audience
      // time to take the photograph in.
      tl.to(node, {
        x: 0,
        opacity: 1,
        duration: exitPct - enterPct,
      }, enterPct);

      // 3 — Exit back to the same side the element entered from
      tl.to(node, {
        x: fromX,
        opacity: 0,
        duration: 1 - exitPct,
        ease: "power2.in",
      }, exitPct);
    }, ref);

    return () => ctx.revert();
  }, [side, distance, start, end, scrub, enterPct, exitPct]);

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
/* ImageReveal — one-way clip-mask reveal                              */
/*                                                                     */
/* The dark curtain lifts the first time the frame enters view and    */
/* never returns. Prevents the "blank bordered placeholder" flash you  */
/* used to get when a parent re-triggered the mask after sticky pin.   */
/* ─────────────────────────────────────────────────────────────────── */
export function ImageReveal({
  children,
  className,
  start = "top 88%",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const st = ScrollTrigger.create({
      trigger: node,
      start,
      once: true,
      onEnter: () => node.classList.add("is-in"),
    });

    // Safety: if the element is already in view at mount (above the
    // fold or on a fast hard-refresh), reveal immediately.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      node.classList.add("is-in");
    }

    return () => st.kill();
  }, [start]);

  return (
    <div ref={ref} className={clsx("img-reveal", className)}>
      {children}
    </div>
  );
}
