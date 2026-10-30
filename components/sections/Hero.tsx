import Image from "next/image";
import { profile } from "@/content/profile";

export default function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative">
      <div className="wrap grid min-h-[calc(100svh-64px)] grid-cols-1 md:grid-cols-12">
        <div className="flex flex-col justify-between gap-12 py-14 md:col-span-7 md:py-20 lg:col-span-6">
          <div>
            <p className="label">
              {profile.role} · {profile.company}
            </p>
            <h1 id="hero-title" className="display mt-6 text-[clamp(40px,11.5vw,148px)]">
              {profile.firstName}
              <span className="block text-fg-3">{profile.lastName}</span>
            </h1>
            <p className="mt-8 max-w-[44ch] text-[18px] leading-[1.55] text-fg-2 md:text-[19px]">{profile.summary}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#systems" className="btn btn-solid">
                Explore systems <span aria-hidden="true">→</span>
              </a>
              <a href="#contact" className="btn">
                Contact
              </a>
            </div>
          </div>
          <ul className="label flex flex-wrap gap-x-6 gap-y-2" aria-label="Focus areas">
            <li>Greater Noida, India</li>
            <li>Python</li>
            <li>FastAPI</li>
            <li>Docker</li>
            <li>Nginx</li>
            <li>Android</li>
          </ul>
        </div>
        {/* The 3D core renders behind this column. The poster stands in until it loads, or when 3D is off. */}
        <div className="relative hidden md:col-span-5 md:block lg:col-span-6" aria-hidden="true">
          <Image
            src="/images/core-poster.webp"
            alt=""
            width={900}
            height={900}
            priority
            className="core-poster absolute left-1/2 top-1/2 w-[min(110%,720px)] max-w-none -translate-x-[46%] -translate-y-1/2"
          />
        </div>
      </div>
    </section>
  );
}
