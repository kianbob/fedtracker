import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Geographic Impact of Federal Workforce Changes — OpenFeds",
  description: "How federal layoffs and separations affect communities across all 50 states.",
  alternates: { canonical: "/geographic-impact" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
