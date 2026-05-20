import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { formatNumber, formatSalary } from "@/lib/format";

export const metadata: Metadata = {
  title: "DOGE Federal Workforce Cuts Tracker",
  description:
    "Comprehensive tracker of federal workforce reductions under DOGE. 280K+ separations, $4.5B in DRP payments, $764M in RIF severance, agency-by-agency breakdown, and timeline of major actions.",
  alternates: { canonical: "/cuts" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "DOGE & Cuts: Federal Workforce Reductions Tracker",
  description:
    "Comprehensive tracker of federal workforce reductions. 280K+ separations, agency breakdowns, DRP costs, and timeline of major DOGE actions.",
  author: { "@type": "Organization", name: "OpenFeds" },
  publisher: {
    "@type": "Organization",
    name: "OpenFeds",
    logo: { "@type": "ImageObject", url: "https://openfeds.com/logo.png" },
  },
  datePublished: "2026-04-21",
  dateModified: "2026-04-21",
};

/* ── inline data (sourced from OPM, Partnership for Public Service, Federal News Network, Wikipedia) ── */

const topStats = {
  totalSeparations: 280000,
  drpAccepted: 76000,
  drpCost: 4_500_000_000,
  rifSeverance: 763_900_000,
  contractsCancelled: 13440,
  contractSavingsClaimed: 61_000_000_000,
  grantsCancelled: 15887,
  septemberExodus: 125589,
  workforceReduction: 0.09,
  agenciesAffected: 27,
};

const agencyBreakdown = [
  { agency: "Health & Human Services (HHS)", cuts: 28200, pctCut: 33, method: "RIF, DRP" },
  { agency: "IRS / Treasury", cuts: 25000, pctCut: 28, method: "RIF, attrition" },
  { agency: "USAID", cuts: 8500, pctCut: 85, method: "Full shutdown" },
  { agency: "Dept. of Education", cuts: 7200, pctCut: 50, method: "RIF, DRP" },
  { agency: "EPA", cuts: 6500, pctCut: 39, method: "RIF, DRP" },
  { agency: "General Services Administration", cuts: 5700, pctCut: 48, method: "RIF" },
  { agency: "Veterans Affairs", cuts: 5200, pctCut: 1.2, method: "Targeted RIF" },
  { agency: "Consumer Financial Protection Bureau", cuts: 1200, pctCut: 60, method: "Near shutdown" },
  { agency: "Office of Personnel Management", cuts: 850, pctCut: 30, method: "RIF" },
  { agency: "Small Business Administration", cuts: 3600, pctCut: 40, method: "RIF, DRP" },
  { agency: "Dept. of Energy", cuts: 4100, pctCut: 27, method: "RIF, DRP" },
  { agency: "Social Security Administration", cuts: 3800, pctCut: 6, method: "Attrition, hiring freeze" },
];

const timeline = [
  { date: "Jan 20, 2025", event: "DOGE established via executive order on Inauguration Day", category: "policy" },
  { date: "Jan 28, 2025", event: "Government-wide hiring freeze issued", category: "policy" },
  { date: "Feb 4, 2025", event: "Deferred Resignation Program (DRP) 'Fork in the Road' email sent to ~2M federal workers", category: "drp" },
  { date: "Feb 6, 2025", event: "Federal judge temporarily blocks DRP deadline; extended to Feb 12", category: "legal" },
  { date: "Feb 12, 2025", event: "DRP deadline passes — ~76,000 employees accept buyout", category: "drp" },
  { date: "Mar 2025", event: "First wave of RIFs (Reductions in Force) begin at USAID, HHS, Education", category: "rif" },
  { date: "Apr 2025", event: "Mass probationary employee firings across agencies; courts order some reinstated", category: "rif" },
  { date: "May 2025", event: "IRS begins post-tax-season layoffs of 25,000 employees", category: "rif" },
  { date: "Jun–Jul 2025", event: "DOGE contract cancellation blitz — $61B in contracts terminated", category: "contracts" },
  { date: "Aug 2025", event: "Grant cancellations accelerate — 15,887 grants worth $49B terminated", category: "contracts" },
  { date: "Sep 30, 2025", event: "'Black September' — 125,589 separations as DRP admin leave expires and fiscal year ends", category: "drp" },
  { date: "Oct 2025", event: "Some agencies begin rehiring; NPR reports DOGE cuts being partially reversed", category: "reversal" },
  { date: "Dec 2025", event: "OPM issues second-round DRP/VERA guidance for FY2026", category: "policy" },
  { date: "Jan 2026", event: "Federal News Network reports cumulative RIF severance costs reach $764M", category: "cost" },
  { date: "Mar 2026", event: "By March 2026, 9% of the total federal workforce has been eliminated", category: "milestone" },
  { date: "Apr 2026", event: "Partnership for Public Service estimates DRP payments totaled $4.5B", category: "cost" },
];

const costComparison = {
  claimed: { label: "DOGE Claimed Savings", amount: 110_300_000_000 },
  drpCost: { label: "DRP Payments (Admin Leave)", amount: 4_500_000_000 },
  rifSeverance: { label: "RIF Severance Payments", amount: 763_900_000 },
  rehiringCosts: { label: "Est. Rehiring & Retraining", amount: 1_200_000_000 },
  legalCosts: { label: "Est. Litigation Costs", amount: 350_000_000 },
  totalCosts: { label: "Total Transition Costs", amount: 6_813_900_000 },
  verifiedSavings: { label: "Verified Recurring Savings (est.)", amount: 5_500_000_000 },
};

function SectionHeading({ emoji, title, id }: { emoji: string; title: string; id?: string }) {
  return (
    <h2 id={id} className="font-serif text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 scroll-mt-8">
      <span className="mr-3">{emoji}</span>
      {title}
    </h2>
  );
}

function BigStat({ value, label, sub, color = "indigo" }: { value: string; label: string; sub?: string; color?: string }) {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-900",
    red: "bg-red-50 border-red-200 text-red-900",
    green: "bg-green-50 border-green-200 text-green-900",
    amber: "bg-amber-50 border-amber-200 text-amber-900",
    purple: "bg-purple-50 border-purple-200 text-purple-900",
    blue: "bg-blue-50 border-blue-200 text-blue-900",
  };
  return (
    <div className={`border rounded-xl p-6 text-center ${colors[color] ?? colors.indigo}`}>
      <div className="text-3xl sm:text-4xl font-bold font-mono">{value}</div>
      <div className="font-medium mt-1">{label}</div>
      {sub && <div className="text-sm opacity-70 mt-1">{sub}</div>}
    </div>
  );
}

const categoryColors: Record<string, string> = {
  policy: "bg-blue-100 text-blue-800",
  drp: "bg-purple-100 text-purple-800",
  rif: "bg-red-100 text-red-800",
  legal: "bg-amber-100 text-amber-800",
  contracts: "bg-green-100 text-green-800",
  reversal: "bg-teal-100 text-teal-800",
  cost: "bg-orange-100 text-orange-800",
  milestone: "bg-indigo-100 text-indigo-800",
};

export default function CutsPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <Breadcrumb items={[{ label: "DOGE & Cuts" }]} />

        {/* Header */}
        <header className="mb-12">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">OpenFeds Tracker</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
            ⚠️ DOGE & Cuts: The Full Picture
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
            <strong>{formatNumber(topStats.totalSeparations)}+</strong> federal positions eliminated since January 2025 — the
            largest peacetime federal workforce reduction in American history. Here&apos;s every number, every agency, and every dollar.
          </p>
          <div className="flex gap-4 mt-4 text-sm text-gray-500">
            <span>Sources: OPM, Partnership for Public Service, Federal News Network, FPDS</span>
            <span>·</span>
            <span>Last updated: April 2026</span>
          </div>
        </header>

        {/* TOC */}
        <nav className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-12">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">On This Page</h3>
          <ol className="space-y-2 text-gray-700 dark:text-gray-300">
            <li><a href="#overview" className="hover:text-indigo-600">1. Overview — By the Numbers</a></li>
            <li><a href="#drp" className="hover:text-indigo-600">2. Deferred Resignation Program (DRP)</a></li>
            <li><a href="#rif" className="hover:text-indigo-600">3. RIF Severance Costs</a></li>
            <li><a href="#agencies" className="hover:text-indigo-600">4. Agency-by-Agency Breakdown</a></li>
            <li><a href="#contracts" className="hover:text-indigo-600">5. Contract & Grant Cancellations</a></li>
            <li><a href="#timeline" className="hover:text-indigo-600">6. Timeline of Major DOGE Actions</a></li>
            <li><a href="#september" className="hover:text-indigo-600">7. The September 2025 Cliff</a></li>
            <li><a href="#costs-vs-savings" className="hover:text-indigo-600">8. Costs vs. Savings — The Real Math</a></li>
            <li><a href="#explore" className="hover:text-indigo-600">9. Explore the Data</a></li>
          </ol>
        </nav>

        {/* 1. Overview */}
        <section className="mb-16">
          <SectionHeading emoji="📊" title="By the Numbers" id="overview" />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <BigStat value="280K+" label="Positions Eliminated" sub="Jan 2025 – Mar 2026" color="red" />
            <BigStat value="9%" label="Workforce Reduction" sub="2.4M → ~2.18M civilian employees" color="red" />
            <BigStat value="76K" label="DRP Buyouts Accepted" sub="'Fork in the Road' email" color="purple" />
            <BigStat value="$4.5B" label="DRP Payments" sub="Admin leave through Sep 30" color="amber" />
            <BigStat value="$764M" label="RIF Severance Paid" sub="Jan 2025 – Jan 2026" color="amber" />
            <BigStat value="27" label="Agencies Affected" sub="From USAID to VA" color="indigo" />
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            The scale is unprecedented. For context, the federal government typically sheds 6–8% of its workforce{" "}
            <em>annually</em> through normal attrition. DOGE compressed years of natural turnover into months —
            and then added involuntary separations on top.
          </p>
        </section>

        {/* 2. DRP */}
        <section className="mb-16">
          <SectionHeading emoji="📧" title="Deferred Resignation Program (DRP)" id="drp" />
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            On February 4, 2025, nearly every federal civilian employee received the &ldquo;Fork in the Road&rdquo; email
            offering a deal: resign voluntarily and receive full pay and benefits through September 30, 2025.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <BigStat value="~2M" label="Emails Sent" sub="First-ever mass email to all feds" color="blue" />
            <BigStat value="76,000" label="Accepted" sub="~3.8% acceptance rate" color="purple" />
            <BigStat value="$4.5B" label="Total Cost" sub="Salary + benefits through Sep 30" color="amber" />
          </div>
          <blockquote className="border-l-4 border-indigo-600 pl-6 py-4 my-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-r-xl">
            <p className="text-xl font-serif italic text-gray-900 dark:text-gray-100">
              &ldquo;The government paid $4.5 billion to employees who accepted the DRP — people who were on paid
              administrative leave doing no work for up to eight months.&rdquo;
            </p>
            <cite className="text-sm text-gray-500 mt-2 block not-italic">
              — Partnership for Public Service estimate, April 2026
            </cite>
          </blockquote>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            The DRP was designed to achieve voluntary attrition without costly RIF procedures. Whether paying 76,000
            employees to do nothing for eight months counts as &ldquo;efficiency&rdquo; depends on your perspective —
            but the $4.5 billion price tag is real, and it offsets a significant chunk of any claimed savings.
          </p>
          <div className="mt-4">
            <Link href="/analysis/drp-true-cost" className="text-indigo-600 hover:underline font-medium">
              Deep dive: The True Cost of the DRP →
            </Link>
          </div>
        </section>

        {/* 3. RIF Severance */}
        <section className="mb-16">
          <SectionHeading emoji="💸" title="RIF Severance Costs" id="rif" />
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            Employees involuntarily separated through Reductions in Force are entitled to severance pay under
            federal law. Between January 2025 and January 2026, the government paid an estimated{" "}
            <strong>$763.9 million</strong> in RIF-related severance.
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-red-900 dark:text-red-200 text-lg mb-3">How Federal Severance Works</h3>
            <ul className="space-y-2 text-red-800 dark:text-red-300">
              <li>• <strong>Basic:</strong> 1 week of pay per year of service (first 10 years)</li>
              <li>• <strong>Extended:</strong> 2 weeks of pay per year beyond 10 years</li>
              <li>• <strong>Age bonus:</strong> 10% increase for each year over age 40</li>
              <li>• <strong>Cap:</strong> Maximum 1 year of salary</li>
              <li>• DRP participants who voluntarily resigned are <em>not</em> eligible for severance</li>
            </ul>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Most DOGE-driven layoffs did <em>not</em> include severance — many employees were fired as
            probationary workers or pressured to resign. The $764M figure represents those who went through
            formal RIF proceedings and had legal entitlement.
          </p>
        </section>

        {/* 4. Agency Breakdown */}
        <section className="mb-16">
          <SectionHeading emoji="🏛️" title="Agency-by-Agency Breakdown" id="agencies" />
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            Not all agencies were cut equally. USAID was effectively shut down (85% reduction), while the VA —
            the largest civilian employer — saw targeted trims of just over 1%.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Agency</th>
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">Est. Cuts</th>
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">% Cut</th>
                  <th className="py-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Method</th>
                </tr>
              </thead>
              <tbody>
                {agencyBreakdown.map((a) => (
                  <tr key={a.agency} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 pr-4 text-gray-900 dark:text-gray-100 font-medium text-sm">{a.agency}</td>
                    <td className="py-3 pr-4 text-right font-mono text-sm text-gray-700 dark:text-gray-300">
                      {formatNumber(a.cuts)}
                    </td>
                    <td className="py-3 pr-4 text-right text-sm">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                          a.pctCut >= 40 ? "bg-red-100 text-red-800" : a.pctCut >= 20 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {a.pctCut}%
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{a.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Estimates compiled from OPM FedScope data, AP, Federal News Network, and agency-specific reports. Numbers are approximate
            and continue to change as some employees are reinstated by court order.
          </p>
        </section>

        {/* 5. Contract & Grant Cancellations */}
        <section className="mb-16">
          <SectionHeading emoji="📄" title="Contract & Grant Cancellations" id="contracts" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <BigStat value="13,440" label="Contracts Terminated" sub="Claimed value: $61B" color="green" />
            <BigStat value="15,887" label="Grants Terminated" sub="Claimed value: $49B" color="green" />
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
            DOGE claims <strong>$110.3 billion</strong> in total savings from terminated contracts, grants, and leases.
            Independent analysis tells a different story — the &ldquo;savings&rdquo; figure represents the <em>ceiling value</em>
            of agreements, not actual money that would have been spent.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-2">⚠️ Important Context</h3>
            <ul className="space-y-1 text-amber-800 dark:text-amber-300 text-sm">
              <li>• Over 8,000 cancelled contracts were worth less than $100K each — more theater than savings</li>
              <li>• Many cancelled contracts are being replaced with new ones at similar cost</li>
              <li>• Contract termination penalties can offset a portion of &ldquo;savings&rdquo;</li>
              <li>• FPDS posting of termination notices can lag up to 1 month</li>
            </ul>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/analysis/doge-savings-reality" className="text-indigo-600 hover:underline font-medium text-sm">
              Deep dive: The $110B Myth →
            </Link>
            <Link href="/analysis/small-contracts-theater" className="text-indigo-600 hover:underline font-medium text-sm">
              Analysis: Small Contract Theater →
            </Link>
            <Link href="/analysis/contract-vendor-network" className="text-indigo-600 hover:underline font-medium text-sm">
              Follow the Money: Who Lost $61B →
            </Link>
          </div>
        </section>

        {/* 6. Timeline */}
        <section className="mb-16">
          <SectionHeading emoji="📅" title="Timeline of Major DOGE Actions" id="timeline" />
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-6">
              {timeline.map((item, i) => (
                <div key={i} className="relative pl-12">
                  <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white dark:border-gray-900" />
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold text-gray-900 dark:text-gray-100">{item.date}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[item.category] ?? "bg-gray-100 text-gray-800"}`}>
                      {item.category}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{item.event}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. September Cliff */}
        <section className="mb-16">
          <SectionHeading emoji="🗓️" title="The September 2025 Cliff" id="september" />
          <BigStat value="125,589" label="Separations in One Month" sub="September 2025 — more than any month in modern history" color="red" />
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mt-6 mb-4">
            September 30, 2025 was the perfect storm. Three forces converged on a single date:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-5">
              <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-2">DRP Expiration</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                76,000 employees on paid administrative leave hit their end date. No more paychecks.
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
              <h4 className="font-bold text-red-900 dark:text-red-200 mb-2">Fiscal Year End</h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                Agencies rushed to complete RIFs before FY2025 closed. Use-it-or-lose-it budget pressure.
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
              <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-2">Retirement Wave</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Demoralized senior employees timed retirements to the fiscal year boundary.
              </p>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            The result: more federal workers left in September 2025 than in any single month in modern history.
            It was three times the monthly average and overwhelmed HR offices, exit-processing systems, and
            unemployment offices in the DC metro area.
          </p>
          <div className="mt-4">
            <Link href="/analysis/the-great-resignation-september" className="text-indigo-600 hover:underline font-medium">
              Full analysis: Black September →
            </Link>
          </div>
        </section>

        {/* 8. Costs vs Savings */}
        <section className="mb-16">
          <SectionHeading emoji="⚖️" title="Costs vs. Savings — The Real Math" id="costs-vs-savings" />
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            Restructuring the federal workforce isn&apos;t free. Before declaring victory, you have to subtract the
            transition costs from any savings.
          </p>

          <div className="space-y-3 mb-8">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">💰 The Costs</h3>
            {[costComparison.drpCost, costComparison.rifSeverance, costComparison.rehiringCosts, costComparison.legalCosts].map(
              (item) => (
                <div key={item.label} className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg px-4 py-3">
                  <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                  <span className="font-mono font-bold text-red-800 dark:text-red-300">
                    ${(item.amount / 1e9).toFixed(1)}B
                  </span>
                </div>
              )
            )}
            <div className="flex justify-between items-center bg-red-100 dark:bg-red-900/40 border-2 border-red-300 dark:border-red-700 rounded-lg px-4 py-3 font-bold">
              <span className="text-gray-900 dark:text-gray-100">{costComparison.totalCosts.label}</span>
              <span className="font-mono text-red-900 dark:text-red-200">
                ${(costComparison.totalCosts.amount / 1e9).toFixed(1)}B
              </span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">📈 The Savings</h3>
            <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg px-4 py-3">
              <span className="text-gray-700 dark:text-gray-300">DOGE Claimed: Total Savings</span>
              <span className="font-mono font-bold text-green-800 dark:text-green-300">$110.3B</span>
            </div>
            <div className="flex justify-between items-center bg-green-100 dark:bg-green-900/40 border-2 border-green-300 dark:border-green-700 rounded-lg px-4 py-3 font-bold">
              <span className="text-gray-900 dark:text-gray-100">{costComparison.verifiedSavings.label}</span>
              <span className="font-mono text-green-900 dark:text-green-200">
                ${(costComparison.verifiedSavings.amount / 1e9).toFixed(1)}B
              </span>
            </div>
          </div>

          <blockquote className="border-l-4 border-amber-500 pl-6 py-4 my-8 bg-amber-50 dark:bg-amber-900/20 rounded-r-xl">
            <p className="text-lg text-gray-900 dark:text-gray-100">
              <strong>Net first-year impact:</strong> After subtracting $6.8B in transition costs from ~$5.5B in verified
              recurring savings, the federal workforce restructuring likely <em>cost money</em> in Year 1. Recurring
              savings should turn positive in Year 2+ — but only if agencies don&apos;t rehire to fill critical gaps.
            </p>
          </blockquote>
          <div className="mt-4">
            <Link href="/analysis/doge-cost-vs-savings" className="text-indigo-600 hover:underline font-medium">
              Full analysis: Cost vs. Savings Deep Dive →
            </Link>
          </div>
        </section>

        {/* 9. Explore */}
        <section className="mb-16">
          <SectionHeading emoji="🔍" title="Explore the Data" id="explore" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: "/doge", title: "DOGE Impact Dashboard", desc: "Real-time workforce reduction tracker" },
              { href: "/layoffs", title: "Separations Data", desc: "All types of federal departures" },
              { href: "/timeline", title: "Monthly Timeline", desc: "Month-by-month workforce changes" },
              { href: "/who-got-cut", title: "Who Got Cut", desc: "Detailed reduction breakdown" },
              { href: "/impact", title: "State Impact", desc: "Geographic effects of cuts" },
              { href: "/risk", title: "Risk Scores", desc: "Which agencies are most vulnerable" },
              { href: "/analysis/doge-savings-reality", title: "The $110B Myth", desc: "What DOGE actually saved" },
              { href: "/analysis/the-great-resignation-september", title: "Black September", desc: "125K left in one month" },
              { href: "/analysis/drp-true-cost", title: "DRP True Cost", desc: "$4.5B in admin leave payments" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group block p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
