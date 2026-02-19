"use client";
import { SimpleBarChart, SimplePieChart } from "@/components/Charts";
import { toTitleCase } from "@/lib/format";

export function OccupationCharts({ data }: { data: any }) {
  return (
    <div className="space-y-12">
      {data.topAgencies?.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Top Agencies</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <SimpleBarChart
              data={data.topAgencies.slice(0, 10).map((a: any) => ({ name: (a.name || a.code).slice(0, 30), count: a.count }))}
              dataKey="count" nameKey="name" color="#3730a3"
            />
          </div>
        </div>
      )}
      {data.ageDistribution?.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Age Distribution</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <SimpleBarChart
              data={data.ageDistribution.map((a: any) => ({ name: toTitleCase(a.label), count: a.count }))}
              dataKey="count" nameKey="name" color="#6366f1"
            />
          </div>
        </div>
      )}
      {data.educationDistribution?.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Education Breakdown</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <SimplePieChart
              data={data.educationDistribution.slice(0, 8).map((e: any) => ({ name: toTitleCase(e.label), count: e.count }))}
              dataKey="count" nameKey="name"
            />
          </div>
        </div>
      )}
    </div>
  );
}
