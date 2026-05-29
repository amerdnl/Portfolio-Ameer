"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { PROCESS, IMG_META } from "@/lib/data";
import { RevealText } from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import SectionTitle from "@/components/SectionTitle";

/**
 * Behind-the-scenes lineup.
 *
 * Constraint: nobody who appears in Works can appear here. The lineup is:
 *   1. DSC08556 — duo (green-hijab + plaid)  — unique pair
 *   2. DSC08576 — guitarist (black outfit)   — unique
 *
 * Works uses: 08449, 08692, 07688, 08380, 07356, 08687. No overlap.
 */
const BTS = [
  "/DSC08556.jpg",
  "/DSC08576.jpg",
];

export default function Process() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Step text — bidirectional rise/fade. End is held wide so the
      // text doesn't slide away while the user is still reading it.
      const steps = gsap.utils.toArray(".process-step");
      steps.forEach((step) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 84%",
              end:   "bottom 15%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });

      // BTS tiles — directional slide from/to right (right-column images).
      //
      // Toggle-based (not scrub) because the column is sticky
      // (md:sticky md:top-28): scrub progress advances relative to the
      // tile's *natural* DOM position, which passes the viewport while
      // the tile is still pinned in view — causing it to animate out
      // while still visible. Toggle fires on enter/leave of the sticky
      // container instead, which aligns with visual presence.
      gsap.utils.toArray(".bts-tile").forEach((tile) => {
        gsap.fromTo(
          tile,
          { x: 110, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: {
              trigger: tile,
              start: "top 88%",
              end:   "bottom 12%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });

      // Subtle vertical parallax on the image inside each tile.
      gsap.utils.toArray(".bts-img").forEach((el, i) => {
        gsap.to(el, {
          yPercent: i % 2 === 0 ? -10 : 8,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end:   "bottom top",
            scrub: true,
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={ref}
      className="relative overflow-hidden bg-ink-900 py-14 md:py-20"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        {/* Oversized centered chapter word — slow scrub-tied entrance */}
        <SectionTitle>PROCESS</SectionTitle>

        {/* Header */}
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-6 text-[11px] uppercase tracking-[0.32em] text-accent">
              ⟶ &nbsp; 02 &nbsp;/ &nbsp; Process
            </p>
            <RevealText
              as="h2"
              lines={["Made slowly,", "on purpose."]}
              className="font-display text-[clamp(2.6rem,6.5vw,6rem)] leading-[0.95] tracking-tighter text-ink-0"
            />
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink-100 md:text-base">
            Four quiet steps that shape the way the studio works — from the
            first conversation to the last frame of grade.
          </p>
        </div>

        {/* Steps + sticky image stack */}
        <div className="mt-12 grid grid-cols-1 gap-x-10 md:grid-cols-12">
          {/* Steps */}
          <div className="md:col-span-6 md:col-start-1">
            <ol className="divide-y divide-ink-0/10 border-y border-ink-0/10">
              {PROCESS.map((p) => (
                <li
                  key={p.n}
                  // gap-4 (was gap-6) on mobile so the numeral column
                  // doesn't crowd the heading on 360 px Android viewports.
                  className="process-step group grid grid-cols-12 gap-4 py-7 md:gap-6 md:py-10"
                >
                  <span className="numeral col-span-2 text-xl text-accent sm:text-2xl md:text-3xl">
                    {p.n}
                  </span>
                  <div className="col-span-10 min-w-0">
                    <h3 className="font-display text-2xl tracking-tight text-ink-0 sm:text-3xl md:text-5xl">
                      {p.title}
                    </h3>
                    <p className="mt-4 max-w-md text-[14px] leading-relaxed text-ink-100 sm:text-[15px]">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Sticky behind-the-scenes column */}
          <div className="mt-10 md:col-span-5 md:col-start-8 md:mt-0">
            <div className="md:sticky md:top-28">
              <div className="flex flex-col gap-10">
                {BTS.map((src, i) => {
                  const meta = IMG_META[src] ?? { w: 4, h: 3 };

                  return (
                    <div
                      key={src}
                      className="bts-tile relative w-full"
                      style={{ willChange: "transform, opacity" }}
                    >
                      <div
                        className="relative w-full overflow-hidden rounded-xl bg-ink-700"
                        style={{ aspectRatio: `${meta.w} / ${meta.h}` }}
                      >
                        <TiltCard intensity={6} className="absolute inset-0">
                          <div
                            className="bts-img absolute inset-0 will-change-transform"
                            style={{ transform: "scale(1.08)" }}
                          >
                            <Image
                              src={src}
                              alt={`Behind the scenes ${i + 1}`}
                              fill
                              sizes="(min-width: 768px) 40vw, 90vw"
                              className="object-cover"
                            />
                          </div>
                        </TiltCard>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-ink-100">
                <span>Behind the scenes</span>
                <span className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  16 / 24 frames
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
