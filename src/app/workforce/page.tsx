import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Federal Workforce Data & Statistics | OpenFeds",
  description: "Comprehensive federal workforce data hub: demographics, salaries, appointments, STEM analysis, trends, education, brain drain, and DOGE impact on 1.81M federal employees.",
  alternates: { canonical: "/workforce" },
};

const coreData = [
  { href: "/demographics", title: "Demographics", stat: "1.81M", desc: "Age, gender, veteran status, and diversity breakdown of the current federal workforce" },
  { href: "/salaries", title: "Salaries", stat: "$$$", desc: "Federal pay grades, GS scale analysis, and compensation trends across agencies" },
  { href: "/salary-explorer", title: "Salary Explorer", stat: "🔎", desc: "Interactive tool — look up pay for any federal job title, grade, and location" },
  { href: "/salary-compare", title: "Salary Compare", stat: "⚖️", desc: "Compare federal salaries across agencies, occupations, and locations side by side" },
  { href: "/appointments", title: "Appointments", stat: "📋", desc: "Career vs. political appointees, hiring types, and appointment patterns" },
  { href: "/occupations", title: "Occupations", stat: "540+", desc: "Every federal job series analyzed — from GS-0301 to GS-2210" },
  { href: "/education", title: "Education & Pay", stat: "🎓", desc: "How degrees and education levels affect federal salaries and career progression" },
];

const trendsAnalysis = [
  { href: "/trends", title: "Workforce Trends", stat: "5yr", desc: "Monthly hiring vs. firing trends — see how the workforce is changing in real time" },
  { href: "/brain-drain", title: "Brain Drain Index", stat: "🧠", desc: "Which agencies are losing their most experienced workers? Institutional knowledge at risk" },
  { href: "/retirement-cliff", title: "Retirement Cliff", stat: "⏳", desc: "30% of federal workers are retirement-eligible within 5 years — who's next?" },
  { href: "/stem-workforce", title: "STEM Workforce", stat: "🔬", desc: "Technical workforce analysis — scientists, engineers, and IT professionals in government" },
  { href: "/analysis/workforce-trends", title: "Historical Trends", stat: "📜", desc: "86 years of federal workforce size — is government right-sized now?" },
];

const dogeImpact = [
  { href: "/cuts", title: "DOGE & Cuts Hub", stat: "256K", desc: "Complete tracker of workforce reductions, methods, timeline, and agency impact" },
  { href: "/analysis/workforce-reductions-2025-2026", title: "Reductions Data", stat: "📊", desc: "256K positions eliminated — full data with GAO-verified numbers" },
  { href: "/analysis/agency-cuts-2026", title: "Agency Cuts 2026", stat: "🏛️", desc: "Agency-by-agency breakdown — who lost the most and which cuts made sense" },
  { href: "/analysis/agency-departure-breakdown", title: "Agency Departures", stat: "280K", desc: "Where 280K federal workers went — from USAID's 85% gutting to VA's 1.2% trim" },
  { href: "/who-got-cut", title: "Who Got Cut", stat: "🔎", desc: "Detailed breakdown by grade, occupation, and demographics" },
  { href: "/layoffs", title: "Separations Data", stat: "📉", desc: "All types of federal departures — RIF, DRP, voluntary, and involuntary" },
];

const quickStats = [
  { value: "1.81M", label: "Current Workforce", change: "−12.6% from 2024 peak" },
  { value: "$98K", label: "Average Salary", change: "GS-12 Step 5 median" },
  { value: "47.3", label: "Average Age", change: "Down from 48.1 pre-DOGE" },
  { value: "3.2:1", label: "Manager Ratio", change: "Improved from 4.1:1" },
];

export default function WorkforcePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-12">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">OpenFeds</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          👥 Federal Workforce
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
          Everything about the federal workforce — who they are, what they earn, how the workforce has changed 
          under DOGE restructuring, and where it&apos;s headed. Data from OPM FedScope covering 1.81 million 
          federal employees across 128 agencies.
        </p>
      </header>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {quickStats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-center">
            <div className="text-3xl font-bold font-mono text-gray-900 dark:text-gray-100">{s.value}</div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">{s.label}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Core data section */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">📊 Core Workforce Data</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreData.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group block p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-accent hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <span className="text-lg font-bold text-accent ml-2 shrink-0">{item.stat}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trends & analysis section */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">📈 Trends & Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendsAnalysis.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group block p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-accent hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <span className="text-lg font-bold text-accent ml-2 shrink-0">{item.stat}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* DOGE impact section */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">🔨 DOGE Restructuring Impact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dogeImpact.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group block p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-accent hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <span className="text-lg font-bold text-accent ml-2 shrink-0">{item.stat}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Context box */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">About This Data</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          All workforce data is sourced from OPM FedScope, the official public data source for federal employment 
          statistics. FedScope covers executive branch civilian employees and is updated quarterly. 
          Data does not include military personnel, postal workers, or intelligence community staff. 
          Current data reflects the post-DOGE workforce as of Q2 2026.
        </p>
      </div>
    </div>
  );
}
