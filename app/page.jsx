import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import LiquidBackground from "@/components/LiquidBackground";
import PageTransition from "@/components/PageTransition";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import Works from "@/components/sections/Works";
import Marquee from "@/components/Marquee";
import Process from "@/components/sections/Process";
import Contact from "@/components/sections/Contact";

export default function Page() {
  return (
    <SmoothScroll>
      <LiquidBackground />
      <Cursor />
      <PageTransition />
      <Nav />
      <main className="relative">
        <Hero />
        <Marquee
          words={[
            "Selected Works",
            "2026",
            "Photography",
            "Direction",
            "Editorial",
            "Motion",
          ]}
        />
        <Works />
        <Process />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
