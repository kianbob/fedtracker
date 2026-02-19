"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AgencyBrainDrain {
  code: string;
  sep_count: number;
  avg_sep_salary: number;
  avg_sep_los: number;
  acc_count: number;
  avg_acc_salary: number;
  avg_acc_los: number;
  salary_gap: number;
  experience_gap: number;
}

interface GradeData {
  grade: string;
  count: number;
  avg_salary: number;
  avg_los: number;
}

interface BrainDrainData {
  separations_by_grade: GradeData[];
  accessions_by_grade: GradeData[];
  agency_brain_drain: AgencyBrainDrain[];
}

type SortKey = "salary_gap" | "experience_gap" | "sep_count" | "avg_sep_salary" | "avg_acc_salary" | "code";

function formatCurrency(n: number): string {
  return "$" + Math.round(n).toLocaleString();
}

export default function BrainDrainPage() {
  const [data, setData] = useState<BrainDrainData | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("salary_gap");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    fetch("/data/brain-drain.json")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const sortedAgencies = useMemo(() => {
    if (!data) return [];
    const sorted = [...data.agency_brain_drain].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return sorted;
  }, [data, sortKey, sortAsc]);

  const gradeChartData = useMemo(() => {
    if (!data) return [];
    const gradeOrder = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15"];
    const sepMap = new Map(data.separations_by_grade.map((g) => [g.grade, g.count]));
    const accMap = new Map(data.accessions_by_grade.map((g) => [g.grade, g.count]));
    return gradeOrder.map((g) => ({
      grade: `GS-${g}`,
      Separations: sepMap.get(g) || 0,
      "New Hires": accMap.get(g) || 0,
    }));
  }, [data]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  }

  function SortHeader({ label, field }: { label: string; field: SortKey }) {
    return (
      <th
        className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-indigo-700 select-none"
        onClick={() => handleSort(field)}
      >
        {label} {sortKey === field ? (sortAsc ? "↑" : "↓") : ""}
      </th>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">Loading brain drain data…</div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Brain Drain Index</span>
      </nav>

      {/* Hero */}
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          🧠 The Brain Drain Index
        </h1>
        <p className="text-xl text-gray-600 mb-6">Who&apos;s Really Leaving Government</p>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-8">
          <p className="text-5xl md:text-6xl font-bold text-indigo-700 mb-2">$49K</p>
          <p className="text-lg text-gray-700">
            Agencies are losing employees earning <strong>$49,000 more</strong> than their replacements
          </p>
        </div>
      </div>

      {/* Editorial */}
      <section className="mb-12">
        <blockquote className="border-l-4 border-indigo-500 pl-6 py-4 bg-indigo-50 rounded-r-xl">
          <p className="text-lg font-serif italic text-gray-800">
            This is the hidden cost of workforce reduction — not just headcount, but capability.
            Bloat is real, but cutting senior expertise to keep junior positions isn&apos;t efficiency.
            It&apos;s degrading capability.
          </p>
        </blockquote>
      </section>

      {/* Grade Comparison Chart */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">
          📊 Grade Comparison: Who&apos;s Leaving vs. Who&apos;s Being Hired
        </h2>
        <p className="text-gray-600 mb-6">
          We&apos;re losing GS-13s and hiring GS-5s. The experience drain is visible at every grade level.
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={gradeChartData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any) => typeof value === "number" ? value.toLocaleString() : String(value ?? "")} />
              <Legend />
              <Bar dataKey="Separations" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="New Hires" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Key Insight */}
      <section className="mb-12">
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="text-5xl">⚠️</div>
          <div>
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">You Can&apos;t Replace Institutional Knowledge</h3>
            <p className="text-gray-700">
              The average employee leaving has <strong>16+ years</strong> of service.
              The average new hire? <strong>Near zero.</strong> That&apos;s decades of expertise, relationships, and institutional memory walking out the door — and no training program can replace it overnight.
            </p>
          </div>
        </div>
      </section>

      {/* Agency Table */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">
          🏛️ Agency Brain Drain Rankings
        </h2>
        <p className="text-gray-600 mb-6">
          Sorted by salary gap between departing and incoming employees. Click any column header to re-sort.
        </p>
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortHeader label="Agency" field="code" />
                <SortHeader label="People Left" field="sep_count" />
                <SortHeader label="Avg Salary Leaving" field="avg_sep_salary" />
                <SortHeader label="Avg Salary Hired" field="avg_acc_salary" />
                <SortHeader label="Salary Gap" field="salary_gap" />
                <SortHeader label="Exp. Gap (yrs)" field="experience_gap" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {sortedAgencies.map((a) => (
                <tr key={a.code} className="hover:bg-indigo-50/50 transition-colors">
                  <td className="px-3 py-2 text-sm font-medium text-gray-900">{a.code}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{a.sep_count.toLocaleString()}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{formatCurrency(a.avg_sep_salary)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{formatCurrency(a.avg_acc_salary)}</td>
                  <td className="px-3 py-2 text-sm font-semibold text-red-700">{formatCurrency(a.salary_gap)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{a.experience_gap.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Agency codes are OPM sub-agency identifiers. {sortedAgencies.length} agencies shown.
        </p>
      </section>

      {/* Footer editorial */}
      <section className="mb-12 prose prose-lg max-w-none">
        <h2 className="font-serif text-2xl font-bold text-gray-900">The Bottom Line</h2>
        <p className="text-gray-700">
          Reducing government bloat is a worthy goal. But there&apos;s a difference between trimming fat and cutting muscle.
          When senior employees leave and are replaced by entry-level hires — or not replaced at all — agencies don&apos;t just lose headcount.
          They lose the ability to function. The salary gap tells you the cost. The experience gap tells you the risk.
        </p>
      </section>
    </main>
  );
}
