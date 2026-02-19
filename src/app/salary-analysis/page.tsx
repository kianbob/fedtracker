import type { Metadata } from "next";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { formatNumber } from "@/lib/format";
import salaryStats from "../../../public/data/salary-stats.json";

export const metadata: Metadata = {
  title: "Federal Pay: Are Government Workers Overpaid? — OpenFeds",
  description:
    "The average federal salary is $116,751 — but most workers earn $60-100K. The real story is a system that rewards longevity over performance.",
};

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
  id,
  children,
}: {
  emoji: string;
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-8">
      <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">
        <span className="mr-3">{emoji}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

const sortedDistribution = [...salaryStats.distribution].sort((a, b) => {
  const order = ["Under $30K", "$30K-$50K", "$50K-$75K", "$75K-$100K", "$100K-$125K", "$125K-$150K", "$150K-$200K", "$200K+"];
  return order.indexOf(a.bracket) - order.indexOf(b.bracket);
});

const totalEmployees = sortedDistribution.reduce((sum, d) => sum + d.employees, 0);

const gsGrades = salaryStats.byGrade
  .filter((g) => /^(0[1-9]|1[0-5])$/.test(g.grade))
  .sort((a, b) => parseInt(a.grade) - parseInt(b.grade));

const topAgencies = salaryStats.topPaidAgencies.slice(0, 10);
const topOccupations = salaryStats.topPaidOccupations.slice(0, 10);

export default function SalaryAnalysisPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-indigo-400">Home</Link>
        <span>/</span>
        <span>Analysis</span>
        <span>/</span>
        <span className="text-slate-300">Salary Analysis</span>
      </nav>
      <header className="mb-16">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">
          OpenFeds Editorial
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Federal Pay: Are Government Workers Overpaid?
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          The average federal salary is $116,751 — a number that fuels outrage.
          But like most averages, it hides more than it reveals. Most federal
          workers earn fair market wages. The real problem is a pay system
          designed in 1949 that rewards time served over results delivered.
        </p>
        <div className="flex gap-4 mt-6 text-sm text-gray-500">
          <span>Data: OPM FedScope Dec 2025</span>
          <span>·</span>
          <span>{formatNumber(totalEmployees)} employees analyzed</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">Last updated: February 2026</p>
      </header>

      {/* TABLE OF CONTENTS */}
      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-16">
        <h3 className="font-semibold text-gray-900 mb-3">In This Analysis</h3>
        <ol className="space-y-2 text-gray-700">
          <li><a href="#headline" className="hover:text-accent">1. The Headline Number</a></li>
          <li><a href="#distribution" className="hover:text-accent">2. What Most Workers Actually Earn</a></li>
          <li><a href="#gs-scale" className="hover:text-accent">3. The GS Pay Scale Explained</a></li>
          <li><a href="#top-paid" className="hover:text-accent">4. Who Earns the Most</a></li>
          <li><a href="#geography" className="hover:text-accent">5. The DC Premium</a></li>
          <li><a href="#editorial" className="hover:text-accent">6. The Real Problem</a></li>
        </ol>
      </nav>

      {/* SECTION 1: THE HEADLINE NUMBER */}
      <Section emoji="💰" title="The Headline Number" id="headline">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="Avg Federal Salary" value="$116,751" />
          <StatCard label="Avg Private Sector" value="$65,470" sub="BLS, all industries" />
          <StatCard label="Apparent Gap" value="+78%" sub="But it's misleading" />
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          Yes, the average federal worker earns $116,751 — nearly 78% more than
          the average private sector worker. But this comparison is deeply
          misleading. The federal workforce has a fundamentally different
          composition than the private sector.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          There are virtually no retail clerks, fast food workers, or
          warehouse associates in the federal government. Instead, federal
          workers are disproportionately lawyers, engineers, scientists, IT
          specialists, and medical professionals. When you compare apples to
          apples — the same occupations in both sectors — the gap shrinks
          dramatically and sometimes reverses.
        </p>
        <PullQuote
          text="Comparing federal pay to all private sector workers is like comparing a hospital's average salary to a Walmart's. The jobs are fundamentally different."
          source="Congressional Budget Office, 2024 compensation analysis"
        />
      </Section>

      {/* SECTION 2: DISTRIBUTION */}
      <Section emoji="📊" title="What Most Workers Actually Earn" id="distribution">
        <p className="text-gray-700 leading-relaxed mb-6">
          The $116K average is pulled up by high-paid DC-area senior positions
          and specialized professionals (doctors, patent attorneys, financial
          regulators). Here&apos;s what the actual distribution looks like:
        </p>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Salary Bracket</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-900">Employees</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-900">% of Workforce</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedDistribution.map((d) => {
                const pct = (d.employees / totalEmployees) * 100;
                return (
                  <tr key={d.bracket} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{d.bracket}</td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {formatNumber(d.employees)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {pct.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 w-32">
                      <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-accent h-3 rounded-full"
                          style={{ width: `${Math.min(pct * 4, 100)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <StatCard
            label="Under $100K"
            value={formatNumber(
              sortedDistribution
                .filter((d) => ["Under $30K", "$30K-$50K", "$50K-$75K", "$75K-$100K"].includes(d.bracket))
                .reduce((s, d) => s + d.employees, 0)
            )}
            sub={`${(
              (sortedDistribution
                .filter((d) => ["Under $30K", "$30K-$50K", "$50K-$75K", "$75K-$100K"].includes(d.bracket))
                .reduce((s, d) => s + d.employees, 0) /
                totalEmployees) *
              100
            ).toFixed(1)}% of workforce`}
          />
          <StatCard
            label="Over $150K"
            value={formatNumber(
              sortedDistribution
                .filter((d) => ["$150K-$200K", "$200K+"].includes(d.bracket))
                .reduce((s, d) => s + d.employees, 0)
            )}
            sub={`${(
              (sortedDistribution
                .filter((d) => ["$150K-$200K", "$200K+"].includes(d.bracket))
                .reduce((s, d) => s + d.employees, 0) /
                totalEmployees) *
              100
            ).toFixed(1)}% of workforce`}
          />
        </div>
        <PullQuote text="Nearly half the federal workforce earns under $100,000. The 'overpaid bureaucrat' is a senior GS-14 in Washington, not a VA nurse in rural Oklahoma." />
      </Section>

      {/* SECTION 3: GS PAY SCALE */}
      <Section emoji="📋" title="The GS Pay Scale Explained" id="gs-scale">
        <p className="text-gray-700 leading-relaxed mb-4">
          Most federal workers are paid under the General Schedule (GS) — a
          15-grade system created in 1949. Each grade has 10 steps, and workers
          automatically advance through steps based on time served. GS-1 is
          entry level; GS-15 is senior professional. Above that, the Senior
          Executive Service (SES) handles top leadership.
        </p>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Grade</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-900">Avg Salary</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-900">Employees</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {gsGrades.map((g) => (
                <tr key={g.grade} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    GS-{parseInt(g.grade)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    ${formatNumber(g.avgSalary)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {formatNumber(g.employees)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          The bulk of the federal workforce clusters at GS-11 through GS-13 —
          the &ldquo;journeyman&rdquo; level where experienced professionals
          land. At {formatNumber(gsGrades.filter(g => parseInt(g.grade) >= 11 && parseInt(g.grade) <= 13).reduce((s, g) => s + g.employees, 0))} employees,
          these three grades alone account for a major share of the GS workforce.
        </p>
        <PullQuote
          text="The GS system's fatal flaw: a brilliant analyst and a mediocre one on the same grade and step earn exactly the same salary. Time, not talent, drives pay."
        />
      </Section>

      {/* SECTION 4: TOP PAID */}
      <Section emoji="🏆" title="Who Earns the Most" id="top-paid">
        <p className="text-gray-700 leading-relaxed mb-6">
          The highest-paid agencies are financial regulators and specialized
          commissions — organizations that compete directly with Wall Street
          for talent. The highest-paid occupations are medical professionals
          and attorneys.
        </p>

        <h3 className="font-serif text-xl font-bold text-gray-900 mb-4">
          Highest-Paid Agencies
        </h3>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Agency</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-900">Avg Salary</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-900">Employees</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topAgencies.map((a) => (
                <tr key={a.code} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <Link href={`/agencies/${a.code}`} className="hover:text-accent">
                      {a.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    ${formatNumber(a.avgSalary)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {formatNumber(a.employees)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="font-serif text-xl font-bold text-gray-900 mb-4">
          Highest-Paid Occupations
        </h3>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Occupation</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-900">Avg Salary</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-900">Employees</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topOccupations.map((o) => (
                <tr key={o.code} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{o.name}</td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    ${formatNumber(o.avgSalary)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {formatNumber(o.employees)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Medical Officers top the list at $296,932 average — but the VA
          employs 33,816 of them, and they&apos;re still paid below private
          practice rates. Securities examiners at $239K compete with Wall Street
          compliance roles paying $300K+. Context matters.
        </p>
      </Section>

      {/* SECTION 5: GEOGRAPHY */}
      <Section emoji="🗺️" title="The DC Premium" id="geography">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <StatCard label="DC Metro Avg" value="~$135K" sub="Locality pay + cost of living" />
          <StatCard label="Rest of Country Avg" value="~$95K" sub="Lower locality adjustments" />
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          Washington DC and its suburbs are home to a disproportionate share of
          senior-level positions — headquarters staff, policy analysts, and
          senior executives. These positions earn 20-40% more through locality
          pay adjustments meant to match the area&apos;s high cost of living.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          This geographic concentration dramatically skews the national average
          upward. A GS-12 in San Antonio earns roughly $80,000. The same grade
          in DC earns $100,000+. Same job, same grade — different number.
        </p>
        <PullQuote
          text="Roughly 16% of federal workers are in the DC metro area, but they account for a disproportionate share of senior positions. Remove DC and the 'overpaid' narrative collapses."
        />
      </Section>

      {/* SECTION 6: EDITORIAL */}
      <Section emoji="✍️" title="The Real Problem" id="editorial">
        <p className="text-gray-700 leading-relaxed mb-4">
          The &ldquo;overpaid bureaucrat&rdquo; narrative is both overstated
          and understated. Overstated because most federal workers earn
          fair market wages for their education and experience — CBO
          consistently finds that workers with professional degrees earn
          <em> less</em> in government than they would in the private sector.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          But understated because the pay <em>system</em> is broken. The GS
          scale rewards longevity over performance. Step increases are
          virtually automatic. Firing is nearly impossible — fewer than 0.5%
          of federal workers are terminated for cause in any given year.
          This isn&apos;t a workforce compensation problem. It&apos;s a
          management accountability problem.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          The fix isn&apos;t cutting salaries — that just drives top talent
          to the private sector and leaves the mediocre behind. The fix is
          reforming the system: tie pay to performance, make firing possible,
          and give managers the tools to build excellent teams.
        </p>
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mt-8">
          <p className="text-sm font-semibold text-indigo-900 mb-2">The Bottom Line</p>
          <p className="text-indigo-800">
            Federal workers aren&apos;t overpaid — the federal pay system is
            outdated. A 75-year-old compensation framework can&apos;t attract
            and retain 21st-century talent. Reform the system, don&apos;t just
            blame the workers.
          </p>
        </div>
      </Section>

      {/* RELATED ANALYSIS */}
      <section className="mt-16 pt-12 border-t border-gray-200">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">
          Related Analysis
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              href: "/salaries",
              title: "Salary Explorer",
              desc: "Browse federal salaries by agency, occupation, and grade level.",
            },
            {
              href: "/agencies",
              title: "Agency Directory",
              desc: "Explore every federal agency — staffing, budgets, and workforce data.",
            },
            {
              href: "/demographics",
              title: "Workforce Demographics",
              desc: "Age, tenure, and retirement risk across the federal workforce.",
            },
            {
              href: "/federal-bloat",
              title: "Is the Federal Workforce Too Big?",
              desc: "Historical context on federal headcount, contractors, and spending.",
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <h3 className="font-serif font-bold text-gray-900 group-hover:text-indigo-700 mb-1">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600">{card.desc}</p>
              <span className="text-sm font-medium text-indigo-600 mt-2 inline-block">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* METHODOLOGY */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
        Data: OPM FedScope (December 2025 employment). Salary figures represent
        adjusted basic pay. Private sector comparisons from BLS Occupational
        Employment and Wage Statistics (May 2024). Updated monthly.
      </div>
    </div>
  );
}
