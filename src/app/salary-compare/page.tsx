import SalaryCompare from "@/components/SalaryCompare";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Does Your Salary Compare? — Federal Pay Comparison Tool — OpenFeds",
  description: "Compare your salary to federal employees by agency, occupation, and GS grade. See where you stand against 2.07 million federal workers.",
  alternates: { canonical: "/salary-compare" },
};

export default function SalaryComparePage() {
  return <SalaryCompare />;
}
