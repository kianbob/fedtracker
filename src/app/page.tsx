import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { formatNumber, formatSalary, cleanAgencyName } from "@/lib/format";
import siteStats from "../../public/data/site-stats.json";
import agencyList from "../../public/data/agency-list.json";

export default function Home() {
  const topAgencies = agencyList.slice(0, 12);

  return (
    <div>
      {/* Hero */}
      <section className="accent-gradient text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Track the Federal Workforce
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mb-8">
            Explore data on {formatNumber(siteStats.totalEmployees)} federal employees across {siteStats.agencyCount} agencies.
            Salaries, layoffs, hiring trends — all from official OPM data.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/layoffs" className="bg-white text-accent font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
              Explore Layoffs →
            </Link>
            <Link href="/agencies" className="border border-white/30 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Browse Agencies
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Federal Employees" value={formatNumber(siteStats.totalEmployees)} sub="March 2025 snapshot" />
          <StatCard label="Average Salary" value={formatSalary(siteStats.avgSalary)} sub="Across all agencies" />
          <StatCard label="Separations (FY20-24)" value={formatNumber(siteStats.totalSeparations)} sub="People who left" />
          <StatCard label="Accessions (FY20-24)" value={formatNumber(siteStats.totalAccessions)} sub="People who joined" />
        </div>
      </section>

      {/* Key Findings */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">Key Findings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* RIF card */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-6">
            <h3 className="font-serif text-xl font-bold text-red-900 mb-3">🔴 Top RIF Agencies</h3>
            <p className="text-sm text-red-700 mb-4">Agencies with the most Reductions in Force (FY20-24)</p>
            <ul className="space-y-2">
              {siteStats.topRifAgencies.slice(0, 5).map((a) => (
                <li key={a.code} className="flex justify-between text-sm">
                  <Link href={`/agencies/${a.code}`} className="text-red-800 hover:underline truncate mr-2">
                    {cleanAgencyName(a.name)}
                  </Link>
                  <span className="font-semibold text-red-900 whitespace-nowrap">{a.rifCount.toLocaleString()} RIFs</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quit rates */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
            <h3 className="font-serif text-xl font-bold text-amber-900 mb-3">⚠️ Highest Quit Rates</h3>
            <p className="text-sm text-amber-700 mb-4">Agencies where the most people quit (% of separations)</p>
            <ul className="space-y-2">
              {siteStats.topQuitRates.slice(0, 5).map((a) => (
                <li key={a.code} className="flex justify-between text-sm">
                  <Link href={`/agencies/${a.code}`} className="text-amber-800 hover:underline truncate mr-2">
                    {cleanAgencyName(a.name)}
                  </Link>
                  <span className="font-semibold text-amber-900 whitespace-nowrap">{a.quitRate}%</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Net change */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
            <h3 className="font-serif text-xl font-bold text-indigo-900 mb-3">📊 Workforce Change</h3>
            <p className="text-sm text-indigo-700 mb-4">Net hiring vs. separations (FY2020-2024)</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-indigo-800">Total Accessions</span>
                <span className="font-semibold text-green-700">+{formatNumber(siteStats.totalAccessions)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-indigo-800">Total Separations</span>
                <span className="font-semibold text-red-700">-{formatNumber(siteStats.totalSeparations)}</span>
              </div>
              <hr className="border-indigo-200" />
              <div className="flex justify-between text-sm font-bold">
                <span className="text-indigo-900">Net Change</span>
                <span className={siteStats.totalAccessions - siteStats.totalSeparations > 0 ? "text-green-700" : "text-red-700"}>
                  {siteStats.totalAccessions - siteStats.totalSeparations > 0 ? "+" : ""}
                  {formatNumber(siteStats.totalAccessions - siteStats.totalSeparations)}
                </span>
              </div>
            </div>
          </div>
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
                {cleanAgencyName(a.name)}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{formatNumber(a.employees)} employees</span>
                <span>•</span>
                <span>Avg {formatSalary(a.avgSalary)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
