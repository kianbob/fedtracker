import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { formatNumber, formatSalary, fixAgencyName } from "@/lib/format";
import salaryStats from "../../../../public/data/salary-stats.json";
import agencyList from "../../../../public/data/agency-list.json";

export const metadata: Metadata = {
  title: "Federal Salary Breakdown: What Uncle Sam Really Pays — OpenFeds",
  description:
    "Average federal salary by agency, GS pay scale explained, highest-paid positions, and where your tax dollars go. Complete 2025 data from OPM FedScope.",
  alternates: { canonical: "/analysis/federal-salary-breakdown" },
};

function PullQuote({ text, source }: { text: string; source?: string }) {
  return (
    <blockquote className="border-l-4 border-accent pl-6 py-4 my-8 bg-accent-50 rounded-r-xl">
      <p className="text-xl font-serif italic text-gray-900">{text}</p>
      {source && (
        <cite className="text-sm text-gray-500 mt-2 block not-italic">— {source}</cite>
      )}
    </blockquote>
  );
}

function Section({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16 scroll-mt-8">
      <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">
        <span className="mr-3">{emoji}</span>{title}
      </h2>
      {children}
    </section>
  );
}

/* Derived data */
const topPaidAgencies = salaryStats.topPaidAgencies.slice(0, 15);
const topPaidOccupations = salaryStats.topPaidOccupations.slice(0, 15);
const distribution = [...salaryStats.distribution].sort((a, b) => {
  const order = ["Under $30K", "$30K-$50K", "$50K-$75K", "$75K-$100K", "$100K-$125K", "$125K-$150K", "$150K-$200K", "$200K+"];
  return order.indexOf(a.bracket) - order.indexOf(b.bracket);
});
const totalEmployees = distribution.reduce((s, d) => s + d.employees, 0);
const gsGrades = salaryStats.byGrade
  .filter((g) => /^\d{2}$/.test(g.grade) && parseInt(g.grade) >= 1 && parseInt(g.grade) <= 15)
  .sort((a, b) => parseInt(a.grade) - parseInt(b.grade));

const sixFigureCount = distribution
  .filter((d) => ["$100K-$125K", "$125K-$150K", "$150K-$200K", "$200K+"].includes(d.bracket))
  .reduce((s, d) => s + d.employees, 0);

const avgSalaryAll = agencyList.filter(a => a.avgSalary).reduce((s, a) => s + (a.avgSalary ?? 0) * a.employees, 0)
  / agencyList.filter(a => a.avgSalary).reduce((s, a) => s + a.employees, 0);

export default function FederalSalaryBreakdownPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/analysis" className="hover:text-accent">Analysis</Link>
        <span>/</span>
        <span className="text-slate-300">Federal Salary Breakdown</span>
      </nav>

      <header className="mb-16">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">OpenFeds Analysis</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Federal Salary Breakdown: What Uncle Sam Really Pays
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          The average federal employee earns <strong>{formatSalary(Math.round(avgSalaryAll))}</strong> per year — but that
          number hides enormous variation. Securities regulators average $236K. Treasury clerks average $93K.
          Here&apos;s the complete picture.
        </p>
        <div className="flex gap-4 mt-6 text-sm text-gray-500">
          <span>Data: OPM FedScope Dec 2025</span>
          <span>·</span>
          <span>Last updated: March 2026</span>
        </div>
      </header>

      {/* TOC */}
      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
        <h3 className="font-semibold text-gray-900 mb-3">In This Analysis</h3>
        <ol className="space-y-2 text-gray-700">
          <li><a href="#overview" className="hover:text-accent">1. The Big Picture</a></li>
          <li><a href="#gs-scale" className="hover:text-accent">2. The GS Pay Scale Explained</a></li>
          <li><a href="#by-agency" className="hover:text-accent">3. Average Salary by Agency</a></li>
          <li><a href="#top-occupations" className="hover:text-accent">4. Highest-Paid Federal Occupations</a></li>
          <li><a href="#distribution" className="hover:text-accent">5. Salary Distribution</a></li>
          <li><a href="#six-figures" className="hover:text-accent">6. The Six-Figure Club</a></li>
          <li><a href="#editorial" className="hover:text-accent">7. The Accountability Question</a></li>
        </ol>
      </nav>

      {/* 1. Overview */}
      <div id="overview">
        <Section emoji="📊" title="The Big Picture">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The federal government employs over <strong>{formatNumber(totalEmployees)}</strong> civilian workers.
            Their total compensation — salaries alone, before benefits — represents one of the largest payrolls
            on Earth. But unlike private sector pay, these salaries are set by rigid classification systems,
            locality adjustments, and congressional action.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Avg Federal Salary" value={formatSalary(Math.round(avgSalaryAll))} sub="All agencies" />
            <StatCard label="Highest Avg Agency" value={formatSalary(topPaidAgencies[0]?.avgSalary)} sub={fixAgencyName(topPaidAgencies[0]?.name ?? "")} />
            <StatCard label="Highest Avg Occupation" value={formatSalary(topPaidOccupations[0]?.avgSalary)} sub={topPaidOccupations[0]?.name ?? ""} />
            <StatCard label="Earning $100K+" value={formatNumber(sixFigureCount)} sub={`${((sixFigureCount / totalEmployees) * 100).toFixed(0)}% of workforce`} />
          </div>

          <PullQuote
            text="The federal pay system was designed for a 1949 workforce. It now struggles to attract tech talent while overpaying for administrative roles that the private sector handles for less."
            source="Congressional Research Service, 2024"
          />

          <p className="text-gray-700 leading-relaxed mb-4">
            Understanding federal pay requires understanding the system. It&apos;s not a free market — it&apos;s a
            bureaucratic architecture of pay plans, grade levels, step increases, and locality adjustments.
            The result is a compensation structure that&apos;s simultaneously too generous for some roles and
            not competitive enough for others.
          </p>
        </Section>
      </div>

      {/* 2. GS Scale */}
      <div id="gs-scale">
        <Section emoji="📋" title="The GS Pay Scale Explained">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The <strong>General Schedule (GS)</strong> is the dominant pay system for federal white-collar workers.
            Created by the Classification Act of 1949, it divides jobs into 15 grades (GS-1 through GS-15),
            each with 10 step increases. Your grade reflects your job&apos;s complexity; your step reflects
            time in grade.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-blue-900 mb-3">How the GS System Works</h4>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li><strong>GS-1 to GS-4:</strong> Entry-level clerical and assistant roles. Think mail room, basic data entry.</li>
              <li><strong>GS-5 to GS-7:</strong> Entry professional positions. Recent college graduates typically start here.</li>
              <li><strong>GS-9 to GS-11:</strong> Journey-level professionals. Most specialized roles land in this range.</li>
              <li><strong>GS-12 to GS-13:</strong> Senior specialists and team leads. The &quot;sweet spot&quot; of federal employment.</li>
              <li><strong>GS-14 to GS-15:</strong> Senior managers and top-level experts. GS-15 Step 10 caps around $191K base.</li>
              <li><strong>Locality Pay:</strong> Adds 17-33% on top of base pay depending on metro area. DC gets ~33%.</li>
              <li><strong>Step Increases:</strong> Automatic raises — Steps 1-3 annually, 4-6 every 2 years, 7-10 every 3 years.</li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            Here&apos;s what each GS grade actually pays on average, based on current federal employees:
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Grade</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Avg Salary</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Employees</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Typical Roles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {gsGrades.map((g) => {
                  const gradeNum = parseInt(g.grade);
                  const roles = gradeNum <= 4 ? "Clerical, assistants" :
                    gradeNum <= 7 ? "Entry professional, technicians" :
                    gradeNum <= 11 ? "Journey-level specialists" :
                    gradeNum <= 13 ? "Senior specialists, team leads" :
                    "Senior managers, top experts";
                  return (
                    <tr key={g.grade} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">GS-{g.grade}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatSalary(g.avgSalary)}</td>
                      <td className="px-4 py-3 text-right text-gray-500">{formatNumber(g.employees)}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{roles}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <PullQuote
            text="Step increases are automatic. A GS-12 who shows up and does the minimum gets the same raises as one who excels. The system rewards longevity, not performance."
          />

          <p className="text-gray-700 leading-relaxed mb-4">
            Beyond the GS system, federal workers can be on dozens of other pay plans — the VA has its own
            physician scale, the FAA uses &quot;FV&quot; bands, intelligence agencies have their own systems, and
            the Senior Executive Service (SES) sits above GS-15. The GS system covers the largest share,
            but it&apos;s far from the only game in town.
          </p>
        </Section>
      </div>

      {/* 3. By Agency */}
      <div id="by-agency">
        <Section emoji="🏛️" title="Average Salary by Agency">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Agency average salaries vary by nearly <strong>3x</strong> — from the SEC&apos;s $236K average to the
            Armed Forces Retirement Home&apos;s $79K. Financial regulators dominate the top of the list,
            reflecting both the specialized talent they need and their self-funded fee structures.
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Agency</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Avg Salary</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Employees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topPaidAgencies.map((a, i) => (
                  <tr key={a.code} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Link href={`/agencies/${a.code}`} className="text-accent hover:underline font-medium">
                        {fixAgencyName(a.name)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{formatSalary(a.avgSalary)}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{formatNumber(a.employees)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-amber-900 mb-2">🤔 Why Are Financial Regulators So Well-Paid?</h4>
            <p className="text-amber-800 text-sm leading-relaxed">
              Agencies like the SEC, CFTC, and FDIC are self-funded through fees and assessments — they
              don&apos;t rely on congressional appropriations for salaries. This gives them special pay
              authorities to compete with Wall Street. The result: securities examiners at the SEC earning
              more than Cabinet secretaries. Whether this is &quot;necessary to attract talent&quot; or a captured
              regulator paying itself handsomely depends on your perspective.
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            The bottom of the list tells a different story. Agencies with large blue-collar or entry-level
            workforces — like the VA (with hundreds of thousands of nurses, custodians, and food service workers)
            or Agriculture (with field workers and inspectors) — pull averages down. These workers aren&apos;t
            underpaid by private sector standards, but they&apos;re a world apart from the DC policy shops.
          </p>
        </Section>
      </div>

      {/* 4. Top Occupations */}
      <div id="top-occupations">
        <Section emoji="💰" title="Highest-Paid Federal Occupations">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Federal doctors lead the pack at <strong>{formatSalary(topPaidOccupations[0]?.avgSalary)}</strong> average.
            But look past the medical professionals and you find patent attorneys, program managers, and
            administrative law judges all clearing $200K. These are the roles where federal pay genuinely
            competes with — or exceeds — private sector equivalents.
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Occupation</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Avg Salary</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Employees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topPaidOccupations.map((o, i) => (
                  <tr key={o.code} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Link href={`/occupations/${o.code}`} className="text-accent hover:underline font-medium">
                        {o.name}
                      </Link>
                      <span className="text-gray-400 text-xs ml-2">({o.code})</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{formatSalary(o.avgSalary)}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{formatNumber(o.employees)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PullQuote
            text="33,816 federal Medical Officers average $297K. Meanwhile, VA nurses — who actually deliver patient care daily — average far less. The federal pay hierarchy doesn't always match who contributes the most value."
          />
        </Section>
      </div>

      {/* 5. Distribution */}
      <div id="distribution">
        <Section emoji="📈" title="Salary Distribution">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Where does the typical federal employee land? The distribution is surprisingly top-heavy.
            The largest single bracket is <strong>$50K–$75K</strong>, but when you add up everyone earning
            over $100K, they represent a majority of the workforce.
          </p>

          <div className="space-y-3 mb-8">
            {distribution.map((d) => {
              const pct = (d.employees / totalEmployees) * 100;
              return (
                <div key={d.bracket} className="flex items-center gap-4">
                  <span className="w-32 text-sm text-gray-600 text-right shrink-0">{d.bracket}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-accent h-full rounded-full flex items-center justify-end pr-3"
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    >
                      {pct > 8 && (
                        <span className="text-white text-xs font-semibold">{formatNumber(d.employees)}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 w-16 text-right">{pct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-red-900 mb-2">📌 The Under-$30K Mystery</h4>
            <p className="text-red-800 text-sm leading-relaxed">
              Only {formatNumber(distribution.find(d => d.bracket === "Under $30K")?.employees ?? 0)} federal
              employees earn under $30K. These are predominantly part-time workers, seasonal employees, and
              interns. The federal minimum for a full-time GS-1 Step 1 with locality pay exceeds $30K in
              every metro area.
            </p>
          </div>
        </Section>
      </div>

      {/* 6. Six Figures */}
      <div id="six-figures">
        <Section emoji="💎" title="The Six-Figure Club">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            <strong>{formatNumber(sixFigureCount)}</strong> federal employees earn $100,000 or more per year —
            that&apos;s <strong>{((sixFigureCount / totalEmployees) * 100).toFixed(0)}%</strong> of the civilian
            workforce. And {formatNumber(distribution.find(d => d.bracket === "$200K+")?.employees ?? 0)} earn
            over $200K.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="$100K-$125K" value={formatNumber(distribution.find(d => d.bracket === "$100K-$125K")?.employees ?? 0)} />
            <StatCard label="$125K-$150K" value={formatNumber(distribution.find(d => d.bracket === "$125K-$150K")?.employees ?? 0)} />
            <StatCard label="$150K-$200K" value={formatNumber(distribution.find(d => d.bracket === "$150K-$200K")?.employees ?? 0)} />
            <StatCard label="$200K+" value={formatNumber(distribution.find(d => d.bracket === "$200K+")?.employees ?? 0)} />
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            In the DC metro area, six-figure federal salaries are the norm, not the exception. With ~33%
            locality pay on top of base salary, a GS-13 Step 5 in Washington earns about $130K before
            benefits. Add in the pension, TSP match, and health insurance, and total compensation for a
            mid-career DC bureaucrat easily exceeds $170K.
          </p>

          <PullQuote
            text="One in every five federal employees now earns over $150,000. That's not just doctors and lawyers — it includes program analysts, HR specialists, and 'management analysts' whose private-sector equivalents earn half as much."
          />
        </Section>
      </div>

      {/* 7. Editorial */}
      <div id="editorial">
        <Section emoji="⚖️" title="The Accountability Question">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Federal pay isn&apos;t inherently too high or too low — it&apos;s misallocated. The system overpays
            for administrative and clerical work that the private sector handles more efficiently, while
            failing to attract top talent in cybersecurity, AI, and data science where private sector
            salaries are 2-3x higher.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">Key Questions Taxpayers Should Ask:</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-2">
                <span className="text-accent font-bold">→</span>
                <span>Why do {formatNumber(distribution.find(d => d.bracket === "$200K+")?.employees ?? 0)} federal employees earn $200K+ when
                  most are in non-technical administrative roles?</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">→</span>
                <span>Why are step increases automatic instead of performance-based?</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">→</span>
                <span>Why do financial regulators get to set their own pay scales outside the GS system?</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">→</span>
                <span>If federal pay is &quot;too low to attract talent&quot; (as unions claim), why do federal jobs
                  have 10x more applicants per opening than comparable private sector roles?</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">→</span>
                <span>Should locality pay still add 33% in DC when most of those employees work from home?</span>
              </li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            The data doesn&apos;t support either extreme. Federal workers aren&apos;t all overpaid paper-pushers,
            and they&apos;re not all selfless public servants earning below market. The truth is a rigid system
            that serves neither taxpayers nor talented employees well. Reform should focus on pay-for-performance,
            market-based adjustments for hard-to-fill roles, and transparency about total compensation.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Every dollar in federal salary is a dollar that came from a taxpayer. The question isn&apos;t whether
            to pay federal workers — it&apos;s whether we&apos;re getting value for what we pay.
          </p>
        </Section>
      </div>

      {/* CTA */}
      <div className="bg-accent-50 border border-accent/20 rounded-xl p-8 text-center">
        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Explore the Data Yourself</h3>
        <p className="text-gray-600 mb-6">Look up specific agencies, occupations, and pay grades.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/salaries" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
            Salary Data →
          </Link>
          <Link href="/salary-explorer" className="border border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent/5 transition-colors">
            Salary Explorer
          </Link>
          <Link href="/agencies" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Browse Agencies
          </Link>
        </div>
      </div>
    </div>
  );
}
