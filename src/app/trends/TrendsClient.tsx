"use client";
import { TrendAreaChart, SimpleBarChart } from "@/components/Charts";
import { formatMonth, formatNumber, fixAgencyName } from "@/lib/format";
import Link from "next/link";

export function TrendsClient({ data }: { data: any }) {
  const monthly = data.monthly.map((m: any) => ({
    ...m,
    label: formatMonth(m.month),
  }));

  const biggestLosers = data.netByAgency.slice(0, 15).map((a: any) => ({
    ...a,
    name: fixAgencyName(a.name),
    absNet: Math.abs(a.net),
  }));

  const biggestGainers = [...data.netByAgency].reverse().slice(0, 15).map((a: any) => ({
    ...a,
    name: fixAgencyName(a.name),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Workforce Trends</h1>
      <p className="text-gray-600 mb-8">Hiring vs. separations across the federal government, FY2020–2025.</p>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Monthly Accessions vs Separations</h2>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Biggest Net Losses</h2>
          <p className="text-sm text-gray-500 mb-4">Agencies that lost the most employees (separations - accessions)</p>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {biggestLosers.map((a: any) => (
              <Link key={a.code} href={`/agencies/${a.code}`} className="flex justify-between px-6 py-3 hover:bg-red-50">
                <span className="text-gray-800 mr-4 text-sm">{a.name}</span>
                <span className="text-red-600 font-semibold whitespace-nowrap shrink-0">-{formatNumber(a.absNet)}</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Biggest Net Gains</h2>
          <p className="text-sm text-gray-500 mb-4">Agencies that gained the most employees</p>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {biggestGainers.map((a: any) => (
              <Link key={a.code} href={`/agencies/${a.code}`} className="flex justify-between px-6 py-3 hover:bg-green-50">
                <span className="text-gray-800 mr-4 text-sm">{a.name}</span>
                <span className="text-green-600 font-semibold whitespace-nowrap shrink-0">+{formatNumber(a.net)}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Related Analysis */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Related Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/doge", title: "DOGE Impact Dashboard", desc: "Full breakdown of 2025 federal workforce restructuring by agency, month, and separation type." },
            { href: "/risk", title: "Agency Risk Dashboard", desc: "Which agencies face the highest restructuring risk based on workforce trends." },
            { href: "/layoffs", title: "Layoffs & Separations", desc: "Every federal separation from FY2020–2025: RIFs, quits, retirements, and terminations." },
            { href: "/workforce-analysis", title: "Workforce Deep Dive", desc: "Retirement cliff, experience drain, STEM brain drain, and pay grade analysis." },
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
