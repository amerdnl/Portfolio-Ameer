"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROCESS, IMG_META } from "@/lib/data";
import { RevealText, ImageReveal, RevealSide } from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import SectionTitle from "@/components/SectionTitle";

const BTS = [
  "/DSC07670.jpg",   // landscape — left column
  "/DSC08556.jpg",   // landscape — right column
  "/DSC08590.jpg",   // landscape — left column
  "/DSC07674.jpg",   // portrait  — right column
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

      // BTS images — gentle vertical parallax (the directional slide is
      // handled by the RevealSide wrapper around each tile).
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
      className="relative overflow-hidden bg-ink-900 py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        {/* Oversized chapter word — drifts in from the left */}
        <SectionTitle from="left">PROCESS</SectionTitle>

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
        <div className="mt-24 grid grid-cols-1 gap-x-10 md:grid-cols-12">
          {/* Steps */}
          <div className="md:col-span-6 md:col-start-1">
            <ol className="divide-y divide-ink-0/10 border-y border-ink-0/10">
              {PROCESS.map((p) => (
                <li
                  key={p.n}
                  className="process-step group grid grid-cols-12 gap-6 py-10 md:py-14"
                >
                  <span className="numeral col-span-2 text-2xl text-accent md:text-3xl">
                    {p.n}
                  </span>
                  <div className="col-span-10">
                    <h3 className="font-display text-3xl tracking-tight text-ink-0 md:text-5xl">
                      {p.title}
                    </h3>
                    <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-100">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Sticky behind-the-scenes column */}
          <div className="mt-16 md:col-span-5 md:col-start-8 md:mt-0">
            <div className="md:sticky md:top-28">
              <div className="grid grid-cols-2 gap-4">
                {BTS.map((src, i) => {
                  const meta   = IMG_META[src] ?? { w: 4, h: 3 };
                  // Column 0 → from left, column 1 → from right.
                  const side   = i % 2 === 0 ? "left" : "right";
                  // Stagger the right column down for an offset rhythm.
                  const offset = i % 2 === 1 ? "mt-10" : "";

                  return (
                    <RevealSide
                      key={src}
                      side={side}
                      className={`relative w-full ${offset}`}
                    >
                      <div
                        className="relative w-full overflow-hidden"
                        style={{ aspectRatio: `${meta.w} / ${meta.h}` }}
                      >
                        <TiltCard intensity={6} className="absolute inset-0">
                          <ImageReveal className="absolute inset-0 bg-ink-700">
                            <div
                              className="bts-img absolute inset-0 will-change-transform"
                              style={{ transform: "scale(1.08)" }}
                            >
                              <Image
                                src={src}
                                alt={`Behind the scenes ${i + 1}`}
                                fill
                                sizes="(min-width: 768px) 22vw, 45vw"
                                className="object-cover"
                              />
                            </div>
                          </ImageReveal>
                        </TiltCard>
                      </div>
                    </RevealSide>
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
