import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { formatNumber, formatSalary, cleanAgencyName } from "@/lib/format";

export const metadata: Metadata = {
  title: "Federal Subagencies — 788 Organizations Within Agencies — FedTracker",
  description: "Drill into the organizational structure of the federal government. Browse 788 subagencies within departments, with employee counts and salary data.",
};

function loadJson(name: string) {
  try {
    const p = path.join(process.cwd(), "public", "data", name);
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch { return null; }
}

export default function SubagenciesPage() {
  const data: any[] | null = loadJson("subagencies.json");

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">Federal Subagencies</h1>
        <p className="text-gray-500">Data loading...</p>
      </div>
    );
  }

  // Group by parent agency
  const byParent: Record<string, any[]> = {};
  for (const sub of data) {
    const key = sub.parentCode;
    if (!byParent[key]) byParent[key] = [];
    byParent[key].push(sub);
  }

  const parentGroups = Object.entries(byParent)
    .map(([code, subs]) => ({
      code,
      name: subs[0].parentName,
      totalEmployees: subs.reduce((s: number, sub: any) => s + sub.employees, 0),
      subs: subs.sort((a: any, b: any) => b.employees - a.employees),
    }))
    .sort((a, b) => b.totalEmployees - a.totalEmployees);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Federal Subagencies</h1>
      <p className="text-gray-600 mb-8">
        The federal government isn&apos;t just {parentGroups.length} agencies — it&apos;s {data.length}+ distinct organizations. 
        Here&apos;s the full breakdown of who&apos;s inside each department.
      </p>

      <div className="space-y-8">
        {parentGroups.map(group => (
          <div key={group.code} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <Link href={`/agencies/${group.code}`} className="block bg-gray-50 px-6 py-4 hover:bg-indigo-50 transition-colors border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-gray-900">{cleanAgencyName(group.name)}</h2>
                <span className="text-sm text-gray-500">{formatNumber(group.totalEmployees)} employees · {group.subs.length} subagencies</span>
              </div>
            </Link>
            <div className="divide-y divide-gray-100">
              {group.subs.slice(0, 10).map((sub: any) => (
                <div key={sub.code} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50">
                  <div>
                    <span className="text-sm text-gray-800">{cleanAgencyName(sub.name)}</span>
                    <span className="text-xs text-gray-400 ml-2">({sub.code})</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">{formatNumber(sub.employees)}</span>
                    <span className="text-gray-400">Avg {formatSalary(sub.avgSalary)}</span>
                  </div>
                </div>
              ))}
              {group.subs.length > 10 && (
                <div className="px-6 py-2 text-xs text-gray-400">
                  + {group.subs.length - 10} more subagencies
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
