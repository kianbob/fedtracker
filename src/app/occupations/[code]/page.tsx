import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { formatNumber, formatSalary, toTitleCase } from "@/lib/format";
import { StatCard } from "@/components/StatCard";
import { OccupationCharts } from "./OccupationCharts";
import fs from "fs";
import path from "path";

function getOccData(code: string) {
  const filePath = path.join(process.cwd(), "public", "data", "occupation-detail", `${code}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const data = getOccData(params.code);
  if (!data) return { title: "Occupation Not Found — FedTracker" };
  return {
    title: `${toTitleCase(data.name)} (${data.code}) — ${formatNumber(data.employees)} Employees — FedTracker`,
    description: `Federal ${toTitleCase(data.name)} workforce data: ${formatNumber(data.employees)} employees, average salary ${formatSalary(data.avgSalary)}.`,
  };
}

export function generateStaticParams() {
  const dir = path.join(process.cwd(), "public", "data", "occupation-detail");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith(".json"))
    .slice(0, 500)
    .map(f => ({ code: f.replace(".json", "") }));
}

export default async function OccupationDetailPage({ params }: { params: { code: string } }) {
  const data = getOccData(params.code);
  if (!data) notFound();

  const topAgency = data.topAgencies?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/occupations" className="hover:text-accent">Occupations</Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-700">{toTitleCase(data.name)}</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{toTitleCase(data.name)}</h1>
      <p className="text-gray-500 mb-8">Series {data.code} · {data.group ? toTitleCase(data.group) : ""}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <StatCard label="Total Employees" value={formatNumber(data.employees)} />
        <StatCard label="Average Salary" value={formatSalary(data.avgSalary)} />
        {topAgency && <StatCard label="Top Agency" value={toTitleCase(topAgency.name || topAgency.code)} sub={`${formatNumber(topAgency.count)} employees`} />}
        {data.topStates?.[0] && <StatCard label="Top State" value={data.topStates[0].state} sub={`${formatNumber(data.topStates[0].count)} employees`} />}
      </div>

      <OccupationCharts data={data} />

      {/* Top States */}
      {data.topStates?.length > 0 && (
        <section className="mt-12 mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Top States</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {data.topStates.slice(0, 10).map((s: any) => (
              <div key={s.state} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="font-semibold text-gray-900">{s.state}</p>
                <p className="text-sm text-gray-500">{formatNumber(s.count)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Salary by Grade */}
      {data.salaryByGrade?.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Salary by Grade</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 px-5 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <span>Grade</span><span className="text-right">Employees</span><span className="text-right">Avg Salary</span>
            </div>
            <div className="divide-y divide-gray-100">
              {data.salaryByGrade.slice(0, 15).map((g: any) => (
                <div key={g.grade} className="grid grid-cols-3 px-5 py-2.5 text-sm">
                  <span className="font-medium text-gray-900">{g.grade}</span>
                  <span className="text-right text-gray-700">{formatNumber(g.count)}</span>
                  <span className={`text-right ${g.avgSalary === 0 ? "text-gray-400" : "text-gray-700"}`}>{g.avgSalary === 0 ? "N/A" : formatSalary(g.avgSalary)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
