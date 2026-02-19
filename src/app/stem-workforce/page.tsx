import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { formatNumber, formatSalary, fixAgencyName } from "@/lib/format";
import stemData from "../../../public/data/stem-analysis.json";
import { STEMCategoryChart } from "./STEMCategoryChart";

export const metadata: Metadata = {
  title:
    "The STEM Brain Drain: Are We Losing America's Technical Workforce? — FedTracker",
  description:
    "Federal STEM workforce analysis: engineers, scientists, technologists, and healthcare professionals across 128 agencies. Who employs them, what they earn, and why it matters for national security.",
};

const STEM_TYPES = [
  "ENGINEERING OCCUPATIONS",
  "SCIENCE OCCUPATIONS",
  "TECHNOLOGY OCCUPATIONS",
  "MATHEMATICS OCCUPATIONS",
  "HEALTH OCCUPATIONS",
];

function PullQuote({ text, source }: { text: string; source?: string }) {
  return (
    <blockquote className="border-l-4 border-accent pl-6 py-4 my-8 bg-accent-50 rounded-r-xl">
      <p className="text-xl font-serif italic text-gray-900">{text}</p>
      {source && (
        <cite className="text-sm text-gray-500 mt-2 block not-italic">
          — {source}
        </cite>
      )}
    </blockquote>
  );
}

function Section({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16 scroll-mt-8">
      <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">
        <span className="mr-3">{emoji}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

// Compute STEM vs Non-STEM totals
const stemRows = stemData.by_agency.filter((r) =>
  STEM_TYPES.includes(r.type)
);
const nonStemRows = stemData.by_agency.filter(
  (r) => r.type === "ALL OTHER OCCUPATIONS"
);

const stemTotal = stemRows.reduce((s, r) => s + r.employees, 0);
const nonStemTotal = nonStemRows.reduce((s, r) => s + r.employees, 0);

const stemSalaryRows = stemRows.filter(
  (r) => r.avg_salary != null && r.avg_salary > 0
);
const stemAvgSalary =
  stemSalaryRows.length > 0
    ? Math.round(
        stemSalaryRows.reduce(
          (s, r) => s + r.avg_salary! * r.employees,
          0
        ) /
          stemSalaryRows.reduce((s, r) => s + r.employees, 0)
      )
    : null;

const nonStemSalaryRows = nonStemRows.filter(
  (r) => r.avg_salary != null && r.avg_salary > 0
);
const nonStemAvgSalary =
  nonStemSalaryRows.length > 0
    ? Math.round(
        nonStemSalaryRows.reduce(
          (s, r) => s + r.avg_salary! * r.employees,
          0
        ) /
          nonStemSalaryRows.reduce((s, r) => s + r.employees, 0)
      )
    : null;

const stemPct = ((stemTotal / (stemTotal + nonStemTotal)) * 100).toFixed(1);

// Top agencies by STEM employees
interface AgencyStem {
  agency: string;
  agency_code: string;
  stemEmployees: number;
  weightedSalary: number;
  salaryEmployees: number;
}

const agencyMap = new Map<string, AgencyStem>();
for (const r of stemRows) {
  const existing = agencyMap.get(r.agency_code);
  if (existing) {
    existing.stemEmployees += r.employees;
    if (r.avg_salary != null && r.avg_salary > 0) {
      existing.weightedSalary += r.avg_salary * r.employees;
      existing.salaryEmployees += r.employees;
    }
  } else {
    agencyMap.set(r.agency_code, {
      agency: r.agency,
      agency_code: r.agency_code,
      stemEmployees: r.employees,
      weightedSalary:
        r.avg_salary != null && r.avg_salary > 0
          ? r.avg_salary * r.employees
          : 0,
      salaryEmployees:
        r.avg_salary != null && r.avg_salary > 0 ? r.employees : 0,
    });
  }
}

const topAgencies = [...Array.from(agencyMap.values())]
  .sort((a, b) => b.stemEmployees - a.stemEmployees)
  .slice(0, 15);

// STEM category breakdown for chart
const categoryTotals = STEM_TYPES.map((type) => {
  const rows = stemRows.filter((r) => r.type === type);
  const label = type
    .replace(" OCCUPATIONS", "")
    .charAt(0)
    .toUpperCase()
    + type.replace(" OCCUPATIONS", "").slice(1).toLowerCase();
  return {
    category: label,
    employees: rows.reduce((s, r) => s + r.employees, 0),
  };
}).sort((a, b) => b.employees - a.employees);

export default function STEMWorkforcePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-indigo-400">
          Home
        </Link>
        <span>/</span>
        <span>Analysis</span>
        <span>/</span>
        <span className="text-slate-300">STEM Brain Drain</span>
      </nav>

      <header className="mb-16">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">
          FedTracker Editorial
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          The STEM Brain Drain: Are We Losing America&apos;s Technical
          Workforce?
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          The federal government employs{" "}
          <strong>{formatNumber(stemTotal)} STEM professionals</strong> across
          engineering, science, technology, mathematics, and healthcare. They
          earn more than their non-STEM colleagues &mdash; but the private
          sector pays even more. Here&apos;s what the data shows.
        </p>
        <div className="flex gap-4 mt-6 text-sm text-gray-500">
          <span>Data: OPM FedScope Dec 2025</span>
          <span>&middot;</span>
          <span>STEM Classification: OPM Occupational Categories</span>
        </div>
      </header>

      {/* TOC */}
      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-16">
        <h3 className="font-semibold text-gray-900 mb-3">In This Analysis</h3>
        <ol className="space-y-2 text-gray-700">
          <li>
            <a href="#overview" className="hover:text-accent">
              1. STEM vs Non-STEM Overview
            </a>
          </li>
          <li>
            <a href="#categories" className="hover:text-accent">
              2. STEM Disciplines Breakdown
            </a>
          </li>
          <li>
            <a href="#agencies" className="hover:text-accent">
              3. Top Agencies by STEM Workforce
            </a>
          </li>
          <li>
            <a href="#editorial" className="hover:text-accent">
              4. The Brain Drain Problem
            </a>
          </li>
        </ol>
      </nav>

      {/* 1 – STEM vs Non-STEM */}
      <div id="overview">
        <Section emoji="🔬" title="STEM vs Non-STEM Overview">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Of the roughly {formatNumber(stemTotal + nonStemTotal)} federal
            employees in our dataset, <strong>{stemPct}%</strong> work in STEM
            occupations. These workers &mdash; engineers, scientists, IT
            specialists, mathematicians, and healthcare professionals &mdash; are
            the backbone of agencies from NASA to the VA.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="STEM Employees"
              value={formatNumber(stemTotal)}
              sub={`${stemPct}% of workforce`}
            />
            <StatCard
              label="Non-STEM Employees"
              value={formatNumber(nonStemTotal)}
              sub={`${(100 - parseFloat(stemPct)).toFixed(1)}% of workforce`}
            />
            <StatCard
              label="Avg STEM Salary"
              value={formatSalary(stemAvgSalary)}
              sub="Weighted average"
            />
            <StatCard
              label="Avg Non-STEM Salary"
              value={formatSalary(nonStemAvgSalary)}
              sub="Weighted average"
            />
          </div>

          <PullQuote text="Federal STEM professionals earn significantly more than their non-STEM counterparts — but the gap with private-sector tech salaries keeps widening, making retention a growing crisis." />
        </Section>
      </div>

      {/* 2 – STEM Categories Breakdown */}
      <div id="categories">
        <Section emoji="📊" title="STEM Disciplines Breakdown">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Health occupations dominate the federal STEM workforce, driven
            largely by the VA hospital system. Engineering and science follow,
            concentrated in defense and research agencies.
          </p>

          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
            <STEMCategoryChart data={categoryTotals} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {categoryTotals.map((c) => (
              <StatCard
                key={c.category}
                label={c.category}
                value={formatNumber(c.employees)}
                sub={`${((c.employees / stemTotal) * 100).toFixed(1)}% of STEM`}
              />
            ))}
          </div>
        </Section>
      </div>

      {/* 3 – Top Agencies */}
      <div id="agencies">
        <Section emoji="🏛️" title="Top Agencies by STEM Workforce">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The Department of Veterans Affairs leads with the largest STEM
            workforce, mostly healthcare professionals. Defense agencies
            (Army, Navy, Air Force) follow with massive engineering and
            technology workforces. NASA, despite its reputation, ranks lower by
            raw headcount.
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Agency
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    STEM Employees
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Avg Salary
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topAgencies.map((a) => (
                  <tr key={a.agency_code} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <Link
                        href={`/agencies/${a.agency_code}`}
                        className="text-accent hover:underline"
                      >
                        {fixAgencyName(a.agency)}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-right text-gray-700">
                      {formatNumber(a.stemEmployees)}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-gray-900">
                      {a.salaryEmployees > 0
                        ? formatSalary(
                            Math.round(
                              a.weightedSalary / a.salaryEmployees
                            )
                          )
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      {/* 4 – Editorial */}
      <div id="editorial">
        <Section emoji="⚠️" title="The Brain Drain Problem">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The federal government faces a compounding talent crisis. Private
            sector companies like Google, Amazon, and defense contractors offer
            salaries 2&ndash;3x federal pay for equivalent STEM roles. A GS-13
            software engineer in D.C. earns roughly $120K; the same engineer at a
            major tech firm earns $250K+.
          </p>

          <PullQuote text="Every STEM professional who leaves federal service takes institutional knowledge, security clearances, and mission-critical expertise with them. The replacement pipeline is thinning." />

          <p className="text-gray-700 leading-relaxed mb-4">
            The national security implications are severe. Federal agencies
            manage nuclear weapons, cybersecurity infrastructure, disease
            surveillance, air traffic control, and space exploration. These
            missions require deep technical expertise that takes years to
            develop. When experienced engineers and scientists leave for the
            private sector, their replacements &mdash; if agencies can hire them
            at all &mdash; start from scratch.
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-2">
            <li>
              <strong>Pay compression:</strong> Federal STEM salaries lag private
              sector by 30&ndash;50% for mid-career professionals.
            </li>
            <li>
              <strong>Hiring speed:</strong> Federal hiring takes 3&ndash;6
              months on average; tech companies extend offers in weeks.
            </li>
            <li>
              <strong>Aging workforce:</strong> Federal STEM employees skew older,
              and many are nearing retirement with no succession pipeline.
            </li>
            <li>
              <strong>RIF vulnerability:</strong> Workforce reductions
              disproportionately hit newer STEM hires, accelerating the brain
              drain among early-career talent.
            </li>
          </ul>

          <p className="text-gray-700 leading-relaxed mb-4">
            The irony is stark: at the same moment the government needs{" "}
            <em>more</em> technical capacity &mdash; for AI governance,
            cybersecurity, and emerging threats &mdash; it&apos;s losing the
            people who provide it. Across-the-board cuts don&apos;t distinguish
            between a redundant administrative position and a cybersecurity
            analyst protecting critical infrastructure.
          </p>

          <PullQuote text="The question isn't whether the federal government can afford to pay competitive STEM salaries. It's whether it can afford not to." />

          <p className="text-gray-700 leading-relaxed">
            Explore the full workforce data on the{" "}
            <Link
              href="/agencies"
              className="text-accent font-semibold hover:underline"
            >
              agencies dashboard
            </Link>
            , see how cuts are reshaping each agency on the{" "}
            <Link
              href="/doge"
              className="text-accent font-semibold hover:underline"
            >
              DOGE impact page
            </Link>
            , or dive into{" "}
            <Link
              href="/salary-analysis"
              className="text-accent font-semibold hover:underline"
            >
              salary patterns
            </Link>{" "}
            across the federal workforce.
          </p>
        </Section>
      </div>

      {/* RELATED ANALYSIS */}
      <section className="mt-16 mb-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
          Related Analysis
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              href: "/salary-analysis",
              title: "Salary Analysis",
              desc: "Pay patterns, grade distributions, and compensation gaps across the federal workforce.",
            },
            {
              href: "/workforce-analysis",
              title: "Workforce Deep Dive",
              desc: "Comprehensive analysis of federal employment trends, demographics, and structural changes.",
            },
            {
              href: "/federal-bloat",
              title: "Federal Bloat",
              desc: "Is the federal workforce too big? Data on headcount, spending per employee, and the shadow contractor workforce.",
            },
            {
              href: "/occupation-impact",
              title: "Occupation Impact",
              desc: "Which job series are most affected by workforce reductions and restructuring.",
            },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <h3 className="font-serif font-bold text-gray-900 group-hover:text-indigo-700 transition-colors mb-1">
                {link.title}
              </h3>
              <p className="text-sm text-gray-500">{link.desc}</p>
              <span className="text-indigo-600 text-sm font-medium mt-2 inline-block">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="bg-gray-50 border border-gray-200 rounded-xl p-8">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
          Sources & Methodology
        </h2>
        <div className="text-gray-700 space-y-3">
          <p>
            Workforce data from <strong>OPM FedScope</strong> (December 2025
            snapshot). STEM classification based on OPM occupational categories:
            Engineering, Science, Technology, Mathematics, and Health
            occupations. Salary figures are weighted averages excluding military
            agencies with redacted pay data. Private-sector salary comparisons
            drawn from Bureau of Labor Statistics and industry surveys.
          </p>
        </div>
        <div className="mt-6">
          <Link
            href="/about"
            className="text-accent font-semibold hover:underline"
          >
            Full methodology →
          </Link>
        </div>
      </section>
    </div>
  );
}
