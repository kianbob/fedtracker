import type { Metadata } from "next";
import { SpendingClient } from "./SpendingClient";

export const metadata: Metadata = {
  title: "Agency Spending — Budget Per Employee, Contracts & Outsourcing — OpenFeds",
  description:
    "How much does each federal agency spend per employee? Explore budget authority, contract outsourcing, grants, and direct payments by agency — powered by USASpending.gov data.",
  openGraph: {
    title: "Agency Spending Data - OpenFeds",
    description: "Budget per employee, contract outsourcing, grants, and direct payments across federal agencies from USASpending.gov data.",
  },
};

export default function SpendingPage() {
  return <SpendingClient />;
}
