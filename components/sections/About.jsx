"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText, ImageReveal, RevealBlock } from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import SectionTitle from "@/components/SectionTitle";

export default function About() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".portrait-parallax", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".side-portrait", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

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

        {/* Main portrait — tall, editorial */}
        <div className="md:col-span-5 md:col-start-1">
          <TiltCard className="relative aspect-[3/4] w-full">
            <ImageReveal className="absolute inset-0 bg-ink-700">
              <div className="portrait-parallax absolute inset-0 will-change-transform">
                <Image
                  src="/DSC08576.jpg"
                  alt="Studio portrait"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </ImageReveal>
          </TiltCard>
          <div className="mt-5 flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-ink-100">
            <span>Ameer K. — Director</span>
            <span>Lisbon, Studio 3B</span>
          </div>
        </div>

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
            <RevealBlock delay={200}>
              <p className="text-[15px] leading-relaxed">
                Ameer is an independent photographer and director working between
                Lisbon and London. The studio takes a small number of
                commissions a year, choosing depth over breadth and intention
                over output.
              </p>
            </RevealBlock>
            <RevealBlock delay={350}>
              <p className="text-[15px] leading-relaxed">
                Clients include heritage fragrance houses, independent ceramics
                ateliers, slow-fashion makers, and architects who appreciate
                seeing their work photographed in the light it was designed
                for.
              </p>
            </RevealBlock>
          </div>

          {/* Pull facts */}
          <RevealBlock delay={500} className="mt-16">
            <div className="grid grid-cols-2 gap-x-10 gap-y-10 border-t border-ink-0/10 pt-10 md:grid-cols-4">
              {[
                { k: "Projects", v: "62" },
                { k: "Cities", v: "14" },
                { k: "Awards", v: "07" },
                { k: "Years", v: "07" },
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

        {/* Side portrait — smaller, offset */}
        <div className="md:col-span-4 md:col-start-9 md:-mt-20">
          <TiltCard className="relative aspect-[4/5] w-full">
            <ImageReveal className="absolute inset-0 bg-ink-700">
              <div className="side-portrait absolute inset-0 will-change-transform">
                <Image
                  src="/DSC08590.jpg"
                  alt="Studio scene"
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            </ImageReveal>
          </TiltCard>
          <p className="mt-4 max-w-xs text-[12px] leading-relaxed text-ink-100">
            <span className="text-ink-0">Studio 3B —</span> a quiet room with
            north-facing windows, a small library, and the patience to wait for
            the right hour.
          </p>
        </div>
      </div>
    </section>
  );
}
