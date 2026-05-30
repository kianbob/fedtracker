import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import SavingsClient from "./SavingsClient";

export const metadata: Metadata = {
  title: "DOGE Savings Fact-Check: $110B Claims Analyzed",
  description: "Fact-checking DOGE's claimed $110.3B in federal savings. See the breakdown by contracts, grants, and leases, plus verification status and top claims analyzed.",
  alternates: { canonical: "/doge/savings" },
  openGraph: {
    title: "DOGE Savings Fact-Check Dashboard",
    description: "Analyzing DOGE's $110.3B claimed savings: which contracts terminated, which grants cut, and what the data actually shows.",
    type: "article",
    url: "https://openfeds.com/doge/savings",
  },
};

export default function DogeLogPage() {
  // Load data files
  const dashboardData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public/data/doge-dashboard.json"), "utf-8")
  );
  const contractsData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public/data/doge-contracts-analytics.json"), "utf-8")
  );

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "DOGE Savings Fact-Check Dashboard: $110.3B in Claims Analyzed",
    "description": "Comprehensive analysis of DOGE's claimed federal savings, including verification status and breakdown by spending type.",
    "author": {
      "@type": "Organization",
      "name": "OpenFeds"
    },
    "publisher": {
      "@type": "Organization",
      "name": "OpenFeds",
      "logo": {
        "@type": "ImageObject",
        "url": "https://openfeds.com/logo.png"
      }
    },
    "datePublished": "2025-03-21",
    "dateModified": "2025-03-21",
    "url": "https://openfeds.com/doge/savings",
    "mainEntityOfPage": "https://openfeds.com/doge/savings",
    "about": [
      {
        "@type": "Thing",
        "name": "DOGE",
        "description": "Department of Government Efficiency"
      },
      {
        "@type": "Thing", 
        "name": "Federal Contracts",
        "description": "Government contract terminations and savings"
      },
      {
        "@type": "Thing",
        "name": "Federal Grants",
        "description": "Government grant eliminations"
      }
    ]
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SavingsClient 
        dashboardData={dashboardData}
        contractsData={contractsData}
      />
    </div>
  );
}