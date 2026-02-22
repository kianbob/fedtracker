import { DogeClient } from "./DogeClient";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "DOGE Impact Dashboard — 217K Federal Positions Restructured — OpenFeds",
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

export default function DogePage() {
  const data = loadJson("doge-impact.json");
  const agencyList: { code: string; name: string; employees: number }[] =
    loadJson("agency-list.json") ?? [];

  // Build lookup: agency code → employee count (pre-restructuring headcount)
  const empByCode: Record<string, number> = {};
  for (const a of agencyList) empByCode[a.code] = a.employees;

  return <DogeClient data={data} agencyEmployees={empByCode} />;
}
