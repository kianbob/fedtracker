import { DogeClient } from "./DogeClient";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DOGE Impact — 2025 Federal Workforce Reduction — FedTracker",
  description: "Data-driven analysis of the 2025 federal workforce reduction under DOGE. Net losses, hiring freeze impact, agency-by-agency breakdown, and monthly trends.",
  openGraph: {
    title: "DOGE Impact — 2025 Federal Workforce Reduction",
    description: "The federal government lost 200K+ employees in 2025. See the data.",
  },
};

function getDogeData() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "doge-impact.json");
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
