import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { formatNumber, formatSalary, cleanAgencyName } from "@/lib/format";
import { SubagenciesClient } from "./SubagenciesClient";

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

      <SubagenciesClient parentGroups={parentGroups} />

      {/* Related Analysis */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Related Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/agencies", title: "Agency Explorer", desc: "Browse all 128 federal agencies with workforce size, salary data, and separation trends." },
            { href: "/doge", title: "DOGE Impact Dashboard", desc: "Full breakdown of 2025 federal workforce restructuring by agency, month, and separation type." },
            { href: "/risk", title: "Agency Risk Dashboard", desc: "Which agencies face the highest restructuring risk based on workforce trends." },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group">
              <h3 className="font-serif font-bold text-gray-900 group-hover:text-indigo-700 transition-colors mb-1">{link.title}</h3>
              <p className="text-sm text-gray-500">{link.desc}</p>
              <span className="text-indigo-600 text-sm font-medium mt-2 inline-block">Explore →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
