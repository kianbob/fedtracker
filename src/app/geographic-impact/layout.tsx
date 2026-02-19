import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Where Federal Jobs Are: The Geographic Footprint of Government — OpenFeds",
  description:
    "Interactive map and analysis of where federal employees actually work. It's not all DC — explore the geographic distribution across all 50 states.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
