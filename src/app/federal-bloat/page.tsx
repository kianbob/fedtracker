import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { formatNumber, fixAgencyName } from "@/lib/format";
import agencyBudgets from "../../../public/data/agency-budgets.json";

export const metadata: Metadata = {
  title: "Is the Federal Workforce Too Big? — FedTracker",
  description:
    "The federal workforce is smaller than in 1960, but spending per employee has exploded. The real bloat isn't headcount — it's the shadow contractor workforce and runaway budgets.",
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

const topByBudgetPerEmployee = [...agencyBudgets]
  .filter((a) => a.employees > 1000 && a.budgetPerEmployee > 0)
  .sort((a, b) => b.budgetPerEmployee - a.budgetPerEmployee)
  .slice(0, 8);

const totalEmployees = agencyBudgets.reduce((s, a) => s + a.employees, 0);
const totalBudget = agencyBudgets.reduce((s, a) => s + a.budgetAuthority, 0);
const totalContracts = agencyBudgets.reduce(
  (s, a) => s + Math.max(0, a.contracts),
  0
);

export default function FederalBloatPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-indigo-400">Home</Link>
        <span>/</span>
        <span>Analysis</span>
        <span>/</span>
        <span className="text-slate-300">Federal Bloat</span>
      </nav>
      <header className="mb-16">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">
          FedTracker Editorial
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Is the Federal Workforce Too Big?
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          The federal civilian workforce has{" "}
          <strong>shrunk relative to the population</strong> for 60 years. But
          spending per employee has exploded, and the real workforce &mdash;
          including contractors &mdash; is far larger than the headcount
          suggests.
        </p>
        <div className="flex gap-4 mt-6 text-sm text-gray-500">
          <span>Data: OPM FedScope Dec 2025</span>
          <span>&middot;</span>
          <span>Budget: USASpending.gov FY2025</span>
        </div>
      </header>

      {/* TOC */}
      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-16">
        <h3 className="font-semibold text-gray-900 mb-3">In This Analysis</h3>
        <ol className="space-y-2 text-gray-700">
          <li>
            <a href="#headcount" className="hover:text-accent">
              1. The Headcount Myth
            </a>
          </li>
          <li>
            <a href="#spending" className="hover:text-accent">
              2. Spending Per Employee
            </a>
          </li>
          <li>
            <a href="#shadow" className="hover:text-accent">
              3. The Shadow Workforce
            </a>
          </li>
          <li>
            <a href="#agency-size" className="hover:text-accent">
              4. Agency Staffing: Who&apos;s Actually Big?
            </a>
          </li>
          <li>
            <a href="#editorial" className="hover:text-accent">
              5. The Real Question
            </a>
          </li>
        </ol>
      </nav>

      {/* 1 */}
      <div id="headcount">
        <Section emoji="📉" title="The Headcount Myth">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The federal civilian workforce peaked at <strong>3.1 million</strong>{" "}
            in 1990. In 1960, it was 2.4 million. Today, it stands at roughly{" "}
            <strong>2.07 million</strong>. Meanwhile, the U.S. population grew
            from 180 million to 340 million and the economy expanded 25x.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="1960" value="2.4M" sub="4.3% of workforce" />
            <StatCard label="1990 Peak" value="3.1M" sub="2.5% of workforce" />
            <StatCard label="2025" value="2.07M" sub="1.3% of workforce" />
            <StatCard label="60-Year Change" value="-70%" sub="As share of labor force" />
          </div>

          <PullQuote text="As a share of the total U.S. workforce, the federal government is a third the size it was in 1960. The 'bloated bureaucracy' narrative doesn't survive contact with the data." />

          <p className="text-gray-700 leading-relaxed mb-4">
            The federal workforce hasn&apos;t kept pace with population or
            economic growth. Whether that&apos;s a sign of efficiency or
            under-investment depends on your priors. But the raw headcount
            argument &mdash; &quot;too many bureaucrats&quot; &mdash; doesn&apos;t hold up.
          </p>
        </Section>
      </div>

      {/* 2 */}
      <div id="spending">
        <Section emoji="💸" title="Spending Per Employee">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Here&apos;s where the story changes. While headcount shrank, total
            federal spending <strong>exploded</strong>. The{" "}
            {formatNumber(totalEmployees)} civilian employees in our dataset
            administer roughly{" "}
            <strong>${(totalBudget / 1e12).toFixed(1)} trillion</strong> in
            budget authority. That&apos;s a staggering amount of spending per
            person.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard
              label="Total Budget Authority"
              value={`$${(totalBudget / 1e12).toFixed(1)}T`}
              sub="FY2025, agencies in dataset"
            />
            <StatCard
              label="Avg Budget per Employee"
              value={`$${(totalBudget / totalEmployees / 1e6).toFixed(1)}M`}
              sub="Budget authority per civilian"
            />
            <StatCard
              label="Federal Contracts"
              value={`$${(totalContracts / 1e9).toFixed(0)}B`}
              sub="Contract spending alone"
            />
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            Some agencies channel enormous budgets through tiny workforces. Here
            are the agencies with the highest budget authority per employee:
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-6">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Agency
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Employees
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Budget/Employee
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topByBudgetPerEmployee.map((a) => (
                  <tr key={a.opmCode} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <Link
                        href={`/agencies/${a.opmCode}`}
                        className="text-accent hover:underline"
                      >
                        {fixAgencyName(a.name)}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-gray-700">
                      {formatNumber(a.employees)}
                    </td>
                    <td className="px-3 py-3 font-semibold text-gray-900">
                      ${(a.budgetPerEmployee / 1e6).toFixed(1)}M
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PullQuote text="The Treasury Department channels $41M in budget authority per employee. Whether fewer people managing more money is a feature or a bug depends entirely on whether oversight keeps up." />
        </Section>
      </div>

      {/* 3 */}
      <div id="shadow">
        <Section emoji="👻" title="The Shadow Workforce">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The 2.07 million federal employees are only part of the story.
            Estimates of the federal <strong>contractor workforce</strong> range
            from 4 to 9 million, depending on how you count. For every federal
            employee, there are 3&ndash;4 people doing government work on
            contract.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <StatCard
              label="Federal Employees"
              value="2.07M"
              sub="Direct civilian workforce"
            />
            <StatCard
              label="Est. Contractors"
              value="5-9M"
              sub="The shadow workforce"
            />
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            The contractor workforce grew precisely{" "}
            <em>because</em> of headcount caps. Politicians could claim a
            &quot;lean&quot; government while spending far more on contractors
            who are harder to track, less accountable, and often more expensive
            than federal employees doing the same work.
          </p>

          <PullQuote text="Cutting federal employees without cutting the work doesn't shrink government. It just moves the payroll to contractors who cost more and answer to shareholders, not taxpayers." />

          <p className="text-gray-700 leading-relaxed">
            In our dataset, federal agencies spent{" "}
            <strong>${(totalContracts / 1e9).toFixed(0)} billion</strong> on
            contracts alone. The Department of Defense leads with $491B in
            contract obligations &mdash;{" "}
            <Link
              href="/spending"
              className="text-accent font-semibold hover:underline"
            >
              see the spending breakdown
            </Link>
            .
          </p>
        </Section>
      </div>

      {/* 4 */}
      <div id="agency-size">
        <Section emoji="🏛️" title="Agency Staffing: Who's Actually Big?">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The federal workforce isn&apos;t evenly distributed. A handful of
            agencies account for the vast majority of employees. The Department
            of Veterans Affairs alone has{" "}
            <strong>451,121 employees</strong> &mdash; mostly doctors, nurses,
            and support staff caring for 18 million veterans. The
            military-affiliated civilian workforce (Army, Navy, Air Force, DoD)
            adds another <strong>707,000+</strong>.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard label="VA" value="451K" sub="Healthcare for veterans" />
            <StatCard label="DOD + Military Depts" value="707K" sub="Civilian defense workforce" />
            <StatCard label="DHS" value="228K" sub="Border, TSA, FEMA, Coast Guard" />
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            Together, these mission-critical agencies account for roughly
            two-thirds of the federal workforce. The remaining third includes
            everything from the IRS to the National Park Service to NASA.
            Agencies like the Department of Education (2,453 employees) and the
            EPA (14,661) are tiny by comparison.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Explore the full landscape on the{" "}
            <Link
              href="/agencies"
              className="text-accent font-semibold hover:underline"
            >
              agencies dashboard
            </Link>{" "}
            or see how the DOGE restructuring reshaped each agency on the{" "}
            <Link
              href="/doge"
              className="text-accent font-semibold hover:underline"
            >
              DOGE Impact page
            </Link>
            .
          </p>
        </Section>
      </div>

      {/* 5 */}
      <div id="editorial">
        <Section emoji="⚖️" title="The Real Question">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The debate over federal workforce size has been stuck in a false
            binary for decades. &quot;Too many bureaucrats&quot; vs.
            &quot;essential public servants.&quot; The data tells a more
            complicated story.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            The headcount isn&apos;t the problem. Federal civilian employment is
            at a 60-year low relative to the workforce. The real problems are:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-2">
            <li>
              <strong>Spending per employee</strong> has grown far faster than
              the workforce, with less oversight per dollar.
            </li>
            <li>
              <strong>The contractor workforce</strong> is 3&ndash;4x the
              civilian headcount and far harder to audit.
            </li>
            <li>
              <strong>Performance management</strong> barely exists &mdash;
              firing underperformers is nearly impossible, so dead weight
              accumulates.
            </li>
            <li>
              <strong>Mission creep</strong> means agencies take on new
              functions without shedding old ones.
            </li>
          </ul>

          <PullQuote text="DOGE's approach of cutting positions is a blunt instrument. But the alternative &mdash; doing nothing &mdash; has failed for 40 years. The real question isn't headcount, it's whether each position creates value." />

          <p className="text-gray-700 leading-relaxed">
            The data is clear: across-the-board cuts hit essential services (
            <Link
              href="/trends"
              className="text-accent font-semibold hover:underline"
            >
              workforce trends
            </Link>
            ) just as hard as bloated bureaucracies. Surgical reform beats
            indiscriminate slashing &mdash; but it also requires the political
            will to make specific, defensible choices. Explore the{" "}
            <Link
              href="/doge"
              className="text-accent font-semibold hover:underline"
            >
              DOGE impact
            </Link>{" "}
            and{" "}
            <Link
              href="/spending"
              className="text-accent font-semibold hover:underline"
            >
              spending data
            </Link>{" "}
            to draw your own conclusions.
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
              href: "/agencies",
              title: "Agency Dashboard",
              desc: "Explore every federal agency — headcount, salary, demographics, and subagency breakdowns.",
            },
            {
              href: "/trends",
              title: "Workforce Trends",
              desc: "Month-by-month accession and separation data showing how the workforce is changing.",
            },
            {
              href: "/doge",
              title: "DOGE Impact Tracker",
              desc: "How the DOGE restructuring reshaped federal agencies — RIFs, early retirements, and net losses.",
            },
            {
              href: "/spending",
              title: "Federal Spending",
              desc: "Budget authority, contract spending, and cost per employee across all agencies.",
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
            snapshot). Budget data from <strong>USASpending.gov</strong> (FY2025
            budget authority). Historical headcount and workforce-share figures
            from the Congressional Research Service and Bureau of Labor
            Statistics. Contractor estimates from the Brookings Institution and
            the Project on Government Oversight (POGO).
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
