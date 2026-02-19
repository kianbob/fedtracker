"use client";
import { SimpleBarChart, SimplePieChart } from "@/components/Charts";
import { StatCard } from "@/components/StatCard";
import { formatNumber } from "@/lib/format";

interface Entry {
  label: string;
  count: number;
}

interface DemographicsData {
  age_bracket: Entry[];
  education_level: Entry[];
  work_schedule: Entry[];
  supervisory_status: Entry[];
  stem_occupation_type: Entry[];
  appointment_type: Entry[];
  duty_station_state: Entry[];
  occupational_group: Entry[];
}

function titleCase(s: string): string {
  if (s === "REDACTED" || s === "INVALID" || s === "NO DATA REPORTED") return s;
  return s
    .replace(/\b\w+/g, (w) => {
      if (["OF", "THE", "AND", "FOR", "IN", "ON", "AT", "TO", "BY", "OR", "A"].includes(w))
        return w.toLowerCase();
      return w.charAt(0) + w.slice(1).toLowerCase();
    })
    .replace(/^./, (c) => c.toUpperCase());
}

export function DemographicsClient({ data }: { data: DemographicsData | null }) {
  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">
          Federal Workforce Demographics
        </h1>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-500 text-lg">
            Data loading... The demographics dataset is being generated.
          </p>
        </div>
      </div>
    );
  }

  const totalEmployees = data.age_bracket.reduce((s, e) => s + e.count, 0);
  const fullTime =
    data.work_schedule.find((w) => w.label === "FULL-TIME")?.count ?? 0;
  const fullTimePct =
    totalEmployees > 0 ? ((fullTime / totalEmployees) * 100).toFixed(1) : "0";

  const stemCount = data.stem_occupation_type
    .filter(
      (s) =>
        !s.label.includes("ALL OTHER") && !s.label.includes("UNSPECIFIED")
    )
    .reduce((sum, s) => sum + s.count, 0);
  const stemPct =
    totalEmployees > 0 ? ((stemCount / totalEmployees) * 100).toFixed(1) : "0";

  const supervisors = data.supervisory_status
    .filter(
      (s) =>
        s.label.includes("SUPERVISOR") || s.label.includes("MANAGEMENT") || s.label.includes("LEADER")
    )
    .reduce((sum, s) => sum + s.count, 0);

  // Top education levels (simplified)
  const topEducation = data.education_level.slice(0, 8).map((e) => ({
    label: titleCase(e.label).slice(0, 40),
    count: e.count,
  }));

  // Age data for chart
  const ageSorted = [...data.age_bracket].sort((a, b) => {
    const order = [
      "LESS THAN 20", "20-24", "25-29", "30-34", "35-39",
      "40-44", "45-49", "50-54", "55-59", "60-64", "65 OR MORE",
    ];
    return order.indexOf(a.label) - order.indexOf(b.label);
  });
  const ageChart = ageSorted.map((a) => ({ label: a.label, count: a.count }));

  // STEM breakdown (exclude "ALL OTHER")
  const stemChart = data.stem_occupation_type
    .filter((s) => !s.label.includes("ALL OTHER") && !s.label.includes("UNSPECIFIED"))
    .map((s) => ({ label: titleCase(s.label).replace(" Occupations", ""), count: s.count }));

  // Top occupational groups
  const topOccupations = data.occupational_group.slice(0, 12).map((o) => ({
    label: titleCase(o.label).replace(" Group", "").replace(" Family", "").slice(0, 40),
    count: o.count,
  }));

  // Top states (exclude REDACTED and NO DATA)
  const topStates = data.duty_station_state
    .filter((s) => s.label !== "REDACTED" && s.label !== "NO DATA REPORTED")
    .slice(0, 15)
    .map((s) => ({ label: titleCase(s.label), count: s.count }));

  // Work schedule for pie chart
  const workSchedule = data.work_schedule
    .filter((w) => w.count > 100)
    .map((w) => ({ label: titleCase(w.label), count: w.count }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">
        Federal Workforce Demographics
      </h1>
      <p className="text-gray-600 mb-8 max-w-3xl">
        Who makes up the {formatNumber(totalEmployees)}-strong federal
        workforce? Age, education, occupations, work schedules, and geographic
        distribution — all from OPM FedScope.
      </p>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <StatCard
          label="Total Employees"
          value={formatNumber(totalEmployees)}
          sub="December 2025"
        />
        <StatCard
          label="Full-Time"
          value={`${fullTimePct}%`}
          sub={`${formatNumber(fullTime)} employees`}
        />
        <StatCard
          label="STEM Workforce"
          value={`${stemPct}%`}
          sub={`${formatNumber(stemCount)} employees`}
        />
        <StatCard
          label="Supervisors & Managers"
          value={formatNumber(supervisors)}
          sub={`${((supervisors / totalEmployees) * 100).toFixed(1)}% of workforce`}
        />
      </div>

      {/* Age distribution */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
          Age Distribution
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Federal employee counts by age bracket. The median federal worker is
          in their 40s.
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <SimpleBarChart
            data={ageChart}
            dataKey="count"
            nameKey="label"
            color="#3730a3"
          />
        </div>
      </section>

      {/* Education + STEM side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            Education Level
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {topEducation.map((e) => (
              <div key={e.label} className="flex justify-between px-6 py-3">
                <span className="text-gray-800 text-sm">{e.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {totalEmployees > 0
                      ? ((e.count / totalEmployees) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                  <span className="font-semibold text-gray-700 w-20 text-right">
                    {formatNumber(e.count)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            STEM Occupations
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <SimplePieChart
              data={stemChart}
              dataKey="count"
              nameKey="label"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            {formatNumber(stemCount)} STEM employees ({stemPct}% of workforce)
          </p>
        </section>
      </div>

      {/* Work Schedule */}
      <section className="mb-12">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
          <h2 className="font-serif text-2xl font-bold text-indigo-900 mb-2">
            Work Schedule
          </h2>
          <p className="text-sm text-indigo-700 mb-4">
            The vast majority of federal employees work full-time, but the
            government also employs tens of thousands of part-time, seasonal, and
            intermittent workers.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {workSchedule.map((w) => (
              <div key={w.label} className="bg-white rounded-lg p-3 text-center">
                <p className="text-xs text-indigo-600 uppercase truncate">
                  {w.label}
                </p>
                <p className="text-lg font-serif font-bold text-gray-900">
                  {formatNumber(w.count)}
                </p>
                <p className="text-xs text-gray-500">
                  {totalEmployees > 0
                    ? ((w.count / totalEmployees) * 100).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Occupational Groups */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
          Largest Occupational Groups
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          The top 12 occupational categories by employee count.
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <SimpleBarChart
            data={topOccupations}
            dataKey="count"
            nameKey="label"
            color="#6366f1"
          />
        </div>
      </section>

      {/* Top States */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
          Top Duty Stations by State
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Where federal employees are stationed. Note: {formatNumber(981186)}{" "}
          records are redacted for privacy.
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <SimpleBarChart
            data={topStates}
            dataKey="count"
            nameKey="label"
            color="#10b981"
          />
        </div>
      </section>

      {/* Data note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-sm text-gray-500">
        <p className="font-semibold text-gray-700 mb-2">About this data</p>
        <p>
          Demographics data comes from OPM FedScope employment records (December
          2025 snapshot). Education level reflects the highest degree completed.
          Some demographic fields are redacted for privacy. Occupational groups
          follow OPM&apos;s standard classification system.
        </p>
      </div>
    </div>
  );
}
