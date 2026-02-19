import type { Metadata } from "next";
import Link from "next/link";
import { formatNumber, formatSalary, toTitleCase } from "@/lib/format";
import { ImpactChart } from "./ImpactChart";
import stateImpact from "../../../public/data/state-impact.json";

export const metadata: Metadata = {
  title: "DOGE Impact by State — State-by-State Federal Workforce Reductions — FedTracker",
  description: "See how DOGE-driven federal workforce reductions impact each state. DC, Maryland, and Virginia hit hardest.",
  openGraph: {
    title: "DOGE Impact by State - FedTracker",
    description: "State-by-state breakdown of federal workforce reductions. See which states are hit hardest by DOGE-driven cuts.",
  },
};

export default function ImpactPage() {
  const states = stateImpact.filter((s) => s.state !== "INVALID" && s.state !== "NO DATA REPORTED");
  const totalSeps = states.reduce((s, st) => s + st.seps2025, 0);
  const totalExperience = states.reduce((s, st) => s + st.experienceLostYears, 0);
  const dc = states.find((s) => s.state === "DISTRICT OF COLUMBIA");

  const top15 = [...states].sort((a, b) => b.seps2025 - a.seps2025).slice(0, 15).map((s) => ({
    name: toTitleCase(s.state),
    value: s.seps2025,
  }));

  const tableData = [...states].sort((a, b) => b.seps2025 - a.seps2025);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <header className="mb-12">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">State-by-State Analysis</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          DOGE Impact by State
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          <span className="text-4xl font-bold text-accent">{formatNumber(totalSeps)}</span>{" "}
          federal employees separated in 2025 across all states.
        </p>
      </header>

      {/* Insight boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-sm text-red-600 font-medium mb-1">Most Impacted</p>
          <p className="text-3xl font-bold text-red-900">DC: {dc ? formatNumber(dc.seps2025) : "N/A"} positions reduced</p>
          <p className="text-sm text-red-700 mt-1">{dc ? dc.impactPct : 0}% of DC&apos;s federal workforce — the nation&apos;s bureaucracy capital</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
          <p className="text-sm text-indigo-600 font-medium mb-1">Experience Lost</p>
          <p className="text-3xl font-bold text-indigo-900">{formatNumber(totalExperience)} years</p>
          <p className="text-sm text-indigo-700 mt-1">Combined federal experience lost nationwide</p>
        </div>
      </div>

      {/* Chart */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Top 15 States by 2025 Separations</h2>
        <ImpactChart data={top15} />
      </section>

      {/* Table */}
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">States by 2025 Separations</h2>
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">State</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">2025 Seps</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">2024 Seps</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">% Change</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">RIFs</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Avg Salary Lost</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Experience Lost</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Impact %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tableData.map((s) => {
              const isDC = s.state === "DISTRICT OF COLUMBIA";
              return (
                <tr key={s.state} className={isDC ? "bg-red-50/50 font-medium" : "hover:bg-gray-50"}>
                  <td className="px-3 py-3 text-gray-900">{toTitleCase(s.state)}</td>
                  <td className="px-3 py-3 text-gray-700">{s.seps2025.toLocaleString()}</td>
                  <td className="px-3 py-3 text-gray-700">{s.seps2024.toLocaleString()}</td>
                  <td className="px-3 py-3">
                    <span className={s.sepChange > 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                      {s.sepChange > 0 ? "+" : ""}{s.sepChange}%
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-700">{s.rifs.toLocaleString()}</td>
                  <td className="px-3 py-3 text-gray-700">{formatSalary(s.avgSalaryLost)}</td>
                  <td className="px-3 py-3 text-gray-700">{formatNumber(s.experienceLostYears)} yrs</td>
                  <td className="px-3 py-3">
                    <span className={s.impactPct > 20 ? "text-red-600 font-semibold" : "text-gray-700"}>
                      {s.impactPct}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Related Analysis */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Related Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/who-got-cut", title: "Who Got Cut", desc: "Agency-by-agency breakdown of the 2025 DOGE-driven workforce reductions." },
            { href: "/states", title: "State-by-State Data", desc: "Explore federal employment by state — where the jobs are and where the cuts hit hardest." },
            { href: "/doge", title: "DOGE Impact Dashboard", desc: "Full breakdown of 2025 federal workforce restructuring by agency, month, and separation type." },
            { href: "/risk", title: "Agency Risk Dashboard", desc: "Which agencies face the highest restructuring risk based on workforce trends." },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group">
              <h3 className="font-serif font-bold text-gray-900 group-hover:text-indigo-700 transition-colors mb-1">{link.title}</h3>
              <p className="text-sm text-gray-500">{link.desc}</p>
              <span className="text-indigo-600 text-sm font-medium mt-2 inline-block">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <p className="text-xs text-gray-400 mt-8">
        Data: OPM FedScope (December 2025 employment, FY2020–2025 separations). Updated monthly.
      </p>
    </div>
  );
}
