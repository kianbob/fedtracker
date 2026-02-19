"use client";
import { useState, useMemo } from "react";
import { formatNumber, formatSalary, toTitleCase } from "@/lib/format";
import Link from "next/link";
import occupations from "../../../public/data/occupations.json";

type SortKey = "employees" | "avgSalary" | "name";

export function OccupationsClient() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("employees");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const validOccupations = useMemo(() => occupations.filter((o) => o.code !== "*" && o.name.toLowerCase() !== "invalid"), []);

  const [page, setPage] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const PAGE_SIZE = 50;

  const sorted = useMemo(() => {
    let list = validOccupations.filter((o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) || o.code.includes(search)
    );
    list.sort((a, b) => {
      if (sortBy === "name") return sortDir === "desc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      return sortDir === "desc" ? (b[sortBy] ?? 0) - (a[sortBy] ?? 0) : (a[sortBy] ?? 0) - (b[sortBy] ?? 0);
    });
    return list;
  }, [search, sortBy, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const filtered = showAll ? sorted : sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else { setSortBy(key); setSortDir("desc"); }
    setPage(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Federal Occupations</h1>
      <p className="text-gray-600 mb-8">{validOccupations.length} distinct occupations across the federal workforce.</p>

      <input
        type="text"
        placeholder="Search occupations..."
        aria-label="Search occupations"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2.5 mb-6 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
      />

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="col-span-5">
            <button onClick={() => toggleSort("name")} className={`text-xs uppercase tracking-wide font-medium ${sortBy === "name" ? "text-accent" : "text-gray-500"}`}>
              Occupation {sortBy === "name" ? (sortDir === "desc" ? "↓" : "↑") : ""}
            </button>
          </div>
          <div className="col-span-3"><span className="text-xs uppercase tracking-wide font-medium text-gray-500">Family</span></div>
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
            <Link key={o.code} href={`/occupations/${o.code}`} className="grid grid-cols-12 gap-4 px-6 py-3 hover:bg-accent-50 transition-colors">
              <div className="col-span-5">
                <span className="font-medium text-gray-900">{o.name}</span>
                <span className="ml-2 text-xs text-gray-400">{o.code}</span>
              </div>
              <div className="col-span-3 text-sm text-gray-500 truncate">{o.family}</div>
              <div className="col-span-2 text-right text-gray-700">{formatNumber(o.employees)}</div>
              <div className="col-span-2 text-right text-gray-700">{formatSalary(o.avgSalary)}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {!showAll && sorted.length > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
            <button
              onClick={() => setShowAll(true)}
              className="ml-2 px-3 py-1.5 text-sm text-accent border border-accent rounded-lg hover:bg-accent-50 transition-colors"
            >
              Show all
            </button>
          </div>
        </div>
      )}
      {showAll && sorted.length > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">Showing all {sorted.length} occupations</p>
          <button
            onClick={() => { setShowAll(false); setPage(0); }}
            className="px-3 py-1.5 text-sm text-accent border border-accent rounded-lg hover:bg-accent-50 transition-colors"
          >
            Paginate
          </button>
        </div>
      )}
    </div>
  );
}
