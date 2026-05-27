import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import HeroCursor from "@/components/HeroCursor";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import Works from "@/components/sections/Works";
import Marquee from "@/components/Marquee";
import About from "@/components/sections/About";
import Process from "@/components/sections/Process";
import Contact from "@/components/sections/Contact";

export default function Page() {
  return (
    <SmoothScroll>
      <Cursor />
      <HeroCursor />
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
        <About />
        <Process />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
