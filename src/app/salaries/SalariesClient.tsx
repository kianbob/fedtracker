"use client";
import { SimpleBarChart, SimplePieChart } from "@/components/Charts";
import { formatNumber, formatSalary, cleanAgencyName } from "@/lib/format";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

export function SalariesClient({ data }: { data: any }) {
  const distOrder = ["Under $30K", "$30K-$50K", "$50K-$75K", "$75K-$100K", "$100K-$125K", "$125K-$150K", "$150K-$200K", "$200K+"];
  const sortedDist = distOrder.map((b) => data.distribution.find((d: any) => d.bracket === b)).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Workforce', href: '/workforce' }, { label: 'Salaries' }]} />
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
              <Link key={o.code} href={`/occupations/${o.code}`} className="flex justify-between px-6 py-3 hover:bg-accent-50">
                <div>
                  <span className="text-gray-800 font-medium">{o.name}</span>
                  <span className="ml-2 text-xs text-gray-400">{formatNumber(o.employees)} emp</span>
                </div>
                <span className="font-semibold text-accent">{formatSalary(o.avgSalary)}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Average Salary by GS Grade</h2>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <SimpleBarChart data={data.byGrade
            .filter((g: any) => /^(0[1-9]|1[0-5])$/.test(g.grade))
            .sort((a: any, b: any) => parseInt(a.grade) - parseInt(b.grade))
            .map((g: any) => ({ ...g, grade: `GS-${parseInt(g.grade)}` }))} dataKey="avgSalary" nameKey="grade" color="#3730a3" />
        </div>
      </section>

      {/* Related Analysis */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Related Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/education", title: "Education & Salary", desc: "How education level affects federal pay — from high school to doctorate." },
            { href: "/occupations", title: "Federal Occupations", desc: "Browse all federal occupations with employee counts and average salaries." },
            { href: "/agencies", title: "All Agencies", desc: "Compare employee counts and salaries across all 128 federal agencies." },
            { href: "/spending", title: "Agency Spending", desc: "Budget per employee, contract outsourcing, and spending patterns by agency." },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group">
              <h3 className="font-serif font-bold text-gray-900 group-hover:text-indigo-700 transition-colors mb-1">{link.title}</h3>
              <p className="text-sm text-gray-500">{link.desc}</p>
              <span className="text-indigo-600 text-sm font-medium mt-2 inline-block">Explore →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
