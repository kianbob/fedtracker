"use client";
import { SimpleBarChart, SimplePieChart } from "@/components/Charts";
import { StatCard } from "@/components/StatCard";
import { formatNumber } from "@/lib/format";

interface DemographicsData {
  totalEmployees: number;
  ageDistribution: { bracket: string; employees: number }[];
  educationLevels: { level: string; employees: number }[];
  veteranStatus: { status: string; employees: number }[];
  telework: { type: string; employees: number }[];
  raceEthnicity: { group: string; employees: number }[];
}

export function DemographicsClient({ data }: { data: DemographicsData | null }) {
  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">Federal Workforce Demographics</h1>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-500 text-lg">Data loading... The demographics dataset is being generated.</p>
          <p className="text-gray-400 text-sm mt-2">Check back soon for the full breakdown.</p>
        </div>
      </div>
    );
  }

  const veteranCount = data.veteranStatus.find((v) => v.status.toLowerCase().includes("veteran") && !v.status.toLowerCase().includes("non"))?.employees ?? 0;
  const veteranPct = data.totalEmployees > 0 ? ((veteranCount / data.totalEmployees) * 100).toFixed(1) : "0";

  const teleworkCount = data.telework
    .filter((t) => t.type.toLowerCase().includes("remote") || t.type.toLowerCase().includes("telework"))
    .reduce((sum, t) => sum + t.employees, 0);
  const teleworkPct = data.totalEmployees > 0 ? ((teleworkCount / data.totalEmployees) * 100).toFixed(1) : "0";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Federal Workforce Demographics</h1>
      <p className="text-gray-600 mb-8 max-w-3xl">
        Who makes up the {formatNumber(data.totalEmployees)}-strong federal workforce? Age, education, veteran status,
        telework, and race/ethnicity — all from OPM FedScope.
      </p>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <StatCard label="Total Employees" value={formatNumber(data.totalEmployees)} sub="December 2025" />
        <StatCard label="Veterans" value={`${veteranPct}%`} sub={`${formatNumber(veteranCount)} employees`} />
        <StatCard label="Remote / Telework" value={`${teleworkPct}%`} sub={`${formatNumber(teleworkCount)} employees`} />
        <StatCard label="Education Levels" value={String(data.educationLevels.length)} sub="Distinct categories" />
      </div>

      {/* Age distribution */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Age Distribution</h2>
        <p className="text-sm text-gray-500 mb-4">Federal employee counts by age bracket.</p>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <SimpleBarChart data={data.ageDistribution} dataKey="employees" nameKey="bracket" color="#3730a3" />
        </div>
      </section>

      {/* Education + Veterans side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Education Level</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {data.educationLevels.map((e) => (
              <div key={e.level} className="flex justify-between px-6 py-3">
                <span className="text-gray-800">{e.level}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {data.totalEmployees > 0 ? ((e.employees / data.totalEmployees) * 100).toFixed(1) : 0}%
                  </span>
                  <span className="font-semibold text-gray-700 w-20 text-right">{formatNumber(e.employees)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Veteran Status</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <SimplePieChart data={data.veteranStatus} dataKey="employees" nameKey="status" />
          </div>
        </section>
      </div>

      {/* Telework — highlighted */}
      <section className="mb-12">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
          <h2 className="font-serif text-2xl font-bold text-indigo-900 mb-2">Remote & Telework</h2>
          <p className="text-sm text-indigo-700 mb-4">
            One of the most debated topics in federal workforce policy.
            Here&apos;s the breakdown of work arrangements.
          </p>
          <div className="bg-white rounded-xl border border-indigo-100 p-4">
            <SimpleBarChart data={data.telework} dataKey="employees" nameKey="type" color="#6366f1" />
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.telework.map((t) => (
              <div key={t.type} className="bg-white rounded-lg p-3 text-center">
                <p className="text-xs text-indigo-600 uppercase">{t.type}</p>
                <p className="text-lg font-serif font-bold text-gray-900">{formatNumber(t.employees)}</p>
                <p className="text-xs text-gray-500">
                  {data.totalEmployees > 0 ? ((t.employees / data.totalEmployees) * 100).toFixed(1) : 0}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Race/Ethnicity */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Race & Ethnicity</h2>
        <p className="text-sm text-gray-500 mb-4">Self-reported race and ethnicity of federal employees.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <SimplePieChart data={data.raceEthnicity} dataKey="employees" nameKey="group" />
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {data.raceEthnicity.map((r) => (
              <div key={r.group} className="flex justify-between px-6 py-3">
                <span className="text-gray-800">{r.group}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {data.totalEmployees > 0 ? ((r.employees / data.totalEmployees) * 100).toFixed(1) : 0}%
                  </span>
                  <span className="font-semibold text-gray-700 w-20 text-right">{formatNumber(r.employees)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-sm text-gray-500">
        <p className="font-semibold text-gray-700 mb-2">About this data</p>
        <p>
          Demographics data comes from OPM FedScope employment records (December 2025 snapshot).
          Race/ethnicity and veteran status are self-reported. Education level reflects the highest
          degree completed. Some records have redacted demographic fields for privacy.
        </p>
      </div>
    </div>
  );
}
