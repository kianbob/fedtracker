"use client";
import { SimpleBarChart } from "@/components/Charts";
import { StatCard } from "@/components/StatCard";
import { formatNumber, formatSalary, cleanAgencyName, toTitleCase, fixAgencyName } from "@/lib/format";
import Link from "next/link";

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mb-6">{subtitle}</p>}
      {children}
    </section>
  );
}

function ComparisonBar({ label, val1, val2 }: { label: string; val1: number; val2: number }) {
  const max = Math.max(val1, val2, 1);
  const change = val1 > 0 ? (((val2 - val1) / val1) * 100).toFixed(0) : "—";
  return (
    <div className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-700 w-32 shrink-0 truncate">{label}</span>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1">
          <div className="h-3 bg-blue-100 rounded-full overflow-hidden mb-1">
            <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(val1 / max) * 100}%` }} />
          </div>
          <div className="h-3 bg-red-100 rounded-full overflow-hidden">
            <div className="h-full bg-red-400 rounded-full" style={{ width: `${(val2 / max) * 100}%` }} />
          </div>
        </div>
        <div className="text-right w-24 shrink-0">
          <div className="text-xs text-blue-600">{formatNumber(val1)}</div>
          <div className="text-xs text-red-600">{formatNumber(val2)}</div>
        </div>
        <span className={`text-xs font-semibold w-14 text-right ${Number(change) > 0 ? "text-red-600" : "text-green-600"}`}>
          {change === "—" ? "—" : `${Number(change) > 0 ? "+" : ""}${change}%`}
        </span>
      </div>
    </div>
  );
}

export function AnalysisClient({ whosLeaving, retirementRisk, stemAnalysis, managerRatios, experienceExodus, overseas, gradeDistribution }: {
  whosLeaving: any; retirementRisk: any; stemAnalysis: any; managerRatios: any; experienceExodus: any; overseas: any; gradeDistribution: any;
}) {
  const hasData = whosLeaving || retirementRisk || stemAnalysis || managerRatios || experienceExodus || overseas || gradeDistribution;

  // Parse data safely
  const stemOverview = stemAnalysis?.overview || [];
  const stemTotal = stemOverview.find((s: any) => s.category === "STEM");
  const nonStemTotal = stemOverview.find((s: any) => s.category === "Non-STEM");
  const totalEmp = (stemTotal?.employees || 0) + (nonStemTotal?.employees || 0);
  
  const mgrOverall = managerRatios?.overall || [];
  const totalManagers = mgrOverall.filter((m: any) => 
    m.status.includes("SUPERVISOR") || m.status.includes("MANAGER") || m.status.includes("MANAGEMENT") || m.status.includes("LEADER")
  ).reduce((s: number, m: any) => s + m.count, 0);
  const totalStaff = mgrOverall.find((m: any) => m.status === "ALL OTHER POSITIONS")?.count || 0;
  const mgrRatio = totalManagers > 0 ? Math.round(totalStaff / totalManagers) : 0;

  const overseasData = overseas?.overview || [];
  const overseasTotal = overseasData.find((o: any) => o.location === "Overseas");
  const domesticTotal = overseasData.find((o: any) => o.location === "Domestic");

  const ee = experienceExodus;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Workforce Deep Dive</h1>
      <p className="text-gray-600 mb-12 max-w-3xl">
        Beyond the headlines — who&apos;s actually leaving the federal government, what experience is walking out the door, 
        and which agencies face the biggest risks. All from official OPM data.
      </p>

      {!hasData && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-500 text-lg">Analysis data is being generated...</p>
        </div>
      )}

      {/* RETIREMENT RISK */}
      {retirementRisk && (
        <Section title="🔴 Retirement Cliff" subtitle={`${retirementRisk.pctEligible}% of the federal workforce is eligible to retire right now.`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Retirement Eligible" value={formatNumber(retirementRisk.totalEligible)} sub={`${retirementRisk.pctEligible}% of workforce`} />
            <StatCard label="Total Workforce" value={formatNumber(retirementRisk.totalEmployees)} sub="December 2025" />
            <StatCard label="Highest Risk Agency" value={retirementRisk.byAgency?.[0] ? cleanAgencyName(retirementRisk.byAgency[0].name).slice(0, 25) : "—"} sub={`${retirementRisk.byAgency?.[0]?.pctEligible || 0}% eligible`} />
            <StatCard label="Highest Risk Job" value={retirementRisk.byOccupation?.[0] ? toTitleCase(retirementRisk.byOccupation[0].name).slice(0, 25) : "—"} sub={`${retirementRisk.byOccupation?.[0]?.pctEligible || 0}% eligible`} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {retirementRisk.byAgency && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Agencies with Highest Retirement %</h3>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {retirementRisk.byAgency.slice(0, 10).map((a: any) => (
                    <Link key={a.code} href={`/agencies/${a.code}`} className="flex justify-between px-5 py-3 hover:bg-red-50">
                      <span className="text-gray-800 text-sm truncate mr-3">{cleanAgencyName(a.name)}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-gray-400">{formatNumber(a.eligible)}/{formatNumber(a.total)}</span>
                        <span className="text-red-600 font-semibold text-sm">{a.pctEligible}%</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {retirementRisk.byOccupation && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Jobs with Highest Retirement %</h3>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {retirementRisk.byOccupation.slice(0, 10).map((o: any, i: number) => (
                    <div key={i} className="flex justify-between px-5 py-3">
                      <span className="text-gray-800 text-sm truncate mr-3">{toTitleCase(o.name)}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-gray-400">{formatNumber(o.eligible)}/{formatNumber(o.total)}</span>
                        <span className="text-red-600 font-semibold text-sm">{o.pctEligible}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* WHO'S LEAVING */}
      {whosLeaving && (
        <Section title="👋 Who&apos;s Leaving in 2025?" subtitle={`${formatNumber(whosLeaving.year2025?.total || 0)} separations in 2025 vs ${formatNumber(whosLeaving.year2024?.total || 0)} in 2024. Here's how the profile changed.`}>
          {whosLeaving.year2025?.byAge && whosLeaving.year2024?.byAge && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">By Age</h3>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                  <span className="inline-block w-3 h-3 bg-blue-400 rounded" /> 2024
                  <span className="inline-block w-3 h-3 bg-red-400 rounded" /> 2025
                </div>
                {whosLeaving.year2025.byAge.map((a: any) => {
                  const match2024 = whosLeaving.year2024.byAge.find((b: any) => b.label === a.label);
                  return <ComparisonBar key={a.label} label={a.label} val1={match2024?.count || 0} val2={a.count} />;
                })}
              </div>
            </div>
          )}
          {whosLeaving.year2025?.byLOS && whosLeaving.year2024?.byLOS && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">By Length of Service</h3>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                  <span className="inline-block w-3 h-3 bg-blue-400 rounded" /> 2024
                  <span className="inline-block w-3 h-3 bg-red-400 rounded" /> 2025
                </div>
                {whosLeaving.year2025.byLOS.map((a: any) => {
                  const match = whosLeaving.year2024.byLOS.find((b: any) => b.label === a.label);
                  return <ComparisonBar key={a.label} label={a.label} val1={match?.count || 0} val2={a.count} />;
                })}
              </div>
            </div>
          )}
          {whosLeaving.year2025?.topOccupations && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Top Occupations Losing People (2025)</h3>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <SimpleBarChart
                  data={whosLeaving.year2025.topOccupations.slice(0, 15).map((o: any) => ({
                    name: toTitleCase(o.name), count: o.count,
                  }))}
                  dataKey="count" nameKey="name" color="#ef4444"
                />
              </div>
            </div>
          )}
        </Section>
      )}

      {/* EXPERIENCE EXODUS */}
      {ee && (
        <Section title="🧠 Experience Exodus" subtitle="Are the most experienced employees walking out the door?">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Avg Tenure (2025 Leavers)" value={`${ee.year2025?.avgLOS || 0} yrs`} sub="Length of service" />
            <StatCard label="Avg Tenure (2024 Leavers)" value={`${ee.year2024?.avgLOS || 0} yrs`} sub="Length of service" />
            <StatCard label="20+ Year Vets Leaving (2025)" value={`${ee.year2025?.pct20plus || 0}%`} sub={`${formatNumber(ee.year2025?.senior20plus || 0)} people`} />
            <StatCard label="20+ Year Vets Leaving (2024)" value={`${ee.year2024?.pct20plus || 0}%`} sub={`${formatNumber(ee.year2024?.senior20plus || 0)} people`} />
          </div>
          {ee.byAgency2025 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Agencies Losing Most Experienced Staff (2025, by avg tenure of leavers)</h3>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                {ee.byAgency2025.slice(0, 12).map((a: any) => (
                  <Link key={a.code} href={`/agencies/${a.code}`} className="flex justify-between px-5 py-3 hover:bg-amber-50">
                    <span className="text-gray-800 text-sm truncate mr-3">{cleanAgencyName(a.name)}</span>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-gray-400">{formatNumber(a.separated)} left</span>
                      <span className="text-amber-700 font-semibold text-sm">{a.avgLOS} yr avg</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Section>
      )}

      {/* STEM */}
      {stemAnalysis && (
        <Section title="🔬 STEM Brain Drain" subtitle="Is the government losing its scientists, engineers, and tech workers?">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="STEM Employees" value={formatNumber(stemTotal?.employees || 0)} sub={totalEmp > 0 ? `${((stemTotal?.employees || 0) / totalEmp * 100).toFixed(1)}% of workforce` : ""} />
            <StatCard label="Non-STEM" value={formatNumber(nonStemTotal?.employees || 0)} sub="" />
            <StatCard label="STEM Avg Salary" value={formatSalary(stemTotal?.avgSalary || 0)} sub="" />
            <StatCard label="Non-STEM Avg Salary" value={formatSalary(nonStemTotal?.avgSalary || 0)} sub="" />
          </div>
          {stemAnalysis.byAgency && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Agencies with Most STEM Workers</h3>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <SimpleBarChart
                  data={stemAnalysis.byAgency.slice(0, 12).map((a: any) => ({
                    name: fixAgencyName(a.name || a.agency || ""),
                    count: a.stemCount || a.employees || 0,
                  }))}
                  dataKey="count" nameKey="name" color="#10b981"
                />
              </div>
            </div>
          )}
        </Section>
      )}

      {/* MANAGER RATIOS */}
      {managerRatios && (
        <Section title="👔 The Manager Question" subtitle="DOGE says there's too much bureaucracy. Here are the actual numbers.">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard label="Manager:Staff Ratio" value={`1:${mgrRatio}`} sub="Overall" />
            <StatCard label="Managers & Supervisors" value={formatNumber(totalManagers)} sub={totalEmp > 0 ? `${(totalManagers / totalEmp * 100).toFixed(1)}% of workforce` : ""} />
            <StatCard label="Individual Contributors" value={formatNumber(totalStaff)} sub="" />
          </div>
          {managerRatios.byAgency && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Manager Ratio by Agency</h3>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                {managerRatios.byAgency.slice(0, 15).map((a: any) => (
                  <Link key={a.code || a.agency_code} href={`/agencies/${a.code || a.agency_code}`} className="flex justify-between px-5 py-3 hover:bg-gray-50">
                    <span className="text-gray-800 text-sm truncate mr-3">{cleanAgencyName(a.name || a.agency)}</span>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-gray-400">{formatNumber(a.managers || 0)} mgrs / {formatNumber(a.staff || 0)} staff</span>
                      <span className="text-indigo-700 font-semibold text-sm">1:{a.ratio || 0}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Section>
      )}

      {/* OVERSEAS */}
      {overseas && (
        <Section title="🌍 Federal Employees Abroad" subtitle={`${formatNumber(overseasTotal?.employees || 0)} civilian federal employees work outside the United States.`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Overseas" value={formatNumber(overseasTotal?.employees || 0)} sub={totalEmp > 0 ? `${((overseasTotal?.employees || 0) / totalEmp * 100).toFixed(1)}%` : ""} />
            <StatCard label="Countries" value={String(overseas.byCountry?.length || 0)} sub="" />
            <StatCard label="Overseas Avg Salary" value={formatSalary(overseasTotal?.avgSalary || 0)} sub="" />
            <StatCard label="Domestic Avg Salary" value={formatSalary(domesticTotal?.avgSalary || 0)} sub="" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {overseas.byCountry && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Top Countries</h3>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {overseas.byCountry.slice(0, 12).map((c: any) => (
                    <div key={c.country} className="flex justify-between px-5 py-3">
                      <span className="text-gray-800 text-sm">{toTitleCase(c.country)}</span>
                      <span className="text-gray-700 font-semibold text-sm">{formatNumber(c.count || c.employees)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {overseas.byAgency && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Top Agencies Abroad</h3>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {overseas.byAgency.slice(0, 12).map((a: any) => (
                    <Link key={a.code || a.agency_code} href={`/agencies/${a.code || a.agency_code}`} className="flex justify-between px-5 py-3 hover:bg-gray-50">
                      <span className="text-gray-800 text-sm truncate mr-3">{cleanAgencyName(a.name || a.agency)}</span>
                      <span className="text-gray-700 font-semibold text-sm">{formatNumber(a.overseas || a.count || a.employees)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* GRADE DISTRIBUTION */}
      {gradeDistribution?.byGrade && (() => {
        function formatGrade(g: string): string {
          if (!g) return "Other/Ungraded";
          if (g === "00") return "Other/Ungraded";
          if (g.startsWith("GS-")) return g;
          const num = parseInt(g);
          if (!isNaN(num) && num >= 1 && num <= 15) return `GS-${num}`;
          return g;
        }
        function gradeSort(a: any, b: any): number {
          const aNum = parseInt(a.grade);
          const bNum = parseInt(b.grade);
          if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
          if (!isNaN(aNum)) return -1;
          if (!isNaN(bNum)) return 1;
          return (a.grade || "").localeCompare(b.grade || "");
        }
        const sorted = [...gradeDistribution.byGrade].sort(gradeSort);
        const total = sorted.reduce((s: number, x: any) => s + (x.count || 0), 0);
        return (
        <Section title="📊 Pay Grade Distribution" subtitle="GS levels, SES, and other pay scales across the federal government.">
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
            <SimpleBarChart
              data={sorted.slice(0, 18).map((g: any) => ({
                name: formatGrade(g.grade), count: g.count || 0,
              }))}
              dataKey="count" nameKey="name" color="#6366f1"
            />
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 px-5 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <span>Grade</span><span className="text-right">Employees</span><span className="text-right">Avg Salary</span><span className="text-right">% of Total</span>
            </div>
            <div className="divide-y divide-gray-100">
              {sorted.slice(0, 18).map((g: any) => (
                  <div key={g.grade} className="grid grid-cols-4 px-5 py-2.5 text-sm">
                    <span className="font-medium text-gray-900">{formatGrade(g.grade)}</span>
                    <span className="text-right text-gray-700">{formatNumber(g.count)}</span>
                    <span className="text-right text-gray-700">{formatSalary(g.avgSalary)}</span>
                    <span className="text-right text-gray-500">{total > 0 ? ((g.count || 0) / total * 100).toFixed(1) : "0"}%</span>
                  </div>
                ))}
            </div>
          </div>
        </Section>
        );
      })()}

      {/* Data note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-sm text-gray-500 mt-8">
        <p className="font-semibold text-gray-700 mb-2">About this analysis</p>
        <p>
          All data from OPM FedScope. Employment: December 2025. Separations: FY2020-2025.
          Retirement eligibility estimated from age + service brackets (FERS: 62+/5yr, 60+/20yr, MRA+30yr).
          Manager ratios use OPM supervisory status. STEM follows OPM coding.
        </p>
        <p className="mt-2"><Link href="/about" className="text-accent hover:underline">Full methodology →</Link></p>
      </div>
    </div>
  );
}
