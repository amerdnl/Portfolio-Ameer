"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);   // large ambient blob

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;

    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX, ringY = mouseY;
    let glowX  = mouseX, glowY = mouseY;
    let wasInHero = false;

    gsap.set([dot, ring, glow], { xPercent: -50, yPercent: -50 });

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.15, ease: "power3.out" });
    };

    const inHero = () => {
      const h = document.getElementById("top");
      if (!h) return false;
      const r = h.getBoundingClientRect();
      return mouseX >= r.left && mouseX <= r.right &&
             mouseY >= r.top  && mouseY <= r.bottom;
    };

    let raf;
    const tick = () => {
      // Ring – medium lerp
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(ring, { x: ringX, y: ringY });

      // Ambient glow – very slow, cinematic trail
      glowX += (mouseX - glowX) * 0.038;
      glowY += (mouseY - glowY) * 0.038;
      gsap.set(glow, { x: glowX, y: glowY });

      // Hide ring + dot inside hero (viewfinder cursor takes over)
      const nowInHero = inHero();
      if (nowInHero !== wasInHero) {
        wasInHero = nowInHero;
        gsap.to([ring, dot], {
          opacity: nowInHero ? 0 : 1,
          scale:   nowInHero ? 0.4 : 1,
          duration: 0.4,
          ease: "power2.inOut",
        });
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const enterables = () =>
      document.querySelectorAll("a, button, [data-cursor='hover'], input, textarea");

    const enter = () => {
      gsap.to(ring, { scale: 2.2, opacity: 0.35, duration: 0.4, ease: "power3.out" });
      gsap.to(dot,  { scale: 0,   duration: 0.3, ease: "power3.out" });
      // Glow flares up on interactive elements
      gsap.to(glow, { opacity: 1, scale: 1.25, duration: 0.8, ease: "power3.out" });
    };
    const leave = () => {
      gsap.to(ring, { scale: 1, opacity: 1,   duration: 0.4, ease: "power3.out" });
      gsap.to(dot,  { scale: 1, duration: 0.3, ease: "power3.out" });
      gsap.to(glow, { opacity: 0.7, scale: 1, duration: 0.8, ease: "power3.out" });
    };

    window.addEventListener("mousemove", onMove);

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
      {/* ── Ambient cinematic glow ── */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[4] hidden md:block"
        style={{
          width: 780,
          height: 780,
          borderRadius: "50%",
          opacity: 0.7,
          background:
            "radial-gradient(circle at center, rgba(199,168,120,0.13) 0%, rgba(199,168,120,0.05) 38%, transparent 68%)",
          filter: "blur(48px)",
          mixBlendMode: "screen",
          willChange: "transform",
        }}
      />

      {/* ── Precision ring ── */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-9 w-9 rounded-full border border-ink-0/50 mix-blend-difference md:block"
      />

      {/* ── Dot ── */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-[6px] w-[6px] rounded-full bg-ink-0 mix-blend-difference md:block"
      />
    </>
  );
}
