import { SalariesClient } from "./SalariesClient";
import salaryStats from "../../../public/data/salary-stats.json";

export const metadata = {
  title: "Federal Salary Analysis — FedTracker",
  description: "Federal workforce salary analysis by agency, occupation, and grade level.",
};

export default function SalariesPage() {
  return <SalariesClient data={salaryStats} />;
}
