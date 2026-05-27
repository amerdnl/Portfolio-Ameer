"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  RevealText,
  ImageReveal,
  RevealBlock,
  RevealSide,
} from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import SectionTitle from "@/components/SectionTitle";
import { IMG_META } from "@/lib/data";

const MAIN_SRC = "/DSC08576.jpg";
const SIDE_SRC = "/DSC08704.jpg";

export default function About() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subtle vertical parallax on the inner image — works alongside
      // the horizontal RevealSide entry/exit on the outer wrapper.
      gsap.to(".portrait-parallax", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end:   "bottom top",
          scrub: true,
        },
      });
      gsap.to(".side-portrait", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end:   "bottom top",
          scrub: true,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const mainMeta = IMG_META[MAIN_SRC] ?? { w: 3, h: 4 };
  const sideMeta = IMG_META[SIDE_SRC] ?? { w: 4, h: 5 };

  return (
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden bg-ink-800 py-28 md:py-44"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        {/* Oversized chapter word — drifts in from the right */}
        <SectionTitle from="right">STUDIO</SectionTitle>
      </div>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-x-10 gap-y-16 px-6 md:grid-cols-12 md:px-10">
        {/* Marker */}
        <div className="md:col-span-12">
          <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
            ⟶ &nbsp; 02 &nbsp;/ &nbsp; The Studio
          </p>
        </div>

        {/* Main portrait — slides in from the LEFT, exits LEFT */}
        <RevealSide
          side="left"
          className="md:col-span-5 md:col-start-1"
        >
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: `${mainMeta.w} / ${mainMeta.h}` }}
          >
            <TiltCard className="absolute inset-0">
              <ImageReveal className="absolute inset-0 bg-ink-700">
                <div
                  className="portrait-parallax absolute inset-0 will-change-transform"
                  style={{ transform: "scale(1.08)" }}
                >
                  <Image
                    src={MAIN_SRC}
                    alt="Guitarist in studio"
                    fill
                    sizes="(min-width: 1280px) 38vw, (min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </ImageReveal>
            </TiltCard>
          </div>
          <div className="mt-5 flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-ink-100">
            <span>Ameer — Director</span>
            <span>Shah Alam, Studio 3B</span>
          </div>
        </RevealSide>

        {/* Text column */}
        <div className="md:col-span-6 md:col-start-7 md:pt-24">
          <RevealText
            as="h2"
            lines={[
              "We make work",
              "that prefers",
              "the long look",
              "to the loud one.",
            ]}
            className="font-display text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.98] tracking-tighter text-ink-0"
          />

          <div className="mt-12 grid grid-cols-1 gap-10 text-ink-50/85 sm:grid-cols-2">
            <RevealBlock delay={0.2}>
              <p className="text-[15px] leading-relaxed">
                northofamer is an independent photography and direction studio
                based in Shah Alam. The studio takes a small number of
                commissions a year, choosing depth over breadth and intention
                over output.
              </p>
            </RevealBlock>
            <RevealBlock delay={0.35}>
              <p className="text-[15px] leading-relaxed">
                Clients include heritage fragrance houses, independent ceramics
                ateliers, slow-fashion makers, and architects who appreciate
                seeing their work photographed in the light it was designed
                for.
              </p>
            </RevealBlock>
          </div>

          {/* Pull facts */}
          <RevealBlock delay={0.5} className="mt-16">
            <div className="grid grid-cols-2 gap-x-10 gap-y-10 border-t border-ink-0/10 pt-10 md:grid-cols-4">
              {[
                { k: "Projects", v: "62" },
                { k: "Cities",   v: "14" },
                { k: "Awards",   v: "07" },
                { k: "Years",    v: "07" },
              ].map((s) => (
                <div key={s.k}>
                  <p className="numeral text-[clamp(2.5rem,4vw,3.5rem)] leading-none text-ink-0">
                    {s.v}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-ink-100">
                    {s.k}
                  </p>
                </div>
              ))}
            </div>
          </RevealBlock>
        </div>

        {/* Side portrait — slides in from the RIGHT, exits RIGHT */}
        <RevealSide
          side="right"
          className="md:col-span-4 md:col-start-9 md:-mt-20"
        >
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: `${sideMeta.w} / ${sideMeta.h}` }}
          >
            <TiltCard className="absolute inset-0">
              <ImageReveal className="absolute inset-0 bg-ink-700">
                <div
                  className="side-portrait absolute inset-0 will-change-transform"
                  style={{ transform: "scale(1.08)" }}
                >
                  <Image
                    src={SIDE_SRC}
                    alt="Guitarist on stage"
                    fill
                    sizes="(min-width: 1280px) 30vw, (min-width: 768px) 38vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </ImageReveal>
            </TiltCard>
          </div>
          <p className="mt-4 max-w-xs text-[12px] leading-relaxed text-ink-100">
            <span className="text-ink-0">Studio 3B —</span> a quiet room with
            north-facing windows, a small library, and the patience to wait for
            the right hour.
          </p>
        </RevealSide>
      </div>
    </section>
  );
}
