"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { formatNumber, formatSalary, cleanAgencyName } from "@/lib/format";
import agencyList from "../../../public/data/agency-list.json";

type SortKey = "employees" | "avgSalary" | "name";

export function AgenciesClient() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("employees");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let list = agencyList.filter((a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) || a.code.toLowerCase().includes(search.toLowerCase())
    );
    list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = a.name.localeCompare(b.name);
      else cmp = (a[sortBy] ?? 0) - (b[sortBy] ?? 0);
      return sortDir === "desc" ? -cmp : cmp;
    });
    return list;
  }, [search, sortBy, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else { setSortBy(key); setSortDir("desc"); }
  };

  const SortHeader = ({ k, label }: { k: SortKey; label: string }) => (
    <button onClick={() => toggleSort(k)} className={`text-left font-medium text-xs uppercase tracking-wide ${sortBy === k ? "text-accent" : "text-gray-500"} hover:text-accent`}>
      {label} {sortBy === k ? (sortDir === "desc" ? "↓" : "↑") : ""}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Federal Agencies</h1>
      <p className="text-gray-600 mb-8">All {agencyList.length} federal agencies with employee counts and salary data from December 2025.</p>

      <input
        type="text"
        placeholder="Search agencies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2.5 mb-6 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
      />

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="col-span-6"><SortHeader k="name" label="Agency" /></div>
          <div className="col-span-3 text-right"><SortHeader k="employees" label="Employees" /></div>
          <div className="col-span-3 text-right"><SortHeader k="avgSalary" label="Avg Salary" /></div>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map((a) => (
            <Link
              key={a.code}
              href={`/agencies/${a.code}`}
              className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-accent-50 transition-colors"
            >
              <div className="col-span-6">
                <span className="font-medium text-gray-900">{cleanAgencyName(a.name)}</span>
                <span className="ml-2 text-xs text-gray-400">{a.code}</span>
              </div>
              <div className="col-span-3 text-right text-gray-700">{formatNumber(a.employees)}</div>
              <div className="col-span-3 text-right text-gray-700">{formatSalary(a.avgSalary)}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
