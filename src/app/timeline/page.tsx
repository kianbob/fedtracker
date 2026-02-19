import { TimelineClient } from "./TimelineClient";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "DOGE Timeline: Month-by-Month Federal Workforce Impact — OpenFeds",
  description: "Interactive timeline of DOGE's impact on the federal workforce. 335K+ separations, month-by-month trends, hiring freezes, and the September 2025 exodus.",
};

function getData() {
  try {
    const p = path.join(process.cwd(), "public", "data", "doge-timeline.json");
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch { return null; }
}

export default function TimelinePage() {
  return <TimelineClient data={getData()} />;
}
