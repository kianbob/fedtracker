import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { formatNumber, formatSalary } from "@/lib/format";
import fs from "fs";
import path from "path";

interface Agency {
  code: string;
  name: string;
  employees: number;
  avgSalary: number | null;
  retirementPct: number;
  retirementEligible: number;
  stemPct: number;
  avgTenure: number;
  riskScore: number;
  seps2025: number;
  seps2024: number;
  sepChange: number;
  rifCount: number;
  quitCount: number;
  quitRate: number;
  retirementCount: number;
  terminationCount: number;
  reductionPct: number;
  experienceLostYears: number;
}

interface ComparisonData {
  slug: string;
  title: string;
  agency1: Agency;
  agency2: Agency;
}

function getComparisonData(slug: string): ComparisonData | null {
  const filePath = path.join(process.cwd(), "public", "data", "comparisons", `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = getComparisonData(params.slug);
  if (!data) return { title: "Comparison Not Found — OpenFeds" };
  return {
    title: `${data.agency1.name} vs ${data.agency2.name} — Federal Agency Comparison — OpenFeds`,
    description: `Side-by-side comparison of ${data.agency1.name} (${formatNumber(data.agency1.employees)} employees) and ${data.agency2.name} (${formatNumber(data.agency2.employees)} employees). Salaries, risk scores, separations, and more.`,
  };
}

export function generateStaticParams() {
  const filePath = path.join(process.cwd(), "public", "data", "comparisons", "index.json");
  if (!fs.existsSync(filePath)) return [];
  const index: { slug: string }[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return index.map((item) => ({ slug: item.slug }));
}

export const dynamicParams = true;

type MetricRow = {
  label: string;
  val1: string;
  val2: string;
  /** 1 = agency1 is better, 2 = agency2 is better, 0 = neutral */
  better: 0 | 1 | 2;
};

function pct(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "N/A";
  return `${n.toFixed(1)}%`;
}

function num(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "N/A";
  return n.toLocaleString();
}

function buildRows(a1: Agency, a2: Agency): MetricRow[] {
  // Helper: higher is better (1), lower is better (-1), neutral (0)
  function compare(v1: number | null, v2: number | null, higherIsBetter: boolean): 0 | 1 | 2 {
    if (v1 == null || v2 == null || v1 === v2) return 0;
    if (higherIsBetter) return v1 > v2 ? 1 : 2;
    return v1 < v2 ? 1 : 2;
  }

  return [
    {
      label: "Total Employees",
      val1: formatNumber(a1.employees),
      val2: formatNumber(a2.employees),
      better: compare(a1.employees, a2.employees, true),
    },
    {
      label: "Average Salary",
      val1: formatSalary(a1.avgSalary),
      val2: formatSalary(a2.avgSalary),
      better: compare(a1.avgSalary, a2.avgSalary, true),
    },
    {
      label: "Risk Score",
      val1: a1.riskScore.toString(),
      val2: a2.riskScore.toString(),
      better: compare(a1.riskScore, a2.riskScore, false),
    },
    {
      label: "RIF Count",
      val1: num(a1.rifCount),
      val2: num(a2.rifCount),
      better: compare(a1.rifCount, a2.rifCount, false),
    },
    {
      label: "Workforce Reduction",
      val1: pct(a1.reductionPct),
      val2: pct(a2.reductionPct),
      better: compare(a1.reductionPct, a2.reductionPct, false),
    },
    {
      label: "Retirement Eligible",
      val1: pct(a1.retirementPct),
      val2: pct(a2.retirementPct),
      better: compare(a1.retirementPct, a2.retirementPct, false),
    },
    {
      label: "STEM Workforce",
      val1: pct(a1.stemPct),
      val2: pct(a2.stemPct),
      better: compare(a1.stemPct, a2.stemPct, true),
    },
    {
      label: "Avg Tenure (years)",
      val1: a1.avgTenure.toFixed(1),
      val2: a2.avgTenure.toFixed(1),
      better: compare(a1.avgTenure, a2.avgTenure, true),
    },
    {
      label: "2025 Separations",
      val1: num(a1.seps2025),
      val2: num(a2.seps2025),
      better: compare(a1.seps2025, a2.seps2025, false),
    },
    {
      label: "Separation Change YoY",
      val1: `${a1.sepChange > 0 ? "+" : ""}${pct(a1.sepChange)}`,
      val2: `${a2.sepChange > 0 ? "+" : ""}${pct(a2.sepChange)}`,
      better: compare(a1.sepChange, a2.sepChange, false),
    },
    {
      label: "Quit Rate",
      val1: pct(a1.quitRate),
      val2: pct(a2.quitRate),
      better: compare(a1.quitRate, a2.quitRate, false),
    },
    {
      label: "Terminations",
      val1: num(a1.terminationCount),
      val2: num(a2.terminationCount),
      better: compare(a1.terminationCount, a2.terminationCount, false),
    },
    {
      label: "Experience Lost (years)",
      val1: num(a1.experienceLostYears),
      val2: num(a2.experienceLostYears),
      better: compare(a1.experienceLostYears, a2.experienceLostYears, false),
    },
  ];
}

export default async function ComparisonPage({ params }: { params: { slug: string } }) {
  const data = getComparisonData(params.slug);
  if (!data) notFound();

  const { agency1, agency2 } = data;
  const rows = buildRows(agency1, agency2);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/compare" className="hover:text-indigo-600">Compare</Link>
        <span className="mx-2">›</span>
        <span>{data.title}</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
        {data.title}
      </h1>
      <p className="text-gray-500 mb-8">
        Side-by-side federal agency comparison
      </p>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-1/3">Metric</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600 w-1/3">
                <Link href={`/agencies/${agency1.code}`} className="text-indigo-600 hover:text-indigo-800">
                  {agency1.name}
                </Link>
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600 w-1/3">
                <Link href={`/agencies/${agency2.code}`} className="text-indigo-600 hover:text-indigo-800">
                  {agency2.name}
                </Link>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.label} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700 font-medium">{row.label}</td>
                <td className={`px-4 py-3 text-right tabular-nums ${
                  row.better === 1 ? "text-green-700 font-semibold" :
                  row.better === 2 ? "text-red-600" : "text-gray-900"
                }`}>
                  {row.val1}
                </td>
                <td className={`px-4 py-3 text-right tabular-nums ${
                  row.better === 2 ? "text-green-700 font-semibold" :
                  row.better === 1 ? "text-red-600" : "text-gray-900"
                }`}>
                  {row.val2}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href={`/agencies/${agency1.code}`}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          View {agency1.name} →
        </Link>
        <Link
          href={`/agencies/${agency2.code}`}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          View {agency2.name} →
        </Link>
      </div>
    </div>
  );
}
