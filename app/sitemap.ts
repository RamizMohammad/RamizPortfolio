import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";
import { publicSystems } from "@/content/systems";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: profile.siteUrl, priority: 1 },
    { url: `${profile.siteUrl}/achievements`, priority: 0.6 },
    ...publicSystems.map((s) => ({ url: `${profile.siteUrl}/work/${s.slug}`, priority: 0.8 })),
  ];
}
