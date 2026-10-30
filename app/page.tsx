import BootSequence from "@/components/BootSequence";
import About from "@/components/sections/About";
import Architecture from "@/components/sections/Architecture";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Stack from "@/components/sections/Stack";
import SystemsLab from "@/components/sections/SystemsLab";
import Timeline from "@/components/sections/Timeline";
import SceneLayer from "@/scene/SceneLayer";

export default function Home() {
  return (
    <>
      <BootSequence />
      <SceneLayer />
      <main id="main" className="page">
        <Hero />
        <About />
        <SystemsLab />
        <Architecture />
        <Timeline />
        <Stack />
        <Contact />
      </main>
    </>
  );
}
