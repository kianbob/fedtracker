import { SalariesClient } from "./SalariesClient";
import salaryStats from "../../../public/data/salary-stats.json";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Federal Salary Data — Pay Distribution, Top Agencies & Occupations — OpenFeds",
  description: "Explore federal employee salaries: pay distribution, highest-paid agencies and occupations, and GS grade breakdowns from OPM FedScope data.",
  openGraph: {
    title: "Federal Salary Data - OpenFeds",
    description: "Pay distribution, highest-paid agencies and occupations, and GS grade breakdowns for federal employees.",
  },
};

export default function SalariesPage() {
  return <SalariesClient data={salaryStats} />;
}
