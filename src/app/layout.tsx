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
  metadataBase: new URL("https://fedtracker.org"),
  title: "FedTracker — Federal Workforce Data",
  description:
    "Track the federal workforce: employees, salaries, layoffs, and hiring across all agencies. Built from OPM FedScope data.",
  openGraph: {
    title: "FedTracker — Federal Workforce Data",
    description: "Track the federal workforce with real data from OPM FedScope.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FedTracker",
  description: "Federal workforce data from OPM FedScope — employees, salaries, layoffs, and hiring trends across all agencies.",
  url: "https://fedtracker.org",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
