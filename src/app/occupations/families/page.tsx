import Link from "next/link";
import { formatNumber, formatSalary } from "@/lib/format";
import familiesData from "../../../../public/data/occupation-families.json";

export const metadata = {
  title: "Occupation Families — Federal Career Groups — OpenFeds",
  description: "Explore federal occupation families: career groups spanning 540+ job series across the U.S. government workforce.",
};

interface Family {
  slug: string;
  name: string;
  totalEmployees: number;
  avgSalary: number;
  occupationCount: number;
}

export default function OccupationFamiliesPage() {
  const families = familiesData as Family[];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">Occupation Families</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">
        Federal occupations are organized into career families — broad groups of related job series.
        Explore the {families.length} career families that make up the federal workforce.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
              <th className="py-3 pr-4 font-semibold">Family</th>
              <th className="py-3 px-4 font-semibold text-right">Occupations</th>
              <th className="py-3 px-4 font-semibold text-right">Employees</th>
              <th className="py-3 pl-4 font-semibold text-right">Avg Salary</th>
            </tr>
          </thead>
          <tbody>
            {families.map((f) => (
              <tr key={f.slug} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-3 pr-4">
                  <Link href={`/occupations/families/${f.slug}`} className="text-blue-700 dark:text-blue-400 hover:underline font-medium">
                    {f.name}
                  </Link>
                </td>
                <td className="py-3 px-4 text-right tabular-nums">{f.occupationCount}</td>
                <td className="py-3 px-4 text-right tabular-nums">{formatNumber(f.totalEmployees)}</td>
                <td className="py-3 pl-4 text-right tabular-nums">{formatSalary(f.avgSalary)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
