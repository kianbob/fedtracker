import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://fedtracker.vercel.app";
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/agencies`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/layoffs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/occupations`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/states`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/salaries`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/trends`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/doge`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/demographics`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Agency pages
  try {
    const dir = path.join(process.cwd(), "public", "data", "agencies");
    fs.readdirSync(dir).filter(f => f.endsWith(".json")).forEach(f => {
      pages.push({ url: `${base}/agencies/${f.replace(".json", "")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
    });
  } catch {}

  // State pages
  try {
    const dir = path.join(process.cwd(), "public", "data", "state-detail");
    fs.readdirSync(dir).filter(f => f.endsWith(".json")).forEach(f => {
      pages.push({ url: `${base}/states/${f.replace(".json", "")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
    });
  } catch {}

  return pages;
}
