import { SalariesClient } from "./SalariesClient";
import salaryStats from "../../../public/data/salary-stats.json";

export const metadata = {
  title: "Federal Salary Data — Pay Distribution, Top Agencies & Occupations — FedTracker",
  description: "Explore federal employee salaries: pay distribution, highest-paid agencies and occupations, and GS grade breakdowns from OPM FedScope data.",
};

export default function SalariesPage() {
  return <SalariesClient data={salaryStats} />;
}
