"use client";
import { useState } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { formatSalary } from "@/lib/format";

interface AppointmentData {
  name: string;
  code: string;
  employees: number;
  avgSalary: number;
  seps2025: number;
  seps2024: number;
  sepChange: number;
  rifs: number;
  impactPct: number;
}

type SortKey = "seps2025" | "sepChange" | "rifs" | "impactPct" | "employees";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function shortName(name: string): string {
  // Extract the part before the parenthetical
  const match = name.match(/^([^(]+)/);
  return match ? match[1].trim() : name;
}

export function AppointmentsClient({ data }: { data: AppointmentData[] | null }) {
  const [sortKey, setSortKey] = useState<SortKey>("seps2025");

  if (!data) return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">Appointment data not available.</div>;

  const sorted = [...data].sort((a, b) => b[sortKey] - a[sortKey]);
  const totalRifs = data.reduce((s, d) => s + d.rifs, 0);
  const careerRifs = data.find(d => d.code === "10")?.rifs ?? 0;
  const careerRifPct = totalRifs > 0 ? ((careerRifs / totalRifs) * 100).toFixed(0) : "0";
  const totalSeps = data.reduce((s, d) => s + d.seps2025, 0);

  const chartData = data
    .filter(d => d.seps2025 > 500)
    .sort((a, b) => b.seps2025 - a.seps2025)
    .map(d => ({ name: shortName(d.name), seps2025: d.seps2025 }));

  const pills: { key: SortKey; label: string }[] = [
    { key: "seps2025", label: "Separations" },
    { key: "sepChange", label: "% Change" },
    { key: "rifs", label: "RIFs" },
    { key: "impactPct", label: "Impact %" },
    { key: "employees", label: "Employees" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Career vs Temporary: Who Got Cut?
      </h1>
      <p className="text-xl text-gray-600 mb-6 max-w-3xl">
        How DOGE separations break down by federal appointment type.
      </p>

      {/* Key Insight */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-10">
        <p className="text-lg text-indigo-900">
          <span className="font-bold text-2xl text-indigo-600">{careerRifPct}%</span> of all RIFs hit
          career permanent employees — the backbone of government. That&apos;s{" "}
          <span className="font-semibold">{careerRifs.toLocaleString()}</span> career employees
          involuntarily separated out of <span className="font-semibold">{totalRifs.toLocaleString()}</span> total RIFs.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Separations" value={totalSeps.toLocaleString()} />
        <StatCard label="Total RIFs" value={totalRifs.toLocaleString()} />
        <StatCard label="Appointment Types" value={data.length.toLocaleString()} />
        <StatCard label="Career RIF %" value={`${careerRifPct}%`} sub="Of all RIFs" />
      </div>

      {/* Bar Chart */}
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Separations by Appointment Type</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-10">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 180 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={170} />
            <Tooltip formatter={(v: any) => Number(v).toLocaleString()} />
            <Bar dataKey="seps2025" fill="#4F46E5" name="2025 Separations" radius={[0, 4, 4, 0]} />
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
            className={`text-sm px-3 py-1 rounded-full border ${sortKey === p.key ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto mb-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-3 font-semibold text-gray-700">Type</th>
              <th className="text-right p-3 font-semibold text-gray-700">Employees</th>
              <th className="text-right p-3 font-semibold text-gray-700 hidden md:table-cell">Avg Salary</th>
              <th className="text-right p-3 font-semibold text-gray-700">2025 Seps</th>
              <th className="text-right p-3 font-semibold text-gray-700">2024 Seps</th>
              <th className="text-right p-3 font-semibold text-gray-700">% Change</th>
              <th className="text-right p-3 font-semibold text-gray-700">RIFs</th>
              <th className="text-right p-3 font-semibold text-gray-700">Impact %</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((d) => (
              <tr key={d.code} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3 font-medium">{d.name}</td>
                <td className="text-right p-3 font-mono">{d.employees.toLocaleString()}</td>
                <td className="text-right p-3 font-mono text-gray-500 hidden md:table-cell">{formatSalary(d.avgSalary)}</td>
                <td className="text-right p-3 font-mono">{d.seps2025.toLocaleString()}</td>
                <td className="text-right p-3 font-mono text-gray-500">{d.seps2024.toLocaleString()}</td>
                <td className={`text-right p-3 font-mono ${d.sepChange > 0 ? "text-red-600" : "text-green-600"}`}>
                  {d.sepChange > 0 ? "+" : ""}{d.sepChange}%
                </td>
                <td className="text-right p-3 font-mono">{d.rifs.toLocaleString()}</td>
                <td className={`text-right p-3 font-mono ${d.impactPct > 50 ? "text-red-600 font-bold" : d.impactPct > 25 ? "text-yellow-600 font-semibold" : ""}`}>
                  {d.impactPct}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Narrative Section */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-8">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">What Are Appointment Types?</h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900">Career (Competitive Service)</h3>
            <p>Employees who passed a competitive exam and completed their probationary period. These are permanent positions with full civil service protections — which also makes them the hardest to fire, regardless of performance.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Career-Conditional</h3>
            <p>Employees still in their probationary period (typically 1-2 years). They&apos;re on the path to career status but can still be let go for performance — the one window where normal accountability applies.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Excepted Service (Schedule A, B, C, D)</h3>
            <p>Hired under special authorities outside the competitive exam process. Schedule A covers people with disabilities and certain professionals. Schedule C covers political appointees. Schedule D (used by agencies like DHS) often covers entry-level pathways. Excepted service employees like VA doctors, FBI agents, and intelligence officers are critical specialists.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Senior Executive Service (SES)</h3>
            <p>The top tier of federal management — senior leaders who bridge political appointees and the career workforce. Career SES members are supposed to be non-partisan experts; noncareer SES are political appointees. SES members earn $150-200K+ and are rarely held accountable for agency performance.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Nonpermanent / Temporary</h3>
            <p>Term-limited positions including seasonal workers, interns, and temporary hires. These are the positions that should flex up and down with actual need — exactly how a well-run organization operates.</p>
          </div>
        </div>
      </div>

      {/* Related Analysis */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Related Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/doge", title: "DOGE Impact Dashboard", desc: "Full breakdown of 2025 federal workforce restructuring by agency, month, and separation type." },
            { href: "/risk", title: "Agency Risk Dashboard", desc: "Which agencies face the highest restructuring risk based on workforce trends." },
            { href: "/workforce-analysis", title: "Workforce Deep Dive", desc: "Retirement cliff, experience drain, STEM brain drain, and pay grade analysis." },
            { href: "/demographics", title: "Workforce Demographics", desc: "Age, education, veteran status, and geographic distribution of federal employees." },
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
