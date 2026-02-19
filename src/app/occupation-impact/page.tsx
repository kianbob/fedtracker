import { OccImpactClient } from "./OccImpactClient";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "Occupation Impact — Which Federal Jobs Were Hit Hardest by DOGE — OpenFeds",
  description: "Analysis of DOGE's impact by occupation: which federal jobs saw the most separations, RIFs, and workforce reduction in 2025.",
};

function getData() {
  try {
    const p = path.join(process.cwd(), "public", "data", "occupation-impact.json");
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch { return null; }
}

export default function OccupationImpactPage() {
  return <OccImpactClient data={getData()} />;
}
