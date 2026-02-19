"use client";
import { useState } from "react";
import Link from "next/link";
import { formatNumber, fixAgencyName } from "@/lib/format";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis,
} from "recharts";
import data from "../../../public/data/agency-budgets.json";

type SortKey = "budgetPerEmployee" | "contractsPerEmployee" | "employees" | "riskScore" | "outlays" | "contracts" | "name";

function hasBadBudgetData(a: any): boolean {
  return a.budgetPerEmployee > 10_000_000 || a.budgetPerEmployee < 1_000;
}

function fmtDollars(v: number | null | undefined): string {
  if (v == null || v < 0) return "N/A";
  if (v >= 1e12) return `$${(v / 1e12).toFixed(1)}T`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v}`;
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export function SpendingClient() {
  const [sortKey, setSortKey] = useState<SortKey>("budgetPerEmployee");
  const [sortAsc, setSortAsc] = useState(false);

  const agencies = data as any[];
  const sorted = [...agencies].sort((a, b) => {
    const av = sortKey === "name" ? fixAgencyName(a.name) : (a[sortKey] ?? 0);
    const bv = sortKey === "name" ? fixAgencyName(b.name) : (b[sortKey] ?? 0);
    if (av < bv) return sortAsc ? -1 : 1;
    if (av > bv) return sortAsc ? 1 : -1;
    return 0;
  });

  const validAgencies = agencies.filter(a => !hasBadBudgetData(a));
  const totalBudget = validAgencies.reduce((s, a) => s + (a.budgetAuthority || 0), 0);
  const totalEmployees = validAgencies.reduce((s, a) => s + (a.employees || 0), 0);
  const totalContracts = agencies.reduce((s, a) => s + (a.contracts > 0 ? a.contracts : 0), 0);
  const avgBudgetPerEmp = totalBudget / totalEmployees;

  // Top 15 for chart — exclude bad data joins
  const chartData = [...agencies]
    .filter(a => a.employees >= 500 && !hasBadBudgetData(a))
    .sort((a, b) => b.budgetPerEmployee - a.budgetPerEmployee)
    .slice(0, 15)
    .map(a => ({ name: fixAgencyName(a.name).replace(/Department of (the )?/i, "").slice(0, 22), value: a.budgetPerEmployee, code: a.opmCode }));

  // Scatter: contracts per emp vs risk score
  const scatterData = agencies
    .filter(a => a.employees >= 200 && (a.contractsPerEmployee || 0) > 0)
    .map(a => ({
      name: fixAgencyName(a.name).replace(/Department of (the )?/i, "").slice(0, 20),
      x: a.contractsPerEmployee,
      y: a.riskScore,
      z: a.employees,
    }));

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortAsc(!sortAsc);
    else { setSortKey(k); setSortAsc(k === "name"); }
  }

  function SortHeader({ label, k, className }: { label: string; k: SortKey; className?: string }) {
    return (
      <th className={`px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-accent select-none ${className || ""}`} onClick={() => toggleSort(k)}>
        {label}{sortKey === k && <span className="ml-1">{sortAsc ? "↑" : "↓"}</span>}
      </th>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <header className="mb-12">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">Federal Budget Analysis</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Follow the Money
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
          How much does each federal agency really cost per employee? By combining OPM workforce data with
          USASpending.gov budget data, we can see which agencies are lean operations and which are massive
          spending pipelines managed by relatively few people.
        </p>
        <p className="text-sm text-gray-400 mt-3">
          Data: OPM FedScope (Dec 2025 employment) + USASpending.gov (FY2025 budget authority &amp; obligations)
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard label="Total Budget Authority" value={fmtDollars(totalBudget)} sub="FY2025, matched agencies" />
        <StatCard label="Employees (Matched)" value={formatNumber(totalEmployees)} sub={`${validAgencies.length} agencies matched`} />
        <StatCard label="Avg Budget / Employee" value={fmtDollars(avgBudgetPerEmp)} sub="Across all matched" />
        <StatCard label="Total Contracts" value={fmtDollars(totalContracts)} sub="FY2025 obligations" />
      </div>

      {/* Bar chart */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">Budget Per Employee</h2>
        <p className="text-sm text-gray-500 mb-4">
          Agencies that manage the most money per staff member. High ratios suggest the agency is a spending pipeline
          (processing payments, managing grants) rather than a service-delivery workforce.
        </p>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 150 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => fmtDollars(v)} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140} />
              <Tooltip formatter={(v: any) => fmtDollars(Number(v))} labelStyle={{ fontWeight: 600 }} />
              <Bar dataKey="value" name="Budget / Employee" radius={[0, 4, 4, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={i < 3 ? "#DC2626" : i < 7 ? "#F59E0B" : "#4F46E5"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Scatter: contract outsourcing vs risk */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">Contract Outsourcing vs. Disruption Risk</h2>
        <p className="text-sm text-gray-500 mb-4">
          Agencies that depend heavily on contractors may face compounding disruption when combined with workforce
          reductions. Losing institutional knowledge while managing billions in contracts is a recipe for waste.
        </p>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart margin={{ top: 10, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" dataKey="x" name="Contracts/Employee" tick={{ fontSize: 11 }} tickFormatter={(v) => fmtDollars(v)} label={{ value: "Contracts per Employee", position: "bottom", fontSize: 12 }} />
              <YAxis type="number" dataKey="y" name="Risk Score" tick={{ fontSize: 11 }} label={{ value: "Risk Score", angle: -90, position: "insideLeft", fontSize: 12 }} />
              <ZAxis type="number" dataKey="z" range={[40, 400]} name="Employees" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(v: any) => fmtDollars(Number(v))} />
              <Scatter data={scatterData} fill="#4F46E5">
                {scatterData.map((d, i) => (
                  <Cell key={i} fill={d.y > 60 ? "#DC2626" : d.y > 40 ? "#F59E0B" : "#22C55E"} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 text-center mt-2">Bubble size = employee count. Color: 🔴 critical (&gt;60) 🟡 elevated (40-60) 🟢 stable (&lt;40)</p>
        </div>
      </section>

      {/* Key insight */}
      <section className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6 mb-12">
        <h3 className="font-serif text-xl font-bold text-indigo-900 dark:text-indigo-200 mb-3">💡 What This Means</h3>
        <div className="text-indigo-800 dark:text-indigo-300 space-y-2 text-sm">
          <p>
            <strong>Not all federal employees do the same work.</strong> A USAID employee managed $54M in foreign aid programs.
            A DOE employee oversaw $6.7M in energy research contracts. Compare that to a DOJ employee at $559K — mostly
            direct law enforcement and legal work.
          </p>
          <p>
            When agencies like GSA (risk score: 81) or DOE (risk: 61) lose experienced staff, they&apos;re not just losing
            workers — they&apos;re losing the people who managed <em>billions</em> in contracts. Who watches the contractors
            when the contract managers are gone?
          </p>
          <p>
            This doesn&apos;t mean every position was necessary — some agencies may have been overstaffed for decades. But it
            does mean the <em>order</em> and <em>speed</em> of reductions matters. Cut the bloat, keep the oversight.
          </p>
        </div>
      </section>

      {/* Table */}
      <section>
        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-4">All Agencies — Budget &amp; Workforce</h2>
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <SortHeader label="Agency" k="name" className="min-w-[180px]" />
                <SortHeader label="Employees" k="employees" />
                <SortHeader label="Budget / Emp" k="budgetPerEmployee" />
                <SortHeader label="Contracts / Emp" k="contractsPerEmployee" />
                <SortHeader label="Total Outlays" k="outlays" />
                <SortHeader label="Total Contracts" k="contracts" />
                <SortHeader label="Risk Score" k="riskScore" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {sorted.map((a: any) => (
                <tr key={a.opmCode} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-3 py-3">
                    <Link href={`/agencies/${a.opmCode}`} className="text-accent hover:underline font-medium">
                      {fixAgencyName(a.name)}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{formatNumber(a.employees)}</td>
                  <td className="px-3 py-3 font-semibold text-gray-900 dark:text-white">
                    {hasBadBudgetData(a) ? <span className="text-gray-400 font-normal text-xs">Data unavailable</span> : fmtDollars(a.budgetPerEmployee)}
                  </td>
                  <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{a.contractsPerEmployee ? fmtDollars(a.contractsPerEmployee) : "—"}</td>
                  <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{fmtDollars(a.outlays)}</td>
                  <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{a.contracts ? fmtDollars(a.contracts) : "—"}</td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${a.riskScore > 60 ? "text-red-700 bg-red-50" : a.riskScore > 30 ? "text-yellow-700 bg-yellow-50" : "text-green-700 bg-green-50"}`}>
                      {a.riskScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Related Analysis */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Related Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/federal-bloat", title: "Federal Bloat Myth", desc: "Is the federal workforce really bloated? The data tells a different story than the headlines." },
            { href: "/agencies", title: "Agency Explorer", desc: "Browse all 128 federal agencies with workforce size, salary data, and separation trends." },
            { href: "/trends", title: "Workforce Trends", desc: "Month-by-month hiring, separations, and net change across the federal government." },
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

      {/* Source */}
      <p className="text-xs text-gray-400 mt-8">
        Sources: <a href="https://data.opm.gov" className="underline hover:text-accent" target="_blank" rel="noopener">OPM FedScope</a> (December 2025 employment) |{" "}
        <a href="https://usaspending.gov" className="underline hover:text-accent" target="_blank" rel="noopener">USASpending.gov</a> (FY2025 budget authority, obligations by award category).
        Only agencies matched between both datasets are shown. Military uniformed personnel are excluded from OPM data.
      </p>
    </div>
  );
}
