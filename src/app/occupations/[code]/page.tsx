import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { formatNumber, formatSalary, toTitleCase, explainGrade, fixAgencyName, stateFullName } from "@/lib/format";
import Breadcrumb from "@/components/Breadcrumb";
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
  if (!data) return { title: "Occupation Not Found — OpenFeds" };
  return {
    title: `${toTitleCase(data.name)} (${data.code}) — ${formatNumber(data.employees)} Employees — OpenFeds`,
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
      <Breadcrumb items={[
        { label: "Occupations", href: "/occupations" },
        { label: toTitleCase(data.name) },
      ]} />

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{toTitleCase(data.name)}</h1>
      <p className="text-gray-500 mb-8">Series {data.code} · {data.group ? toTitleCase(data.group) : ""}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <StatCard label="Total Employees" value={formatNumber(data.employees)} />
        <StatCard label="Average Salary" value={formatSalary(data.avgSalary)} />
        {topAgency && <StatCard label="Top Agency" value={fixAgencyName(topAgency.name || topAgency.code)} sub={`${formatNumber(topAgency.count)} employees`} />}
        {data.topStates?.[0] && <StatCard label="Top State" value={stateFullName(data.topStates[0].state)} sub={`${formatNumber(data.topStates[0].count)} employees`} />}
      </div>

      <OccupationCharts data={data} />

      {/* Top States */}
      {data.topStates?.length > 0 && (
        <section className="mt-12 mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Top States</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {data.topStates.slice(0, 10).map((s: any) => (
              <div key={s.state} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="font-semibold text-gray-900">{stateFullName(s.state)}</p>
                <p className="text-sm text-gray-500">{formatNumber(s.count)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Salary by Grade */}
      {data.salaryByGrade?.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Salary by Pay Plan &amp; Grade</h2>
          <p className="text-sm text-gray-500 mb-4">
            Federal employees are paid under various pay plans. GS (General Schedule) is the most common,
            covering most white-collar positions. Other plans include VA medical, Senior Executive Service,
            DoD acquisition, and agency-specific scales.
          </p>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 px-5 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <span>Grade &amp; Pay Plan</span><span className="text-right">Employees</span><span className="text-right">Avg Salary</span>
            </div>
            <div className="divide-y divide-gray-100">
              {data.salaryByGrade.slice(0, 20).map((g: any) => {
                const info = g.grade ? explainGrade(g.grade) : null;
                return (
                  <div key={g.grade} className="grid grid-cols-[1fr_auto_auto] gap-x-4 px-5 py-3 text-sm">
                    <div>
                      <span className="font-mono font-semibold text-gray-900">{g.grade}</span>
                      {info?.planName && (
                        <span className="ml-2 text-xs text-gray-500">
                          {info.planName}{info.level && info.level !== '00' && info.level !== 'PH' ? `, Grade ${info.level}` : ''}{info.level === 'PH' ? ' (Physician)' : ''}
                        </span>
                      )}
                    </div>
                    <span className="text-right text-gray-700 whitespace-nowrap">{formatNumber(g.count)}</span>
                    <span className={`text-right whitespace-nowrap ${g.avgSalary === 0 ? "text-gray-400" : "text-gray-700 font-medium"}`}>{g.avgSalary === 0 ? "N/A" : formatSalary(g.avgSalary)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
