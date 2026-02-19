"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { formatNumber, formatSalary } from "@/lib/format";

type SortKey = "employees" | "avgSalary" | "name";

export function StatesClient({ states }: { states: { code: string; name: string; employees: number; avgSalary: number }[] }) {
  const [sortBy, setSortBy] = useState<SortKey>("employees");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const maxEmployees = useMemo(() => Math.max(...states.map(s => s.employees)), [states]);

  const sorted = useMemo(() => {
    const list = [...states];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = (a.name || a.code).localeCompare(b.name || b.code);
      else cmp = (a[sortBy] ?? 0) - (b[sortBy] ?? 0);
      return sortDir === "desc" ? -cmp : cmp;
    });
    return list;
  }, [states, sortBy, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(key); setSortDir(key === "name" ? "asc" : "desc"); }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <span>Sort by:</span>
        {([["employees", "Employees"], ["avgSalary", "Avg Salary"], ["name", "Name"]] as [SortKey, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => toggleSort(key)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${sortBy === key ? "bg-accent text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {label} {sortBy === key ? (sortDir === "desc" ? "↓" : "↑") : ""}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sorted.map((s) => (
          <Link
            key={s.code}
            href={`/states/${s.code}`}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-accent-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-accent">{s.name || s.code}</h3>
              <span className="text-xs text-gray-400 font-mono">{s.code}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{formatNumber(s.employees)} employees</span>
              <span>Avg {formatSalary(s.avgSalary)}</span>
            </div>
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full accent-gradient rounded-full"
                style={{ width: `${Math.min(100, (s.employees / maxEmployees) * 100)}%` }}
              />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
