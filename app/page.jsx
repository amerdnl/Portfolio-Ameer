import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import Works from "@/components/sections/Works";
import Process from "@/components/sections/Process";
import Contact from "@/components/sections/Contact";
import WaterRipple from "@/components/WaterRipple";
import LoadingScreen from "@/components/LoadingScreen";

export default function Page() {
  return (
    <>
      <LoadingScreen />
      {/* Fixed outside site-content so GSAP transforms/filters on the parent
          don't break position:fixed and clip the canvas. */}
      <WaterRipple />
      <SmoothScroll>
        {/* site-content: starts invisible; LoadingScreen zooms + fades it in */}
        <div className="site-content" style={{ opacity: 0 }}>
          <PageTransition />
          <Nav />
          <main className="relative">
            <Hero />
            <Works />
            <Process />
            <Contact />
          </main>
        </div>
      </SmoothScroll>
    </>
  );
}
