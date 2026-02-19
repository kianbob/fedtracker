import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { formatNumber, formatSalary, cleanAgencyName, toTitleCase } from "@/lib/format";
import { AgencyCharts } from "./AgencyCharts";
import agencyList from "../../../../public/data/agency-list.json";
import fs from "fs";
import path from "path";

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const data = await getAgencyData(params.code);
  if (!data) return { title: "Agency Not Found — FedTracker" };
  const name = cleanAgencyName(data.name);
  return {
    title: `${name} — ${formatNumber(data.employees)} Employees, Avg ${formatSalary(data.avgSalary)} — FedTracker`,
    description: `Federal workforce data for ${name}: ${formatNumber(data.employees)} employees, average salary ${formatSalary(data.avgSalary)}. Top occupations, locations, and separation trends.`,
  };
}

export const dynamicParams = true;

export function generateStaticParams() {
  return agencyList.slice(0, 200).map((a) => ({ code: a.code }));
}

async function getAgencyData(code: string) {
  const filePath = path.join(process.cwd(), "public", "data", "agencies", `${code}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

async function getAgencySeps(code: string) {
  const filePath = path.join(process.cwd(), "public", "data", "agency-separations", `${code}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export default async function AgencyDetailPage({ params }: { params: { code: string } }) {
  const { code } = params;
  const data = await getAgencyData(code);
  if (!data) notFound();

  const seps = await getAgencySeps(code);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/agencies" className="hover:text-accent">Agencies</Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-700">{cleanAgencyName(data.name)}</span>
      </nav>
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{cleanAgencyName(data.name)}</h1>
      <p className="text-gray-500 mb-8">Agency Code: {data.code} · {formatNumber(data.employees)} employees · December 2025</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">Total Employees</p>
          <p className="text-3xl font-serif font-bold">{formatNumber(data.employees)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">Average Salary</p>
          <p className="text-3xl font-serif font-bold">{formatSalary(data.avgSalary)}</p>
        </div>
      </div>

      {/* Top Occupations */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Top Occupations</h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="divide-y divide-gray-100">
            {data.topOccupations?.slice(0, 10).map((o: any, i: number) => (
              <div key={i} className="flex justify-between px-6 py-3">
                <span className="text-gray-800 truncate mr-4">{toTitleCase(o.name)}</span>
                <div className="flex gap-6 text-sm text-gray-500 whitespace-nowrap">
                  <span>{formatNumber(o.count)} employees</span>
                  <span>{formatSalary(o.avgSalary)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top States */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Top Locations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {data.topStates?.slice(0, 10).map((s: any, i: number) => (
            <Link key={i} href={`/states/${s.code}`} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center">
              <p className="font-semibold text-gray-900">{s.name || s.code}</p>
              <p className="text-sm text-gray-500">{formatNumber(s.count)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 2025 Impact */}
      {data.riskScore != null && (
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">2025 Workforce Impact</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Risk Score</p>
              <p className={`text-3xl font-serif font-bold ${data.riskScore > 60 ? 'text-red-600' : data.riskScore > 30 ? 'text-amber-600' : 'text-green-600'}`}>{data.riskScore}/100</p>
              <p className="text-xs text-gray-400">{data.riskScore > 60 ? 'Critical' : data.riskScore > 30 ? 'Elevated' : 'Stable'}</p>
            </div>
            {data.seps2025 > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide">2025 Separations</p>
                <p className="text-3xl font-serif font-bold text-gray-900">{formatNumber(data.seps2025)}</p>
                {data.sepChange !== 0 && <p className={`text-xs ${data.sepChange > 0 ? 'text-red-500' : 'text-green-500'}`}>{data.sepChange > 0 ? '+' : ''}{data.sepChange}% vs 2024</p>}
              </div>
            )}
            {data.rifCount > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide">RIFs (Layoffs)</p>
                <p className="text-3xl font-serif font-bold text-red-600">{formatNumber(data.rifCount)}</p>
              </div>
            )}
            {data.experienceLostYears > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Experience Lost</p>
                <p className="text-3xl font-serif font-bold text-gray-900">{formatNumber(data.experienceLostYears)}</p>
                <p className="text-xs text-gray-400">combined years</p>
              </div>
            )}
            {data.avgTenure && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Tenure</p>
                <p className="text-3xl font-serif font-bold text-gray-900">{data.avgTenure}</p>
                <p className="text-xs text-gray-400">years</p>
              </div>
            )}
            {data.quitRate > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Quit Rate</p>
                <p className="text-3xl font-serif font-bold text-amber-600">{data.quitRate}%</p>
                <p className="text-xs text-gray-400">of separations</p>
              </div>
            )}
            {data.reductionPct > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Workforce Reduction</p>
                <p className={`text-3xl font-serif font-bold ${data.reductionPct > 30 ? 'text-red-600' : 'text-gray-900'}`}>{data.reductionPct > 100 ? '>100' : data.reductionPct}%</p>
                <p className="text-xs text-gray-400">{data.reductionPct > 100 ? 'more left than remain' : 'of workforce separated'}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Budget from USASpending */}
      {data.budgetAuthority > 0 && (
        <section className="mb-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="font-serif text-xl font-bold text-blue-900 mb-3">💰 Agency Budget (FY2025)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-blue-600 font-medium">Budget Authority</p>
              <p className="text-xl font-bold text-blue-900">${data.budgetAuthority >= 1e12 ? (data.budgetAuthority/1e12).toFixed(1)+'T' : data.budgetAuthority >= 1e9 ? (data.budgetAuthority/1e9).toFixed(1)+'B' : (data.budgetAuthority/1e6).toFixed(0)+'M'}</p>
            </div>
            <div>
              <p className="text-blue-600 font-medium">Budget / Employee</p>
              <p className="text-xl font-bold text-blue-900">${data.budgetPerEmployee >= 1e6 ? (data.budgetPerEmployee/1e6).toFixed(1)+'M' : (data.budgetPerEmployee/1e3).toFixed(0)+'K'}</p>
            </div>
            {data.contracts > 0 && (
              <div>
                <p className="text-blue-600 font-medium">Contract Spending</p>
                <p className="text-xl font-bold text-blue-900">${data.contracts >= 1e9 ? (data.contracts/1e9).toFixed(1)+'B' : (data.contracts/1e6).toFixed(0)+'M'}</p>
              </div>
            )}
            {data.grants > 0 && (
              <div>
                <p className="text-blue-600 font-medium">Grant Spending</p>
                <p className="text-xl font-bold text-blue-900">${data.grants >= 1e9 ? (data.grants/1e9).toFixed(1)+'B' : (data.grants/1e6).toFixed(0)+'M'}</p>
              </div>
            )}
          </div>
          <p className="text-xs text-blue-500 mt-3">Source: <a href="https://usaspending.gov" target="_blank" rel="noopener" className="underline">USASpending.gov</a> FY2025. <Link href="/spending" className="underline">See all agencies →</Link></p>
        </section>
      )}

      {/* Extra stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {data.retirementRisk && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-sm text-red-600 font-medium">Retirement Risk</p>
            <p className="text-3xl font-serif font-bold text-red-700">{data.retirementRisk.pctEligible}%</p>
            <p className="text-xs text-red-500">{formatNumber(data.retirementRisk.eligible)} eligible</p>
          </div>
        )}
        {data.stem && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <p className="text-sm text-green-600 font-medium">STEM Workforce</p>
            <p className="text-3xl font-serif font-bold text-green-700">{data.stem.stemPct}%</p>
            <p className="text-xs text-green-500">{formatNumber(data.stem.stemCount)} STEM employees</p>
          </div>
        )}
        {data.supervisoryBreakdown && (() => {
          const mgrs = data.supervisoryBreakdown.filter((s: any) => 
            s.status?.includes("SUPERVISOR") || s.status?.includes("MANAGER") || s.status?.includes("LEADER") || s.status?.includes("MANAGEMENT")
          ).reduce((sum: number, s: any) => sum + (s.count || 0), 0);
          const staff = data.supervisoryBreakdown.find((s: any) => s.status === "ALL OTHER POSITIONS")?.count || 0;
          const ratio = mgrs > 0 ? Math.round(staff / mgrs) : 0;
          return (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
              <p className="text-sm text-indigo-600 font-medium">Manager:Staff Ratio</p>
              <p className="text-3xl font-serif font-bold text-indigo-700">1:{ratio}</p>
              <p className="text-xs text-indigo-500">{formatNumber(mgrs)} supervisors</p>
            </div>
          );
        })()}
      </div>

      {/* Age Distribution */}
      {data.ageDistribution?.length > 0 && (
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Age Distribution</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="divide-y divide-gray-100">
              {data.ageDistribution.map((a: any) => {
                const maxCount = Math.max(...data.ageDistribution.map((x: any) => x.count || 0));
                return (
                  <div key={a.label} className="flex items-center px-6 py-2">
                    <span className="text-sm text-gray-700 w-20 shrink-0">{a.label}</span>
                    <div className="flex-1 mx-4">
                      <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${maxCount > 0 ? (a.count / maxCount * 100) : 0}%` }} />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-20 text-right">{formatNumber(a.count)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Education Distribution */}
      {data.educationDistribution?.length > 0 && (
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Education Levels</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {data.educationDistribution.filter((e: any) => e.level !== "INVALID" && e.level !== "REDACTED").slice(0, 10).map((e: any) => (
              <div key={e.level} className="flex justify-between px-6 py-3">
                <span className="text-gray-800 text-sm">{toTitleCase(e.level)}</span>
                <span className="text-gray-700 font-semibold text-sm">{formatNumber(e.count)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Subagencies */}
      {data.subagencies?.length > 0 && (
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Subagencies</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {data.subagencies.slice(0, 20).map((s: any) => (
              <div key={s.code || s.name} className="flex justify-between px-6 py-3">
                <span className="text-gray-800 text-sm truncate mr-4">{toTitleCase(s.name)}</span>
                <div className="flex gap-4 text-sm text-gray-500 whitespace-nowrap shrink-0">
                  <span>{formatNumber(s.count || s.employees)} employees</span>
                  {s.avgSalary > 0 && <span>{formatSalary(s.avgSalary)}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Separations Breakdown */}
      {seps?.monthly?.length > 0 && (() => {
        const SEP_NAMES: Record<string, string> = {
          SA: "Transfer Out", SB: "Death", SC: "Quit", SD: "Retirement",
          SE: "Termination for Cause", SF: "Involuntary Resignation", SG: "Other",
          SH: "RIF", SJ: "Termination", SK: "Disability", SL: "Early Retirement",
        };
        const totals: Record<string, number> = {};
        for (const m of seps.monthly) {
          for (const key of Object.keys(SEP_NAMES)) {
            totals[key] = (totals[key] || 0) + (m[key] || 0);
          }
        }
        const sorted = Object.entries(totals)
          .filter(([, v]) => v > 0)
          .sort(([, a], [, b]) => b - a);
        const total = sorted.reduce((s, [, v]) => s + v, 0);
        if (sorted.length === 0) return null;
        return (
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Separations Breakdown</h2>
            <p className="text-sm text-gray-500 mb-4">{formatNumber(total)} total separations (FY2020–2025)</p>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
              {sorted.map(([code, count]) => (
                <Link key={code} href={`/separations/${code}`} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-400 w-6">{code}</span>
                    <span className="text-gray-800">{SEP_NAMES[code]}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${(count / sorted[0][1]) * 100}%` }} />
                    </div>
                    <span className="text-sm text-gray-600 font-semibold w-16 text-right">{formatNumber(count)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Separations chart */}
      {seps && <AgencyCharts seps={seps} />}
    </div>
  );
}
