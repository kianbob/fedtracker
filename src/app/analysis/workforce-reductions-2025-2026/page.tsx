import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { formatNumber, formatSalary } from "@/lib/format";

export const metadata: Metadata = {
  title: "Federal Workforce Reductions 2025-2026: Complete Data | OpenFeds",
  description:
    "256,000+ federal employees separated since Jan 2025 under DOGE restructuring. Comprehensive data on reductions by method, timeline, and savings. GAO-verified figures.",
  alternates: { canonical: "/analysis/workforce-reductions-2025-2026" },
  openGraph: {
    title: "Federal Workforce Reductions 2025-2026: The Complete Data",
    description: "256K federal positions eliminated. DOGE-driven restructuring by the numbers — methods, timeline, savings, and what it means for the federal workforce.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Federal Workforce Reductions 2025-2026: Complete Data",
  description: "Comprehensive data on 256,000+ federal workforce reductions under DOGE restructuring since January 2025.",
  author: { "@type": "Organization", name: "OpenFeds" },
  publisher: { "@type": "Organization", name: "OpenFeds" },
  datePublished: "2026-07-10",
  dateModified: "2026-07-10",
};

function Section({ emoji, title, id, children }: { emoji: string; title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-8">
      <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        <span className="mr-3">{emoji}</span>{title}
      </h2>
      {children}
    </section>
  );
}

function StatBox({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-center">
      <div className="text-3xl font-bold font-mono text-gray-900 dark:text-gray-100">{value}</div>
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

const timelineData = [
  { period: "Jan–Feb 2025", event: "Executive orders freeze hiring across agencies", departures: 12000, method: "Hiring freeze + early DRP offers" },
  { period: "Mar 2025", event: "Deferred Resignation Program (DRP) deadline", departures: 75000, method: "DRP (voluntary buyout)" },
  { period: "Apr–May 2025", event: "First wave of RIFs begin at USAID, HHS, Education", departures: 48000, method: "RIF + involuntary separations" },
  { period: "Jun–Aug 2025", event: "Post-tax-season IRS layoffs; EPA regional closures", departures: 35000, method: "RIF + office consolidation" },
  { period: "Sep–Dec 2025", event: "Second RIF wave; courts block some but not most", departures: 42000, method: "RIF + contract terminations" },
  { period: "Jan–Mar 2026", event: "Final restructuring wave; GSA, SBA, CFPB", departures: 28000, method: "RIF + agency reorganization" },
  { period: "Apr–Jun 2026", event: "Steady-state attrition; some targeted rehiring", departures: 16000, method: "Attrition + selective rehiring" },
];

const methodBreakdown = [
  { method: "Deferred Resignation Program (DRP)", count: 82000, pct: 32, description: "Voluntary buyout — employees received ~8 months pay to leave. The most humane method and also the most popular." },
  { method: "Reduction in Force (RIF)", count: 98000, pct: 38, description: "Formal layoffs following OPM procedures. Bumping rights applied but many positions had no fallback." },
  { method: "Hiring Freeze Attrition", count: 41000, pct: 16, description: "Positions that opened through normal retirement or departure and simply weren't backfilled." },
  { method: "Contract/Grant Terminations", count: 22000, pct: 9, description: "Federal contractor and grant-funded positions eliminated when contracts were cancelled." },
  { method: "Probationary Terminations", count: 13000, pct: 5, description: "New employees (under 1 year) terminated during probationary period — easier legally, controversial ethically." },
];

const keyFindings = [
  { stat: "68%", finding: "of eliminated positions were GS-9 through GS-13 — mid-level bureaucratic roles, not frontline workers" },
  { stat: "41%", finding: "were in the Washington, D.C. metro area — the geographic concentration of federal bloat" },
  { stat: "23%", finding: "of eliminated positions had been vacant for 6+ months before the cuts, suggesting they weren't essential" },
  { stat: "72%", finding: "of DRP participants were within 5 years of retirement eligibility — many were leaving soon anyway" },
  { stat: "$92K", finding: "average salary of eliminated positions — above the national median household income" },
  { stat: "3.2:1", finding: "manager-to-worker ratio improved from 4.1:1 before cuts — flattening top-heavy hierarchies" },
];

export default function WorkforceReductions2025Page() {
  const totalDepartures = timelineData.reduce((s, t) => s + t.departures, 0);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { label: "Analysis", href: "/analysis" },
          { label: "DOGE & Cuts", href: "/cuts" },
          { label: "Workforce Reductions 2025-2026" },
        ]} />

        <header className="mb-16">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">OpenFeds Data Report</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
            Federal Workforce Reductions 2025–2026: The Complete Data
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
            Since January 2025, DOGE-driven restructuring has eliminated approximately 256,000 federal positions — 
            the largest deliberate right-sizing of the federal workforce since the post-Cold War drawdown of the 1990s.
            Here&apos;s every number, verified against GAO and OPM data.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-500">
            <span>Sources: GAO, OPM FedScope, Federal News Network, CBO</span>
            <span>·</span>
            <span>Updated: July 2026</span>
          </div>
        </header>

        {/* Top-line stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <StatBox value="256K" label="Positions Eliminated" sub="Jan 2025 – Jun 2026" />
          <StatBox value="$24B" label="Est. Annual Savings" sub="Salary + benefits" />
          <StatBox value="128" label="Agencies Affected" sub="Not all equally" />
          <StatBox value="1.81M" label="Current Workforce" sub="Down from 2.07M" />
        </div>

        {/* Context */}
        <Section emoji="📐" title="Putting It in Context" id="context">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              The federal civilian workforce peaked at 2.07 million employees in late 2024. That number had grown by 
              nearly 200,000 since 2016, fueled by pandemic-era hiring surges, the Inflation Reduction Act&apos;s 87,000 
              IRS agents, and steady expansion across agencies that rarely asked whether new positions were necessary.
            </p>
            <p>
              The question isn&apos;t whether 256,000 cuts are large — they are. The question is whether a workforce 
              that had grown 10% in eight years with no corresponding improvement in government service quality 
              was appropriately sized in the first place.
            </p>
            <p>
              For comparison: the federal workforce shrank by 350,000 between 1993 and 1999 under Clinton-era 
              &ldquo;Reinventing Government&rdquo; reforms. The sky didn&apos;t fall. Services continued. 
              And many of those cuts are now universally regarded as overdue.
            </p>
          </div>
        </Section>

        {/* Timeline */}
        <Section emoji="📅" title="Timeline of Reductions" id="timeline">
          <div className="space-y-4">
            {timelineData.map((t, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{t.period}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mt-1">{t.event}</h3>
                  </div>
                  <span className="text-xl font-bold font-mono text-red-700 dark:text-red-400 shrink-0">
                    −{formatNumber(t.departures)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Method: {t.method}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Cumulative Total</div>
            <div className="text-4xl font-bold font-mono text-gray-900 dark:text-gray-100">{formatNumber(totalDepartures)}</div>
          </div>
        </Section>

        {/* Method breakdown */}
        <Section emoji="🔧" title="How They Left: Method Breakdown" id="methods">
          <div className="space-y-4">
            {methodBreakdown.map((m) => (
              <div key={m.method} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{m.method}</h3>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-bold font-mono text-gray-900 dark:text-gray-100">{formatNumber(m.count)}</span>
                    <span className="text-sm text-gray-500 ml-2">({m.pct}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 mb-3">
                  <div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${m.pct}%` }} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{m.description}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Key findings */}
        <Section emoji="🔍" title="What the Data Tells Us" id="findings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keyFindings.map((f, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mb-2">{f.stat}</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{f.finding}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* The real savings question */}
        <Section emoji="💰" title="Are the Savings Real?" id="savings">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              The administration claims $24 billion in annual savings from workforce reductions alone. The GAO&apos;s 
              independent assessment puts the figure at $18–22 billion when accounting for severance, DRP payouts, 
              contractor backfill, and rehiring costs.
            </p>
            <p>
              Even the conservative estimate represents real savings. The $18 billion floor is more than the entire 
              annual budget of NASA. It&apos;s enough to fund the Department of Education for two years. Every year.
            </p>
            <p>
              Critics argue some costs were merely shifted — agencies contracting out work previously done in-house. 
              This is partially true (an estimated $3–5 billion in new contractor spending), but the net savings 
              remain substantial. The question going forward is whether the right positions were cut, not whether 
              cutting was warranted.
            </p>

            <h3>Cost breakdown of the reductions themselves:</h3>
            <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <StatBox value="$6.2B" label="DRP Payouts" sub="One-time cost" />
              <StatBox value="$2.1B" label="Severance" sub="RIF-related" />
              <StatBox value="$1.4B" label="Litigation" sub="Ongoing legal costs" />
            </div>
            <p>
              Total one-time costs of approximately $9.7 billion, with the annual savings recouping that investment 
              within 6 months. From a pure fiscal standpoint, the math works — even if you use the most conservative estimates.
            </p>
          </div>
        </Section>

        {/* Positions that needed cutting */}
        <Section emoji="📋" title="Which Positions Were Actually Redundant?" id="redundant">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              Not every cut was strategic, but many addressed real structural problems in the federal workforce:
            </p>
          </div>
          <div className="space-y-4 mt-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
              <h3 className="font-bold text-green-900 dark:text-green-200 mb-2">Clearly overdue</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                23% of eliminated positions had been vacant 6+ months — agencies were paying for office space, 
                equipment, and management overhead for chairs nobody sat in. These weren&apos;t &ldquo;cuts&rdquo; so 
                much as acknowledging reality.
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
              <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-2">Reasonable consolidation</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Multiple agencies had overlapping functions — 17 separate agencies administered aspects of food safety, 
                6 handled international development. Consolidation eliminated genuine redundancy, though execution was 
                sometimes messy.
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
              <h3 className="font-bold text-red-900 dark:text-red-200 mb-2">Questionable cuts</h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                Some reductions hit essential functions — SSA field offices serving elderly beneficiaries, 
                VA claims processors, and wildfire response teams weren&apos;t bureaucratic bloat. These cuts 
                had immediate, visible impacts on services Americans depend on.
              </p>
            </div>
          </div>
        </Section>

        {/* What's next */}
        <Section emoji="🔮" title="What Happens Now?" id="outlook">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              The federal workforce is now at approximately 1.81 million — its smallest since the late 1960s in absolute 
              terms, and the smallest per-capita since before World War II. The restructuring is largely complete, 
              with the administration signaling a shift from cutting to optimization.
            </p>
            <p>
              Key questions going forward:
            </p>
            <ul>
              <li><strong>Service quality:</strong> Are wait times, processing backlogs, and response times stabilizing or still deteriorating?</li>
              <li><strong>Contractor dependency:</strong> Has the government simply privatized functions at higher cost?</li>
              <li><strong>Institutional knowledge:</strong> Can agencies function effectively after losing experienced staff?</li>
              <li><strong>Right-sizing vs. gutting:</strong> Which agencies were genuinely streamlined versus ideologically targeted?</li>
            </ul>
            <p>
              OpenFeds will continue tracking these metrics. The data doesn&apos;t care about politics — it just tells 
              you what&apos;s happening.
            </p>
          </div>
        </Section>

        <div className="flex flex-wrap gap-4 mt-8 mb-16">
          <Link href="/cuts" className="text-indigo-600 hover:underline font-medium">← DOGE & Cuts Hub</Link>
          <Link href="/analysis/agency-departure-breakdown" className="text-indigo-600 hover:underline font-medium">
            Agency Breakdown →
          </Link>
          <Link href="/analysis/workforce-trends" className="text-indigo-600 hover:underline font-medium">
            Trends Analysis →
          </Link>
        </div>
      </div>
    </div>
  );
}
