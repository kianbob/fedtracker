import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Federal Brain Drain Analysis — OpenFeds",
  description: "Which agencies are losing the most talent? Analysis of federal workforce departures by agency, occupation, and education level.",
  alternates: { canonical: "/brain-drain" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
