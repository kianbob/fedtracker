import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import GrantsClient from "./GrantsClient";

export const metadata: Metadata = {
  title: "DOGE Grants: 15,887 Terminated, $49B Cut",
  description: "Track all grants terminated by DOGE: university research, hospital funding, state programs, and international aid. See which recipients lost the most funding.",
  alternates: { canonical: "/doge/grants" },
  openGraph: {
    title: "DOGE Grant Tracker: 15,887 Grants Terminated",
    description: "Complete database of grants canceled by DOGE, with recipient analysis and agency breakdown.",
    type: "article", 
    url: "https://openfeds.com/doge/grants",
  },
};

export default function DogeGrantsPage() {
  // Load grants data
  const grantsData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public/data/doge-grants-analytics.json"), "utf-8")
  );

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "DOGE Grant Tracker: 15,887 Grants Terminated, $49.2B in Claimed Savings",
    "description": "Comprehensive tracking of federal grants terminated by DOGE, including recipient analysis and agency breakdown.",
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
    "url": "https://openfeds.com/doge/grants",
    "mainEntityOfPage": "https://openfeds.com/doge/grants",
    "about": [
      {
        "@type": "Thing",
        "name": "Federal Grants",
        "description": "Government grant terminations and cancellations"
      },
      {
        "@type": "Thing",
        "name": "USAID",
        "description": "U.S. Agency for International Development"
      },
      {
        "@type": "Thing",
        "name": "University Research Grants",
        "description": "Federal research funding to universities"
      }
    ]
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GrantsClient grantsData={grantsData} />
    </div>
  );
}