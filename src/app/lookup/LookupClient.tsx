"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatNumber, formatSalary } from "@/lib/format";

interface Agency {
  code: string;
  name: string;
  employees: number;
  avgSalary: number | null;
  retirementPct: number;
  stemPct: number;
  riskScore: number;
  seps2025: number;
  seps2024: number;
  sepChange: number;
  rifCount: number;
  quitRate: number;
  reductionPct: number;
  experienceLostYears: number;
  avgTenure: number;
}

// Common abbreviations for agency search
const AGENCY_ALIASES: Record<string, string[]> = {
  'NN': ['NASA'],
  'DJ': ['DOJ', 'Justice'],
  'DD': ['DOD', 'Pentagon', 'Military', 'Defense'],
  'HE': ['HHS', 'Health'],
  'VA': ['Veterans', 'VA'],
  'TD': ['DOT', 'Transportation'],
  'TR': ['Treasury', 'IRS'],
  'ED': ['Education', 'Dept of Ed'],
  'IN': ['Interior', 'DOI'],
  'AG': ['USDA', 'Agriculture'],
  'HS': ['DHS', 'Homeland'],
  'ST': ['State Dept', 'DOS'],
  'DL': ['DOL', 'Labor'],
  'HU': ['HUD', 'Housing'],
  'CT': ['DOE', 'Energy'],
  'CM': ['Commerce'],
  'EP': ['EPA'],
  'GS': ['GSA'],
  'OM': ['OMB'],
  'FT': ['FTC'],
  'SE': ['SEC'],
  'NF': ['NSF', 'Science Foundation'],
  'SZ': ['SSA', 'Social Security'],
  'AM': ['USAID'],
};

function riskColor(score: number) {
  if (score > 60) return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" };
  if (score > 30) return { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" };
  return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" };
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className={`rounded-xl border p-4 ${color || "bg-white border-gray-200"}`}>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

export function LookupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Agency | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/data/agency-risk.json")
      .then((r) => r.json())
      .then((data: Agency[]) => {
        setAgencies(data);
        const code = searchParams.get("agency");
        if (code) {
          const match = data.find((a) => a.code === code.toUpperCase());
          if (match) {
            setSelected(match);
            setQuery(match.name);
          }
        }
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return agencies.slice(0, 10);
    const q = query.toLowerCase();
    return agencies.filter((a) => {
      if (a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)) return true;
      const aliases = AGENCY_ALIASES[a.code];
      return aliases ? aliases.some(al => al.toLowerCase().includes(q) || q.includes(al.toLowerCase())) : false;
    }).slice(0, 15);
  }, [query, agencies]);

  function selectAgency(a: Agency) {
    setSelected(a);
    setQuery(a.name);
    setShowDropdown(false);
    router.replace(`/lookup?agency=${a.code}`, { scroll: false });
  }

  const rc = selected ? riskColor(selected.riskScore) : null;

  const shareText = selected
    ? `${selected.name}: Risk Score ${selected.riskScore}/100, ${formatNumber(selected.seps2025)} separations in 2025 (${selected.sepChange > 0 ? "+" : ""}${selected.sepChange}% YoY). Check your agency at`
    : "";
  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://fedtracker.org/lookup";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-3">
          What Happened to My Agency?
        </h1>
        <p className="text-lg text-gray-600">
          Search for any federal agency to see how the 2025 workforce changes affected it.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl mx-auto mb-12">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); setSelected(null); }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search for your agency..."
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-accent focus:ring-2 focus:ring-accent-200 outline-none transition-all"
          />
        </div>
        {showDropdown && filtered.length > 0 && !selected && (
          <div ref={dropdownRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
            {filtered.map((a) => (
              <button
                key={a.code}
                onClick={() => selectAgency(a)}
                className="w-full text-left px-4 py-3 hover:bg-accent-50 transition-colors flex justify-between items-center border-b border-gray-50 last:border-0"
              >
                <span>
                  <span className="font-medium text-gray-900">{a.name}</span>
                  <span className="text-sm text-gray-400 ml-2">({a.code})</span>
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${riskColor(a.riskScore).bg} ${riskColor(a.riskScore).text}`}>
                  Risk: {a.riskScore}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Report Card */}
      {selected && rc && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-gray-900">{selected.name}</h2>
            <p className="text-gray-500 mt-1">Agency Code: {selected.code}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard
              label="Risk Score"
              value={`${selected.riskScore}/100`}
              color={`${rc.bg} ${rc.border} border`}
            />
            <StatCard label="Employees" value={formatNumber(selected.employees)} />
            <StatCard
              label="2025 Separations"
              value={formatNumber(selected.seps2025)}
              sub={`${selected.sepChange > 0 ? "+" : ""}${selected.sepChange}% vs 2024`}
            />
            <StatCard label="RIFs" value={formatNumber(selected.rifCount)} />
            <StatCard
              label="Workforce Reduction"
              value={`${selected.reductionPct}%`}
            />
            <StatCard label="Avg Salary" value={formatSalary(selected.avgSalary)} />
            <StatCard label="Retirement Risk" value={`${selected.retirementPct}%`} sub="eligible to retire" />
            <StatCard label="STEM %" value={`${selected.stemPct}%`} />
            <StatCard
              label="Experience Lost"
              value={`${formatNumber(selected.experienceLostYears)} yrs`}
            />
            <StatCard label="Quit Rate" value={`${selected.quitRate}%`} />
          </div>

          {/* Verdict */}
          <div className={`rounded-xl border-2 p-6 text-center ${rc.bg} ${rc.border}`}>
            {selected.riskScore > 60 ? (
              <p className="text-lg font-semibold text-red-800">
                🔴 Critical — This agency experienced severe workforce disruption in 2025
              </p>
            ) : selected.riskScore > 30 ? (
              <p className="text-lg font-semibold text-yellow-800">
                🟡 Warning — This agency saw significant workforce changes in 2025
              </p>
            ) : (
              <p className="text-lg font-semibold text-green-800">
                🟢 Relatively Stable — This agency was less affected by 2025 workforce changes
              </p>
            )}
          </div>

          {/* Share & Link */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-3">
              <span className="text-sm text-gray-500 self-center">Share this report:</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Post
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0077B5] text-white text-sm rounded-lg hover:bg-[#005885] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                Share
              </a>
            </div>
            <Link
              href={`/agencies/${selected.code.toLowerCase()}`}
              className="text-accent hover:text-accent-light font-medium transition-colors"
            >
              View full agency profile →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
