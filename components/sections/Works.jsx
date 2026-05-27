"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WORKS, IMG_META } from "@/lib/data";
import { RevealText, RevealSide } from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import SectionTitle from "@/components/SectionTitle";

export default function Works() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(".work-card");
      items.forEach((card) => {
        const img  = card.querySelector(".work-img");
        const meta = card.querySelector(".work-meta");

        // Subtle parallax — the inner scale-110 gives headroom so the
        // image never reveals the container background.
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end:   "bottom top",
                scrub: true,
              },
            }
          );
        }

        // Meta fade-in — synchronised with the card's directional reveal.
        if (meta) {
          gsap.fromTo(
            meta,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              delay: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 82%",
                end:   "top 25%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="works"
      ref={sectionRef}
      className="relative bg-ink-900 py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        {/* Oversized chapter word — drifts in from the left as you scroll */}
        <SectionTitle from="left">SELECTED</SectionTitle>

        {/* Section header */}
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-6 text-[11px] uppercase tracking-[0.32em] text-accent">
              ⟶ &nbsp; 01 &nbsp;/ &nbsp; Selected Works
            </p>
            <RevealText
              as="h2"
              lines={["Six pieces of work,", "told in their own light."]}
              className="font-display text-[clamp(2.6rem,6.5vw,6rem)] leading-[0.95] tracking-tighter text-ink-0"
            />
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink-100 md:text-base">
            A small selection from recent commissions and personal work between
            2022 and 2026 — stills, motion, and the patient spaces in between.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-24 grid grid-cols-1 gap-x-10 gap-y-24 md:grid-cols-12 md:gap-y-32">
          {WORKS.map((w, i) => {
            // Alternating L/R column placement gives an editorial rhythm.
            // Wide columns for landscape images, narrower for portrait —
            // the natural aspect ratio drives the cell's height.
            const layouts = [
              "md:col-span-7 md:col-start-1",
              "md:col-span-5 md:col-start-8 md:mt-32",
              "md:col-span-6 md:col-start-2",
              "md:col-span-5 md:col-start-8 md:mt-24",
              "md:col-span-7 md:col-start-1",
              "md:col-span-5 md:col-start-8 md:mt-20",
            ];
            const side = i % 2 === 0 ? "left" : "right";
            const meta = IMG_META[w.cover] ?? { w: 4, h: 3 };

            return (
              <RevealSide
                key={w.id}
                side={side}
                delay={0.05}
                className={`work-card group relative ${layouts[i % layouts.length]}`}
              >
                <div data-cursor="hover">
                  {/* Image frame — aspect-ratio matches the source so the
                      image is never cropped, stretched, or letter-boxed. */}
                  <div
                    className="relative w-full overflow-hidden bg-ink-700"
                    style={{ aspectRatio: `${meta.w} / ${meta.h}` }}
                  >
                    <TiltCard className="absolute inset-0">
                      <div
                        className="work-img absolute inset-0 will-change-transform"
                        style={{ transform: "scale(1.1)" }}
                      >
                        <Image
                          src={w.cover}
                          alt={w.title}
                          fill
                          sizes="(min-width: 1280px) 45vw, (min-width: 768px) 55vw, 100vw"
                          className="object-cover transition-[filter] duration-1000 ease-cinematic group-hover:grayscale-0"
                          priority={i < 2}
                        />
                      </div>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent transition-opacity duration-700 group-hover:opacity-30" />
                      {/* Index numeral */}
                      <span className="numeral pointer-events-none absolute -top-6 -left-2 text-[6rem] leading-none text-ink-0/0 mix-blend-overlay transition-all duration-700 group-hover:text-ink-0/15 md:text-[9rem]">
                        {w.id}
                      </span>
                      {/* View tag */}
                      <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-ink-0/20 bg-ink-900/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-ink-0 backdrop-blur-md opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1">
                        <span className="h-1 w-1 rounded-full bg-accent" />
                        View piece
                      </span>
                    </TiltCard>
                  </div>

                  <div className="work-meta mt-6 flex items-start justify-between gap-6">
                    <div>
                      <h3 className="font-display text-2xl tracking-tight text-ink-0 md:text-3xl">
                        {w.title}
                      </h3>
                      <p className="mt-1 text-[12px] uppercase tracking-[0.26em] text-ink-100">
                        {w.discipline}
                      </p>
                    </div>
                    <div className="text-right text-[11px] uppercase tracking-[0.28em] text-ink-100">
                      <p>{w.client}</p>
                      <p className="mt-1 text-ink-200">{w.year}</p>
                    </div>
                  </div>

                  <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-100/85">
                    {w.description}
                  </p>
                </div>
              </RevealSide>
            );
          })}
        </div>

        {/* End rule */}
        <div className="mt-32 flex items-center justify-between border-t border-ink-0/10 pt-8 text-[11px] uppercase tracking-[0.32em] text-ink-100">
          <span>End of selected works</span>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(
                new CustomEvent("page:transition", {
                  detail: { id: "contact", label: "Contact" },
                })
              );
            }}
            className="group inline-flex items-center gap-3 text-ink-0 transition-colors hover:text-accent"
            data-cursor="hover"
          >
            Commission a project
            <span className="inline-block h-px w-12 bg-accent transition-all duration-500 group-hover:w-20" />
          </a>
        </div>
      </div>
    </section>
  );
}
