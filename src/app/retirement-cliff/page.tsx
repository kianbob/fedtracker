"use client";

import { useState, useEffect, useMemo, Fragment } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface AgencyRetirement {
  code: string;
  name: string;
  total: number;
  near_retirement: number;
  pct_near_retirement: number;
  age_distribution: Record<string, number>;
}

const AGE_ORDER = [
  "LESS THAN 20", "20-24", "25-29", "30-34", "35-39",
  "40-44", "45-49", "50-54", "55-59", "60-64", "65 OR MORE",
];

function toTitleCase(s: string): string {
  const minor = new Set(["of", "the", "and", "in", "for", "on", "at", "to", "a", "an"]);
  return s
    .toLowerCase()
    .split(" ")
    .map((w, i) => (i > 0 && minor.has(w)) ? w : w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function riskColor(pct: number): string {
  if (pct >= 40) return "text-red-700 bg-red-50";
  if (pct >= 30) return "text-amber-700 bg-amber-50";
  if (pct >= 20) return "text-yellow-700 bg-yellow-50";
  return "text-gray-700";
}

function riskBadge(pct: number): string {
  if (pct >= 40) return "bg-red-100 text-red-800 border-red-300";
  if (pct >= 30) return "bg-amber-100 text-amber-800 border-amber-300";
  if (pct >= 20) return "bg-yellow-100 text-yellow-800 border-yellow-300";
  return "bg-green-100 text-green-800 border-green-300";
}

export default function RetirementCliffPage() {
  const [data, setData] = useState<AgencyRetirement[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/retirement-cliff.json")
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load data: ${r.status} ${r.statusText}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  // Aggregate age pyramid across all agencies
  const agePyramid = useMemo(() => {
    if (!data) return [];
    const totals: Record<string, number> = {};
    data.forEach((a) => {
      Object.entries(a.age_distribution).forEach(([bracket, count]) => {
        totals[bracket] = (totals[bracket] || 0) + count;
      });
    });
    return AGE_ORDER.filter((b) => totals[b]).map((bracket) => ({
      bracket,
      count: totals[bracket],
    }));
  }, [data]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">Loading retirement data…</div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Retirement Cliff</span>
      </nav>

      {/* Hero */}
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          🕰️ The Retirement Cliff
        </h1>
        <p className="text-xl text-gray-600 mb-6">Which Agencies Are About to Lose Half Their Workforce</p>
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8">
          <p className="text-5xl md:text-6xl font-bold text-red-700 mb-2">54.5%</p>
          <p className="text-lg text-gray-700">
            of Selective Service employees are near retirement age — and they&apos;re not alone
          </p>
        </div>
      </div>

      {/* Editorial */}
      <section className="mb-12">
        <blockquote className="border-l-4 border-red-500 pl-6 py-4 bg-red-50 rounded-r-xl">
          <p className="text-lg font-serif italic text-gray-800">
            On top of DOGE cuts, these agencies face a retirement tsunami. The question isn&apos;t whether
            they&apos;ll lose people — it&apos;s whether they&apos;ll be able to replace them.
          </p>
        </blockquote>
      </section>

      {/* Age Pyramid */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">
          📊 Federal Workforce Age Distribution
        </h2>
        <p className="text-gray-600 mb-6">Age brackets across all federal civilian employees. The bulge at 45-59 is the retirement wave.</p>
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={agePyramid} layout="vertical" barCategoryGap="15%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 12 }} />
              <YAxis dataKey="bracket" type="category" width={100} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: any) => typeof value === "number" ? value.toLocaleString() : String(value ?? "")} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {agePyramid.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      ["55-59", "60-64", "65 OR MORE"].includes(entry.bracket)
                        ? "#ef4444"
                        : ["50-54", "45-49"].includes(entry.bracket)
                        ? "#f59e0b"
                        : "#6366f1"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 text-xs text-gray-500 justify-center">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-sm inline-block" /> Near retirement (55+)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded-sm inline-block" /> Mid-career</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-500 rounded-sm inline-block" /> Early career</span>
          </div>
        </div>
      </section>

      {/* Agency Risk Table */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">
          🏛️ Agency Retirement Risk
        </h2>
        <p className="text-gray-600 mb-6">
          Sorted by % of workforce near retirement (age 55+). Click an agency to see its age breakdown.
        </p>
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Agency</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total Employees</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Near Retirement (55+)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">% Near Retirement</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {data.map((a) => (
                <>
                  <tr
                    key={a.code}
                    className="hover:bg-indigo-50/50 cursor-pointer transition-colors"
                    onClick={() => setExpandedCode(expandedCode === a.code ? null : a.code)}
                  >
                    <td className="px-4 py-2 text-sm">
                      <span className="font-medium text-gray-900">{a.name}</span>
                      <span className="text-gray-400 ml-2 text-xs">({a.code})</span>
                      <span className="ml-2 text-xs text-indigo-500">{expandedCode === a.code ? "▲" : "▼"}</span>
                    </td>
                    <td className="px-4 py-2 text-sm text-right text-gray-700">{a.total.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-right text-gray-700">{a.near_retirement.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold border ${riskBadge(a.pct_near_retirement)}`}>
                        {a.pct_near_retirement.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                  {expandedCode === a.code && (
                    <tr key={`${a.code}-detail`}>
                      <td colSpan={4} className="px-4 py-4 bg-gray-50">
                        <div className="max-w-lg">
                          <p className="text-xs text-gray-500 font-semibold mb-2 uppercase">Age Distribution — {a.name}</p>
                          <div className="space-y-1">
                            {AGE_ORDER.filter((b) => a.age_distribution[b]).map((bracket) => {
                              const count = a.age_distribution[bracket];
                              const pct = (count / a.total) * 100;
                              const isRetirement = ["55-59", "60-64", "65 OR MORE"].includes(bracket);
                              return (
                                <div key={bracket} className="flex items-center gap-2 text-xs">
                                  <span className="w-20 text-gray-500 text-right">{bracket}</span>
                                  <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${isRetirement ? "bg-red-400" : "bg-indigo-400"}`}
                                      style={{ width: `${Math.max(pct, 1)}%` }}
                                    />
                                  </div>
                                  <span className="w-16 text-gray-600">{count.toLocaleString()}</span>
                                  <span className="w-12 text-gray-400">{pct.toFixed(1)}%</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Line */}
      <section className="mb-12 prose prose-lg max-w-none">
        <h2 className="font-serif text-2xl font-bold text-gray-900">The Bottom Line</h2>
        <p className="text-gray-700">
          Even without a single layoff, dozens of agencies face a workforce crisis within the next decade.
          When a third or more of your staff is retirement-eligible, succession planning isn&apos;t optional — it&apos;s survival.
          Combined with hiring freezes and DOGE-driven reductions, the retirement cliff becomes a freefall.
        </p>
      </section>

      {/* Related Analysis */}
      <hr className="border-gray-200 mb-8" />
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Related Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/brain-drain", title: "Brain Drain Index", desc: "Senior staff losses and salary gaps" },
            { href: "/demographics", title: "Demographics", desc: "Age, tenure, and diversity breakdown" },
            { href: "/risk", title: "Workforce Risk", desc: "Agencies most vulnerable to staffing disruptions" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <h3 className="font-serif font-bold text-gray-900 group-hover:text-indigo-700 transition-colors mb-1">
                {link.title}
              </h3>
              <p className="text-sm text-gray-500">{link.desc}</p>
              <span className="text-indigo-600 text-sm font-medium mt-2 inline-block">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
