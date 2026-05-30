import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Federal Job Losses by State & Region",
  description: "How federal layoffs and separations affect communities across all 50 states.",
  alternates: { canonical: "/geographic-impact" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
