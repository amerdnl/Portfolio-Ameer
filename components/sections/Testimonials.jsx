"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TESTIMONIALS } from "@/lib/data";
import { RevealText } from "@/components/Reveal";

export default function Testimonials() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      // Compute distance to translate so the last card aligns to viewport right
      const getDistance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth + 64);

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + getDistance(),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="voices"
      ref={sectionRef}
      className="relative h-[100svh] overflow-hidden bg-ink-800"
    >
      {/* Sticky header strip */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 mx-auto flex max-w-[1600px] items-center justify-between px-6 pt-28 md:px-10 md:pt-32">
        <div>
          <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-accent">
            ⟶ &nbsp; 04 &nbsp;/ &nbsp; Voices
          </p>
          <RevealText
            as="h2"
            lines={["What people", "say after."]}
            className="font-display text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[0.95] tracking-tighter text-ink-0"
          />
        </div>
        <div className="hidden text-right text-[11px] uppercase tracking-[0.28em] text-ink-100 md:block">
          <p>Drag · Scroll</p>
          <p className="mt-1">{`01 / 0${TESTIMONIALS.length}`}</p>
        </div>
      </div>

      {/* Horizontal track */}
      <div className="absolute inset-0 flex items-center">
        <div
          ref={trackRef}
          className="flex gap-8 pl-6 pr-[20vw] will-change-transform md:gap-14 md:pl-10"
        >
          {TESTIMONIALS.map((t, i) => (
            <article
              key={t.id}
              className="group relative flex w-[85vw] shrink-0 flex-col justify-between border border-ink-0/10 bg-ink-900/60 p-8 backdrop-blur-sm transition-colors duration-700 hover:border-accent/40 md:w-[640px] md:p-12"
              style={{ minHeight: "min(60vh, 460px)" }}
            >
              <div>
                <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-ink-100">
                  <span className="numeral text-accent">{`0${i + 1}`}</span>
                  <span className="h-px w-10 bg-ink-0/20" />
                  <span>Client Letter</span>
                </div>
                <p className="mt-10 font-display text-[clamp(1.5rem,2.3vw,2.1rem)] leading-[1.25] tracking-tight text-ink-0">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="mt-10 flex items-end justify-between">
                <div>
                  <p className="text-[13px] uppercase tracking-[0.26em] text-ink-0">
                    {t.author}
                  </p>
                  <p className="mt-1 text-[12px] tracking-wide text-ink-100">
                    {t.role}
                  </p>
                </div>
                <span className="h-px w-12 bg-accent transition-all duration-700 group-hover:w-24" />
              </div>
            </article>
          ))}
          {/* Tail card — closing note */}
          <div className="flex w-[60vw] shrink-0 flex-col items-start justify-center md:w-[420px]">
            <p className="text-[11px] uppercase tracking-[0.32em] text-ink-100">
              End of voices
            </p>
            <p className="mt-4 max-w-xs text-ink-50/85">
              The studio has worked with a small, considered list of clients
              since 2019.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto flex max-w-[1600px] items-center justify-between px-6 pb-8 text-[11px] uppercase tracking-[0.28em] text-ink-100 md:px-10">
        <span>Scroll to advance →</span>
        <span className="hidden md:inline">Pinned section</span>
      </div>
    </section>
  );
}
