"use client";
import { useState } from "react";
import Link from "next/link";
import { formatNumber } from "@/lib/format";

interface OccData {
  code: string;
  name: string;
  seps2025: number;
  seps2024: number;
  sepChange: number;
  currentEmployees: number;
  rifs: number;
  experienceLost: number;
  impactPct: number;
}

type SortKey = "seps2025" | "sepChange" | "rifs" | "impactPct" | "experienceLost";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export function OccImpactClient({ data }: { data: OccData[] | null }) {
  const [sortKey, setSortKey] = useState<SortKey>("seps2025");
  const [limit, setLimit] = useState(50);

  if (!data || data.length === 0) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">No occupation impact data available.</div>;
  }

  const sorted = [...data].sort((a, b) => b[sortKey] - a[sortKey]);
  const shown = sorted.slice(0, limit);
  const totalSeps = data.reduce((s, d) => s + d.seps2025, 0);
  const totalRifs = data.reduce((s, d) => s + d.rifs, 0);
  const highestImpact = [...data].sort((a, b) => b.impactPct - a.impactPct)[0];
  const mostRifs = [...data].sort((a, b) => b.rifs - a.rifs)[0];

  const pills: { key: SortKey; label: string }[] = [
    { key: "seps2025", label: "Separations" },
    { key: "sepChange", label: "% Change" },
    { key: "rifs", label: "RIFs" },
    { key: "impactPct", label: "Impact %" },
    { key: "experienceLost", label: "Experience Lost" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">DOGE Impact Analysis</p>
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Which Jobs Were Hit Hardest?
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl">
        Analysis of {data.length} federal occupation groups showing how DOGE-era separations impacted different job categories.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Occupations Tracked" value={data.length.toString()} sub="With 50+ separations" />
        <StatCard label="Total 2025 Separations" value={totalSeps.toLocaleString()} />
        <StatCard label="Highest Impact" value={`${highestImpact?.impactPct}%`} sub={highestImpact?.name} />
        <StatCard label="Most RIFs" value={mostRifs?.rifs.toLocaleString() || "0"} sub={mostRifs?.name} />
      </div>

      {/* Sort Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm text-gray-500 py-1">Sort by:</span>
        {pills.map(p => (
          <button
            key={p.key}
            onClick={() => setSortKey(p.key)}
            className={`text-sm px-3 py-1 rounded-full border transition-colors ${sortKey === p.key ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-3 font-semibold text-gray-700">Occupation</th>
              <th className="text-right p-3 font-semibold text-gray-700">Current</th>
              <th className="text-right p-3 font-semibold text-gray-700">2025 Seps</th>
              <th className="text-right p-3 font-semibold text-gray-700 hidden sm:table-cell">2024 Seps</th>
              <th className="text-right p-3 font-semibold text-gray-700">% Change</th>
              <th className="text-right p-3 font-semibold text-gray-700">RIFs</th>
              <th className="text-right p-3 font-semibold text-gray-700">Impact %</th>
              <th className="text-right p-3 font-semibold text-gray-700 hidden lg:table-cell">Exp Lost (yrs)</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((d) => (
              <tr key={d.code} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3">
                  <Link href={`/occupations/${d.code}`} className="text-accent hover:underline font-medium">
                    {d.name}
                  </Link>
                </td>
                <td className="text-right p-3 font-mono text-gray-500">{formatNumber(d.currentEmployees)}</td>
                <td className="text-right p-3 font-mono font-semibold">{d.seps2025.toLocaleString()}</td>
                <td className="text-right p-3 font-mono text-gray-500 hidden sm:table-cell">{d.seps2024.toLocaleString()}</td>
                <td className={`text-right p-3 font-mono ${d.sepChange > 100 ? "text-red-600 font-bold" : d.sepChange > 0 ? "text-red-500" : "text-green-600"}`}>
                  {d.sepChange > 0 ? "+" : ""}{d.sepChange}%
                </td>
                <td className={`text-right p-3 font-mono ${d.rifs > 100 ? "text-red-600 font-semibold" : ""}`}>
                  {d.rifs.toLocaleString()}
                </td>
                <td className={`text-right p-3 font-mono ${d.impactPct > 50 ? "text-red-600 font-bold" : d.impactPct > 25 ? "text-yellow-600 font-semibold" : ""}`}>
                  {d.impactPct}%
                </td>
                <td className="text-right p-3 font-mono text-gray-500 hidden lg:table-cell">
                  {d.experienceLost > 0 ? d.experienceLost.toLocaleString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {limit < sorted.length && (
        <div className="text-center mb-10">
          <button
            onClick={() => setLimit(l => l + 50)}
            className="text-accent hover:underline text-sm font-medium"
          >
            Show more ({sorted.length - limit} remaining) →
          </button>
        </div>
      )}

      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-sm text-gray-600">
        <p><strong>Impact %</strong> = 2025 separations as a percentage of current workforce. Values over 100% mean more people left than currently remain.</p>
        <p className="mt-2"><strong>Experience Lost</strong> = cumulative years of service of separated employees — a proxy for institutional knowledge drain.</p>
      </div>
    </div>
  );
}
