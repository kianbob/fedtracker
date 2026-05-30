import { TrendsClient } from "./TrendsClient";
import trends from "../../../public/data/trends.json";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Federal Hiring vs Firing Trends 2020-2025",
  description: "Hiring vs. firing trends across the federal workforce.",
  openGraph: {
    title: "Federal Workforce Trends - OpenFeds",
    description: "Monthly hiring and firing trends across federal agencies. Track how the workforce is changing over time.",
  },
  alternates: { canonical: "/trends" },
};

export default function TrendsPage() {
  return <TrendsClient data={trends} />;
}
