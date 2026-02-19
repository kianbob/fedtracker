"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { formatNumber, formatSalary, cleanAgencyName } from "@/lib/format";
import agencyRisk from "../../../public/data/agency-risk.json";

type Agency = (typeof agencyRisk)[number];

const sorted = [...agencyRisk].sort((a, b) => a.name.localeCompare(b.name));

type StatDef = {
  label: string;
  key: keyof Agency | "quitRatePct";
  format: (v: number | null) => string;
  better: "higher" | "lower";
};

const stats: StatDef[] = [
  { label: "Employees", key: "employees", format: (v) => formatNumber(v), better: "higher" },
  { label: "Avg Salary", key: "avgSalary", format: (v) => formatSalary(v), better: "higher" },
  { label: "Risk Score", key: "riskScore", format: (v) => v?.toString() ?? "N/A", better: "lower" },
  { label: "Retirement %", key: "retirementPct", format: (v) => v != null ? v.toFixed(1) + "%" : "N/A", better: "lower" },
  { label: "STEM %", key: "stemPct", format: (v) => v != null ? v.toFixed(1) + "%" : "N/A", better: "higher" },
  { label: "RIF Count", key: "rifCount", format: (v) => formatNumber(v), better: "lower" },
  { label: "Quit Rate", key: "quitRate", format: (v) => v != null ? v.toFixed(1) + "%" : "N/A", better: "lower" },
  { label: "2025 Separations", key: "seps2025", format: (v) => formatNumber(v), better: "lower" },
  { label: "Workforce Reduction %", key: "reductionPct", format: (v) => v != null ? v.toFixed(1) + "%" : "N/A", better: "lower" },
  { label: "Experience Lost (years)", key: "experienceLostYears", format: (v) => formatNumber(v), better: "lower" },
  { label: "Avg Tenure", key: "avgTenure", format: (v) => v != null ? v.toFixed(1) + " yrs" : "N/A", better: "higher" },
];

function SearchableSelect({ value, onChange, exclude }: { value: string; onChange: (code: string) => void; exclude: string }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = agencyRisk.find((a) => a.code === value);
  const filtered = sorted.filter(
    (a) => a.code !== exclude && (search === "" || a.name.toLowerCase().includes(search.toLowerCase()) || a.code.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left border border-gray-300 rounded-lg px-4 py-2.5 bg-white hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
      >
        <span className="font-medium text-gray-900">{selected ? cleanAgencyName(selected.name) : "Select agency..."}</span>
        <span className="ml-2 text-xs text-gray-400">{selected?.code}</span>
        <svg className="w-4 h-4 absolute right-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              type="text"
              placeholder="Search agencies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div className="overflow-y-auto max-h-56">
            {filtered.map((a) => (
              <button
                key={a.code}
                onClick={() => { onChange(a.code); setOpen(false); setSearch(""); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-accent-50 hover:text-accent transition-colors ${a.code === value ? "bg-accent-50 text-accent font-medium" : "text-gray-700"}`}
              >
                {cleanAgencyName(a.name)} <span className="text-xs text-gray-400">{a.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function CompareClient() {
  const [leftCode, setLeftCode] = useState("VA");
  const [rightCode, setRightCode] = useState("HE");

  const left = agencyRisk.find((a) => a.code === leftCode)!;
  const right = agencyRisk.find((a) => a.code === rightCode)!;

  const getColor = (stat: StatDef, valA: number | null, valB: number | null) => {
    if (valA == null || valB == null || valA === valB) return { a: "", b: "" };
    const aWins = stat.better === "higher" ? valA > valB : valA < valB;
    return {
      a: aWins ? "text-green-600 font-semibold" : "text-red-500",
      b: aWins ? "text-red-500" : "text-green-600 font-semibold",
    };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Compare Agencies</h1>
      <p className="text-gray-600 mb-8">Select two federal agencies to compare side-by-side on key workforce metrics.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <SearchableSelect value={leftCode} onChange={setLeftCode} exclude={rightCode} />
        <SearchableSelect value={rightCode} onChange={setRightCode} exclude={leftCode} />
      </div>

      {left && right && (
        <div className="space-y-3">
          {/* Header row */}
          <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="font-medium text-sm text-gray-500 uppercase tracking-wide">Metric</div>
            <div className="text-center font-serif font-bold text-gray-900 text-sm truncate">{cleanAgencyName(left.name)}</div>
            <div className="text-center font-serif font-bold text-gray-900 text-sm truncate">{cleanAgencyName(right.name)}</div>
          </div>

          {stats.map((stat) => {
            const valA = left[stat.key as keyof Agency] as number | null;
            const valB = right[stat.key as keyof Agency] as number | null;
            const colors = getColor(stat, valA, valB);
            return (
              <div key={stat.label} className="grid grid-cols-3 gap-4 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                <div className={`text-center text-lg ${colors.a}`}>{stat.format(valA)}</div>
                <div className={`text-center text-lg ${colors.b}`}>{stat.format(valB)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
