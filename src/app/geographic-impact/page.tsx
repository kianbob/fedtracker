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
  ResponsiveContainer,
  Cell,
} from "recharts";

interface StateData {
  state: string;
  state_name: string;
  employees: number;
  agencies: number;
}

interface GeoData {
  current_by_state: StateData[];
  separations_by_location: { code: string; separations: number }[];
}

export default function GeographicImpactPage() {
  const [data, setData] = useState<GeoData | null>(null);

  useEffect(() => {
    fetch("/data/geographic-impact.json")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const states = useMemo(() => {
    if (!data) return [];
    return data.current_by_state.filter((s) => s.state !== "*" && s.state !== "NDR");
  }, [data]);

  const totalEmployees = useMemo(() => states.reduce((s, a) => s + a.employees, 0), [states]);

  const top20 = useMemo(() => states.slice(0, 20), [states]);

  const beltway = useMemo(() => {
    const dcVaMd = states.filter((s) => ["DC", "VA", "MD"].includes(s.state));
    const beltwayTotal = dcVaMd.reduce((s, a) => s + a.employees, 0);
    return { beltwayTotal, restTotal: totalEmployees - beltwayTotal };
  }, [states, totalEmployees]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">Loading geographic data…</div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Geographic Impact</span>
      </nav>

      {/* Hero */}
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          🗺️ Where Federal Jobs Are
        </h1>
        <p className="text-xl text-gray-600 mb-6">The Geographic Footprint of Government</p>
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8">
          <p className="text-5xl md:text-6xl font-bold text-emerald-700 mb-2">{states.length}</p>
          <p className="text-lg text-gray-700">
            states and territories with federal employees — totaling <strong>{totalEmployees.toLocaleString()}</strong> workers
          </p>
        </div>
      </div>

      {/* Editorial */}
      <section className="mb-12">
        <blockquote className="border-l-4 border-emerald-500 pl-6 py-4 bg-emerald-50 rounded-r-xl">
          <p className="text-lg font-serif italic text-gray-800">
            Where federal workers actually are might surprise you. It&apos;s not all DC — Texas, California,
            and Georgia are major federal employment centers because of military bases, VA hospitals,
            and IRS processing centers.
          </p>
        </blockquote>
      </section>

      {/* Beltway Bubble */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">
          🏛️ The Beltway Bubble
        </h2>
        <p className="text-gray-600 mb-6">DC, Virginia, and Maryland combined vs. the rest of the country.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-indigo-700">{beltway.beltwayTotal.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">DC + VA + MD</p>
            <p className="text-lg font-semibold text-indigo-600 mt-2">
              {((beltway.beltwayTotal / totalEmployees) * 100).toFixed(1)}% of all federal employees
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-gray-700">{beltway.restTotal.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">All other states</p>
            <p className="text-lg font-semibold text-gray-600 mt-2">
              {((beltway.restTotal / totalEmployees) * 100).toFixed(1)}% of all federal employees
            </p>
          </div>
        </div>
      </section>

      {/* Top 20 Bar Chart */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">
          📊 Top 20 States by Federal Employees
        </h2>
        <p className="text-gray-600 mb-6">Federal civilian workforce by state, ranked by headcount.</p>
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={top20} layout="vertical" barCategoryGap="12%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 12 }} />
              <YAxis dataKey="state" type="category" width={40} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any) => typeof value === "number" ? value.toLocaleString() : String(value ?? "")} labelFormatter={(label: any) => {
                const l = String(label);
                const found = top20.find(s => s.state === l);
                return found ? found.state_name : l;
              }} />
              <Bar dataKey="employees" radius={[0, 4, 4, 0]}>
                {top20.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={["DC", "VA", "MD"].includes(entry.state) ? "#6366f1" : "#10b981"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 text-xs text-gray-500 justify-center">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-500 rounded-sm inline-block" /> DC/VA/MD (Beltway)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded-sm inline-block" /> Other states</span>
          </div>
        </div>
      </section>

      {/* Full State Table */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">
          📋 All States
        </h2>
        <p className="text-gray-600 mb-6">Complete list of federal employees by state.</p>
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">State</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Employees</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase"># Agencies</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">% of Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {states.map((s) => (
                <tr key={s.state} className="hover:bg-emerald-50/50 transition-colors">
                  <td className="px-4 py-2 text-sm">
                    <span className="font-medium text-gray-900">{s.state_name}</span>
                    <span className="text-gray-400 ml-2 text-xs">({s.state})</span>
                  </td>
                  <td className="px-4 py-2 text-sm text-right text-gray-700">{s.employees.toLocaleString()}</td>
                  <td className="px-4 py-2 text-sm text-right text-gray-700">{s.agencies}</td>
                  <td className="px-4 py-2 text-sm text-right text-gray-600">
                    {((s.employees / totalEmployees) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Line */}
      <section className="mb-12 prose prose-lg max-w-none">
        <h2 className="font-serif text-2xl font-bold text-gray-900">The Bottom Line</h2>
        <p className="text-gray-700">
          The federal workforce isn&apos;t just a DC phenomenon. Major military installations, VA hospitals,
          and processing centers mean that states like Texas, California, Georgia, and Florida have enormous
          federal footprints. When we talk about cutting the federal workforce, we&apos;re talking about jobs
          in every state — often in communities where the government is the largest employer.
        </p>
      </section>
    </main>
  );
}
