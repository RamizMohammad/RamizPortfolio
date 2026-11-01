import About from "@/components/home/About";
import Awards from "@/components/home/Awards";
import Companies from "@/components/home/Companies";
import Architecture from "@/components/home/Architecture";
import Contact from "@/components/home/Contact";
import Experience from "@/components/home/Experience";
import Hero from "@/components/home/Hero";
import Moments from "@/components/home/Moments";
import { Papers, Patents } from "@/components/home/Publications";
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
      <Awards />
      <Patents />
      <Papers />
      <Companies />
      <Contact />
    </main>
  );
}
