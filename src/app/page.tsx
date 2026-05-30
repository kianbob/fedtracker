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
  title: "OpenFeds — Track the Federal Workforce | 2M+ Employees, 128 Agencies",
  description: "Search 2M+ federal employee records. Compare salaries by agency, track DOGE layoffs & 335K separations across 128 agencies.",
};


const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How many federal employees are there in 2025?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "There are approximately 2.07 million federal civilian employees across 128 agencies, according to OPM FedScope data."
      }
    },
    {
      "@type": "Question",
      "name": "What is the average federal employee salary?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The average federal employee salary is approximately $106,000, though most employees earn between $60,000 and $100,000 depending on GS grade and location."
      }
    },
    {
      "@type": "Question",
      "name": "How many federal workers were laid off by DOGE?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In 2025, over 335,000 federal separations occurred — a 67% increase over 2024. This includes 10,721 RIFs (layoffs), up from just 46 the prior year."
      }
    },
    {
      "@type": "Question",
      "name": "What is OPM FedScope data?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "FedScope is the official federal workforce database published by the U.S. Office of Personnel Management (OPM), covering employment, salaries, demographics, and separations."
      }
    }
  ]
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
          <span className="font-bold text-accent text-2xl sm:text-3xl">280,000+</span> federal positions have been eliminated since January 2025 — the largest peacetime workforce reduction in American history. Here&apos;s the data.
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

      {/* DOGE Data Hub CTA */}
      <section className="max-w-7xl mx-auto px-4 mt-10">
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-xl p-6 sm:p-8 text-white">
          <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wide mb-2">📊 DOGE Data Hub</p>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
            $110.3 Billion in &ldquo;Savings&rdquo; — We Checked the Math
          </h3>
          <p className="text-indigo-200 mb-4 max-w-2xl">
            DOGE claims $110.3B saved from 29,591 terminated contracts, grants, and leases. 
            We pulled every record from the DOGE API and cross-referenced the data. Here&apos;s what we found.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">13,440</p>
              <p className="text-xs text-indigo-300">Contracts Cut</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">15,887</p>
              <p className="text-xs text-indigo-300">Grants Cut</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">107K</p>
              <p className="text-xs text-indigo-300">Payments Reviewed</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">280K+</p>
              <p className="text-xs text-indigo-300">Positions Eliminated</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/doge/savings" className="bg-white text-indigo-900 font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-indigo-50 transition-colors">
              Savings Fact-Check →
            </Link>
            <Link href="/doge/contracts" className="border border-white/30 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors">
              Contract Tracker
            </Link>
            <Link href="/doge/grants" className="border border-white/30 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors">
              Grant Tracker
            </Link>
            <Link href="/doge" className="border border-white/30 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors">
              Workforce Impact
            </Link>
          </div>
        </div>
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

      {/* Salary Compare CTA */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <Link
          href="/salary-compare"
          className="block bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl p-8 sm:p-10 hover:from-indigo-700 hover:to-indigo-600 transition-all group shadow-lg"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                How Does Your Salary Compare?
              </h3>
              <p className="text-indigo-100 text-sm sm:text-base">
                See how your pay stacks up against 2M+ federal employees across every agency, grade, and occupation.
              </p>
            </div>
            <span className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg text-sm whitespace-nowrap self-start sm:self-center group-hover:bg-indigo-50 transition-colors">
              Compare Now →
            </span>
          </div>
        </Link>
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
              <p className="text-xs text-gray-500">{a.reductionPct > 100 ? '>100%*' : `${a.reductionPct}%`} workforce reduction</p>
            </Link>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-400">
          * &gt;100% reduction means separations exceeded current headcount (e.g. due to prior hiring freezes or transfers).
        </p>
      </section>

      {/* Featured Analysis */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">Featured Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: "/doge", icon: "🏛️", title: "DOGE Impact", desc: "Inside the largest federal restructuring in modern history — who was cut and why" },
            { href: "/risk", icon: "📉", title: "Risk Scores", desc: "Which agencies are most vulnerable to the next round of cuts" },
            { href: "/who-got-cut", icon: "👤", title: "Who Got Cut", desc: "The demographics, pay grades, and job types behind the layoff numbers" },
            { href: "/salary-analysis", icon: "💰", title: "Salary Analysis", desc: "How federal pay compares across agencies, grades, and geography" },
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

      {/* Latest Analysis */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">Latest Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              href: "/federal-bloat",
              title: "The Federal Bloat Myth",
              date: "February 2025",
              desc: "The federal workforce has barely grown in 50 years while the population surged. We break down the real numbers behind the \"bloated bureaucracy\" narrative.",
            },
            {
              href: "/who-got-cut",
              title: "Who Got Cut: A Demographic Breakdown",
              date: "February 2025",
              desc: "Veterans, long-tenured employees, and specific pay grades bore the brunt of 2025 reductions. Here's what the separation data reveals.",
            },
            {
              href: "/salary-analysis",
              title: "Federal Salary Deep Dive",
              date: "February 2025",
              desc: "From GS-5 to senior executives, how does federal pay actually stack up? A data-driven look at compensation across the government.",
            },
          ].map((article) => (
            <Link
              key={article.href}
              href={article.href}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-accent transition-all group"
            >
              <div className="p-6">
                <p className="text-xs font-medium text-accent uppercase tracking-wide mb-2">{article.date}</p>
                <h3 className="font-serif text-xl font-bold text-gray-900 group-hover:text-accent transition-colors mb-3">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{article.desc}</p>
                <span className="text-sm font-medium text-accent group-hover:underline">Read more →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Deep Dives */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">Deep Dives</h2>
        <p className="text-sm text-gray-500 mb-8">Interactive tools and in-depth analysis of federal workforce data.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/brain-drain", icon: "🧠", title: "Brain Drain Index", desc: "Agencies losing senior staff earning $49K more than replacements" },
            { href: "/retirement-cliff", icon: "⏳", title: "Retirement Cliff", desc: "54.5% of Selective Service near retirement age" },
            { href: "/geographic-impact", icon: "🗺️", title: "Geographic Impact", desc: "Where federal jobs are disappearing" },
            { href: "/stem-workforce", icon: "🔬", title: "STEM Workforce", desc: "552K federal STEM workers at risk" },
            { href: "/monthly-timeline", icon: "📅", title: "Monthly Timeline", desc: "48 months of hiring vs firing data" },
            { href: "/salary-explorer", icon: "💰", title: "Salary Explorer", desc: "Interactive tool to compare agency pay" },
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
