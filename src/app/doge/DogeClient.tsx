"use client";
import { TrendAreaChart, SimpleBarChart } from "@/components/Charts";
import { StatCard } from "@/components/StatCard";
import { formatNumber, formatMonth, cleanAgencyName } from "@/lib/format";
import Link from "next/link";

interface MonthlyEntry {
  month: string;
  separations: number;
  accessions: number;
  net: number;
}

interface AgencyLoss {
  code: string;
  name: string;
  netChange: number;
  separations: number;
  accessions: number;
}

interface RifAgency {
  code: string;
  name: string;
  rifCount: number;
}

interface DogeData {
  comparisonPeriod: string;
  separations2025: number;
  separations2024: number;
  separationChange: number;
  separationChangePct: number;
  accessions2025: number;
  accessions2024: number;
  accessionChange: number;
  accessionChangePct: number;
  netChangeSinceJan2025: number;
  monthlyBreakdown2025: MonthlyEntry[];
  topAgenciesByNetLoss: AgencyLoss[];
  rifByAgency2025: RifAgency[];
  rifByYear: Record<string, number>;
  drpIdentifiable: boolean;
  generatedAt: string;
  separationCodes: Record<string, string>;
}

export function DogeClient({ data }: { data: DogeData | null }) {
  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">
          DOGE Impact Dashboard
        </h1>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-500 text-lg">
            Data loading... The DOGE impact dataset is being generated.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Check back soon for the full analysis.
          </p>
        </div>
      </div>
    );
  }

  const netChange = data.netChangeSinceJan2025;
  const totalRif2025 = data.rifByYear["2025"] ?? 0;

  // Monthly trend data for area chart
  const monthly = data.monthlyBreakdown2025.map((m) => ({
    ...m,
    label: formatMonth(m.month),
  }));

  // Top 10 agencies bar chart data
  const agencyBarData = data.topAgenciesByNetLoss.slice(0, 10).map((a) => ({
    name: cleanAgencyName(a.name).slice(0, 30),
    netLoss: Math.abs(a.netChange),
    code: a.code,
  }));

  // RIF by year comparison
  const rifYearData = Object.entries(data.rifByYear).map(([year, count]) => ({
    name: year,
    rifs: count,
  }));

  // Peak separations month
  const peakMonth = data.monthlyBreakdown2025.reduce((max, m) =>
    m.separations > max.separations ? m : max
  );

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-900 via-red-800 to-orange-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-200 text-sm font-medium uppercase tracking-wide mb-3">
            2025 Federal Workforce Impact
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            DOGE Impact Dashboard
          </h1>
          <p className="text-lg text-red-100 max-w-2xl mb-8">
            A data-driven look at the unprecedented federal workforce reduction
            in 2025. Every number comes from official OPM FedScope data.
          </p>
          <div className="inline-block bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-8 py-6">
            <p className="text-red-200 text-sm uppercase tracking-wide">
              Net Change Since January 2025
            </p>
            <p className="text-5xl sm:text-6xl font-serif font-bold mt-2">
              {netChange.toLocaleString()}
            </p>
            <p className="text-red-200 text-sm mt-1">federal employees</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatCard
            label="2025 Separations"
            value={formatNumber(data.separations2025)}
            sub={`+${data.separationChangePct}% vs 2024`}
          />
          <StatCard
            label="2025 Accessions"
            value={formatNumber(data.accessions2025)}
            sub={`${data.accessionChangePct}% vs 2024`}
          />
          <StatCard
            label="RIF Actions (2025)"
            value={formatNumber(totalRif2025)}
            sub={`vs ${data.rifByYear["2024"] ?? 0} in 2024`}
          />
          <StatCard
            label="Net Change"
            value={netChange.toLocaleString()}
            sub={data.comparisonPeriod}
          />
        </div>

        {/* Monthly Trend Area Chart */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
            Monthly Accessions vs. Separations (2025)
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            The gap between the red and green lines represents the monthly
            workforce drain. September 2025 saw{" "}
            {formatNumber(peakMonth.separations)} separations — the largest
            single-month exodus.
          </p>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <TrendAreaChart
              data={monthly}
              lines={[
                {
                  key: "accessions",
                  color: "#10b981",
                  name: "Accessions (Hiring)",
                },
                {
                  key: "separations",
                  color: "#ef4444",
                  name: "Separations (Leaving)",
                },
              ]}
            />
          </div>
        </section>

        {/* Top 10 Agencies Bar Chart */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
            Top 10 Agencies by Net Loss
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Agencies with the largest net workforce reductions in 2025.
          </p>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <SimpleBarChart
              data={agencyBarData}
              dataKey="netLoss"
              nameKey="name"
              color="#ef4444"
            />
          </div>
          <div className="mt-4 bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {data.topAgenciesByNetLoss.slice(0, 10).map((a) => (
              <Link
                key={a.code}
                href={`/agencies/${a.code}`}
                className="flex items-center justify-between px-6 py-3 hover:bg-red-50 transition-colors"
              >
                <span className="text-gray-800 truncate mr-4">
                  {cleanAgencyName(a.name)}
                </span>
                <div className="flex items-center gap-4 text-sm whitespace-nowrap">
                  <span className="text-gray-400">
                    {formatNumber(a.separations)} left ·{" "}
                    {formatNumber(a.accessions)} hired
                  </span>
                  <span className="text-red-600 font-semibold">
                    {a.netChange.toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* RIF Year Comparison */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
            Reduction in Force (RIF) by Year
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Formal RIF actions exploded from {data.rifByYear["2024"] ?? 0} in
            2024 to {formatNumber(totalRif2025)} in 2025 — a{" "}
            {Math.round(totalRif2025 / Math.max(data.rifByYear["2024"] ?? 1, 1))}
            x increase.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <SimpleBarChart
                data={rifYearData}
                dataKey="rifs"
                nameKey="name"
                color="#dc2626"
              />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-3">
                Top Agencies by RIF (2025)
              </h3>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                {data.rifByAgency2025.slice(0, 10).map((a) => (
                  <Link
                    key={a.code}
                    href={`/agencies/${a.code}`}
                    className="flex items-center justify-between px-5 py-2.5 hover:bg-red-50 transition-colors"
                  >
                    <span className="text-gray-800 text-sm truncate mr-3">
                      {cleanAgencyName(a.name)}
                    </span>
                    <span className="text-red-600 font-semibold text-sm whitespace-nowrap">
                      {formatNumber(a.rifCount)} RIFs
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What Happened Explainer */}
        <section className="mb-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <h2 className="font-serif text-2xl font-bold text-red-900 mb-4">
              What Happened in 2025?
            </h2>
            <div className="space-y-4 text-red-800 text-sm leading-relaxed">
              <p>
                <strong className="text-red-900">
                  The Department of Government Efficiency (DOGE)
                </strong>{" "}
                was established in January 2025 with a mandate to reduce the size
                of the federal government. Combined with executive orders on
                hiring freezes and workforce restructuring, it triggered the
                largest peacetime reduction in the federal civilian workforce.
              </p>
              <p>
                <strong className="text-red-900">Hiring Freeze:</strong> Federal
                hiring was effectively frozen starting in late January 2025.
                Monthly accessions dropped from{" "}
                {formatNumber(Math.round(data.accessions2024 / 12))}/month (2024
                average) to{" "}
                {formatNumber(
                  Math.round(
                    data.monthlyBreakdown2025
                      .slice(1)
                      .reduce((s, m) => s + m.accessions, 0) /
                      (data.monthlyBreakdown2025.length - 1)
                  )
                )}
                /month — a {Math.abs(data.accessionChangePct)}% collapse.
              </p>
              <p>
                <strong className="text-red-900">
                  Deferred Resignation Program (DRP):
                </strong>{" "}
                A voluntary &quot;fork in the road&quot; buyout offered to all federal
                employees in early 2025, contributing to elevated quit rates in
                subsequent months.
              </p>
              <p>
                <strong className="text-red-900">
                  Reductions in Force (RIF):
                </strong>{" "}
                {formatNumber(totalRif2025)} formal RIF actions were carried out
                in 2025, compared to just {data.rifByYear["2024"] ?? 0} in 2024
                and {data.rifByYear["2023"] ?? 0} in 2023. HHS and USAID bore
                the brunt with{" "}
                {formatNumber(data.rifByAgency2025[0]?.rifCount ?? 0)} and{" "}
                {formatNumber(data.rifByAgency2025[1]?.rifCount ?? 0)} RIFs
                respectively.
              </p>
              <p>
                <strong className="text-red-900">The September Spike:</strong>{" "}
                September 2025 saw {formatNumber(peakMonth.separations)}{" "}
                separations — the largest single-month exodus in modern federal
                history. This included end-of-fiscal-year retirements amplified
                by workforce reduction policies and early retirement incentives.
              </p>
            </div>
          </div>
        </section>

        {/* 2024 vs 2025 Comparison */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
            Year-over-Year: 2024 vs. 2025
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Comparing {data.comparisonPeriod} — average monthly figures.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wide mb-4">
                2024 Average (Monthly)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Accessions</span>
                  <span className="font-semibold text-green-700">
                    {formatNumber(Math.round(data.accessions2024 / 11))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Separations</span>
                  <span className="font-semibold text-red-700">
                    {formatNumber(Math.round(data.separations2024 / 11))}
                  </span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between font-bold">
                  <span className="text-gray-900">Net</span>
                  <span className="text-green-700">
                    +
                    {formatNumber(
                      Math.round(
                        (data.accessions2024 - data.separations2024) / 11
                      )
                    )}
                    /mo
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-semibold text-red-500 text-sm uppercase tracking-wide mb-4">
                2025 Average (Monthly)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Accessions</span>
                  <span className="font-semibold text-green-700">
                    {formatNumber(
                      Math.round(
                        data.accessions2025 /
                          data.monthlyBreakdown2025.length
                      )
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Separations</span>
                  <span className="font-semibold text-red-700">
                    {formatNumber(
                      Math.round(
                        data.separations2025 /
                          data.monthlyBreakdown2025.length
                      )
                    )}
                  </span>
                </div>
                <hr className="border-red-200" />
                <div className="flex justify-between font-bold">
                  <span className="text-gray-900">Net</span>
                  <span className="text-red-700">
                    {formatNumber(
                      Math.round(
                        (data.accessions2025 - data.separations2025) /
                          data.monthlyBreakdown2025.length
                      )
                    )}
                    /mo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data source note */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-sm text-gray-500">
          <p className="font-semibold text-gray-700 mb-2">About this data</p>
          <p>
            All figures come from OPM FedScope separation and accession records
            ({data.comparisonPeriod}). This covers civilian federal employees
            only — not military, contractors, or postal workers. &quot;Net
            change&quot; is calculated as accessions minus separations. Monthly
            figures reflect the effective date of each personnel action.
          </p>
          <p className="mt-2">
            <Link href="/about" className="text-accent hover:underline">
              Read our full methodology →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
