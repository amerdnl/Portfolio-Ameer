"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.08,
    });

    // Bridge Lenis -> ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Mark body so we can switch to custom cursor styling
    document.body.classList.add("has-custom-cursor");

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return <>{children}</>;
}
