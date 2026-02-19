"use client";
import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface AgencyData {
  code: string;
  name: string;
  employees: number;
  avgSalary: number;
  topOccupations: { name: string; count: number; avgSalary: number }[];
}

interface GradeRow {
  grade: string;
  employees: number;
  pay_plan: string;
}

interface SepGradeRow {
  grade: string;
  count: number;
  avg_salary: number;
  avg_los: number;
}

interface GradeData {
  current_distribution: GradeRow[];
  separations_by_grade: SepGradeRow[];
  accessions_by_grade: SepGradeRow[];
}

const fmt = (n: number) => n.toLocaleString();
const fmtSal = (n: number) => "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

const COLORS = [
  "#4f46e5", "#7c3aed", "#2563eb", "#0891b2", "#059669",
  "#d97706", "#dc2626", "#6366f1", "#8b5cf6", "#06b6d4",
];

export function SalaryExplorerClient() {
  const [agencies, setAgencies] = useState<AgencyData[]>([]);
  const [gradeData, setGradeData] = useState<GradeData | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<string>("");
  const [compareAgency, setCompareAgency] = useState<string>("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Load agency data
    fetch("/api/agency-list")
      .then((r) => r.json())
      .then(setAgencies)
      .catch(() => {});
    fetch("/data/grade-shift.json")
      .then((r) => r.json())
      .then(setGradeData)
      .catch(() => {});
  }, []);

  const agencySorted = useMemo(
    () => [...agencies].sort((a, b) => a.name.localeCompare(b.name)),
    [agencies]
  );

  const filtered = useMemo(() => {
    if (!search) return [];
    const q = search.toLowerCase();
    return agencySorted.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q)
    );
  }, [search, agencySorted]);

  const selected = agencies.find((a) => a.code === selectedAgency);
  const compared = agencies.find((a) => a.code === compareAgency);

  // GS grade salary reference from separations data (most reliable avg salaries)
  const gsGrades = useMemo(() => {
    if (!gradeData) return [];
    return gradeData.separations_by_grade
      .filter((g) => parseInt(g.grade) >= 1 && parseInt(g.grade) <= 15)
      .sort((a, b) => parseInt(a.grade) - parseInt(b.grade));
  }, [gradeData]);

  // GS distribution (current)
  const gsDistribution = useMemo(() => {
    if (!gradeData) return [];
    return gradeData.current_distribution
      .filter((g) => g.pay_plan === "GS" && parseInt(g.grade) >= 1 && parseInt(g.grade) <= 15)
      .sort((a, b) => parseInt(a.grade) - parseInt(b.grade));
  }, [gradeData]);

  return (
    <div className="space-y-12">
      {/* Search */}
      <section>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
          🔍 Search Agency Salaries
        </h2>
        <input
          type="text"
          placeholder="Type an agency name... (e.g., NASA, Veterans Affairs, Treasury)"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && filtered.length > 0 && (
          <div className="mt-3 grid gap-2 max-h-80 overflow-y-auto">
            {filtered.slice(0, 10).map((a) => (
              <button
                key={a.code}
                onClick={() => {
                  setSelectedAgency(a.code);
                  setSearch("");
                }}
                className="text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 transition"
              >
                <span className="font-semibold text-gray-900">{a.name}</span>
                <span className="ml-3 text-gray-500">
                  {fmt(a.employees)} employees · Avg {fmtSal(a.avgSalary)}
                </span>
              </button>
            ))}
          </div>
        )}
        {search && filtered.length === 0 && (
          <p className="mt-2 text-gray-500">No agencies found matching &ldquo;{search}&rdquo;</p>
        )}
      </section>

      {/* Agency Selector + Compare */}
      <section className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Agency
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={selectedAgency}
            onChange={(e) => setSelectedAgency(e.target.value)}
          >
            <option value="">Choose an agency...</option>
            {agencySorted.map((a) => (
              <option key={a.code} value={a.code}>
                {a.name} ({fmt(a.employees)})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Compare With (optional)
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={compareAgency}
            onChange={(e) => setCompareAgency(e.target.value)}
          >
            <option value="">Choose an agency...</option>
            {agencySorted.map((a) => (
              <option key={a.code} value={a.code}>
                {a.name} ({fmt(a.employees)})
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Selected Agency Detail */}
      {selected && (
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-serif text-2xl font-bold text-gray-900 mb-1">{selected.name}</h3>
          <div className="grid grid-cols-2 gap-4 mt-4 mb-6">
            <div className="bg-indigo-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-indigo-700">{fmt(selected.employees)}</p>
              <p className="text-sm text-gray-600">Employees</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-emerald-700">{fmtSal(selected.avgSalary)}</p>
              <p className="text-sm text-gray-600">Average Salary</p>
            </div>
          </div>
          {selected.topOccupations && selected.topOccupations.length > 0 && (
            <>
              <h4 className="font-semibold text-gray-700 mb-2">Top Occupations</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-500">
                      <th className="pb-2 pr-4">Occupation</th>
                      <th className="pb-2 pr-4 text-right">Count</th>
                      <th className="pb-2 text-right">Avg Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.topOccupations.slice(0, 10).map((o, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-2 pr-4 text-gray-800">{o.name}</td>
                        <td className="py-2 pr-4 text-right text-gray-600">{fmt(o.count)}</td>
                        <td className="py-2 text-right font-medium text-gray-900">{fmtSal(o.avgSalary)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      )}

      {/* Side-by-side compare */}
      {selected && compared && compared.code !== selected.code && (
        <section>
          <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            📊 Comparison
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[selected, compared].map((a) => (
              <div key={a.code} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h4 className="font-semibold text-lg text-gray-900 mb-3">{a.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Employees</span>
                    <span className="font-semibold">{fmt(a.employees)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Average Salary</span>
                    <span className="font-semibold">{fmtSal(a.avgSalary)}</span>
                  </div>
                  {a.topOccupations?.[0] && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Top Job</span>
                      <span className="font-semibold text-right">{a.topOccupations[0].name}</span>
                    </div>
                  )}
                  {a.topOccupations?.[0] && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Top Job Salary</span>
                      <span className="font-semibold">{fmtSal(a.topOccupations[0].avgSalary)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GS Grade Pay Scale */}
      {gsGrades.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            💰 GS Grade Pay Scale
          </h2>
          <p className="text-gray-600 mb-4">
            Average actual salaries by GS grade, including locality pay adjustments.
            Based on separation data (which captures the most accurate salary snapshots).
          </p>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gsGrades}>
                <XAxis dataKey="grade" tick={{ fontSize: 12 }} tickFormatter={(v) => `GS-${v}`} />
                <YAxis
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 12 }}
                  width={60}
                />
                <Tooltip
                  formatter={(v) => [fmtSal(Number(v)), "Avg Salary"]}
                  labelFormatter={(l) => `GS-${l}`}
                />
                <Bar dataKey="avg_salary" radius={[4, 4, 0, 0]}>
                  {gsGrades.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-2 pr-4">Grade</th>
                  <th className="pb-2 pr-4 text-right">Avg Salary</th>
                  <th className="pb-2 pr-4 text-right">Departed Employees</th>
                  <th className="pb-2 text-right">Avg Years of Service</th>
                </tr>
              </thead>
              <tbody>
                {gsGrades.map((g) => (
                  <tr key={g.grade} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-medium text-gray-800">GS-{g.grade}</td>
                    <td className="py-2 pr-4 text-right text-gray-900">{fmtSal(g.avg_salary)}</td>
                    <td className="py-2 pr-4 text-right text-gray-600">{fmt(g.count)}</td>
                    <td className="py-2 text-right text-gray-600">{g.avg_los.toFixed(1)} yrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* GS Distribution */}
      {gsDistribution.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            📈 Current GS Grade Distribution
          </h2>
          <p className="text-gray-600 mb-4">
            How many employees are at each GS grade level right now.
            GS-12 and GS-13 dominate — the &ldquo;journeyman&rdquo; and &ldquo;senior specialist&rdquo; levels.
          </p>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gsDistribution}>
                <XAxis dataKey="grade" tick={{ fontSize: 12 }} tickFormatter={(v) => `GS-${v}`} />
                <YAxis
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 12 }}
                  width={50}
                />
                <Tooltip
                  formatter={(v: any) => [fmt(v), "Employees"]}
                  labelFormatter={(l) => `GS-${l}`}
                />
                <Bar dataKey="employees" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  );
}
