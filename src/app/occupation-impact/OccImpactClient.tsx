"use client";
import { useState } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

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

type SortKey = "seps2025" | "sepChange" | "rifs" | "impactPct" | "currentEmployees";

function toTitleCase(s: string) {
  if (!s) return s;
  const small = new Set(["of","the","and","in","for","on","at","to","a","an","or","by"]);
  return s.toLowerCase().split(" ").map((w, i) => i === 0 || !small.has(w) ? w.charAt(0).toUpperCase() + w.slice(1) : w).join(" ");
}

export function OccImpactClient({ data }: { data: OccData[] | null }) {
  const [sortKey, setSortKey] = useState<SortKey>("seps2025");
  const [showAll, setShowAll] = useState(false);

  if (!data || data.length === 0) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">Occupation impact data not available.</div>;
  }

  const sorted = [...data].sort((a, b) => b[sortKey] - a[sortKey]);
  const displayed = showAll ? sorted : sorted.slice(0, 50);
  const totalSeps = data.reduce((s, d) => s + d.seps2025, 0);
  const totalRifs = data.reduce((s, d) => s + d.rifs, 0);
  const highestImpact = [...data].sort((a, b) => b.impactPct - a.impactPct)[0];
  const mostRifs = [...data].sort((a, b) => b.rifs - a.rifs)[0];

  const chartData = data
    .sort((a, b) => b.seps2025 - a.seps2025)
    .slice(0, 12)
    .map(d => ({ name: toTitleCase(d.name).slice(0, 30), seps: d.seps2025 }));

  const pills: { key: SortKey; label: string }[] = [
    { key: "seps2025", label: "Separations" },
    { key: "sepChange", label: "% Change" },
    { key: "rifs", label: "RIFs" },
    { key: "impactPct", label: "Impact %" },
    { key: "currentEmployees", label: "Current Employees" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">DOGE Impact Analysis</p>
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Which Jobs Were Hit Hardest?
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl">
        Not all federal occupations were affected equally. Some job categories lost more than half their workforce in 2025.
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Occupations Tracked</p>
          <p className="text-2xl font-bold text-gray-900">{data.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Separations</p>
          <p className="text-2xl font-bold text-gray-900">{totalSeps.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total RIFs</p>
          <p className="text-2xl font-bold text-red-600">{totalRifs.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Highest Impact</p>
          <p className="text-2xl font-bold text-red-600">{highestImpact.impactPct}%</p>
          <p className="text-xs text-gray-400 mt-1">{toTitleCase(highestImpact.name)}</p>
        </div>
      </div>

      {/* Key Insight */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-10">
        <p className="text-lg text-red-900">
          The occupation with the most RIFs: <span className="font-bold">{toTitleCase(mostRifs.name)}</span> with{" "}
          <span className="font-bold text-red-600">{mostRifs.rifs.toLocaleString()} RIFs</span> and{" "}
          {mostRifs.experienceLost.toLocaleString()} combined years of experience lost.
        </p>
      </div>

      {/* Bar Chart */}
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Top 12 by Separations</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-10">
        <ResponsiveContainer width="100%" height={420}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 180 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={170} />
            <Tooltip formatter={(v: any) => Number(v).toLocaleString()} />
            <Bar dataKey="seps" fill="#4F46E5" name="2025 Separations" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
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
              <th className="text-right p-3 font-semibold text-gray-700 hidden md:table-cell">2024 Seps</th>
              <th className="text-right p-3 font-semibold text-gray-700">% Change</th>
              <th className="text-right p-3 font-semibold text-gray-700">RIFs</th>
              <th className="text-right p-3 font-semibold text-gray-700">Impact %</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((d) => (
              <tr key={d.code} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3">
                  <Link href={`/occupations/${d.code}`} className="text-accent hover:underline font-medium">
                    {toTitleCase(d.name)}
                  </Link>
                </td>
                <td className="text-right p-3 font-mono text-gray-500">{d.currentEmployees.toLocaleString()}</td>
                <td className="text-right p-3 font-mono font-semibold">{d.seps2025.toLocaleString()}</td>
                <td className="text-right p-3 font-mono text-gray-500 hidden md:table-cell">{d.seps2024.toLocaleString()}</td>
                <td className={`text-right p-3 font-mono ${d.sepChange > 100 ? "text-red-600 font-bold" : d.sepChange > 0 ? "text-red-600" : "text-green-600"}`}>
                  {d.sepChange > 0 ? "+" : ""}{d.sepChange}%
                </td>
                <td className={`text-right p-3 font-mono ${d.rifs > 100 ? "text-red-600 font-semibold" : ""}`}>{d.rifs.toLocaleString()}</td>
                <td className="text-right p-3">
                  <span className={`font-mono px-2 py-0.5 rounded ${
                    d.impactPct > 50 ? "bg-red-100 text-red-700 font-bold" :
                    d.impactPct > 25 ? "bg-yellow-100 text-yellow-700 font-semibold" :
                    "text-gray-700"
                  }`}>
                    {d.impactPct}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!showAll && sorted.length > 50 && (
        <div className="text-center mb-10">
          <button
            onClick={() => setShowAll(true)}
            className="text-accent hover:underline font-medium"
          >
            Show all {sorted.length} occupations →
          </button>
        </div>
      )}

      {/* Related Analysis */}
      <hr className="border-gray-200 mb-8" />
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Related Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/occupations", title: "Occupations", desc: "Federal workforce by job series" },
            { href: "/who-got-cut", title: "Who Got Cut", desc: "Which employees were most affected" },
            { href: "/appointments", title: "Appointments", desc: "Hiring types and appointment authorities" },
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
