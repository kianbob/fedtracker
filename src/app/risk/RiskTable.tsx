"use client";
import { useState } from "react";
import Link from "next/link";
import { formatNumber, formatSalary, fixAgencyName } from "@/lib/format";

type Agency = {
  code: string;
  name: string;
  employees: number;
  riskScore: number;
  retirementPct: number;
  stemPct: number;
  rifCount: number;
  seps2025: number;
  reductionPct: number;
  avgSalary: number | null;
};

type SortKey = "name" | "riskScore" | "employees" | "retirementPct" | "stemPct" | "rifCount" | "seps2025" | "reductionPct";

function riskColor(score: number) {
  if (score <= 30) return "bg-green-500";
  if (score <= 60) return "bg-yellow-500";
  return "bg-red-500";
}

function riskBadge(score: number) {
  if (score <= 30) return "text-green-700 bg-green-50";
  if (score <= 60) return "text-yellow-700 bg-yellow-50";
  return "text-red-700 bg-red-50";
}

function fmtReduction(pct: number) {
  if (pct > 100) return ">100%";
  return `${pct}%`;
}

export function RiskTable({ agencies }: { agencies: Agency[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("riskScore");
  const [sortAsc, setSortAsc] = useState(false);
  const [hideSmall, setHideSmall] = useState(true);

  const filtered = hideSmall ? agencies.filter(a => a.employees >= 50) : agencies;

  const sorted = [...filtered].sort((a, b) => {
    const av = sortKey === "name" ? fixAgencyName(a.name) : (a[sortKey] ?? 0);
    const bv = sortKey === "name" ? fixAgencyName(b.name) : (b[sortKey] ?? 0);
    if (av < bv) return sortAsc ? -1 : 1;
    if (av > bv) return sortAsc ? 1 : -1;
    return 0;
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(key === "name"); }
  }

  function SortHeader({ label, k, className }: { label: string; k: SortKey; className?: string }) {
    return (
      <th
        className={`px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-accent select-none ${className || ""}`}
        onClick={() => toggleSort(k)}
      >
        {label}
        {sortKey === k && <span className="ml-1">{sortAsc ? "↑" : "↓"}</span>}
      </th>
    );
  }

  return (
    <>
    <div className="mb-4 flex items-center gap-3">
      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <input type="checkbox" checked={hideSmall} onChange={() => setHideSmall(!hideSmall)} className="accent-indigo-600" />
        Hide small agencies (&lt;50 employees)
      </label>
      <span className="text-xs text-gray-400">{filtered.length} of {agencies.length} shown</span>
    </div>
    <div className="overflow-x-auto border border-gray-200 rounded-xl">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <SortHeader label="Agency" k="name" className="min-w-[200px]" />
            <SortHeader label="Risk Score" k="riskScore" />
            <SortHeader label="Employees" k="employees" />
            <SortHeader label="Retirement %" k="retirementPct" />
            <SortHeader label="STEM %" k="stemPct" />
            <SortHeader label="RIF Count" k="rifCount" />
            <SortHeader label="2025 Seps" k="seps2025" />
            <SortHeader label="% Reduction" k="reductionPct" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map((a) => (
            <tr key={a.code} className="hover:bg-accent-50/50 transition-colors">
              <td className="px-3 py-3">
                <Link href={`/agencies/${a.code}`} className="text-accent hover:underline font-medium">
                  {fixAgencyName(a.name)}
                </Link>
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${riskColor(a.riskScore)}`} style={{ width: `${a.riskScore}%` }} />
                  </div>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${riskBadge(a.riskScore)}`}>
                    {a.riskScore}
                  </span>
                </div>
              </td>
              <td className="px-3 py-3 text-gray-700">{formatNumber(a.employees)}</td>
              <td className="px-3 py-3 text-gray-700">{a.retirementPct}%</td>
              <td className="px-3 py-3 text-gray-700">{a.stemPct}%</td>
              <td className="px-3 py-3 text-gray-700">{a.rifCount.toLocaleString()}</td>
              <td className="px-3 py-3 text-gray-700">{a.seps2025.toLocaleString()}</td>
              <td className="px-3 py-3">
                <span className={a.reductionPct > 30 ? "text-red-600 font-semibold" : "text-gray-700"}>
                  {fmtReduction(a.reductionPct)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
