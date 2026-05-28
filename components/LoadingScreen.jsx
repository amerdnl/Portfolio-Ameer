"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const WORD = "northofamer";

export default function LoadingScreen() {
  const panelRef  = useRef(null);
  const lineRef   = useRef(null);
  const promptRef = useRef(null);
  const exitRef   = useRef(null); // stores the exit function so click can call it
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    gsap.set(".site-content", { scale: 0.93, filter: "blur(12px)" });

    // Hide chars immediately so they're never visible before the intro plays.
    // Without this, a fast tap finds chars at yPercent:0 (natural CSS state)
    // and the exit has to slide all 12 through the full stagger (0.88 s) —
    // the "font stuck" feeling. Starting at 115 means the exit is a no-op
    // and the panel dissolves cleanly regardless of tap timing.
    gsap.set(".ldr-char", { yPercent: 115 });

    // intro is declared here so runExit can kill it via closure regardless
    // of whether it has started yet (null-safe: if (intro) intro.kill()).
    let intro  = null;
    let exited = false; // guards fonts.ready from starting intro after tap

    // ── Exit function (triggered by click) ───────────────────────────────
    const runExit = () => {
      exited = true;
      // Kill intro so chars don't fight two competing animations when the
      // user taps before the wordmark has fully settled.
      if (intro) intro.kill();

      // Snap to top before the transition so the site always reveals from the hero.
      window.scrollTo({ top: 0, behavior: "instant" });

      // Dispatch so Hero can start + unmute the video (user gesture captured).
      window.dispatchEvent(new CustomEvent("loader:unmute"));

      const exit = gsap.timeline({
        onComplete: () => {
          // Clear both transform *and* filter — leaving scale:1 as an inline
          // GSAP style creates a containing block that breaks position:fixed.
          gsap.set(".site-content", { clearProps: "transform,filter" });
          document.body.style.overflow = "";
          setGone(true);
          // ScrollTrigger calculated positions at scale:0.93 — refresh so all
          // scroll animations hit the correct pixel offsets after layout settles.
          window.dispatchEvent(new Event("resize"));
        },
      });

      // Prompt fades out quickly
      exit.to(promptRef.current, { opacity: 0, duration: 0.25, ease: "power2.in" });

      // Letters fall away from wherever they currently are (handles early tap)
      exit.to(".ldr-char", {
        yPercent: 115,
        duration: 0.55,
        ease: "power3.in",
        stagger: { each: 0.03, from: "end" },
      }, "<");

      // Panel zooms out and dissolves
      exit.to(
        panelRef.current,
        { scale: 1.18, opacity: 0, duration: 1.0, ease: "power2.in" },
        "-=0.1"
      );

      // Site content zooms in and resolves — always from the known initial state
      // so a mid-intro tap doesn't start from a partially-interpolated position.
      exit.fromTo(
        ".site-content",
        { scale: 0.93, opacity: 0, filter: "blur(12px)" },
        { scale: 1,    opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power2.out" },
        "<"
      );
    };

    exitRef.current = runExit;

    // ── Intro timeline — deferred until Fraunces is ready ────────────────
    // display:"swap" in the font config means the browser may paint the
    // first frame in the fallback serif before the custom font arrives.
    // Waiting for document.fonts.ready ensures the wordmark animates in
    // with the correct typeface from the very first frame.
    document.fonts.ready.then(() => {
      // Guard against fast tap (exited) or unmount before fonts resolved.
      if (exited || !panelRef.current) return;

      intro = gsap.timeline();

      intro.fromTo(
        ".ldr-char",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1.0,
          ease: "power4.out",
          stagger: { each: 0.05, from: "start" },
        },
        0.15
      );

      intro.fromTo(
        lineRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.7, ease: "power3.inOut" },
        0.6
      );

      intro.fromTo(
        promptRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "+=0.25"
      );
    });

    return () => {
      document.body.style.overflow = "";
      if (intro) intro.kill();
    };
  }, []);

  const handleClick = () => {
    if (exitRef.current) {
      exitRef.current();
      exitRef.current = null; // prevent double-trigger
    }
  };

  if (gone) return null;

  return (
    <div
      ref={panelRef}
      onClick={handleClick}
      className="fixed inset-0 z-[9999] flex cursor-pointer flex-col items-center justify-center bg-ink-900"
    >
      {/* Wordmark */}
      <div className="flex items-end">
        {WORD.split("").map((char, i) => (
          <div key={i} className="overflow-hidden">
            <span
              className="ldr-char inline-block font-display lowercase leading-[0.85] tracking-tightest text-ink-0"
              style={{ fontSize: "clamp(2.8rem, 9vw, 8rem)" }}
            >
              {char}
            </span>
          </div>
        ))}
        <div className="overflow-hidden">
          <span
            className="ldr-char inline-block font-display lowercase italic leading-[0.85] tracking-tightest text-accent"
            style={{ fontSize: "clamp(2.8rem, 9vw, 8rem)" }}
          >
            .
          </span>
        </div>
      </div>

      {/* Accent line */}
      <div
        ref={lineRef}
        className="mt-6 h-px w-40 origin-center bg-accent opacity-0"
      />

      {/* Tap-to-enter prompt */}
      <p
        ref={promptRef}
        className="mt-10 text-[11px] uppercase tracking-[0.35em] text-ink-100 opacity-0"
      >
        tap anywhere to enter
      </p>
    </div>
  );
}
