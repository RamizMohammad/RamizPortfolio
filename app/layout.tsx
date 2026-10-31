import type { Metadata, Viewport } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import CommandPalette from "@/components/CommandPalette";
import RevealObserver from "@/components/RevealObserver";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { themeScript } from "@/components/ThemeToggle";
import { profile } from "@/content/profile";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jbm", display: "swap" });

const description =
  "Mohammad Ramiz is a software engineer at Moglix building LLM agents, Python backends, APIs and data pipelines, plus the Android and web apps on top.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: `${profile.name} — Software Engineer`, template: `%s — ${profile.name}` },
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "profile", siteName: profile.name, title: `${profile.name} — Software Engineer`, description, url: "/", locale: "en_IN" },
  twitter: { card: "summary_large_image", creator: "@Mohammad__Ramiz" },
};

export const viewport: Viewport = { themeColor: "#d4f25b", colorScheme: "light", viewportFit: "cover" };

// Lets CSS hide content that reveals on scroll only when JavaScript will reveal it again.
const jsFlag = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="btn-pill sr-only fixed left-4 top-4 z-[200] focus:not-sr-only">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <CommandPalette />
        <RevealObserver />
      </body>
    </html>
  );
}
