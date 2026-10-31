import About from "@/components/home/About";
import Architecture from "@/components/home/Architecture";
import Contact from "@/components/home/Contact";
import Experience from "@/components/home/Experience";
import Hero from "@/components/home/Hero";
import Recognition from "@/components/home/Recognition";
import Stack from "@/components/home/Stack";
import Work from "@/components/home/Work";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <About />
      <Work />
      <Architecture />
      <Stack />
      <Experience />
      <Recognition />
      <Contact />
    </main>
  );
}
