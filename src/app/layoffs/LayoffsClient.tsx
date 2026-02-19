"use client";
import { useState, useMemo } from "react";
import { SeparationsChart } from "@/components/Charts";
import { StatCard } from "@/components/StatCard";
import { formatMonth, formatNumber } from "@/lib/format";
import Link from "next/link";

interface Props {
  separations: any;
  agencies: any[];
}

export function LayoffsClient({ separations, agencies }: Props) {
  const data = separations.monthly.map((m: any) => ({
    ...m,
    label: formatMonth(m.month),
  }));

  // Compute totals
  const totals = useMemo(() => {
    const t: Record<string, number> = {};
    separations.monthly.forEach((m: any) => {
      Object.keys(separations.types).forEach((k) => {
        t[k] = (t[k] || 0) + (m[k] || 0);
      });
    });
    return t;
  }, [separations]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Federal Layoffs & Separations</h1>
      <p className="text-gray-600 mb-8 max-w-3xl">
        Every federal employee who left their position from FY2020 to FY2025, broken down by type.
        RIFs (Reductions in Force) are involuntary layoffs. This data comes from OPM FedScope.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="RIFs (Layoffs)" value={formatNumber(totals["SH"] || 0)} sub="Reductions in Force" />
        <StatCard label="Terminations" value={formatNumber(totals["SJ"] || 0)} sub="Expired appointments & other" />
        <StatCard label="Quits" value={formatNumber(totals["SC"] || 0)} sub="Voluntary resignations" />
        <StatCard label="Retirements" value={formatNumber((totals["SD"] || 0) + (totals["SE"] || 0) + (totals["SF"] || 0) + (totals["SG"] || 0))} sub="All retirement types" />
      </div>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Monthly Separations by Type</h2>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <SeparationsChart data={data} />
        </div>
      </section>

      {/* Type breakdown table */}
      <section>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Separation Types (FY2020-2025)</h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="divide-y divide-gray-100">
            {Object.entries(separations.types as Record<string, string>)
              .sort((a, b) => (totals[b[0]] || 0) - (totals[a[0]] || 0))
              .map(([code, name]) => (
                <Link key={code} href={`/separations/${code}`} className="flex justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <span className="font-medium text-gray-900">{name}</span>
                    <span className="ml-2 text-xs text-gray-400">{code}</span>
                  </div>
                  <span className="font-semibold text-gray-700">{(totals[code] || 0).toLocaleString()}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Related Analysis */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Related Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/who-got-cut", title: "Who Got Cut", desc: "Agency-by-agency breakdown of the 2025 DOGE-driven workforce reductions." },
            { href: "/doge", title: "DOGE Impact Dashboard", desc: "Full breakdown of 2025 federal workforce restructuring by agency, month, and separation type." },
            { href: "/trends", title: "Workforce Trends", desc: "Month-by-month hiring, separations, and net change across the federal government." },
            { href: "/agencies", title: "Agency Explorer", desc: "Browse all 24 federal agencies with workforce size, salary data, and separation trends." },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group">
              <h3 className="font-serif font-bold text-gray-900 group-hover:text-indigo-700 transition-colors mb-1">{link.title}</h3>
              <p className="text-sm text-gray-500">{link.desc}</p>
              <span className="text-indigo-600 text-sm font-medium mt-2 inline-block">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <p className="text-xs text-gray-400 mt-8">
        Data: OPM FedScope (December 2025 employment, FY2020–2025 separations). Updated monthly.
      </p>
    </div>
  );
}
