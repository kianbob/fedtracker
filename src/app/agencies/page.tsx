import { AgenciesClient } from "./AgenciesClient";

export const metadata = {
  title: "All Federal Agencies — Employee Counts & Salaries — OpenFeds",
  description: "Browse all 128 federal agencies with employee counts and average salary data from OPM FedScope. Search, sort, and explore.",
  alternates: { canonical: "/agencies" },
};

export default function AgenciesPage() {
  return <AgenciesClient />;
}
