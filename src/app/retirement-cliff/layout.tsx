import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Federal Retirement Cliff: Aging Workforce Data",
  description: "Analysis of retirement-eligible federal employees and the coming wave of federal workforce departures.",
  alternates: { canonical: "/retirement-cliff" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
