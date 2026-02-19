import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { formatNumber, formatSalary, cleanAgencyName } from "@/lib/format";
import states from "../../../../public/data/states.json";
import fs from "fs";
import path from "path";

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const data = await getStateData(params.code);
  if (!data) return { title: "State Not Found — FedTracker" };
  return {
    title: `Federal Employees in ${data.name} — ${formatNumber(data.employees)} Workers — FedTracker`,
    description: `${formatNumber(data.employees)} federal employees in ${data.name}. Average salary ${formatSalary(data.avgSalary)}. Top agencies and occupations.`,
  };
}

export const dynamicParams = true;

export function generateStaticParams() {
  return states.slice(0, 60).map((s) => ({ code: s.code }));
}

async function getStateData(code: string) {
  const filePath = path.join(process.cwd(), "public", "data", "state-detail", `${code}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export default async function StateDetailPage({ params }: { params: { code: string } }) {
  const data = await getStateData(params.code);
  if (!data) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/states" className="hover:text-accent">States</Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-700">{data.name}</span>
      </nav>
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Federal Employees in {data.name}</h1>

      <div className="grid grid-cols-2 gap-4 mb-12">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">Federal Employees</p>
          <p className="text-3xl font-serif font-bold">{formatNumber(data.employees)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">Average Salary</p>
          <p className="text-3xl font-serif font-bold">{formatSalary(data.avgSalary)}</p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Top Agencies</h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
          {data.topAgencies?.map((a: any, i: number) => (
            <Link key={i} href={`/agencies/${a.code}`} className="flex justify-between px-6 py-3 hover:bg-accent-50">
              <span className="text-gray-800">{cleanAgencyName(a.name)}</span>
              <span className="text-gray-500 text-sm">{formatNumber(a.employees)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Top Occupations</h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
          {data.topOccupations?.map((o: any, i: number) => (
            <div key={i} className="flex justify-between px-6 py-3">
              <span className="text-gray-800 truncate mr-4">{o.name}</span>
              <div className="flex gap-4 text-sm text-gray-500 whitespace-nowrap">
                <span>{formatNumber(o.employees)}</span>
                <span>{formatSalary(o.avgSalary)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
