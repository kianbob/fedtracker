import { DemographicsClient } from "./DemographicsClient";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Federal Workforce Demographics — Age, Education, Veterans, Telework — OpenFeds",
  description: "Explore the demographics of the federal workforce: age distribution, education levels, veteran status, remote work, and race/ethnicity composition from OPM FedScope.",
  openGraph: {
    title: "Federal Workforce Demographics - OpenFeds",
    description: "Age distribution, education levels, veteran status, and telework patterns across the federal workforce from OPM FedScope data.",
  },
  alternates: { canonical: "/demographics" },
};

function getDemographicsData() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "demographics.json");
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

export default function DemographicsPage() {
  const data = getDemographicsData();
  return <DemographicsClient data={data} />;
}
