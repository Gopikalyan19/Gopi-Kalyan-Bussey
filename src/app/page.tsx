import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Experience from "@/components/sections/Experience";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Milestones from "@/components/sections/Milestones";
import Process from "@/components/sections/Process";
import Services from "@/components/sections/Services";
import Skills from "@/components/sections/Skills";
import StickyNav from "@/components/sections/StickyNav";
import UIProvider from "@/components/ui/UIProvider";
import Work from "@/components/work/Work";

export default function Home() {
  return (
    <UIProvider>
      <StickyNav />
      <Hero />
      <main id="main">
        <About />
        <Services />
        <Work />
        <Process />
        <Experience />
        <Skills />
        <Milestones />
        <Contact />
      </main>
      <Footer />
    </UIProvider>
  );
}
