"use client";
import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Line, ComposedChart, Bar,
} from "recharts";
import { formatNumber, formatMonth } from "@/lib/format";

interface MonthData {
  month: string;
  separations: number;
  rifs: number;
  quits: number;
  retirements: number;
  terminations: number;
  cumulativeLoss: number;
  accessions: number;
  netChange: number;
  cumulativeNetChange: number;
}

function generateNarrative(d: MonthData, allData: MonthData[]): string {
  const label = formatMonth(d.month);
  const seps = d.separations.toLocaleString();
  const acc = d.accessions.toLocaleString();

  // Find peak month
  const peakMonth = allData.reduce((a, b) => b.separations > a.separations ? b : a);
  const isPeak = d.month === peakMonth.month;

  if (isPeak) return `${seps} separations — the biggest single-month exodus in modern federal history. Only ${acc} hired.`;

  // Jan 2025 - first big month
  if (d.month === "202501") return `${seps} separations — the first wave begins. Hiring still strong at ${acc}.`;
  if (d.month === "202502") return `${seps} separations as DOGE ramps up. Hiring drops to ${acc} — the freeze begins.`;
  if (d.month === "202503") return `${seps} separations with hiring plummeting to ${acc}. Net loss of ${Math.abs(d.netChange).toLocaleString()} in one month.`;
  if (d.month === "202507") return `${seps} separations including ${d.rifs.toLocaleString()} RIFs — the largest RIF month. Only ${acc} hired.`;
  if (d.month === "202510") return `Separations slow to ${seps}. Hiring at ${acc}. The worst may be over — but damage is done.`;
  if (d.month === "202511") return `${seps} separations — lowest since DOGE began. Net change nearly flat at ${d.netChange.toLocaleString()}.`;

  // Pre-DOGE months (2023-2024)
  if (d.month < "202501") {
    if (d.netChange > 0) return `Normal operations: ${seps} separations, ${acc} accessions. Net gain of ${d.netChange.toLocaleString()}.`;
    return `${seps} separations, ${acc} accessions. Net change: ${d.netChange.toLocaleString()}.`;
  }

  // Generic DOGE-era
  if (d.rifs > 100) return `${seps} separations including ${d.rifs.toLocaleString()} RIFs. Hiring frozen at ${acc}.`;
  if (d.netChange < -15000) return `${seps} separations vs only ${acc} hired. A devastating net loss of ${Math.abs(d.netChange).toLocaleString()}.`;
  return `${seps} separations, ${acc} accessions. Net change: ${d.netChange.toLocaleString()}.`;
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export function TimelineClient({ data }: { data: MonthData[] | null }) {
  const [showPreDoge, setShowPreDoge] = useState(false);

  if (!data) return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">Timeline data not available.</div>;

  const dogeData = data.filter(d => d.month >= "202501");
  const displayData = showPreDoge ? data : dogeData;

  // Stats
  const peakMonth = dogeData.reduce((a, b) => b.separations > a.separations ? b : a);
  const lastMonth = dogeData[dogeData.length - 1];
  const totalCumulativeLoss = Math.abs(lastMonth.cumulativeNetChange);
  const worstNetMonth = dogeData.reduce((a, b) => b.netChange < a.netChange ? b : a);
  const totalRifs = dogeData.reduce((s, d) => s + d.rifs, 0);

  const chartData = displayData.map(d => ({
    ...d,
    label: formatMonth(d.month),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          The DOGE Effect: Month by Month
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          The federal government has lost a net <span className="font-bold text-indigo-600">{totalCumulativeLoss.toLocaleString()}</span> employees
          since January 2025. Here&apos;s how it unfolded.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Peak Month Separations" value={peakMonth.separations.toLocaleString()} sub={formatMonth(peakMonth.month)} />
        <StatCard label="Total Cumulative Net Loss" value={totalCumulativeLoss.toLocaleString()} sub="Since Jan 2025" />
        <StatCard label="Worst Net Month" value={worstNetMonth.netChange.toLocaleString()} sub={formatMonth(worstNetMonth.month)} />
        <StatCard label="Total RIFs" value={totalRifs.toLocaleString()} sub={`${dogeData.length} months of DOGE`} />
      </div>

      {/* Chart Controls */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-serif text-2xl font-bold text-gray-900">Separations vs. Accessions</h2>
        <button
          onClick={() => setShowPreDoge(!showPreDoge)}
          className="ml-auto text-sm px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-50 text-gray-600"
        >
          {showPreDoge ? "DOGE Era Only" : "Show Pre-DOGE"}
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-10">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 40, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" interval={showPreDoge ? 3 : 0} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
            <Tooltip formatter={(v: any) => Number(v).toLocaleString()} />
            <Area type="monotone" dataKey="separations" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} name="Separations" />
            <Area type="monotone" dataKey="accessions" stroke="#10b981" fill="#10b981" fillOpacity={0.15} name="Accessions" />
            <Line type="monotone" dataKey="cumulativeNetChange" stroke="#4F46E5" strokeWidth={2} dot={false} name="Cumulative Net Change" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Month Cards */}
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">The Story, Month by Month</h2>
      <div className="space-y-4">
        {dogeData.map((d, i) => {
          const narrative = generateNarrative(d, dogeData);
          const isNegative = d.netChange < 0;
          return (
            <div key={d.month} className={`bg-white rounded-xl border p-6 shadow-sm ${d.month === peakMonth.month ? "border-red-300 ring-2 ring-red-100" : "border-gray-200"}`}>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="md:w-32 shrink-0">
                  <span className="text-lg font-bold text-gray-900">{formatMonth(d.month)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 mb-3">{narrative}</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="px-2 py-1 bg-red-50 text-red-700 rounded">↓ {d.separations.toLocaleString()} separations</span>
                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded">↑ {d.accessions.toLocaleString()} hired</span>
                    <span className={`px-2 py-1 rounded ${isNegative ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                      Net: {d.netChange.toLocaleString()}
                    </span>
                    {d.rifs > 0 && <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded">{d.rifs.toLocaleString()} RIFs</span>}
                    <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded">Cumulative: {d.cumulativeNetChange.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
