"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const mediaRef   = useRef(null);
  const overlayRef = useRef(null);
  const videoRef   = useRef(null);
  // Mirrors muted state without causing re-renders inside scroll callbacks
  const mutedRef     = useRef(true);
  // True while the initial volume ramp-up is in progress — suppresses the
  // ScrollTrigger volume override so it can't jump to 1 before the tween fires.
  const isRampingRef = useRef(false);

  const [muted,        setMuted]        = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    if (!next) v.volume = 1;
    mutedRef.current = next;
    setMuted(next);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = sectionRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch { /* permissions or user-gesture issue */ }
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // Triggered by the loading-screen tap (the required browser gesture).
  // Starts the video, fades the media container in, and slowly ramps volume
  // from 0 → 1 so there's no jarring audio surprise.
  useEffect(() => {
    const onUnmute = () => {
      const v = videoRef.current;
      if (!v) return;

      // Fade the media container in from black.
      gsap.fromTo(
        mediaRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2.2, ease: "power2.inOut", delay: 0.2 }
      );

      // Start silent, then ramp up.
      // isRampingRef suppresses the ScrollTrigger onUpdate while the tween
      // is running so it can't race-override volume back to 1 at progress=0.
      v.volume = 0;
      v.muted  = false;
      mutedRef.current  = false;
      isRampingRef.current = true;
      setMuted(false);

      v.play().then(() => {
        gsap.to(v, {
          volume: 1,
          duration: 2.0,
          delay: 0.6,
          ease: "power1.inOut",
          onComplete: () => { isRampingRef.current = false; },
        });
      }).catch(() => {
        // Browser still blocked audio — fall back to muted autoplay.
        isRampingRef.current = false;
        v.muted = true;
        mutedRef.current = true;
        setMuted(true);
        v.play().catch(() => {});
      });
    };
    window.addEventListener("loader:unmute", onUnmute);
    return () => window.removeEventListener("loader:unmute", onUnmute);
  }, []);

  // Exit fullscreen on scroll-down so the audience can continue browsing
  useEffect(() => {
    const onWheel = (e) => {
      if (document.fullscreenElement && e.deltaY > 0) {
        document.exitFullscreen?.();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const ctx = gsap.context(() => {
      // Parallax drift
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

      // Dark overlay deepens as hero exits
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

      // Video fades out as user scrolls down, fades back in scrolling up.
      // Applied to videoRef only (not mediaRef) so the overlay stays visible.
      gsap.to(video, {
        opacity: 0,
        ease:    "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   "top top",
          end:     "bottom top",
          scrub:   true,
        },
      });

      // Audio volume fades out as hero leaves, back in on return.
      // Only active when the viewer has explicitly unmuted.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top top",
        end:     "bottom top",
        onUpdate: (self) => {
          if (!mutedRef.current && !isRampingRef.current && videoRef.current) {
            videoRef.current.volume = Math.max(0, 1 - self.progress);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="hero-section relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink-900"
    >
      {/* Background media */}
      <div ref={mediaRef} className="absolute inset-0 z-0 will-change-transform" style={{ opacity: 0 }}>
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted={muted}
          loop
          playsInline
          preload="auto"
          poster="/hero.jpg"
        >
          <source src="https://res.cloudinary.com/dk3pkt2wb/video/upload/v1779974124/afiq-steve-web_nxkj0e.mp4" type="video/mp4" />
        </video>
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-b from-ink-900/25 via-ink-900/15 to-ink-900/70"
        />
      </div>

      {/* Controls — mute + fullscreen */}
      <div className="hero-controls absolute right-6 top-6 z-20 flex items-center gap-2 md:right-10 md:top-8">
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute reel audio" : "Mute reel audio"}
          aria-pressed={!muted}
          data-cursor="hover"
          className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-0/20 bg-ink-900/30 text-ink-0 backdrop-blur-md transition-all duration-500 hover:border-accent hover:bg-ink-900/50 md:h-11 md:w-11"
        >
          {muted ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M11 5 6 9H3v6h3l5 4z" />
              <line x1="22" y1="9" x2="16" y2="15" />
              <line x1="16" y1="9" x2="22" y2="15" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M11 5 6 9H3v6h3l5 4z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 5.5a9 9 0 0 1 0 13" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          aria-pressed={isFullscreen}
          data-cursor="hover"
          className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-0/20 bg-ink-900/30 text-ink-0 backdrop-blur-md transition-all duration-500 hover:border-accent hover:bg-ink-900/50 md:h-11 md:w-11"
        >
          {isFullscreen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M9 3v4a2 2 0 0 1-2 2H3" />
              <path d="M15 3v4a2 2 0 0 0 2 2h4" />
              <path d="M9 21v-4a2 2 0 0 0-2-2H3" />
              <path d="M15 21v-4a2 2 0 0 1 2-2h4" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M3 9V5a2 2 0 0 1 2-2h4" />
              <path d="M21 9V5a2 2 0 0 0-2-2h-4" />
              <path d="M3 15v4a2 2 0 0 0 2 2h4" />
              <path d="M21 15v4a2 2 0 0 1-2 2h-4" />
            </svg>
          )}
        </button>
      </div>

      {/* Foreground — headline + bottom row. Fades out in fullscreen so
          the viewer watches the reel unobstructed, fades back on exit. */}
      <div className={`hero-foreground relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end gap-14 px-6 pb-12 transition-opacity duration-[1200ms] ease-in-out md:gap-20 md:px-10 md:pb-16 ${isFullscreen ? "opacity-0" : "opacity-100"}`}>
        <div className="relative">
          <div className="soft-glow absolute -inset-x-10 -inset-y-20 -z-10 blur-3xl" />
          <h1 className="font-display leading-[0.86] tracking-tightest text-ink-0">
            <span className="block text-[clamp(3.5rem,12vw,12.5rem)]">Quiet</span>
            <span className="block translate-x-[6vw] text-[clamp(3.5rem,12vw,12.5rem)] italic">frames,</span>
            <span className="block text-[clamp(3.5rem,12vw,12.5rem)]">loud stories.</span>
          </h1>
        </div>

        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <p className="max-w-md text-sm leading-relaxed text-ink-50/85 md:text-base">
            A photography and videography practice based in Shah Alam, crafting
            cinematic stills and films for brands that prefer atmosphere to noise.
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

        /* Fullscreen: force the section to fill the screen properly
           and ensure all content layers remain visible above the backdrop */
        .hero-section:fullscreen,
        .hero-section:-webkit-full-screen {
          height: 100vh !important;
          width: 100vw !important;
          overflow: visible !important;
        }
        .hero-section:fullscreen .hero-controls,
        .hero-section:-webkit-full-screen .hero-controls {
          z-index: 2147483647 !important;
        }
      `}</style>
    </section>
  );
}
