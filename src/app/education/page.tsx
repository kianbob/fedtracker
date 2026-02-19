import type { Metadata } from "next";
import { formatNumber, formatSalary } from "@/lib/format";
import { EducationChart } from "./EducationChart";
import educationData from "../../../public/data/education-salary.json";

export const metadata: Metadata = {
  title: "Education & Salary Analysis — Federal Pay by Degree Level — FedTracker",
  description: "How does education level affect federal salary? Analysis of pay by degree from high school to doctorate across 2M+ federal employees.",
};

export default function EducationPage() {
  // Filter out tiny/no-data categories for chart, keep top 10
  const mainLevels = educationData.filter(
    (d) => d.employees > 5000 && d.level !== "No Data Reported"
  );

  const chartData = [...mainLevels]
    .sort((a, b) => a.avgSalary - b.avgSalary)
    .map((d) => ({ name: d.level, value: d.avgSalary }));

  const hsLevel = educationData.find((d) => d.level.startsWith("High School"));
  const hsSalary = hsLevel?.avgSalary ?? 0;

  // Salary premiums
  const premiumLevels = [
    { label: "Associate Degree", key: "Associate Degree" },
    { label: "Bachelor's Degree", key: "Bachelor's Degree" },
    { label: "Master's Degree", key: "Master's Degree" },
    { label: "Doctorate Degree", key: "Doctorate Degree" },
    { label: "First Professional", key: "First Professional" },
  ];
  const premiums = premiumLevels.map((p) => {
    const match = educationData.find((d) => d.level === p.key);
    const premium = match ? Math.round(((match.avgSalary - hsSalary) / hsSalary) * 100) : 0;
    const diff = match ? match.avgSalary - hsSalary : 0;
    return { ...p, premium, diff, salary: match?.avgSalary ?? 0 };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">Education Analysis</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Education &amp; Salary Analysis
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          How does education level affect federal pay? A breakdown of average salaries across {formatNumber(
            educationData.reduce((s, d) => s + d.employees, 0)
          )} federal employees.
        </p>
      </header>

      {/* Chart */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Average Salary by Education Level</h2>
        <EducationChart data={chartData} />
      </section>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl mb-12">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Education Level</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Employees</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Avg Salary</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">25th %ile</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Median</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">75th %ile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {educationData.map((d) => (
              <tr key={d.level} className="hover:bg-gray-50">
                <td className="px-3 py-3 text-gray-900 font-medium">{d.level}</td>
                <td className="px-3 py-3 text-gray-700">{formatNumber(d.employees)}</td>
                <td className="px-3 py-3 text-gray-700 font-semibold">{formatSalary(d.avgSalary)}</td>
                <td className="px-3 py-3 text-gray-500">{formatSalary(d.p25)}</td>
                <td className="px-3 py-3 text-gray-500">{formatSalary(d.median)}</td>
                <td className="px-3 py-3 text-gray-500">{formatSalary(d.p75)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Salary Premium */}
      <section className="bg-indigo-50 border border-indigo-200 rounded-xl p-8 mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Does Education Pay Off?</h2>
        <p className="text-gray-600 mb-6">
          Salary premium compared to a high school diploma ({formatSalary(hsSalary)} avg). In the federal
          government, higher education consistently translates to higher pay — but the biggest jump comes
          from professional degrees (law, medicine) rather than PhDs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {premiums.map((p) => (
            <div key={p.key} className="bg-white rounded-lg p-4 border border-indigo-100">
              <p className="text-xs text-gray-500 font-medium mb-1">{p.label}</p>
              <p className="text-2xl font-bold text-accent">+{p.premium}%</p>
              <p className="text-xs text-gray-500 mt-1">+{formatSalary(p.diff)}/yr</p>
            </div>
          ))}
        </div>
      </section>

      {/* Narrative */}
      <section className="max-w-3xl">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Key Takeaways</h2>
        <div className="text-gray-700 space-y-4 leading-relaxed">
          <p>
            Federal pay is strongly correlated with education. A bachelor&apos;s degree holder earns{" "}
            <strong>{formatSalary(premiums[1]?.diff ?? 0)} more per year</strong> than a high school graduate —
            a {premiums[1]?.premium}% premium. Master&apos;s degrees add another meaningful bump.
          </p>
          <p>
            The highest-paid group is <strong>First Professional</strong> degree holders (JD, MD) at{" "}
            {formatSalary(educationData[0]?.avgSalary)} average — largely driven by federal attorneys and
            physicians in the VA health system.
          </p>
          <p>
            Interestingly, the doctorate-to-professional degree gap is significant: PhDs average{" "}
            {formatSalary(educationData.find((d) => d.level === "Doctorate Degree")?.avgSalary ?? 0)} vs.{" "}
            {formatSalary(educationData[0]?.avgSalary)} for professional degrees. This reflects the premium
            placed on legal and medical expertise in government service.
          </p>
        </div>
      </section>
    </div>
  );
}
