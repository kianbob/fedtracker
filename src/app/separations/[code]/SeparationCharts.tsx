"use client";
import { TrendAreaChart, SimpleBarChart } from "@/components/Charts";
import { formatMonth, toTitleCase } from "@/lib/format";

export function SeparationCharts({ data }: { data: any }) {
  const trendData = (data.monthlyTrend || []).map((m: any) => ({
    label: formatMonth(m.month),
    count: m.count,
  }));

  return (
    <div className="space-y-12">
      {trendData.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Monthly Trend</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <TrendAreaChart
              data={trendData}
              lines={[{ key: "count", color: "#ef4444", name: data.name || data.code }]}
            />
          </div>
        </div>
      )}
      {data.topAgencies?.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Top Agencies</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <SimpleBarChart
              data={data.topAgencies.slice(0, 12).map((a: any) => ({ name: toTitleCase(a.name || a.code).slice(0, 35), count: a.count }))}
              dataKey="count" nameKey="name" color="#3730a3"
            />
          </div>
        </div>
      )}
      {data.byAge?.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">By Age Group</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <SimpleBarChart
              data={data.byAge.map((a: any) => ({ name: toTitleCase(a.label), count: a.count }))}
              dataKey="count" nameKey="name" color="#6366f1"
            />
          </div>
        </div>
      )}
    </div>
  );
}
