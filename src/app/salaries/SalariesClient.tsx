"use client";
import { SimpleBarChart, SimplePieChart } from "@/components/Charts";
import { formatNumber, formatSalary, cleanAgencyName } from "@/lib/format";
import Link from "next/link";

export function SalariesClient({ data }: { data: any }) {
  const distOrder = ["Under $30K", "$30K-$50K", "$50K-$75K", "$75K-$100K", "$100K-$125K", "$125K-$150K", "$150K-$200K", "$200K+"];
  const sortedDist = distOrder.map((b) => data.distribution.find((d: any) => d.bracket === b)).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Federal Salary Analysis</h1>
      <p className="text-gray-600 mb-8">Pay distribution, highest-paid agencies, occupations, and grade levels.</p>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Salary Distribution</h2>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <SimpleBarChart data={sortedDist} dataKey="employees" nameKey="bracket" color="#6366f1" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Highest Paid Agencies</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {data.topPaidAgencies.slice(0, 15).map((a: any) => (
              <Link key={a.code} href={`/agencies/${a.code}`} className="flex justify-between px-6 py-3 hover:bg-accent-50">
                <div>
                  <span className="text-gray-800 font-medium">{cleanAgencyName(a.name)}</span>
                  <span className="ml-2 text-xs text-gray-400">{formatNumber(a.employees)} emp</span>
                </div>
                <span className="font-semibold text-accent">{formatSalary(a.avgSalary)}</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Highest Paid Occupations</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {data.topPaidOccupations.slice(0, 15).map((o: any) => (
              <div key={o.code} className="flex justify-between px-6 py-3">
                <div>
                  <span className="text-gray-800 font-medium">{o.name}</span>
                  <span className="ml-2 text-xs text-gray-400">{formatNumber(o.employees)} emp</span>
                </div>
                <span className="font-semibold text-accent">{formatSalary(o.avgSalary)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Average Salary by GS Grade</h2>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <SimpleBarChart data={data.byGrade.filter((g: any) => g.grade && g.employees > 100)} dataKey="avgSalary" nameKey="grade" color="#3730a3" />
        </div>
      </section>
    </div>
  );
}
