import type { MetadataRoute } from "next";

const languages = ["ru", "en", "uz"] as const;

const staticRoutes = [
  "",
  "publications",
  "glossary",
  "roadmap",
  "archive",
  "contacts",
  "disciplines",
  "history",
  "hymn",
  "people",
  "projects",
  "timeline",
  "department",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const entries: MetadataRoute.Sitemap = [];

  for (const lang of languages) {
    for (const route of staticRoutes) {
      const path = route ? `/${lang}/${route}` : `/${lang}`;
      entries.push({
        url: `${siteUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  return entries;
}
