"use client";
import { useState, useMemo } from "react";
import { formatNumber, formatSalary } from "@/lib/format";
import occupations from "../../../public/data/occupations.json";

type SortKey = "employees" | "avgSalary" | "name";

export default function OccupationsPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("employees");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let list = occupations.filter((o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) || o.code.includes(search)
    );
    list.sort((a, b) => {
      if (sortBy === "name") return sortDir === "desc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      return sortDir === "desc" ? (b[sortBy] ?? 0) - (a[sortBy] ?? 0) : (a[sortBy] ?? 0) - (b[sortBy] ?? 0);
    });
    return list.slice(0, 200);
  }, [search, sortBy, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else { setSortBy(key); setSortDir("desc"); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Federal Occupations</h1>
      <p className="text-gray-600 mb-8">{occupations.length} distinct occupations across the federal workforce.</p>

      <input
        type="text"
        placeholder="Search occupations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2.5 mb-6 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
      />

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="col-span-5">
            <button onClick={() => toggleSort("name")} className={`text-xs uppercase tracking-wide font-medium ${sortBy === "name" ? "text-accent" : "text-gray-500"}`}>
              Occupation {sortBy === "name" ? (sortDir === "desc" ? "↓" : "↑") : ""}
            </button>
          </div>
          <div className="col-span-3"><span className="text-xs text-gray-400">Family</span></div>
          <div className="col-span-2 text-right">
            <button onClick={() => toggleSort("employees")} className={`text-xs uppercase tracking-wide font-medium ${sortBy === "employees" ? "text-accent" : "text-gray-500"}`}>
              Count {sortBy === "employees" ? (sortDir === "desc" ? "↓" : "↑") : ""}
            </button>
          </div>
          <div className="col-span-2 text-right">
            <button onClick={() => toggleSort("avgSalary")} className={`text-xs uppercase tracking-wide font-medium ${sortBy === "avgSalary" ? "text-accent" : "text-gray-500"}`}>
              Avg Salary {sortBy === "avgSalary" ? (sortDir === "desc" ? "↓" : "↑") : ""}
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map((o) => (
            <div key={o.code} className="grid grid-cols-12 gap-4 px-6 py-3 hover:bg-accent-50 transition-colors">
              <div className="col-span-5">
                <span className="font-medium text-gray-900">{o.name}</span>
                <span className="ml-2 text-xs text-gray-400">{o.code}</span>
              </div>
              <div className="col-span-3 text-sm text-gray-500 truncate">{o.family}</div>
              <div className="col-span-2 text-right text-gray-700">{formatNumber(o.employees)}</div>
              <div className="col-span-2 text-right text-gray-700">{formatSalary(o.avgSalary)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
