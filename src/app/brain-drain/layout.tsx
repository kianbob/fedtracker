import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Brain Drain Index: Who's Really Leaving Government — FedTracker",
  description:
    "Agencies are losing employees earning $49K more than their replacements. Interactive analysis of the federal brain drain by agency, grade, and experience.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
