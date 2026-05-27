"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";

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
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative overflow-hidden bg-ink-900 pt-28 md:pt-44"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        {/* Oversized chapter word — drifts in from the right */}
        <SectionTitle from="right">CONTACT</SectionTitle>

        <div className="grid grid-cols-1 gap-y-16 md:grid-cols-12">
          {/* Marker */}
          <div className="md:col-span-12">
            <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
              ⟶ &nbsp; 04 &nbsp;/ &nbsp; Contact
            </p>
          </div>

          {/* Headline */}
          <div className="md:col-span-12">
            <RevealText
              as="h2"
              lines={[
                "Let's make",
                <em key="1" className="italic text-ink-50">
                  something
                </em>,
                "worth waiting for.",
              ]}
              className="font-display text-[clamp(2.8rem,9vw,9rem)] leading-[0.92] tracking-tightest text-ink-0"
            />
          </div>

          {/* Email CTA */}
          <div className="md:col-span-7">
            <a
              href="mailto:ekspresiameer@gmail.com"
              data-cursor="hover"
              className="group inline-flex flex-wrap items-baseline gap-x-5 gap-y-2"
            >
              <span className="font-display text-[clamp(2rem,5vw,4rem)] italic tracking-tight text-ink-0 transition-colors duration-500 group-hover:text-accent">
                ekspresiameer@gmail.com
              </span>
              <span className="inline-block h-px w-16 translate-y-[-12px] bg-accent transition-all duration-500 group-hover:w-24" />
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
        <div className="mt-28">
          <div className="contact-rule h-px w-full origin-left bg-ink-0/15" />
        </div>

        {/* Footer */}
        <footer className="grid grid-cols-2 gap-y-8 py-10 text-[11px] uppercase tracking-[0.28em] text-ink-100 md:grid-cols-4">
          <div>
            <p className="text-ink-0">Studio</p>
            <p className="mt-2">Persiaran Setia Murni, Studio 3B</p>
            <p>40170 Shah Alam, Selangor</p>
          </div>
          <div>
            <p className="text-ink-0">Hours</p>
            <p className="mt-2 flex items-center gap-2">
              <span className="h-1 w-1 animate-blink rounded-full bg-accent" />
              Shah Alam · {time || "—"}
            </p>
            <p>Mon — Fri · By appointment</p>
          </div>
          <div>
            <p className="text-ink-0">Index</p>
            <p className="mt-2">Works · About</p>
            <p>Process · Voices</p>
          </div>
          <div className="md:text-right">
            <p className="text-ink-0">© 2026</p>
            <p className="mt-2 lowercase">northofamer</p>
            <p>All Rights Reserved</p>
          </div>
        </footer>

        {/* Big wordmark */}
        <div className="relative -mx-6 mt-4 select-none overflow-hidden md:-mx-10">
          <p className="font-display text-[15vw] leading-[0.82] tracking-tightest text-ink-0/95 lowercase">
            northofamer<span className="italic text-accent">.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
