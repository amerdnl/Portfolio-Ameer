"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

const LINKS = [
  { id: "top",     label: "Home" },
  { id: "works",   label: "Works" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  // `visible` flips true once the user has scrolled past most of the
  // hero — keeps the first screen completely chrome-free.
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cinematic transition: dispatch a custom event picked up by
  // <PageTransition />, which runs a fullscreen curtain animation
  // and snaps the document to the anchor mid-wipe.
  const go = (id, label) => (e) => {
    e.preventDefault();
    if (!document.getElementById(id)) return;
    setOpen(false);
    window.dispatchEvent(
      new CustomEvent("page:transition", { detail: { id, label } })
    );
  };

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 py-4 transition-all duration-[900ms] ease-cinematic",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-3 opacity-0"
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-10">
        <a
          href="#top"
          onClick={go("top", "Home")}
          className="group flex items-center gap-3 text-[13px] uppercase tracking-[0.28em] text-ink-0"
        >
          <span className="relative inline-block h-[7px] w-[7px] rounded-full bg-accent">
            <span className="absolute inset-0 animate-glow rounded-full bg-accent" />
          </span>
          <span className="font-medium lowercase tracking-[0.22em]">northofamer</span>
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {LINKS.filter((l) => l.id !== "top").map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={go(l.id, l.label)}
              className="group relative text-[12px] uppercase tracking-[0.26em] text-ink-100 transition-colors hover:text-ink-0"
            >
              <span>{l.label}</span>
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-500 ease-cinematic group-hover:w-full" />
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          onClick={go("contact", "Contact")}
          className="hidden text-[12px] uppercase tracking-[0.26em] text-ink-0 md:inline-flex"
          data-cursor="hover"
        >
          <span className="relative inline-flex items-center gap-3 rounded-full border border-ink-0/20 px-5 py-2.5 transition-colors duration-500 hover:border-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Start a project
          </span>
        </a>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={clsx(
              "h-px w-6 bg-ink-0 transition-transform duration-500",
              open && "translate-y-[3px] rotate-45"
            )}
          />
          <span
            className={clsx(
              "h-px w-6 bg-ink-0 transition-transform duration-500",
              open && "-translate-y-[3px] -rotate-45"
            )}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={clsx(
          "fixed inset-0 top-0 z-40 bg-ink-900/95 backdrop-blur-lg transition-all duration-700 ease-cinematic md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="flex h-full flex-col items-start justify-center gap-6 px-8">
          {LINKS.filter((l) => l.id !== "top").map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={go(l.id, l.label)}
              className="font-display text-5xl tracking-tight text-ink-0"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={go("contact", "Contact")}
            className="mt-6 text-[12px] uppercase tracking-[0.26em] text-accent"
          >
            Start a project →
          </a>
        </div>
      </div>
    </header>
  );
}
