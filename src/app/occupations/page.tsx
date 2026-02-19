import { OccupationsClient } from "./OccupationsClient";

export const metadata = {
  title: "Federal Occupations — Job Titles & Salaries — OpenFeds",
  description: "Explore all federal occupations with employee counts and average salaries. Search by job title or occupation code.",
};

export default function OccupationsPage() {
  return <OccupationsClient />;
}
