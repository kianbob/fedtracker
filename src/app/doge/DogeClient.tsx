"use client";
import { TrendAreaChart, SimpleBarChart } from "@/components/Charts";
import { StatCard } from "@/components/StatCard";
import { formatNumber, formatMonth, cleanAgencyName } from "@/lib/format";
import Link from "next/link";

interface DogeData {
  netChange2025: number;
  totalSeparations2025: number;
  totalAccessions2025: number;
  peakSeparationsMonth: { month: string; count: number };
  avgAccessionsPre: number;
  avgAccessionsPost: number;
  monthly2025: { month: string; accessions: number; separations: number }[];
  topAgencyLosses: { code: string; name: string; net: number; separations: number; accessions: number }[];
  comparison: {
    avg2024: { accessions: number; separations: number };
    avg2025: { accessions: number; separations: number };
  };
}

export function DogeClient({ data }: { data: DogeData | null }) {
  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">DOGE Impact: 2025 Workforce Reduction</h1>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-500 text-lg">Data loading... The DOGE impact dataset is being generated.</p>
          <p className="text-gray-400 text-sm mt-2">Check back soon for the full analysis.</p>
        </div>
      </div>
    );
  }

  const monthly = data.monthly2025.map((m) => ({
    ...m,
    label: formatMonth(m.month),
  }));

  const agencyLosses = data.topAgencyLosses.slice(0, 15).map((a) => ({
    ...a,
    name: cleanAgencyName(a.name).slice(0, 35),
    absNet: Math.abs(a.net),
  }));

  const hiringDropPct = data.avgAccessionsPre > 0
    ? Math.round((1 - data.avgAccessionsPost / data.avgAccessionsPre) * 100)
    : 0;

  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-200 text-sm font-medium uppercase tracking-wide mb-3">2025 Federal Workforce Impact</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            DOGE Impact Report
          </h1>
          <p className="text-lg text-red-100 max-w-2xl mb-8">
            A data-driven look at the unprecedented federal workforce reduction in 2025.
            Every number comes from official OPM data.
          </p>
          <div className="inline-block bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-8 py-6">
            <p className="text-red-200 text-sm uppercase tracking-wide">Net Workforce Change in 2025</p>
            <p className="text-5xl sm:text-6xl font-serif font-bold mt-2">
              {data.netChange2025 > 0 ? "+" : ""}{formatNumber(data.netChange2025)}
            </p>
            <p className="text-red-200 text-sm mt-1">federal employees</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Key stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatCard
            label="Total Separations"
            value={formatNumber(data.totalSeparations2025)}
            sub="Left federal service in 2025"
          />
          <StatCard
            label="Total Accessions"
            value={formatNumber(data.totalAccessions2025)}
            sub="Hired in 2025"
          />
          <StatCard
            label="Peak Month"
            value={formatMonth(data.peakSeparationsMonth.month)}
            sub={`${formatNumber(data.peakSeparationsMonth.count)} separations`}
          />
          <StatCard
            label="Hiring Collapse"
            value={`-${hiringDropPct}%`}
            sub="Accessions drop after freeze"
          />
        </div>

        {/* Monthly accessions vs separations chart */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Monthly Accessions vs. Separations (2025)</h2>
          <p className="text-sm text-gray-500 mb-4">
            The gap between the red and green lines represents the monthly workforce drain.
          </p>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <TrendAreaChart
              data={monthly}
              lines={[
                { key: "accessions", color: "#10b981", name: "Accessions (Hiring)" },
                { key: "separations", color: "#ef4444", name: "Separations (Leaving)" },
              ]}
            />
          </div>
        </section>

        {/* Hiring freeze callout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-serif text-xl font-bold text-blue-900 mb-3">The Hiring Freeze</h3>
            <p className="text-blue-800 text-sm leading-relaxed mb-4">
              Federal hiring collapsed after the executive order. Monthly accessions plummeted
              from ~{formatNumber(data.avgAccessionsPre)}/month to ~{formatNumber(data.avgAccessionsPost)}/month —
              a {hiringDropPct}% drop.
            </p>
            <div className="flex gap-4">
              <div className="bg-white rounded-lg p-4 flex-1 text-center">
                <p className="text-xs text-blue-600 uppercase">Before Freeze</p>
                <p className="text-2xl font-serif font-bold text-blue-900">~{formatNumber(data.avgAccessionsPre)}</p>
                <p className="text-xs text-gray-500">per month</p>
              </div>
              <div className="bg-white rounded-lg p-4 flex-1 text-center">
                <p className="text-xs text-red-600 uppercase">After Freeze</p>
                <p className="text-2xl font-serif font-bold text-red-900">~{formatNumber(data.avgAccessionsPost)}</p>
                <p className="text-xs text-gray-500">per month</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="font-serif text-xl font-bold text-red-900 mb-3">The September Spike</h3>
            <p className="text-red-800 text-sm leading-relaxed mb-4">
              September 2025 saw {formatNumber(data.peakSeparationsMonth.count)} separations in a single month —
              the largest single-month exodus in modern federal history. This includes end-of-fiscal-year
              retirements amplified by workforce reduction policies.
            </p>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-red-600 uppercase">September 2025 Separations</p>
              <p className="text-3xl font-serif font-bold text-red-900">{formatNumber(data.peakSeparationsMonth.count)}</p>
            </div>
          </div>
        </div>

        {/* Top agencies by net loss */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Hardest-Hit Agencies</h2>
          <p className="text-sm text-gray-500 mb-4">Agencies with the largest net workforce losses in 2025.</p>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {agencyLosses.map((a) => (
              <Link
                key={a.code}
                href={`/agencies/${a.code}`}
                className="flex items-center justify-between px-6 py-3 hover:bg-red-50 transition-colors"
              >
                <span className="text-gray-800 truncate mr-4">{a.name}</span>
                <div className="flex items-center gap-4 text-sm whitespace-nowrap">
                  <span className="text-gray-400">
                    {formatNumber(a.separations)} left · {formatNumber(a.accessions)} hired
                  </span>
                  <span className="text-red-600 font-semibold">-{formatNumber(a.absNet)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 2024 vs 2025 comparison */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Before & After: 2024 vs. 2025</h2>
          <p className="text-sm text-gray-500 mb-4">Average monthly figures comparing the two years.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wide mb-4">2024 Average (Monthly)</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Accessions</span>
                  <span className="font-semibold text-green-700">{formatNumber(data.comparison.avg2024.accessions)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Separations</span>
                  <span className="font-semibold text-red-700">{formatNumber(data.comparison.avg2024.separations)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between font-bold">
                  <span className="text-gray-900">Net</span>
                  <span className={data.comparison.avg2024.accessions - data.comparison.avg2024.separations > 0 ? "text-green-700" : "text-red-700"}>
                    {data.comparison.avg2024.accessions - data.comparison.avg2024.separations > 0 ? "+" : ""}
                    {formatNumber(data.comparison.avg2024.accessions - data.comparison.avg2024.separations)}/mo
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-semibold text-red-500 text-sm uppercase tracking-wide mb-4">2025 Average (Monthly)</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Accessions</span>
                  <span className="font-semibold text-green-700">{formatNumber(data.comparison.avg2025.accessions)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Separations</span>
                  <span className="font-semibold text-red-700">{formatNumber(data.comparison.avg2025.separations)}</span>
                </div>
                <hr className="border-red-200" />
                <div className="flex justify-between font-bold">
                  <span className="text-gray-900">Net</span>
                  <span className="text-red-700">
                    {formatNumber(data.comparison.avg2025.accessions - data.comparison.avg2025.separations)}/mo
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
            All figures come from OPM FedScope separation and accession records. This covers civilian federal employees
            only — not military, contractors, or postal workers. &quot;Net change&quot; is calculated as accessions minus
            separations. Monthly figures reflect the effective date of each personnel action.
          </p>
          <p className="mt-2">
            <Link href="/about" className="text-accent hover:underline">Read our full methodology →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
