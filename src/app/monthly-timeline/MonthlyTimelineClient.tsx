"use client";
import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import rawData from "../../../public/data/monthly-timeline.json";

const fmt = (n: number) => n.toLocaleString();

function formatMonth(m: string) {
  const y = m.slice(0, 4);
  const mo = parseInt(m.slice(4));
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[mo]} ${y}`;
}

const data = (rawData as any[]).map((d) => ({
  ...d,
  label: formatMonth(d.month),
  other_separations: d.separations - d.quits - d.retirements - d.rifs - d.terminations,
}));

type SortKey = "month" | "separations" | "accessions" | "net_change" | "quits" | "retirements" | "rifs";

const KEY_MONTHS = [
  { month: "202004", label: "COVID hiring freeze ends", color: "#059669" },
  { month: "202112", label: "Worst month: -18,323 net", color: "#dc2626" },
  { month: "202109", label: "Vaccine mandate announced", color: "#d97706" },
  { month: "202305", label: "Best 2023 month: +17,962", color: "#059669" },
];

export function MonthlyTimelineClient() {
  const [sortKey, setSortKey] = useState<SortKey>("month");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return sorted;
  }, [sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "month" ? "asc" : "desc");
    }
  }

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span> : null;

  const totalSep = data.reduce((s, d) => s + d.separations, 0);
  const totalAcc = data.reduce((s, d) => s + d.accessions, 0);
  const worstMonth = data.reduce((w, d) => (d.net_change < w.net_change ? d : w), data[0]);
  const bestMonth = data.reduce((b, d) => (d.net_change > b.net_change ? d : b), data[0]);

  return (
    <div className="space-y-12">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-red-600">{fmt(totalSep)}</p>
          <p className="text-xs text-gray-500">Total Separations</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-600">{fmt(totalAcc)}</p>
          <p className="text-xs text-gray-500">Total Accessions</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-red-700">{formatMonth(worstMonth.month)}</p>
          <p className="text-xs text-gray-500">Worst Month ({fmt(worstMonth.net_change)})</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-700">{formatMonth(bestMonth.month)}</p>
          <p className="text-xs text-gray-500">Best Month (+{fmt(bestMonth.net_change)})</p>
        </div>
      </div>

      {/* Hero Chart */}
      <section>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
          <span className="mr-3">📉</span>Separations, Accessions &amp; Net Change
        </h2>
        <div className="h-96 w-full bg-white border border-gray-200 rounded-xl p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={5} angle={-30} textAnchor="end" height={50} />
              <YAxis tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={50} />
              <Tooltip formatter={(v: any) => fmt(Number(v))} />
              <Legend />
              <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="separations" stroke="#dc2626" name="Separations" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="accessions" stroke="#059669" name="Accessions" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="net_change" stroke="#2563eb" name="Net Change" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Stacked Area: Separation Types */}
      <section>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
          <span className="mr-3">📊</span>Separation Types Over Time
        </h2>
        <p className="text-gray-600 mb-4">
          Retirements spike every December. Quits surged during the Great Resignation. RIFs remain negligible.
        </p>
        <div className="h-80 w-full bg-white border border-gray-200 rounded-xl p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={5} angle={-30} textAnchor="end" height={50} />
              <YAxis tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={50} />
              <Tooltip formatter={(v: any) => fmt(Number(v))} />
              <Legend />
              <Area type="monotone" dataKey="retirements" stackId="1" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.6} name="Retirements" />
              <Area type="monotone" dataKey="quits" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Quits" />
              <Area type="monotone" dataKey="terminations" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Terminations" />
              <Area type="monotone" dataKey="rifs" stackId="1" stroke="#64748b" fill="#64748b" fillOpacity={0.6} name="RIFs" />
              <Area type="monotone" dataKey="other_separations" stackId="1" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.4} name="Other" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Key Month Callouts */}
      <section>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
          <span className="mr-3">🔑</span>Key Months
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {KEY_MONTHS.map((km) => {
            const d = data.find((x) => x.month === km.month);
            if (!d) return null;
            return (
              <div key={km.month} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: km.color }} />
                  <span className="font-semibold text-gray-900">{d.label}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{km.label}</p>
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div>
                    <p className="font-bold text-red-600">{fmt(d.separations)}</p>
                    <p className="text-gray-500">Departures</p>
                  </div>
                  <div>
                    <p className="font-bold text-green-600">{fmt(d.accessions)}</p>
                    <p className="text-gray-500">Hired</p>
                  </div>
                  <div>
                    <p className={`font-bold ${d.net_change >= 0 ? "text-blue-600" : "text-red-600"}`}>
                      {d.net_change >= 0 ? "+" : ""}{fmt(d.net_change)}
                    </p>
                    <p className="text-gray-500">Net</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Data Table */}
      <section>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
          <span className="mr-3">📋</span>Full Data Table
        </h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-3 py-2 cursor-pointer hover:text-gray-900" onClick={() => toggleSort("month")}>Month<SortIcon k="month" /></th>
                <th className="px-3 py-2 text-right cursor-pointer hover:text-gray-900" onClick={() => toggleSort("separations")}>Departures<SortIcon k="separations" /></th>
                <th className="px-3 py-2 text-right cursor-pointer hover:text-gray-900" onClick={() => toggleSort("accessions")}>Hired<SortIcon k="accessions" /></th>
                <th className="px-3 py-2 text-right cursor-pointer hover:text-gray-900" onClick={() => toggleSort("net_change")}>Net<SortIcon k="net_change" /></th>
                <th className="px-3 py-2 text-right cursor-pointer hover:text-gray-900" onClick={() => toggleSort("quits")}>Quits<SortIcon k="quits" /></th>
                <th className="px-3 py-2 text-right cursor-pointer hover:text-gray-900" onClick={() => toggleSort("retirements")}>Retirements<SortIcon k="retirements" /></th>
                <th className="px-3 py-2 text-right cursor-pointer hover:text-gray-900" onClick={() => toggleSort("rifs")}>RIFs<SortIcon k="rifs" /></th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((d) => (
                <tr key={d.month} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-800">{d.label}</td>
                  <td className="px-3 py-2 text-right text-red-600">{fmt(d.separations)}</td>
                  <td className="px-3 py-2 text-right text-green-600">{fmt(d.accessions)}</td>
                  <td className={`px-3 py-2 text-right font-semibold ${d.net_change >= 0 ? "text-blue-600" : "text-red-600"}`}>
                    {d.net_change >= 0 ? "+" : ""}{fmt(d.net_change)}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600">{fmt(d.quits)}</td>
                  <td className="px-3 py-2 text-right text-gray-600">{fmt(d.retirements)}</td>
                  <td className="px-3 py-2 text-right text-gray-600">{fmt(d.rifs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
