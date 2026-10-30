import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { profile } from "@/content/profile";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

const description =
  "Mohammad Ramiz is a software engineer at Moglix building Python automation, backends, APIs and infrastructure, plus the Android and web apps on top.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: `${profile.name} · Software Engineer`, template: `%s · ${profile.name}` },
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "profile", siteName: profile.name, title: `${profile.name} · Software Engineer`, description, url: "/", locale: "en_IN" },
  twitter: { card: "summary_large_image", creator: "@Mohammad__Ramiz" },
};

export const viewport: Viewport = { themeColor: "#0a0a0a", colorScheme: "dark", viewportFit: "cover" };

// Runs before first paint so the boot sequence never flashes for returning visitors or reduced motion.
// data-boot-initial never changes afterwards, so CSS entrance delays can key off it safely.
const bootGate = `try{var d=document.documentElement;if(sessionStorage.getItem('ramiz-boot')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.boot='skip';d.dataset.bootInitial='skip'}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootGate }} />
      </head>
      <body>
        <a href="#main" className="btn btn-solid sr-only fixed left-4 top-4 z-[200] focus:not-sr-only">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
