import { TrendsClient } from "./TrendsClient";
import trends from "../../../public/data/trends.json";

export const metadata = {
  title: "Federal Workforce Trends — FedTracker",
  description: "Hiring vs. firing trends across the federal workforce.",
};

export default function TrendsPage() {
  return <TrendsClient data={trends} />;
}
