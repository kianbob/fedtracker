import { AnalysisClient } from "./AnalysisClient";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Workforce Analysis — Who's Leaving, Retirement Risk, Experience Exodus — FedTracker",
  description: "Deep analysis of the federal workforce: retirement cliff, experience drain, STEM brain drain, manager ratios, and who's actually leaving in 2025.",
  openGraph: {
    title: "Workforce Analysis - FedTracker",
    description: "Deep analysis of federal workforce trends: retirement cliff, experience drain, STEM brain drain, and who's actually leaving in 2025.",
  },
};

function loadJson(name: string) {
  try {
    const p = path.join(process.cwd(), "public", "data", name);
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch { return null; }
}

export default function AnalysisPage() {
  return (
    <AnalysisClient
      whosLeaving={loadJson("whos-leaving.json")}
      retirementRisk={loadJson("retirement-risk.json")}
      stemAnalysis={loadJson("stem-analysis.json")}
      managerRatios={loadJson("manager-ratios.json")}
      experienceExodus={loadJson("experience-exodus.json")}
      overseas={loadJson("overseas.json")}
      gradeDistribution={loadJson("grade-distribution.json")}
    />
  );
}
