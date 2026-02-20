import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { formatNumber, formatSalary, cleanAgencyName } from "@/lib/format";
import Breadcrumb from "@/components/Breadcrumb";
import { StateOccupationChart } from "@/components/StateOccupationChart";
import states from "../../../../public/data/states.json";
import stateOccupations from "../../../../public/data/state-occupations.json";
import fs from "fs";
import path from "path";

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bAnd\b/g, "and")
    .replace(/\bOf\b/g, "of")
    .replace(/\bThe\b/g, "the")
    .replace(/\bOr\b/g, "or")
    .replace(/\bIn\b/g, "in")
    .replace(/\bFor\b/g, "for")
    .replace(/^./, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const data = await getStateData(params.code);
  if (!data) return { title: "State Not Found — OpenFeds" };
  const salaryStr = formatSalary(data.avgSalary);
  const sepStr = data.separations2025 ? ` ${formatNumber(data.separations2025)} separations in 2025.` : "";
  return {
    title: `Federal Employees in ${data.name} — ${formatNumber(data.employees)} Workers, ${salaryStr} Avg Salary — OpenFeds`,
    description: `${formatNumber(data.employees)} federal employees in ${data.name}. Average salary ${salaryStr}.${sepStr} DOGE impact data, top agencies, and occupations.`,
  };
}

export const dynamicParams = true;

export function generateStaticParams() {
  return states.slice(0, 60).map((s) => ({ code: s.code }));
}

async function getStateData(code: string) {
  const filePath = path.join(process.cwd(), "public", "data", "state-detail", `${code}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function getStateOccupationData(code: string) {
  const stateData = (stateOccupations as any[]).find(
    (s) => s.code.toUpperCase() === code.toUpperCase()
  );
  return stateData || null;
}

export default async function StateDetailPage({ params }: { params: { code: string } }) {
  const data = await getStateData(params.code);
  if (!data) notFound();

  const occData = getStateOccupationData(params.code);
  const topOccupations = occData?.occupations?.slice(0, 15) || [];

  const salaryAboveNational = (data.salaryVsNational ?? 0) >= 0;
  const salaryDiffAbs = Math.abs(data.salaryVsNational ?? 0).toFixed(1);

  const maxAgencyEmployees = data.topAgencies?.length
    ? Math.max(...data.topAgencies.map((a: any) => a.employees))
    : 1;

  const nationalAvg = data.nationalAvgSalary ?? 0;
  const stateAvg = data.avgSalary ?? 0;
  const salaryBarMax = Math.max(nationalAvg, stateAvg, 1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Breadcrumb items={[
        { label: "States", href: "/states" },
        { label: data.name },
      ]} />

      {/* Hero Section */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Federal Employees in {data.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          {data.salaryVsNational != null && (
            <span className={`inline-flex items-center text-sm font-medium px-3 py-1 rounded-full ${
              salaryAboveNational
                ? "bg-indigo-50 text-indigo-700"
                : "bg-red-50 text-red-700"
            }`}>
              {salaryAboveNational ? "↑" : "↓"} {salaryDiffAbs}% {salaryAboveNational ? "above" : "below"} national average
            </span>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">Federal Employees</p>
          <p className="text-3xl font-serif font-bold text-gray-900">{formatNumber(data.employees)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">Average Salary</p>
          <p className="text-3xl font-serif font-bold text-gray-900">{formatSalary(data.avgSalary)}</p>
        </div>
        {data.separations2025 != null && data.separations2025 > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-sm text-gray-500">2025 Separations</p>
            <p className="text-3xl font-serif font-bold text-red-600">{formatNumber(data.separations2025)}</p>
          </div>
        )}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">Top Agencies</p>
          <p className="text-3xl font-serif font-bold text-gray-900">{data.topAgencies?.length ?? 0}</p>
        </div>
      </div>

      {/* DOGE Narrative */}
      {data.dogeNarrative && (
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            What DOGE Means for {data.name}
          </h2>
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed">{data.dogeNarrative}</p>
          </div>
        </section>
      )}

      {/* Salary Comparison */}
      {nationalAvg > 0 && stateAvg > 0 && (
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Salary Comparison</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{data.name} Average</span>
                  <span className="font-semibold text-gray-900">{formatSalary(stateAvg)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4">
                  <div
                    className="bg-indigo-600 h-4 rounded-full"
                    style={{ width: `${(stateAvg / salaryBarMax) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">National Average</span>
                  <span className="font-semibold text-gray-900">{formatSalary(nationalAvg)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4">
                  <div
                    className="bg-gray-400 h-4 rounded-full"
                    style={{ width: `${(nationalAvg / salaryBarMax) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Top Agencies */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Top Agencies</h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
          {data.topAgencies?.map((a: any, i: number) => (
            <Link key={i} href={`/agencies/${a.code}`} className="block px-6 py-4 hover:bg-indigo-50/50 transition-colors">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-gray-800 font-medium">{cleanAgencyName(a.name)}</span>
                <span className="text-gray-500 text-sm ml-4 whitespace-nowrap">{formatNumber(a.employees)}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${(a.employees / maxAgencyEmployees) * 100}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Occupations (list) */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Top Occupations</h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
          {data.topOccupations?.map((o: any, i: number) => (
            <div key={i} className="flex justify-between px-6 py-3">
              <span className="text-gray-800 truncate mr-4">{toTitleCase(o.name)}</span>
              <div className="flex gap-4 text-sm text-gray-500 whitespace-nowrap">
                <span>{formatNumber(o.employees)}</span>
                <span>{formatSalary(o.avgSalary)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Occupation Table + Chart */}
      {topOccupations.length > 0 && (
        <>
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
              Top Federal Occupations in {data.name}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Showing top 15 occupation groups by employee count, with average salary data.
            </p>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Occupation</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Employees</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Avg Salary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topOccupations.map((occ: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-gray-400">{i + 1}</td>
                        <td className="px-6 py-3 text-sm text-gray-800">{toTitleCase(occ.name)}</td>
                        <td className="px-6 py-3 text-sm text-gray-600 text-right">{formatNumber(occ.employees)}</td>
                        <td className="px-6 py-3 text-sm text-gray-600 text-right">{formatSalary(occ.avgSalary)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
              Top 10 Occupations by Employee Count
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <StateOccupationChart data={topOccupations} />
            </div>
          </section>
        </>
      )}

      {/* Link to occupations breakdown */}
      {occData && (
        <section className="mb-12">
          <Link
            href={`/states/${params.code}/occupations`}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-lg"
          >
            View top occupations in {data.name} →
          </Link>
        </section>
      )}

      {/* Related Links */}
      <section>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Explore More</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/geographic-impact" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
            <h3 className="font-serif font-bold text-gray-900 mb-1">Geographic Impact</h3>
            <p className="text-sm text-gray-500">See how federal workforce changes affect states nationwide.</p>
          </Link>
          <Link href="/impact" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
            <h3 className="font-serif font-bold text-gray-900 mb-1">DOGE Impact</h3>
            <p className="text-sm text-gray-500">Track DOGE-driven workforce reductions and their effects.</p>
          </Link>
          <Link href="/salaries" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
            <h3 className="font-serif font-bold text-gray-900 mb-1">Salary Data</h3>
            <p className="text-sm text-gray-500">Federal salary breakdowns by agency, grade, and location.</p>
          </Link>
          <Link href="/states" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
            <h3 className="font-serif font-bold text-gray-900 mb-1">All States</h3>
            <p className="text-sm text-gray-500">Compare federal employment across all 50 states.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
