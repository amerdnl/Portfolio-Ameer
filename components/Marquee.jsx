"use client";

export default function Marquee({ words = [], speed = 40 }) {
  const items = [...words, ...words];
  return (
    <section
      aria-hidden
      className="relative overflow-hidden border-y border-ink-0/10 bg-ink-900 py-6 md:py-8"
    >
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {items.map((w, i) => (
          <span
            key={i}
            className="mx-10 inline-flex items-center gap-10 whitespace-nowrap font-display text-3xl italic text-ink-50 md:text-5xl"
          >
            {w}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </section>
  );
}
