import React from "react";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.openfeds.org"),
  alternates: {
    canonical: "./",
  },
  title: "Federal Employee Data & Salary Tracker | OpenFeds",
  description:
    "Track 1.81M federal employees across 128 agencies. Salaries, layoffs, hiring trends & DOGE impact from official OPM data.",
  openGraph: {
    title: "Federal Employee Data & Salary Tracker | OpenFeds",
    description: "Track 1.81M federal employees across 128 agencies. Official OPM salary, layoff & hiring data.",
    type: "website",
  },
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "OpenFeds",
  "url": "https://www.openfeds.org",
  "description": "Track the federal workforce with data from OPM FedScope. 1.81M employees, 128 agencies, salaries, layoffs, hiring trends, and DOGE impact analysis.",
  "publisher": {
    "@type": "Organization",
    "name": "TheDataProject.ai",
    "url": "https://thedataproject.ai"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.openfeds.org/lookup?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

const jsonLdDataset = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "Federal Workforce Analysis (FY2020–2026)",
  "description": "Analysis of OPM FedScope employment, separations, and accessions data covering 1.81 million federal employees across 128 agencies, including 2025-2026 DOGE workforce reduction impact.",
  "url": "https://www.openfeds.org",
  "creator": {
    "@type": "Organization",
    "name": "TheDataProject.ai"
  },
  "isBasedOn": {
    "@type": "Dataset",
    "name": "OPM FedScope",
    "description": "Official federal workforce data published by the U.S. Office of Personnel Management covering employment demographics, separations, and accessions.",
    "url": "https://data.opm.gov",
    "license": "https://creativecommons.org/publicdomain/zero/1.0/",
    "creator": {
      "@type": "Organization",
      "name": "U.S. Office of Personnel Management"
    }
  },
  "temporalCoverage": "2020-01/2026-07",
  "license": "https://creativecommons.org/publicdomain/zero/1.0/",
  "variableMeasured": [
    "Employment Count",
    "Average Salary",
    "Separations",
    "Accessions",
    "Agency",
    "Occupation"
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2LHTNSRWPK" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-2LHTNSRWPK');`,
          }}
        />
        <link rel="alternate" type="application/rss+xml" title="OpenFeds" href="/feed.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite, null, 2) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDataset, null, 2) }}
        />
      </head>
      <body className="font-sans bg-white text-gray-900 antialiased">
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
