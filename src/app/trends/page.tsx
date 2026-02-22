import { TrendsClient } from "./TrendsClient";
import trends from "../../../public/data/trends.json";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Federal Workforce Trends — Hiring vs. Firing — OpenFeds",
  description: "Hiring vs. firing trends across the federal workforce.",
  alternates: { canonical: "/trends" },
  openGraph: {
    title: "Federal Workforce Trends - OpenFeds",
    description: "Monthly hiring and firing trends across federal agencies. Track how the workforce is changing over time.",
  },
};

export default function TrendsPage() {
  return <TrendsClient data={trends} />;
}
