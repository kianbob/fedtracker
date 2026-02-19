import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Federal Agencies Directory — OpenFeds",
  description: "Browse all 124 federal agencies with employee counts, average salaries, and workforce data from OPM FedScope.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
