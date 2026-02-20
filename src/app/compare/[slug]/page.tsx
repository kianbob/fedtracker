import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface AgencyData {
  code: string;
  name: string;
  employees: number;
  avgSalary: number | null;
  riskScore: number;
  rifCount: number;
  reductionPct: number;
  retirementPct: number;
  stemPct: number;
  seps2025: number;
  seps2024: number;
  sepChange: number;
  quitCount: number;
  quitRate: number;
  retirementCount: number;
  terminationCount: number;
  avgTenure: number;
  retirementEligible: number;
  experienceLostYears: number;
}

interface ComparisonData {
  slug: string;
  title: string;
  agency1: AgencyData;
  agency2: AgencyData;
}

interface IndexEntry {
  slug: string;
  title: string;
  agency1Name: string;
  agency2Name: string;
}

function getComparison(slug: string): ComparisonData | null {
  try {
    const filePath = path.join(process.cwd(), "public/data/comparisons", `${slug}.json`);
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function getIndex(): IndexEntry[] {
  const filePath = path.join(process.cwd(), "public/data/comparisons/index.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function generateStaticParams() {
  return getIndex().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = getComparison(slug);
  if (!data) return { title: "Comparison Not Found — OpenFeds" };

  const a1 = data.agency1;
  const a2 = data.agency2;
  const title = `${data.title}: Federal Agency Comparison — OpenFeds`;
  const description = `Compare ${a1.name} (${(a1.employees).toLocaleString()} employees) vs ${a2.name} (${(a2.employees).toLocaleString()} employees). Side-by-side analysis of salaries, risk scores, RIF counts, and workforce reductions.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

function fmt(val: number | null | undefined, type: "number" | "currency" | "pct" | "score" = "number"): string {
  if (val == null) return "N/A";
  if (type === "currency") return "$" + val.toLocaleString();
  if (type === "pct") return val.toFixed(1) + "%";
  if (type === "score") return val.toString() + "/100";
  return val.toLocaleString();
}

type Direction = "lower" | "higher" | "neutral";

interface Metric {
  label: string;
  key: keyof AgencyData;
  type: "number" | "currency" | "pct" | "score";
  better: Direction;
}

const metrics: Metric[] = [
  { label: "Employees", key: "employees", type: "number", better: "neutral" },
  { label: "Avg Salary", key: "avgSalary", type: "currency", better: "higher" },
  { label: "Risk Score", key: "riskScore", type: "score", better: "lower" },
  { label: "RIF Count", key: "rifCount", type: "number", better: "lower" },
  { label: "Reduction %", key: "reductionPct", type: "pct", better: "lower" },
  { label: "Retirement %", key: "retirementPct", type: "pct", better: "lower" },
  { label: "STEM %", key: "stemPct", type: "pct", better: "higher" },
  { label: "2025 Separations", key: "seps2025", type: "number", better: "lower" },
  { label: "Avg Tenure (yrs)", key: "avgTenure", type: "number", better: "higher" },
  { label: "Quit Rate %", key: "quitRate", type: "pct", better: "lower" },
];

function getColor(v1: number | null, v2: number | null, better: Direction, isFirst: boolean): string {
  if (better === "neutral" || v1 == null || v2 == null || v1 === v2) return "";
  const firstBetter = better === "lower" ? v1 < v2 : v1 > v2;
  if (isFirst) return firstBetter ? "text-green-600 font-semibold" : "text-red-600";
  return firstBetter ? "text-red-600" : "text-green-600 font-semibold";
}

function generateSummary(a1: AgencyData, a2: AgencyData): string {
  const parts: string[] = [];

  // Size comparison
  const bigger = a1.employees > a2.employees ? a1 : a2;
  const smaller = a1.employees > a2.employees ? a2 : a1;
  const ratio = (bigger.employees / smaller.employees).toFixed(1);
  parts.push(`${bigger.name} is ${ratio}x larger than ${smaller.name} with ${bigger.employees.toLocaleString()} employees compared to ${smaller.employees.toLocaleString()}.`);

  // Risk comparison
  const riskier = a1.riskScore > a2.riskScore ? a1 : a2;
  const safer = a1.riskScore > a2.riskScore ? a2 : a1;
  parts.push(`${riskier.name} faces higher workforce risk with a score of ${riskier.riskScore}/100 vs ${safer.riskScore}/100 for ${safer.name}.`);

  // Salary comparison
  if (a1.avgSalary && a2.avgSalary) {
    const higherPay = a1.avgSalary > a2.avgSalary ? a1 : a2;
    const lowerPay = a1.avgSalary > a2.avgSalary ? a2 : a1;
    const diff = higherPay.avgSalary! - lowerPay.avgSalary!;
    parts.push(`${higherPay.name} pays $${diff.toLocaleString()} more on average ($${higherPay.avgSalary!.toLocaleString()} vs $${lowerPay.avgSalary!.toLocaleString()}).`);
  }

  // Reduction comparison
  const moreReduced = a1.reductionPct > a2.reductionPct ? a1 : a2;
  parts.push(`${moreReduced.name} has seen steeper workforce reductions at ${moreReduced.reductionPct.toFixed(1)}% compared to ${(a1 === moreReduced ? a2 : a1).reductionPct.toFixed(1)}% for ${(a1 === moreReduced ? a2 : a1).name}.`);

  return parts.join(" ");
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getComparison(slug);
  if (!data) notFound();

  const { agency1: a1, agency2: a2 } = data;
  const summary = generateSummary(a1, a2);

  // Bar chart data
  const barMetrics = [
    { label: "Risk Score", v1: a1.riskScore, v2: a2.riskScore, max: 100 },
    { label: "Reduction %", v1: a1.reductionPct, v2: a2.reductionPct, max: Math.max(a1.reductionPct, a2.reductionPct) * 1.2 },
    { label: "STEM %", v1: a1.stemPct, v2: a2.stemPct, max: Math.max(a1.stemPct, a2.stemPct, 1) * 1.2 },
    { label: "Retirement %", v1: a1.retirementPct, v2: a2.retirementPct, max: Math.max(a1.retirementPct, a2.retirementPct) * 1.2 },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How do ${a1.name} and ${a2.name} compare?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: summary,
        },
      },
      {
        "@type": "Question",
        name: `Which agency has more employees, ${a1.name} or ${a2.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${a1.name} has ${a1.employees.toLocaleString()} employees while ${a2.name} has ${a2.employees.toLocaleString()} employees.`,
        },
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        {" / "}
        <Link href="/compare" className="hover:text-indigo-600">Compare</Link>
        {" / "}
        <span className="text-gray-900">{data.title}</span>
      </nav>

      <h1 className="font-heading text-3xl md:text-4xl font-bold text-center mb-2">
        <Link href={`/agency/${a1.code}`} className="text-indigo-600 hover:text-indigo-800">{a1.name}</Link>
        <span className="text-gray-400 mx-3">vs</span>
        <Link href={`/agency/${a2.code}`} className="text-indigo-600 hover:text-indigo-800">{a2.name}</Link>
      </h1>
      <p className="text-center text-gray-500 mb-8">Federal Agency Comparison</p>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Metric</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-indigo-600">{a1.name}</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-indigo-600">{a2.name}</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m, i) => {
              const v1 = a1[m.key] as number | null;
              const v2 = a2[m.key] as number | null;
              return (
                <tr key={m.key} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">{m.label}</td>
                  <td className={`px-4 py-3 text-sm text-right ${getColor(v1, v2, m.better, true)}`}>
                    {fmt(v1, m.type)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right ${getColor(v1, v2, m.better, false)}`}>
                    {fmt(v2, m.type)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Visual Comparison */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="font-heading text-xl font-bold mb-4">Visual Comparison</h2>
        <div className="space-y-4">
          {barMetrics.map((bm) => (
            <div key={bm.label}>
              <p className="text-sm font-medium text-gray-700 mb-1">{bm.label}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-10 text-right">{bm.v1.toFixed(1)}</span>
                <div className="flex-1 flex gap-1">
                  <div
                    className="h-5 bg-indigo-500 rounded-l"
                    style={{ width: `${Math.min((bm.v1 / bm.max) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-10 text-right">{bm.v2.toFixed(1)}</span>
                <div className="flex-1 flex gap-1">
                  <div
                    className="h-5 bg-amber-500 rounded-l"
                    style={{ width: `${Math.min((bm.v2 / bm.max) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex text-xs text-gray-400 mt-0.5 gap-4">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-indigo-500 rounded-sm inline-block" /> {a1.name}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-sm inline-block" /> {a2.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="font-heading text-xl font-bold mb-3">Analysis</h2>
        <p className="text-gray-700 leading-relaxed">{summary}</p>
      </div>

      {/* Links */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={`/agency/${a1.code}`}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-center hover:bg-indigo-700 transition"
        >
          View {a1.name} Details →
        </Link>
        <Link
          href={`/agency/${a2.code}`}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-center hover:bg-indigo-700 transition"
        >
          View {a2.name} Details →
        </Link>
      </div>

      {/* Other Comparisons */}
      <div className="mt-12">
        <h2 className="font-heading text-xl font-bold mb-4">More Comparisons</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {getIndex()
            .filter((e) => e.slug !== slug)
            .slice(0, 9)
            .map((e) => (
              <Link
                key={e.slug}
                href={`/compare/${e.slug}`}
                className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                {e.title}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
