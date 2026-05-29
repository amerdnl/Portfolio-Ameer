"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle from "@/components/SectionTitle";
import TiltCard from "@/components/TiltCard";
import { ImageReveal } from "@/components/Reveal";

const CHANNELS = [
  { label: "Email", value: "ekspresiameer@gmail.com", href: "mailto:ekspresiameer@gmail.com" },
  { label: "Instagram", value: "@northofamer", href: "https://instagram.com/northofamer" },
  { label: "TikTok", value: "@northofamer", href: "https://tiktok.com/@northofamer" },
  { label: "Phone", value: "013-2311494", href: "tel:+60132311494" },
];

export default function Contact() {
  const ref = useRef(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kuala_Lumpur",
      }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 70%" },
        }
      );

      // Portrait — slide in from left once, no exit.
      gsap.fromTo(
        ".contact-photo",
        { x: -140, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".contact-photo",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );

      // Subtle vertical parallax on the inner image — matches the
      // .work-img / .bts-img treatment so the Contact portrait reads
      // with the same cinematic depth as the Works and Process tiles.
      // scrub:true ties the drift to scroll position rather than firing
      // an out-animation, so the image never re-hides itself.
      gsap.to(".contact-img", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: ".contact-photo",
          start: "top bottom",
          end:   "bottom top",
          scrub: true,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative overflow-hidden bg-ink-900 pt-14 md:pt-24"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        {/* Oversized centered chapter word — slow scrub-tied entrance */}
        <SectionTitle className="!mb-6 md:!mb-8">CONTACT</SectionTitle>

        <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-y-14">
          {/* Marker */}
          <div className="md:col-span-12">
            <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
              ⟶ &nbsp; 03 &nbsp;/ &nbsp; Contact
            </p>
          </div>

          {/* Portrait + bio */}
          <div className="md:col-span-12">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-20">
              {/* Photo — matches the Works/Process reveal vocabulary:
                  outer slide-in from left (.contact-photo), dark
                  curtain mask lifts off the frame (ImageReveal), and
                  inner parallax drift on the image itself (.contact-img).
                  All play-once — once the photo is revealed it stays
                  revealed, since this is the final section. */}
              <div className="contact-photo md:col-span-5" style={{ willChange: "transform, opacity" }}>
                <ImageReveal className="rounded-xl">
                  <div className="relative w-full" style={{ aspectRatio: "5990 / 3993" }}>
                    <TiltCard intensity={6} className="absolute inset-0">
                      <div
                        className="contact-img absolute inset-0 will-change-transform"
                        style={{ transform: "scale(1.08)" }}
                      >
                        <Image
                          src="/DSC06965_Original.jpg"
                          alt="Ameer Danial — northofamer"
                          fill
                          sizes="(min-width: 768px) 40vw, 100vw"
                          className="object-cover object-top"
                        />
                      </div>
                    </TiltCard>
                  </div>
                </ImageReveal>
              </div>

              {/* Bio */}
              <div className="flex flex-col justify-center md:col-span-7">
                <p className="mb-5 text-[11px] uppercase tracking-[0.32em] text-accent">
                  ⟶ &nbsp; The person behind the lens
                </p>
                <h3 className="font-display text-2xl tracking-tight text-ink-0 md:text-3xl">
                  Ameer Danial
                </h3>
                <p className="mt-6 text-[15px] leading-[1.85] text-ink-100">
                  The visuals and stories you've seen throughout this website reflect
                  the kind of art and emotion I always strive to create for every
                  client I work with. For me, photography and videography are more
                  than just capturing moments — it's about turning real memories into
                  something cinematic, timeless, and meaningful.
                </p>
                <p className="mt-4 text-[15px] leading-[1.85] text-ink-100">
                  Whether it's a personal moment, a wedding, or a creative project,
                  I always give my full passion, creativity, and attention to detail
                  into every frame. If you choose to work with me, I promise to
                  deliver visuals that not only look beautiful, but truly feel
                  personal and memorable.
                </p>
              </div>
            </div>
          </div>

          {/* Email CTA */}
          <div className="md:col-span-7">
            <a
              href="mailto:ekspresiameer@gmail.com"
              data-cursor="hover"
              // max-w-full so the inline-flex never escapes the column,
              // and the inner span gets break-all so the email can wrap
              // gracefully on narrow Android viewports instead of
              // scrolling off the right edge of the screen.
              className="group inline-flex max-w-full flex-wrap items-baseline gap-x-5 gap-y-2"
            >
              <span className="font-display break-all text-[clamp(1.35rem,5vw,4rem)] italic leading-[1.1] tracking-tight text-ink-0 transition-colors duration-500 group-hover:text-accent">
                ekspresiameer@gmail.com
              </span>
              <span className="hidden h-px w-16 translate-y-[-12px] bg-accent transition-all duration-500 group-hover:w-24 sm:inline-block" />
            </a>
            <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink-100">
              The studio accepts a small number of commissions each year.
              Briefs, decks, and conversations are equally welcome — we reply
              to every message.
            </p>
          </div>

          {/* Channels */}
          <div className="md:col-span-5">
            <ul className="divide-y divide-ink-0/10 border-y border-ink-0/10">
              {CHANNELS.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    data-cursor="hover"
                    className="group flex items-center justify-between py-5 text-ink-0 transition-colors hover:text-accent"
                  >
                    <span className="text-[11px] uppercase tracking-[0.32em] text-ink-100 group-hover:text-accent">
                      {c.label}
                    </span>
                    <span className="font-display text-xl tracking-tight md:text-2xl">
                      {c.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-24">
          <div className="contact-rule h-px w-full origin-left bg-ink-0/15" />
        </div>

        {/* Footer */}
        <footer className="grid grid-cols-2 gap-y-8 py-10 text-[11px] uppercase tracking-[0.28em] text-ink-100 md:grid-cols-4 md:py-14">
          <div>
            <p className="text-ink-0">Based in</p>
            <p className="mt-2">Shah Alam</p>
          </div>
          <div>
            <p className="text-ink-0">Hours</p>
            <p className="mt-2 flex items-center gap-2">
              <span className="h-1 w-1 animate-blink rounded-full bg-accent" />
              Shah Alam · {time || "—"}
            </p>
            <p>Mon — Sun · By appointment</p>
          </div>
          <div>
            <p className="text-ink-0">Index</p>
            <p className="mt-2">Works · Process</p>
            <p>Contact</p>
          </div>
          <div className="md:text-right">
            <p className="text-ink-0">© 2026</p>
            <p className="mt-2 lowercase">northofamer</p>
            <p>All Rights Reserved</p>
          </div>
        </footer>

        {/* Big wordmark — flush to section bottom, no trailing space */}
        <div className="relative -mx-6 mt-3 select-none overflow-hidden md:-mx-10">
          <p className="font-display text-[15vw] leading-[0.78] tracking-tightest text-ink-0/95 lowercase">
            northofamer<span className="italic text-accent">.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
