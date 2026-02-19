"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { formatNumber, formatSalary, cleanAgencyName } from "@/lib/format";

interface SubagencyGroup {
  code: string;
  name: string;
  totalEmployees: number;
  subs: { code: string; name: string; employees: number; avgSalary: number }[];
}

const INITIAL_GROUPS = 10;

export function SubagenciesClient({ parentGroups }: { parentGroups: SubagencyGroup[] }) {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (!search) return parentGroups;
    const q = search.toLowerCase();
    return parentGroups.filter(g =>
      g.name.toLowerCase().includes(q) ||
      g.code.toLowerCase().includes(q) ||
      g.subs.some(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q))
    );
  }, [parentGroups, search]);

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_GROUPS);

  const toggleExpand = (code: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code); else next.add(code);
      return next;
    });
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search agencies or subagencies..."
        aria-label="Search subagencies"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setShowAll(false); }}
        className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2.5 mb-6 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
      />

      <div className="space-y-8">
        {visible.map(group => (
          <div key={group.code} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <Link href={`/agencies/${group.code}`} className="block bg-gray-50 px-6 py-4 hover:bg-indigo-50 transition-colors border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-gray-900">{cleanAgencyName(group.name)}</h2>
                <span className="text-sm text-gray-500">{formatNumber(group.totalEmployees)} employees · {group.subs.length} subagencies</span>
              </div>
            </Link>
            {/* Column headers */}
            <div className="flex items-center justify-between px-6 py-2 bg-gray-50/50 border-b border-gray-100">
              <span className="text-xs uppercase tracking-wide font-medium text-gray-500">Subagency</span>
              <div className="flex items-center gap-4 text-xs uppercase tracking-wide font-medium text-gray-500">
                <span className="w-20 text-right">Employees</span>
                <span className="w-24 text-right">Avg Salary</span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {(expandedGroups.has(group.code) ? group.subs : group.subs.slice(0, 10)).map((sub) => (
                <div key={sub.code} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50">
                  <div>
                    <span className="text-sm text-gray-800">{cleanAgencyName(sub.name)}</span>
                    <span className="text-xs text-gray-400 ml-2">({sub.code})</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 w-20 text-right">{formatNumber(sub.employees)}</span>
                    <span className="text-gray-400 w-24 text-right">Avg {formatSalary(sub.avgSalary)}</span>
                  </div>
                </div>
              ))}
              {group.subs.length > 10 && !expandedGroups.has(group.code) && (
                <button
                  onClick={() => toggleExpand(group.code)}
                  className="w-full px-6 py-2 text-xs text-accent hover:bg-accent-50 transition-colors text-left"
                >
                  + {group.subs.length - 10} more subagencies
                </button>
              )}
              {group.subs.length > 10 && expandedGroups.has(group.code) && (
                <button
                  onClick={() => toggleExpand(group.code)}
                  className="w-full px-6 py-2 text-xs text-accent hover:bg-accent-50 transition-colors text-left"
                >
                  Show fewer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show more / less */}
      {filtered.length > INITIAL_GROUPS && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Showing {visible.length} of {filtered.length} agencies
          </p>
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 text-sm font-medium text-accent border border-accent rounded-lg hover:bg-accent-50 transition-colors"
          >
            {showAll ? "Show fewer" : "Show all"}
          </button>
        </div>
      )}
    </>
  );
}
