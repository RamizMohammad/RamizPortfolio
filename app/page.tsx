import About from "@/components/home/About";
import Architecture from "@/components/home/Architecture";
import Contact from "@/components/home/Contact";
import Experience from "@/components/home/Experience";
import Hero from "@/components/home/Hero";
import Moments from "@/components/home/Moments";
import Publications from "@/components/home/Publications";
import Recognition from "@/components/home/Recognition";
import Stack from "@/components/home/Stack";
import Work from "@/components/home/Work";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <About />
      <Moments />
      <Experience />
      <Work />
      <Architecture />
      <Stack />
      <Recognition />
      <Publications />
      <Contact />
    </main>
  );
}
