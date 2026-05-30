import { DogeClient } from "./DogeClient";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "DOGE Impact: 217K Federal Jobs Restructured",
  description:
    "Data-driven analysis of the 2025 federal workforce restructuring under DOGE: 217,177 net positions reduced, 10,721 RIFs, hiring reduced 54%. Agency-by-agency breakdown and monthly trends from OPM data.",
  openGraph: {
    title: "DOGE Impact Dashboard — 217K Federal Positions Restructured",
    description:
      "The federal workforce shrank by 217,177 positions since January 2025. See the full breakdown by agency, month, and separation type.",
  },
  alternates: { canonical: "/doge" },
};

function loadJson(filename: string) {
  try {
    const filePath = path.join(process.cwd(), "public", "data", filename);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}


const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is DOGE (Department of Government Efficiency)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "DOGE is the Department of Government Efficiency initiative that restructured 217,000+ federal positions, terminated 13,440 contracts worth $61B, and cut 15,887 grants worth $49B in 2025."
      }
    },
    {
      "@type": "Question",
      "name": "How much has DOGE saved?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "DOGE claims $110.3B in total savings from contract terminations, grant cuts, and lease cancellations. Independent analysis suggests actual verified savings are significantly lower."
      }
    },
    {
      "@type": "Question",
      "name": "How many federal jobs did DOGE eliminate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "DOGE restructured approximately 217,000 federal positions through a combination of RIFs, hiring freezes, deferred resignations, and voluntary separation incentives."
      }
    }
  ]
};
export default function DogePage() {
  const data = loadJson("doge-impact.json");
  const agencyList: { code: string; name: string; employees: number }[] =
    loadJson("agency-list.json") ?? [];

  // Build lookup: agency code → employee count (pre-restructuring headcount)
  const empByCode: Record<string, number> = {};
  for (const a of agencyList) empByCode[a.code] = a.employees;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <DogeClient data={data} agencyEmployees={empByCode} />
    </>);
}
