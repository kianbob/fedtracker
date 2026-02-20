import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { formatNumber, formatSalary, toTitleCase } from "@/lib/format";
import Breadcrumb from "@/components/Breadcrumb";
import stateOccupations from "../../../../../public/data/state-occupations.json";

interface OccEntry {
  name: string;
  employees: number;
  avgSalary: number;
}

interface StateOccData {
  name: string;
  code: string;
  occupations: OccEntry[];
  totalEmployees: number;
}

const allStates = stateOccupations as StateOccData[];

function getState(code: string): StateOccData | undefined {
  return allStates.find((s) => s.code.toUpperCase() === code.toUpperCase());
}

export function generateStaticParams() {
  return allStates.map((s) => ({ code: s.code }));
}

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const state = getState(params.code);
  if (!state) return { title: "State Not Found — OpenFeds" };
  return {
    title: `Top Federal Occupations in ${state.name} — OpenFeds`,
    description: `See the ${state.occupations.length} most common federal occupations in ${state.name}, covering ${formatNumber(state.totalEmployees)} employees. Explore what federal workers in ${state.name} actually do.`,
  };
}

export default async function StateOccupationsPage({ params }: { params: { code: string } }) {
  const state = getState(params.code);
  if (!state) notFound();

  const maxEmployees = state.occupations.length ? Math.max(...state.occupations.map((o) => o.employees)) : 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: "States", href: "/states" },
          { label: state.name, href: `/states/${state.code}` },
          { label: "Top Occupations" },
        ]}
      />

      <div className="mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Top Federal Occupations in {state.name}
        </h1>
        <p className="text-gray-600 text-lg">
          What federal employees in {state.name} actually do
        </p>
      </div>

      {/* Summary stat */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">Total Employees</p>
          <p className="text-3xl font-serif font-bold text-gray-900">{formatNumber(state.totalEmployees)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">Occupation Groups</p>
          <p className="text-3xl font-serif font-bold text-gray-900">{state.occupations.length}</p>
        </div>
      </div>

      {/* Occupations table */}
      <section className="mb-12">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Occupation</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Employees</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Avg Salary</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-48 hidden sm:table-cell"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {state.occupations.map((occ, i) => (
                  <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-6 py-3 text-sm text-gray-400">{i + 1}</td>
                    <td className="px-6 py-3 text-sm text-gray-800 font-medium">
                      {toTitleCase(occ.name)}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600 text-right">{formatNumber(occ.employees)}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 text-right">{formatSalary(occ.avgSalary)}</td>
                    <td className="px-6 py-3 hidden sm:table-cell">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${(occ.employees / maxEmployees) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Back + Related links */}
      <div className="flex flex-wrap gap-3 mb-12">
        <Link
          href={`/states/${state.code}`}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to {state.name}
        </Link>
      </div>

      <section>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Explore More</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/occupations" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
            <h3 className="font-serif font-bold text-gray-900 mb-1">All Occupations</h3>
            <p className="text-sm text-gray-500">Browse all federal occupation series and their workforce data.</p>
          </Link>
          <Link href="/occupations/families" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
            <h3 className="font-serif font-bold text-gray-900 mb-1">Occupation Families</h3>
            <p className="text-sm text-gray-500">Explore occupation groups and families across the federal workforce.</p>
          </Link>
          <Link href="/states" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
            <h3 className="font-serif font-bold text-gray-900 mb-1">All States</h3>
            <p className="text-sm text-gray-500">Compare federal employment across all 50 states and territories.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
