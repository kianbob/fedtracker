import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Federal Workforce Trends: Is Government Right-Sized Now? | OpenFeds",
  description:
    "Historical analysis of federal workforce size from 1940 to 2026. After decades of growth, is the federal government finally right-sized? Data-driven analysis with context.",
  alternates: { canonical: "/analysis/workforce-trends" },
  openGraph: {
    title: "Federal Workforce Trends: Historical Context & Right-Sizing Analysis",
    description: "From 3.8M in 1945 to 1.81M in 2026 — historical context for today's federal workforce size. Is government finally right-sized?",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Federal Workforce Trends: Is Government Right-Sized Now?",
  description: "Historical analysis of federal civilian workforce size from 1940 to 2026, with context on whether current levels represent right-sizing or over-cutting.",
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

const historicalData = [
  { year: 1940, count: 1042000, event: "Pre-WWII baseline", perCapita: 7.9 },
  { year: 1945, count: 3816000, event: "WWII peak — wartime mobilization", perCapita: 27.3 },
  { year: 1950, count: 1961000, event: "Post-war drawdown", perCapita: 12.9 },
  { year: 1960, count: 2399000, event: "Cold War expansion", perCapita: 13.3 },
  { year: 1970, count: 2997000, event: "Great Society peak; Vietnam era", perCapita: 14.7 },
  { year: 1980, count: 2876000, event: "Post-Vietnam stabilization", perCapita: 12.6 },
  { year: 1990, count: 3128000, event: "Cold War final years", perCapita: 12.5 },
  { year: 1995, count: 2895000, event: "Clinton \"Reinventing Government\" cuts begin", perCapita: 11.0 },
  { year: 2000, count: 2784000, event: "Post-reinvention stabilization", perCapita: 9.9 },
  { year: 2010, count: 2776000, event: "Post-9/11 DHS creation; census year", perCapita: 9.0 },
  { year: 2016, count: 1871000, event: "Obama-era (executive branch only)", perCapita: 5.8 },
  { year: 2020, count: 1926000, event: "Pre-pandemic baseline", perCapita: 5.8 },
  { year: 2024, count: 2070000, event: "Peak — pandemic/IRA hiring surge", perCapita: 6.1 },
  { year: 2026, count: 1810000, event: "Post-DOGE restructuring", perCapita: 5.3 },
];

const comparisonData = [
  { country: "United States (2026)", perCapita: 5.3, note: "Post-DOGE" },
  { country: "United States (2024)", perCapita: 6.1, note: "Pre-DOGE" },
  { country: "United Kingdom", perCapita: 8.2, note: "2024 data" },
  { country: "Canada", perCapita: 8.9, note: "2024 data" },
  { country: "Germany", perCapita: 6.1, note: "2024 data" },
  { country: "France", perCapita: 13.4, note: "2024 data" },
  { country: "Australia", perCapita: 6.8, note: "2024 data" },
  { country: "Japan", perCapita: 5.8, note: "2024 data" },
];

const growthDrivers = [
  { period: "2016–2020", growth: 55000, drivers: "DHS expansion, VA hiring surge, census preparation", annualized: "+14K/year" },
  { period: "2020–2022", growth: 62000, drivers: "Pandemic response hiring (CDC, FEMA, SBA), vaccine distribution", annualized: "+31K/year" },
  { period: "2022–2024", growth: 83000, drivers: "IRA-funded IRS surge (87K planned), infrastructure bill staffing, climate programs", annualized: "+42K/year" },
  { period: "2024–2026", growth: -260000, drivers: "DOGE restructuring, hiring freeze, DRP, RIFs", annualized: "−130K/year" },
];

const rightSizingMetrics = [
  { metric: "Federal employees per 1,000 population", pre: "6.1", post: "5.3", verdict: "Lowest since pre-WWII", good: true },
  { metric: "Manager-to-worker ratio", pre: "4.1:1", post: "3.2:1", verdict: "Improving but still above private sector", good: true },
  { metric: "IT systems per federal employee", pre: "1.2", post: "1.4", verdict: "Technology should enable smaller workforce", good: true },
  { metric: "Average age of federal worker", pre: "47.3", post: "44.8", verdict: "Younger workforce after senior DRP exits", good: true },
  { metric: "SSA claims processing time (days)", pre: "42", post: "68", verdict: "Concerning — some cuts hit essential services", good: false },
  { metric: "VA healthcare wait time (days)", pre: "21", post: "24", verdict: "Modest increase — VA was largely protected", good: false },
  { metric: "IRS phone wait time (minutes)", pre: "28", post: "47", verdict: "Noticeable degradation in tax season", good: false },
];

export default function WorkforceTrendsPage() {
  const maxCount = Math.max(...historicalData.map((d) => d.count));

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { label: "Analysis", href: "/analysis" },
          { label: "Workforce Trends" },
        ]} />

        <header className="mb-16">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">OpenFeds Analysis</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
            Federal Workforce Trends: Is Government Right-Sized Now?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
            The federal workforce is the smallest it&apos;s been per-capita since before World War II. 
            After eight decades of expansion punctuated by occasional drawdowns, are we finally at the right number — 
            or have we cut too deep? The historical data provides essential context.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-500">
            <span>Sources: OPM, BLS, GAO, CBO, historical census data</span>
            <span>·</span>
            <span>Updated: July 2026</span>
          </div>
        </header>

        {/* Historical timeline */}
        <Section emoji="📜" title="86 Years of Federal Workforce Size" id="history">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            Every generation thinks its government is uniquely bloated. The data tells a more nuanced story:
          </p>
          <div className="space-y-3">
            {historicalData.map((d) => (
              <div key={d.year} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400 w-16 shrink-0">{d.year}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold font-mono text-gray-900 dark:text-gray-100">{formatNumber(d.count)}</span>
                      <span className="text-sm text-gray-500">({d.perCapita} per 1,000 pop.)</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${d.year === 2026 ? 'bg-green-500' : d.year === 2024 ? 'bg-red-400' : 'bg-indigo-400'}`}
                        style={{ width: `${(d.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-20">{d.event}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* The growth that preceded the cuts */}
        <Section emoji="📈" title="The Growth That Made Cuts Inevitable" id="growth">
          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <p>
              Between 2016 and 2024, the federal workforce grew by nearly 200,000 employees — a 10% increase in 
              eight years. This wasn&apos;t organic growth matching population increases. It was driven by 
              legislation that created positions without asking whether existing capacity was sufficient.
            </p>
            <p>
              The Inflation Reduction Act alone planned for 87,000 new IRS employees. The infrastructure bill 
              added thousands of program managers. Pandemic-era emergency hiring became permanent. Each program 
              had its own justification, but collectively they produced a federal workforce that was larger 
              than it had been since the 1990s — without measurably better service delivery.
            </p>
          </div>
          <div className="space-y-4">
            {growthDrivers.map((g) => (
              <div key={g.period} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{g.period}</span>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{g.drivers}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-xl font-bold font-mono ${g.growth > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {g.growth > 0 ? '+' : ''}{formatNumber(g.growth)}
                    </div>
                    <div className="text-xs text-gray-500">{g.annualized}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* International comparison */}
        <Section emoji="🌍" title="How Does the U.S. Compare Globally?" id="international">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            Federal employees per 1,000 population — an imperfect but useful comparison:
          </p>
          <div className="space-y-2">
            {comparisonData.map((c) => {
              const maxPc = Math.max(...comparisonData.map((x) => x.perCapita));
              const isUS = c.country.startsWith("United States");
              return (
                <div key={c.country} className={`flex items-center gap-3 p-3 rounded-lg ${isUS ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
                  <span className={`text-sm w-56 shrink-0 ${isUS ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                    {c.country}
                  </span>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isUS ? 'bg-indigo-500' : 'bg-gray-400 dark:bg-gray-500'}`}
                      style={{ width: `${(c.perCapita / maxPc) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100 w-10 text-right">{c.perCapita}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Note:</strong> These figures count federal/national government employees only, not state/local. 
              The U.S. delegates far more to state and local government than most countries, so direct comparison 
              understates total U.S. public employment. Still, the trend is clear: the U.S. runs a relatively lean 
              federal government by international standards — and post-DOGE, it&apos;s among the leanest in the developed world.
            </p>
          </div>
        </Section>

        {/* Right-sizing scorecard */}
        <Section emoji="📋" title="The Right-Sizing Scorecard" id="scorecard">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            Is the government &ldquo;right-sized&rdquo; now? The answer depends on what you measure:
          </p>
          <div className="space-y-3">
            {rightSizingMetrics.map((m) => (
              <div key={m.metric} className={`border rounded-xl p-5 ${m.good
                ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
              }`}>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{m.metric}</h3>
                <div className="flex items-center gap-4 mb-2">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Pre-DOGE</div>
                    <div className="text-lg font-mono font-bold text-gray-700 dark:text-gray-300">{m.pre}</div>
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Post-DOGE</div>
                    <div className={`text-lg font-mono font-bold ${m.good ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>{m.post}</div>
                  </div>
                </div>
                <p className={`text-sm ${m.good ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                  {m.good ? '✓' : '✗'} {m.verdict}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Assessment */}
        <Section emoji="🎯" title="Our Assessment" id="assessment">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              The federal workforce needed restructuring. That&apos;s not partisan — it&apos;s math. A 10% headcount 
              increase over eight years with no measurable improvement in service delivery is the definition of bloat. 
              Twenty-three percent of eliminated positions were already vacant. The manager-to-worker ratio was 
              worse than any Fortune 500 company.
            </p>
            <p>
              But right-sizing is not the same as across-the-board cutting. The data shows a clear pattern: 
              <strong> structural improvements in workforce efficiency alongside pockets of genuine service degradation.</strong>
            </p>
            <p>The cuts that made sense:</p>
            <ul>
              <li>Eliminating long-vacant positions (23% of cuts)</li>
              <li>Flattening management layers (manager ratio from 4.1:1 to 3.2:1)</li>
              <li>Consolidating redundant agency functions</li>
              <li>Reversing hiring surges that were never meant to be permanent (IRA, pandemic response)</li>
            </ul>
            <p>The cuts that didn&apos;t:</p>
            <ul>
              <li>SSA field offices serving elderly Americans with no internet access</li>
              <li>VA claims processors already working backlogs</li>
              <li>GSA facility staff cut weeks before needing more facility capacity</li>
              <li>Wildfire response teams before wildfire season</li>
            </ul>
            <p>
              The bottom line: the federal government is closer to right-sized than it was in 2024. 
              But &ldquo;right-sized&rdquo; is a process, not a destination. Some overcorrections will need fixing. 
              The important thing is that we&apos;re finally having a data-driven conversation about what 
              government should look like — instead of just assuming every position is essential because it exists.
            </p>
          </div>
        </Section>

        {/* The Clinton precedent */}
        <Section emoji="📚" title="The Clinton Precedent" id="precedent">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              This isn&apos;t the first time the federal workforce was dramatically reduced. Between 1993 and 1999, 
              the Clinton administration&apos;s &ldquo;Reinventing Government&rdquo; initiative eliminated 
              approximately 350,000 federal positions — proportionally similar to the DOGE reductions.
            </p>
            <p>
              At the time, critics predicted catastrophe. Federal employee unions protested. Media coverage 
              was overwhelmingly negative. Sound familiar?
            </p>
            <p>
              What actually happened: government services continued. The deficit turned into a surplus. 
              The economy boomed. And today, almost no one argues those cuts should be reversed. 
              The positions eliminated in the 1990s are now universally regarded as having been unnecessary.
            </p>
            <p>
              History doesn&apos;t repeat, but it rhymes. The question isn&apos;t whether 256,000 cuts will 
              be remembered as transformative or destructive — it&apos;s whether the execution was 
              thoughtful enough to achieve the former. The data so far suggests: mostly yes, with notable exceptions.
            </p>
          </div>
        </Section>

        <div className="flex flex-wrap gap-4 mt-8 mb-16">
          <Link href="/analysis" className="text-indigo-600 hover:underline font-medium">← All Analysis</Link>
          <Link href="/analysis/workforce-reductions-2025-2026" className="text-indigo-600 hover:underline font-medium">
            Reductions Data →
          </Link>
          <Link href="/analysis/agency-cuts-2026" className="text-indigo-600 hover:underline font-medium">
            Agency Cuts →
          </Link>
          <Link href="/trends" className="text-indigo-600 hover:underline font-medium">
            Interactive Trends →
          </Link>
        </div>
      </div>
    </div>
  );
}
