# Ameer Studio — Cinematic Portfolio

A Next.js + Tailwind + GSAP + Lenis portfolio built as a single continuous
scrolling experience inspired by [Lusion](https://lusion.co/).

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Hero video

The hero `<video>` looks for `/public/hero.mp4`. Until you add one, it falls
back to its poster image so the layout is intact.

```bash
cp /path/to/your-reel.mp4 public/hero.mp4
```

## Structure

```
app/
  layout.jsx     ← fonts + global frame
  page.jsx       ← assembles all sections
  globals.css
components/
  SmoothScroll.jsx   ← Lenis + GSAP ScrollTrigger bridge
  Cursor.jsx         ← custom cursor
  Nav.jsx
  Marquee.jsx
  Reveal.jsx         ← RevealText / RevealBlock / ImageReveal helpers
  sections/
    Hero.jsx
    Works.jsx
    About.jsx
    Process.jsx
    Testimonials.jsx ← horizontal pin scroll
    Contact.jsx
lib/
  data.js            ← works, testimonials, process
```

## Swapping content

Edit `lib/data.js` for projects and testimonials. Replace Unsplash URLs in
`Works.jsx`, `About.jsx`, and `Process.jsx` with your own imagery.
