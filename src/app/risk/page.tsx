import type { Metadata } from "next";
import Link from "next/link";
import { formatNumber, formatSalary, fixAgencyName } from "@/lib/format";
import { RiskTable } from "./RiskTable";
import agencyRisk from "../../../public/data/agency-risk.json";

export const metadata: Metadata = {
  title: "Agency Risk Dashboard — Which Agencies Are Most At Risk? — FedTracker",
  description: "Risk scores for every federal agency based on workforce reduction, retirement eligibility, separation rates, and more.",
};

export default function RiskPage() {
  const sorted = [...agencyRisk].sort((a, b) => b.riskScore - a.riskScore);
  const highestRisk = sorted[0];
  const avgScore = Math.round(sorted.reduce((s, a) => s + a.riskScore, 0) / sorted.length);
  const criticalCount = sorted.filter((a) => a.riskScore > 60).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <header className="mb-12">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">Agency Risk Analysis</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Which Agencies Are Most At Risk?
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          A composite risk score for every federal agency, based on workforce reduction rates, retirement eligibility,
          separation surges, RIF activity, and quit rates.
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
            <li><strong>Retirement Vulnerability (20%)</strong> — Percentage of current employees eligible to retire. Higher = more future risk.</li>
            <li><strong>RIF Activity (15%)</strong> — Number of Reductions in Force as a share of total employees. Direct involuntary losses.</li>
            <li><strong>Quit Rate (10%)</strong> — Percentage of separations that are voluntary quits, signaling morale and retention issues.</li>
          </ol>
          <p className="text-sm text-gray-500 mt-4">
            Scores are normalized on a 0–100 scale. Data source: OPM FedScope, December 2025 employment + FY2025 separations.
          </p>
        </div>
      </section>
    </div>
  );
}
