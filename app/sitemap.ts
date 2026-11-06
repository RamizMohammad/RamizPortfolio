import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";
import { publicSystems } from "@/content/systems";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: profile.siteUrl, priority: 1 },
    { url: `${profile.siteUrl}/achievements`, priority: 0.6 },
    { url: `${profile.siteUrl}/resume`, priority: 0.7 },
    { url: `${profile.siteUrl}/shipyard`, priority: 0.7 },
    // Switched off until the status endpoint is online; see app/_infra/page.tsx.
    // { url: `${profile.siteUrl}/infra`, priority: 0.6 },
    ...publicSystems.map((s) => ({ url: `${profile.siteUrl}/work/${s.slug}`, priority: 0.8 })),
  ];
}
