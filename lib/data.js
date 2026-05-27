/**
 * Intrinsic dimensions for every image in /public.
 * Lets <Image> reserve the correct aspect-ratio box without
 * cropping or stretching the source — portrait stays portrait,
 * landscape stays landscape, across every breakpoint.
 */
export const IMG_META = {
  "/hero.jpg":      { w: 2048, h: 1365 },
  "/DSC07356.jpg":  { w: 6192, h: 4128 },
  "/DSC07670.jpg":  { w: 5609, h: 3739 },
  "/DSC07674.jpg":  { w: 4107, h: 6160 },
  "/DSC07688.jpg":  { w: 5889, h: 3926 },
  "/DSC08380.jpg":  { w: 1365, h: 2048 },
  "/DSC08449.jpg":  { w: 1365, h: 2048 },
  "/DSC08556.jpg":  { w: 2048, h: 1365 },
  "/DSC08576.jpg":  { w: 2048, h: 1365 },
  "/DSC08590.jpg":  { w: 2048, h: 1365 },
  "/DSC08687.jpg":  { w: 2048, h: 1365 },
  "/DSC08692.jpg":  { w: 1365, h: 2048 },
  "/DSC08704.jpg":  { w: 2048, h: 1365 },
};

export const WORKS = [
  {
    id: "01",
    title: "Stage Presence",
    client: "Private Commission",
    year: "2026",
    discipline: "Portraiture · Live",
    cover: "/DSC08449.jpg",
    description:
      "A vocalist captured mid-performance — the stage light finding her in a single, unwavering beam.",
  },
  {
    id: "02",
    title: "Red Frequency",
    client: "Private Commission",
    year: "2026",
    discipline: "Concert · Stills",
    cover: "/DSC08692.jpg",
    description:
      "Emotion at full volume — a frame taken at the exact moment the voice and the light agreed on the same note.",
  },
  {
    id: "03",
    title: "Ghost Note",
    client: "Private Commission",
    year: "2026",
    discipline: "Editorial · Motion",
    cover: "/DSC07688.jpg",
    description:
      "A long exposure turning a guitarist into light — the instrument held still while everything around her dissolves.",
  },
  {
    id: "04",
    title: "Low Light",
    client: "Private Commission",
    year: "2026",
    discipline: "Concert · Stills",
    cover: "/DSC08380.jpg",
    description:
      "A full-body silhouette in warm stage light — the instrument and the performer merging into one shape.",
  },
  {
    id: "05",
    title: "Signal",
    client: "Private Commission",
    year: "2026",
    discipline: "Portraiture · Motion",
    cover: "/DSC07356.jpg",
    description:
      "Caught in the spiral — a performer mid-transmission, the mic raised like an antenna to an unseen frequency.",
  },
  {
    id: "06",
    title: "Blue Hour",
    client: "Private Commission",
    year: "2026",
    discipline: "Stage · Editorial",
    cover: "/DSC08687.jpg",
    description:
      "Cool stage light on warm hands — a guitarist in full concentration, the Marshall stack glowing behind him.",
  },
];

export const TESTIMONIALS = [
  {
    id: "t1",
    quote:
      "Ameer made our brand feel like a place you could walk into. Every frame had weight, restraint, and a sense of time.",
    author: "Inés Caro",
    role: "Creative Director, Maison Verre",
  },
  {
    id: "t2",
    quote:
      "He doesn't chase moments — he waits for them. The film he delivered changed how our audience speaks about the work.",
    author: "Kenji Aoyama",
    role: "Founder, Aoyama Ceramics",
  },
  {
    id: "t3",
    quote:
      "A rare director who treats every commission as if it might be the last one. Calm on set, precise on camera, unhurried in edit.",
    author: "Lena Bauer",
    role: "Head of Brand, Form Studio",
  },
  {
    id: "t4",
    quote:
      "We trusted him with three days, a small budget, and no script. He returned with something we are still showing clients two years later.",
    author: "Marcus Hâra",
    role: "Founder, Hâra Outdoor",
  },
];

export const PROCESS = [
  {
    n: "01",
    title: "Listening",
    body: "Every project begins with a conversation about intention. Before a camera is opened, the story is shaped on paper and in mood.",
  },
  {
    n: "02",
    title: "Pre-Visualisation",
    body: "Locations are scouted in light. References are quiet, deliberate. A single visual language is chosen and protected.",
  },
  {
    n: "03",
    title: "Capture",
    body: "Small crews, long takes, natural light wherever possible. The set is calm because the work is loud enough on its own.",
  },
  {
    n: "04",
    title: "Edit & Grade",
    body: "The image is finished slowly. Colour is treated like material. Every frame must survive being looked at twice.",
  },
];
