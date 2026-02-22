import type { Metadata } from "next";
import Link from "next/link";
import { formatNumber, formatSalary, fixAgencyName } from "@/lib/format";
import { RiskTable } from "./RiskTable";
import agencyRisk from "../../../public/data/agency-risk.json";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Agency Risk Dashboard — Which Agencies Are Most At Risk? — OpenFeds",
  description: "Risk scores for every federal agency based on workforce reduction, retirement eligibility, separation rates, and more.",
  openGraph: {
    title: "Agency Risk Dashboard - OpenFeds",
    description: "Risk scores for every federal agency based on workforce reduction, retirement eligibility, and separation rates.",
  },
  alternates: { canonical: "/risk" },
};

export default function RiskPage() {
  const sorted = [...agencyRisk].sort((a, b) => b.riskScore - a.riskScore);
  const highestRisk = sorted[0];
  const avgScore = Math.round(sorted.reduce((s, a) => s + a.riskScore, 0) / sorted.length);
  const criticalCount = sorted.filter((a) => a.riskScore > 60).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'DOGE & Cuts', href: '/cuts' }, { label: 'Risk Dashboard' }]} />
      {/* Hero */}
      <header className="mb-12">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">Agency Risk Analysis</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Agency Disruption Scores
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          A composite score measuring workforce disruption at every federal agency — based on reduction rates, retirement eligibility,
          separation surges, RIF activity, and quit rates. High scores indicate the biggest changes. Whether that&apos;s a problem 
          or progress depends on whether the agency was bloated to begin with.
        </p>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-sm text-red-600 font-medium mb-1">Highest Risk Agency</p>
          <p className="text-2xl font-bold text-red-900">{fixAgencyName(highestRisk.name)}</p>
          <p className="text-sm text-red-700 mt-1">Score: {highestRisk.riskScore}/100</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-sm text-amber-600 font-medium mb-1">Average Risk Score</p>
          <p className="text-4xl font-bold text-amber-900">{avgScore}</p>
          <p className="text-sm text-amber-700 mt-1">Across {sorted.length} agencies</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-sm text-red-600 font-medium mb-1">Critical Zone (&gt;60)</p>
          <p className="text-4xl font-bold text-red-900">{criticalCount}</p>
          <p className="text-sm text-red-700 mt-1">Agencies in critical risk</p>
        </div>
      </div>

      {/* Table */}
      <RiskTable agencies={sorted} />

      {/* Methodology */}
      <section className="bg-gray-50 border border-gray-200 rounded-xl p-8 mt-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Methodology: How Risk Scores Are Calculated</h2>
        <div className="text-gray-700 space-y-3">
          <p>Each agency&apos;s risk score (0–100) is a weighted composite of five factors:</p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li><strong>Workforce Reduction Rate (30%)</strong> — Percentage of employees lost through separations in 2025 vs. headcount.</li>
            <li><strong>Separation Surge (25%)</strong> — Year-over-year increase in separations (2025 vs. 2024). Captures sudden acceleration.</li>
            <li><strong>Retirement Eligibility (20%)</strong> — Percentage of current employees eligible to retire. Higher = more turnover potential (and more opportunity to right-size).</li>
            <li><strong>RIF Activity (15%)</strong> — Number of Reductions in Force as a share of total employees. Direct involuntary losses.</li>
            <li><strong>Quit Rate (10%)</strong> — Percentage of separations that are voluntary quits. High quit rates may signal employees choosing private sector over government.</li>
          </ol>
          <p className="text-sm text-gray-500 mt-4">
            Scores are normalized on a 0–100 scale. Data source: OPM FedScope, December 2025 employment + FY2025 separations.
          </p>
        </div>
      </section>

      {/* Related Analysis */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Related Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/doge", title: "DOGE Impact Dashboard", desc: "Full breakdown of 2025 federal workforce restructuring by agency, month, and separation type." },
            { href: "/workforce-analysis", title: "Workforce Deep Dive", desc: "Retirement cliff, experience drain, STEM brain drain, and pay grade analysis." },
            { href: "/trends", title: "Workforce Trends", desc: "Month-by-month hiring vs. firing trends across all federal agencies." },
            { href: "/impact", title: "Impact by State", desc: "Where federal job losses are concentrated geographically across the U.S." },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group">
              <h3 className="font-serif font-bold text-gray-900 group-hover:text-indigo-700 transition-colors mb-1">{link.title}</h3>
              <p className="text-sm text-gray-500">{link.desc}</p>
              <span className="text-indigo-600 text-sm font-medium mt-2 inline-block">Explore →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
