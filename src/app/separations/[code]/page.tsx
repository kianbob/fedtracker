import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { formatNumber } from "@/lib/format";
import { StatCard } from "@/components/StatCard";
import { SeparationCharts } from "./SeparationCharts";
import fs from "fs";
import path from "path";

const SEP_CODES = ["SA","SB","SC","SD","SE","SF","SG","SH","SJ","SK","SL"];

function getSepData(code: string) {
  const filePath = path.join(process.cwd(), "public", "data", "separation-types", `${code}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const data = getSepData(params.code.toUpperCase());
  if (!data) return { title: "Separation Type Not Found — FedTracker" };
  return {
    title: `${data.name} (${data.code}) — ${formatNumber(data.totalCount)} Separations — FedTracker`,
    description: `${data.description}. ${formatNumber(data.totalCount)} federal employees separated under this category from FY2020-2025.`,
  };
}

export function generateStaticParams() {
  return SEP_CODES.map(code => ({ code }));
}

export default async function SeparationDetailPage({ params }: { params: { code: string } }) {
  const data = getSepData(params.code.toUpperCase());
  if (!data) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/layoffs" className="hover:text-accent">Layoffs & Separations</Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-700">{data.name}</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{data.name}</h1>
      <p className="text-gray-500 mb-8">{data.description}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <StatCard label="Total Separations" value={formatNumber(data.totalCount)} sub="FY2020-2025" />
        {data.avgSalaryAtSeparation > 0 && <StatCard label="Avg Salary at Separation" value={`$${data.avgSalaryAtSeparation.toLocaleString()}`} />}
        {data.avgLOS > 0 && <StatCard label="Avg Length of Service" value={`${data.avgLOS} years`} />}
        {data.topAgencies?.[0] && <StatCard label="Top Agency" value={(data.topAgencies[0].name || data.topAgencies[0].code).slice(0, 25)} sub={`${formatNumber(data.topAgencies[0].count)} separations`} />}
      </div>

      <SeparationCharts data={data} />

      {/* Top Occupations */}
      {data.topOccupations?.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Top Occupations</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {data.topOccupations.slice(0, 15).map((o: any, i: number) => (
              <div key={i} className="flex justify-between px-6 py-3">
                <span className="text-gray-800 truncate mr-4">{o.name}</span>
                <span className="text-gray-700 font-semibold text-sm shrink-0">{formatNumber(o.count)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other separation types */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Other Separation Types</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {SEP_CODES.filter(c => c !== data.code).map(code => {
            const other = getSepData(code);
            if (!other) return null;
            return (
              <Link key={code} href={`/separations/${code}`} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <p className="font-semibold text-gray-900 text-sm">{other.name}</p>
                <p className="text-xs text-gray-500">{formatNumber(other.totalCount)}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
