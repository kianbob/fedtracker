import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import ContractsClient from "./ContractsClient";

export const metadata: Metadata = {
  title: "DOGE Contracts: 13,440 Terminated, $61B Cut",
  description: "Complete database of federal contracts terminated by DOGE. See which vendors lost the most, FPDS verification status, and links to vendor profiles.",
  alternates: { canonical: "/doge/contracts" },
  openGraph: {
    title: "DOGE Contract Tracker: 13,440 Contracts Terminated",
    description: "Track federal contract terminations by DOGE with vendor analysis, size distribution, and verification data.",
    type: "article",
    url: "https://openfeds.com/doge/contracts",
  },
};

export default function DogeContractsPage() {
  // Load contract and vendor data
  const contractsData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public/data/doge-contracts-analytics.json"), "utf-8")
  );
  
  const vendorData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public/data/vendor-index.json"), "utf-8")
  );

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "DOGE Contract Tracker: 13,440 Contracts Terminated, $61B in Claimed Savings",
    "description": "Comprehensive tracking of federal contracts terminated by DOGE, including vendor analysis and verification status.",
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
    "url": "https://openfeds.com/doge/contracts",
    "mainEntityOfPage": "https://openfeds.com/doge/contracts",
    "about": [
      {
        "@type": "Thing",
        "name": "Federal Contracts",
        "description": "Government contract terminations and vendor analysis"
      },
      {
        "@type": "Thing",
        "name": "FPDS",
        "description": "Federal Procurement Data System verification"
      },
      {
        "@type": "Thing",
        "name": "Government Vendors",
        "description": "Companies with terminated federal contracts"
      }
    ]
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContractsClient 
        contractsData={contractsData}
        vendorData={vendorData}
      />
    </div>
  );
}