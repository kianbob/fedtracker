import { AgenciesClient } from "./AgenciesClient";

export const metadata = {
  title: "All 128 Federal Agencies: Salaries & Workforce",
  description: "Compare all 128 federal agencies by employee count, average salary & workforce size. Searchable directory from OPM data.",
  alternates: { canonical: "/agencies" },
};

export default function AgenciesPage() {
  return <AgenciesClient />;
}
