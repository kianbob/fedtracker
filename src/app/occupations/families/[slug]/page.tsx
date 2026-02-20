import Link from "next/link";
import { notFound } from "next/navigation";
import { formatNumber, formatSalary } from "@/lib/format";
import familiesData from "../../../../../public/data/occupation-families.json";

interface Occupation {
  code: string;
  name: string;
  employees: number;
  avgSalary: number;
}

interface Family {
  slug: string;
  name: string;
  totalEmployees: number;
  avgSalary: number;
  occupationCount: number;
  allOccupations: Occupation[];
}

const families = familiesData as Family[];

export function generateStaticParams() {
  return families.map((f) => ({ slug: f.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const family = families.find((f) => f.slug === params.slug);
  if (!family) return {};
  return {
    title: `${family.name} — Federal Occupation Family — OpenFeds`,
    description: `Explore ${family.occupationCount} federal occupations in the ${family.name}, employing ${formatNumber(family.totalEmployees)} workers with an average salary of ${formatSalary(family.avgSalary)}.`,
  };
}

export default function FamilyDetailPage({ params }: { params: { slug: string } }) {
  const family = families.find((f) => f.slug === params.slug);
  if (!family) notFound();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <Link href="/occupations/families" className="text-sm text-blue-700 dark:text-blue-400 hover:underline mb-4 inline-block">
        ← All Occupation Families
      </Link>

      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">{family.name}</h1>

      <div className="grid grid-cols-3 gap-4 mb-8 max-w-xl">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold tabular-nums">{formatNumber(family.totalEmployees)}</div>
          <div className="text-xs text-gray-500">Employees</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold tabular-nums">{formatSalary(family.avgSalary)}</div>
          <div className="text-xs text-gray-500">Avg Salary</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold tabular-nums">{family.occupationCount}</div>
          <div className="text-xs text-gray-500">Occupations</div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">Occupations in this Family</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
              <th className="py-3 pr-4 font-semibold">Code</th>
              <th className="py-3 px-4 font-semibold">Occupation</th>
              <th className="py-3 px-4 font-semibold text-right">Employees</th>
              <th className="py-3 pl-4 font-semibold text-right">Avg Salary</th>
            </tr>
          </thead>
          <tbody>
            {family.allOccupations.map((occ) => (
              <tr key={occ.code} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-2 pr-4 tabular-nums text-gray-500">{occ.code}</td>
                <td className="py-2 px-4">
                  <Link href={`/occupations/${occ.code}`} className="text-blue-700 dark:text-blue-400 hover:underline">
                    {occ.name}
                  </Link>
                </td>
                <td className="py-2 px-4 text-right tabular-nums">{formatNumber(occ.employees)}</td>
                <td className="py-2 pl-4 text-right tabular-nums">{formatSalary(occ.avgSalary)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 max-w-3xl">
        The {family.name} encompasses {family.occupationCount} federal occupation series employing
        approximately {formatNumber(family.totalEmployees)} workers across the U.S. government.
        These positions carry a weighted average salary of {formatSalary(family.avgSalary)}, reflecting
        the range of roles from entry-level support to senior professional positions within this career group.
      </p>
    </main>
  );
}
