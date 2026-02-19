import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Retirement Cliff: Which Agencies Are About to Lose Half Their Workforce — OpenFeds",
  description:
    "54.5% of Selective Service employees are near retirement age. Interactive analysis of the federal retirement tsunami by agency and age distribution.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
