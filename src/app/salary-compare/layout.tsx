import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Does Your Salary Compare to Federal Workers? — OpenFeds",
  description:
    "Compare your salary to federal employees. See how you rank against 1M+ federal workers by state, occupation, and overall pay distribution.",
  openGraph: {
    title: "Federal Employee Salary Comparison Tool - OpenFeds",
    description:
      "Enter your salary and see how it compares to federal workers by state and occupation.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
