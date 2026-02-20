import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.openfeds.org";
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
    { url: `${base}/workforce-analysis`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/lookup`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/downloads`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/subagencies`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/findings`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/risk`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/impact`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/education`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/timeline`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/occupation-impact`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/appointments`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/spending`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/federal-bloat`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/who-got-cut`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/salary-analysis`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/brain-drain`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/retirement-cliff`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/geographic-impact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/stem-workforce`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/salary-explorer`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/monthly-timeline`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  // Separation type pages
  const separationCodes = ["SA", "SB", "SC", "SD", "SE", "SF", "SG", "SH", "SJ", "SK", "SL"];
  separationCodes.forEach(code => {
    pages.push({ url: `${base}/separations/${code}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
  });

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

  // Occupation families
  pages.push({ url: `${base}/occupations/families`, lastModified: now, changeFrequency: "monthly", priority: 0.8 });
  try {
    const familiesPath = path.join(process.cwd(), "public", "data", "occupation-families.json");
    const families: { slug: string }[] = JSON.parse(fs.readFileSync(familiesPath, "utf-8"));
    families.forEach(f => {
      pages.push({ url: `${base}/occupations/families/${f.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
    });
  } catch {}

  // Occupation detail pages
  try {
    const occupationsPath = path.join(process.cwd(), "public", "data", "occupations.json");
    const occupations: { code: string }[] = JSON.parse(fs.readFileSync(occupationsPath, "utf-8"));
    occupations.forEach(occ => {
      if (occ.code && occ.code !== "*") {
        pages.push({ url: `${base}/occupations/${occ.code}`, lastModified: now, changeFrequency: "monthly", priority: 0.6 });
      }
    });
  } catch {}

  // Subagency detail pages
  try {
    const subagenciesPath = path.join(process.cwd(), "public", "data", "subagencies.json");
    const subagencies: { code: string }[] = JSON.parse(fs.readFileSync(subagenciesPath, "utf-8"));
    subagencies.forEach(sub => {
      pages.push({ url: `${base}/subagencies/${sub.code}`, lastModified: now, changeFrequency: "monthly", priority: 0.6 });
    });
  } catch {}

  return pages;
}
