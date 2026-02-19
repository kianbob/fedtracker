import { DogeClient } from "./DogeClient";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "DOGE Impact Dashboard — 217K Federal Jobs Lost in 2025 — FedTracker",
  description:
    "Data-driven analysis of the 2025 federal workforce reduction under DOGE: 217,177 net jobs lost, 10,721 RIFs, hiring frozen 54%. Agency-by-agency breakdown and monthly trends from OPM data.",
  openGraph: {
    title: "DOGE Impact Dashboard — 217K Federal Jobs Lost",
    description:
      "The federal government lost 217,177 employees since January 2025. See the full breakdown by agency, month, and separation type.",
  },
};

function getDogeData() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "doge-impact.json"
    );
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

export default function DogePage() {
  const data = getDogeData();
  return <DogeClient data={data} />;
}
