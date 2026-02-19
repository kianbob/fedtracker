"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { formatNumber, formatSalary, cleanAgencyName } from "@/lib/format";
import agencyList from "../../../public/data/agency-list.json";
import agencyRisk from "../../../public/data/agency-risk.json";

type SortKey = "employees" | "avgSalary" | "name" | "riskScore" | "rifCount" | "reductionPct";

const riskMap = new Map(agencyRisk.map((a) => [a.code, a]));

function RiskDot({ score }: { score: number | undefined }) {
  if (score == null) return null;
  const color = score >= 67 ? "bg-red-500" : score >= 34 ? "bg-yellow-500" : "bg-green-500";
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${color} mr-2 flex-shrink-0`} title={`Risk: ${score}`} />;
}

const PAGE_SIZE = 20;

export function AgenciesClient() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("employees");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const merged = useMemo(() => {
    return agencyList.map((a) => {
      const risk = riskMap.get(a.code);
      return {
        ...a,
        riskScore: risk?.riskScore ?? null,
        rifCount: risk?.rifCount ?? null,
        reductionPct: risk?.reductionPct ?? null,
      };
    });
  }, []);

  const filtered = useMemo(() => {
    let list = merged.filter((a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) || a.code.toLowerCase().includes(search.toLowerCase())
    );
    list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = a.name.localeCompare(b.name);
      else cmp = ((a as Record<string, unknown>)[sortBy] as number ?? -1) - ((b as Record<string, unknown>)[sortBy] as number ?? -1);
      return sortDir === "desc" ? -cmp : cmp;
    });
    setVisibleCount(PAGE_SIZE);
    return list;
  }, [search, sortBy, sortDir, merged]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else { setSortBy(key); setSortDir(key === "name" ? "asc" : "desc"); }
  };

  const SortHeader = ({ k, label, className }: { k: SortKey; label: string; className?: string }) => (
    <button onClick={() => toggleSort(k)} className={`text-left font-medium text-xs uppercase tracking-wide ${sortBy === k ? "text-accent" : "text-gray-500"} hover:text-accent ${className ?? ""}`}>
      {label} {sortBy === k ? (sortDir === "desc" ? "↓" : "↑") : ""}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Federal Agencies</h1>
      <p className="text-gray-600 mb-8">All {agencyList.length} federal agencies with employee counts and salary data from December 2025.</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search agencies..."
          aria-label="Search federal agencies"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        />
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Sort:</span>
          {([["employees", "Employees"], ["name", "Name"], ["avgSalary", "Salary"], ["riskScore", "Risk"], ["rifCount", "RIFs"], ["reductionPct", "Reduction %"]] as [SortKey, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleSort(key)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${sortBy === key ? "bg-accent text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {label} {sortBy === key ? (sortDir === "desc" ? "↓" : "↑") : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Risk score legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mb-6 text-xs text-gray-500">
        <span className="font-medium text-gray-600">Risk Score (0–100, higher = more disruption risk):</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" /> Low (0–33)</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-500" /> Medium (34–66)</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500" /> High (67–100)</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Desktop header - hidden on mobile */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="col-span-4"><SortHeader k="name" label="Agency" /></div>
          <div className="col-span-2 text-right"><SortHeader k="employees" label="Employees" /></div>
          <div className="col-span-2 text-right"><SortHeader k="avgSalary" label="Avg Salary" /></div>
          <div className="col-span-1 text-right"><SortHeader k="riskScore" label="Risk" /></div>
          <div className="col-span-1 text-right"><SortHeader k="rifCount" label="RIFs" /></div>
          <div className="col-span-2 text-right"><SortHeader k="reductionPct" label="Reduction %" /></div>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.slice(0, visibleCount).map((a) => (
            <Link
              key={a.code}
              href={`/agencies/${a.code}`}
              className="block md:grid md:grid-cols-12 gap-4 px-6 py-4 hover:bg-accent-50 transition-colors"
            >
              <div className="md:col-span-4 flex items-center min-w-0">
                <RiskDot score={a.riskScore ?? undefined} />
                <span className="font-medium text-gray-900 truncate" title={cleanAgencyName(a.name)}>{cleanAgencyName(a.name)}</span>
                <span className="ml-2 text-xs font-semibold text-gray-600 shrink-0">{a.code}</span>
              </div>
              <div className="md:col-span-2 text-right text-gray-700 hidden md:block">{formatNumber(a.employees)}</div>
              <div className="md:col-span-2 text-right text-gray-700 hidden md:block">{formatSalary(a.avgSalary)}</div>
              <div className="md:col-span-1 text-right text-gray-700 hidden md:block">{a.riskScore ?? "—"}</div>
              <div className="md:col-span-1 text-right text-gray-700 hidden md:block">{a.rifCount != null ? formatNumber(a.rifCount) : "—"}</div>
              <div className="md:col-span-2 text-right text-gray-700 hidden md:block">{a.reductionPct != null ? (a.reductionPct > 100 ? ">100%" : a.reductionPct.toFixed(1) + "%") : "—"}</div>
              {/* Mobile inline stats */}
              <div className="flex gap-4 mt-1 text-xs text-gray-500 md:hidden">
                <span>{formatNumber(a.employees)} emp</span>
                <span>{formatSalary(a.avgSalary)}</span>
                {a.riskScore != null && <span>Risk: {a.riskScore}</span>}
                {a.reductionPct != null && <span>-{a.reductionPct > 100 ? ">100" : a.reductionPct.toFixed(1)}%</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Show More / count */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">
          Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} agencies
        </p>
        {visibleCount < filtered.length && (
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="px-4 py-2 text-sm font-medium text-accent border border-accent rounded-lg hover:bg-accent-50 transition-colors"
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
}
