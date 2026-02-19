import Link from "next/link";
import type { Metadata } from "next";
import { StatCard } from "@/components/StatCard";
import { HomepageChart } from "./HomepageChart";
import { HomeSearch } from "@/components/HomeSearch";
import { formatNumber, formatSalary, fixAgencyName } from "@/lib/format";
import siteStats from "../../public/data/site-stats.json";
import agencyList from "../../public/data/agency-list.json";
import agencyRisk from "../../public/data/agency-risk.json";
import occupations from "../../public/data/occupations.json";
import statesData from "../../public/data/states.json";
import trends from "../../public/data/trends.json";

export const metadata: Metadata = {
  title: "FedTracker — Track the Federal Workforce | 2M+ Employees, 128 Agencies",
  description: "Explore data on 2M+ federal employees across 128 agencies. Salaries, layoffs, hiring trends, and separations — all from official OPM FedScope data.",
};

export default function Home() {
  const topAgencies = agencyList.slice(0, 12);
  const maxEmployees = topAgencies[0]?.employees ?? 1;
  const recentTrends = trends.monthly.slice(-12);

  const searchItems = [
    ...agencyList
      .filter((a) => a.code !== "*")
      .map((a) => ({ label: fixAgencyName(a.name), href: `/agencies/${a.code}`, type: "Agency" as const })),
    ...occupations
      .filter((o) => o.code !== "*")
      .map((o) => ({ label: o.name, href: `/occupations/${o.code}`, type: "Occupation" as const })),
    ...statesData
      .filter((s) => s.code !== "*" && s.code !== "NDR")
      .map((s) => ({ label: s.name, href: `/states/${s.code}`, type: "State" as const })),
  ];

  return (
    <div>
      {/* Data freshness banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-800">
        📊 Data from OPM FedScope: Employment as of December 2025 · Separations &amp; Accessions FY2020–2025. <span className="font-medium">Now includes December 2025 data.</span>
      </div>

      {/* Hero */}
      <section className="accent-gradient text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Track the Federal Workforce
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mb-4">
            Explore data on {formatNumber(siteStats.totalEmployees)} federal employees across {siteStats.agencyCount} agencies.
            Salaries, layoffs, hiring trends — all from official OPM data.
          </p>
          <p className="text-sm text-indigo-200 max-w-2xl mb-8">
            Built for journalists, researchers, and anyone tracking government workforce changes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/layoffs" className="bg-white text-accent font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
              Explore Layoffs & Separations →
            </Link>
            <Link href="/agencies" className="border border-white/30 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Browse Agencies
            </Link>
            <Link href="/salaries" className="border border-white/30 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Salary Data
            </Link>
          </div>
          <HomeSearch items={searchItems} />
        </div>
      </section>

      {/* Narrative Hook */}
      <section className="max-w-4xl mx-auto px-4 mt-10 mb-4 text-center">
        <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed">
          <span className="font-bold text-accent text-2xl sm:text-3xl">217,000</span> federal positions have been restructured since January 2025 — the largest workforce reduction in modern history. Here&apos;s the data.
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 mt-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Federal Employees" value={formatNumber(siteStats.totalEmployees)} sub="December 2025 snapshot" />
          <StatCard label="Average Salary" value={formatSalary(siteStats.avgSalary)} sub="Across all agencies" />
          <StatCard label="Separations (FY20-25)" value={formatNumber(siteStats.totalSeparations)} sub="People who left" />
          <StatCard label="Accessions (FY20-25)" value={formatNumber(siteStats.totalAccessions)} sub="People who joined" />
        </div>
      </section>

      {/* DOGE Impact CTA */}
      <section className="max-w-7xl mx-auto px-4 mt-10">
        <Link href="/doge" className="block bg-red-50 border-2 border-red-200 rounded-xl p-6 hover:bg-red-100 hover:border-red-300 transition-all group">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">New Analysis</p>
              <h3 className="font-serif text-2xl font-bold text-red-900 group-hover:text-red-800">
                DOGE Impact: 2025 Workforce Reduction
              </h3>
              <p className="text-sm text-red-700 mt-1">
                The federal government underwent its largest restructuring in modern history. See the data.
              </p>
              <div className="flex gap-2 mt-2">
                <Link href="/impact" className="text-xs font-medium text-red-600 hover:underline">State-by-State Impact →</Link>
              </div>
            </div>
            <span className="bg-red-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm whitespace-nowrap self-start sm:self-center group-hover:bg-red-700 transition-colors">
              View Report →
            </span>
          </div>
        </Link>
      </section>

      {/* Recent Trends Chart */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-3xl font-bold text-gray-900">Recent Trends</h2>
          <Link href="/trends" className="text-accent hover:underline text-sm font-medium">View full trends →</Link>
        </div>
        <p className="text-sm text-gray-500 mb-4">Monthly hiring vs. separations over the last 12 months.</p>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <HomepageChart data={recentTrends} />
        </div>
      </section>

      {/* Key Findings */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">Key Findings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* RIF card */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
            <p className="text-sm font-medium text-red-600 uppercase tracking-wide mb-1">Reductions in Force</p>
            <p className="font-serif text-4xl sm:text-5xl font-bold text-accent mb-2">
              {siteStats.topRifAgencies.reduce((sum, a) => sum + a.rifCount, 0).toLocaleString()}
            </p>
            <p className="text-sm text-red-700 mb-4">total RIFs across all agencies (FY2020–2025)</p>
            <ul className="space-y-2 border-t border-red-200 pt-4">
              {siteStats.topRifAgencies.slice(0, 5).map((a) => (
                <li key={a.code} className="flex justify-between text-sm">
                  <Link href={`/agencies/${a.code}`} className="text-red-800 hover:underline mr-2">
                    {fixAgencyName(a.name)}
                  </Link>
                  <span className="font-semibold text-red-900 whitespace-nowrap">{a.rifCount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quit rates */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
            <p className="text-sm font-medium text-amber-600 uppercase tracking-wide mb-1">Highest Quit Rate</p>
            <p className="font-serif text-4xl sm:text-5xl font-bold text-accent mb-2">
              {siteStats.topQuitRates[0]?.quitRate}%
            </p>
            <p className="text-sm text-amber-700 mb-4">of separations at {fixAgencyName(siteStats.topQuitRates[0]?.name)} were voluntary quits</p>
            <ul className="space-y-2 border-t border-amber-200 pt-4">
              {siteStats.topQuitRates.slice(0, 5).map((a) => (
                <li key={a.code} className="flex justify-between text-sm">
                  <Link href={`/agencies/${a.code}`} className="text-amber-800 hover:underline truncate mr-2">
                    {fixAgencyName(a.name)}
                  </Link>
                  <span className="font-semibold text-amber-900 whitespace-nowrap">{a.quitRate}%</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Net change */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
            <p className="text-sm font-medium text-indigo-600 uppercase tracking-wide mb-1">Net Workforce Change</p>
            <p className={`font-serif text-4xl sm:text-5xl font-bold mb-2 ${siteStats.totalAccessions - siteStats.totalSeparations > 0 ? "text-green-600" : "text-red-600"}`}>
              {siteStats.totalAccessions - siteStats.totalSeparations > 0 ? "+" : ""}
              {formatNumber(siteStats.totalAccessions - siteStats.totalSeparations)}
            </p>
            <p className="text-sm text-indigo-700 mb-4">net change in federal headcount (FY2020–2025)</p>
            <div className="space-y-3 border-t border-indigo-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-indigo-800">Total Accessions</span>
                <span className="font-semibold text-green-700">+{formatNumber(siteStats.totalAccessions)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-indigo-800">Total Separations</span>
                <span className="font-semibold text-red-700">-{formatNumber(siteStats.totalSeparations)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agency Risk Scores */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-3xl font-bold text-gray-900">Agency Risk Scores</h2>
          <Link href="/risk" className="text-accent hover:underline text-sm font-medium">View all scores →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...agencyRisk].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5).map((a) => (
            <Link
              key={a.code}
              href={`/agencies/${a.code}`}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-red-200 transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  a.riskScore > 60 ? "bg-red-100 text-red-700" : a.riskScore > 30 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                }`}>{a.riskScore}</span>
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${a.riskScore > 60 ? "bg-red-500" : a.riskScore > 30 ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${a.riskScore}%` }} />
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900 group-hover:text-accent leading-tight">{fixAgencyName(a.name)}</p>
              <p className="text-xs text-gray-500">{a.reductionPct > 100 ? '>100' : a.reductionPct}% workforce reduction</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Analysis */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">Featured Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: "/doge", icon: "🏛️", title: "DOGE Impact", desc: "Track which agencies DOGE targeted and the real workforce impact" },
            { href: "/risk", icon: "📉", title: "Risk Scores", desc: "Agency-by-agency vulnerability assessment for future cuts" },
            { href: "/states", icon: "🗺️", title: "State Impact", desc: "How federal workforce changes affect your state" },
            { href: "/workforce-analysis", icon: "🔍", title: "Workforce Analysis", desc: "Deep dive into federal employment patterns and trends" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-accent transition-all group"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-accent transition-colors mt-2 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 leading-snug">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Agencies */}
      <section className="max-w-7xl mx-auto px-4 mt-16 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl font-bold text-gray-900">Largest Agencies</h2>
          <Link href="/agencies" className="text-accent hover:underline text-sm font-medium">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topAgencies.map((a) => (
            <Link
              key={a.code}
              href={`/agencies/${a.code}`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-accent-200 transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors mb-2 truncate">
                {fixAgencyName(a.name)}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span>{formatNumber(a.employees)} employees</span>
                <span>•</span>
                <span>Avg {formatSalary(a.avgSalary)}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${Math.round((a.employees / maxEmployees) * 100)}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
