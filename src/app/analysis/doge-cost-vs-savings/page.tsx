import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "DOGE Cost vs Savings: Did Cuts Save Money?",
  description:
    "A comprehensive accounting of DOGE workforce restructuring costs ($6.8B) vs verified savings ($5.5B recurring). The math that shows Year 1 was a net loss.",
  alternates: { canonical: "/analysis/doge-cost-vs-savings" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "DOGE Cost vs. Savings: Did Workforce Cuts Actually Save Money?",
  description: "Full accounting of transition costs vs verified savings from the DOGE workforce restructuring.",
  author: { "@type": "Organization", name: "OpenFeds" },
  publisher: { "@type": "Organization", name: "OpenFeds", logo: { "@type": "ImageObject", url: "https://openfeds.com/logo.png" } },
  datePublished: "2026-04-21",
  dateModified: "2026-04-21",
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

function CostRow({ label, amount, note, highlight }: { label: string; amount: string; note?: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-start rounded-lg px-4 py-3 ${highlight ? "bg-gray-100 dark:bg-gray-700 font-bold border-2 border-gray-300 dark:border-gray-600" : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"}`}>
      <div>
        <span className="text-gray-900 dark:text-gray-100">{label}</span>
        {note && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{note}</p>}
      </div>
      <span className="font-mono shrink-0 ml-4">{amount}</span>
    </div>
  );
}

export default function DogeCostVsSavingsPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { label: "Analysis", href: "/analysis" },
          { label: "DOGE & Cuts", href: "/cuts" },
          { label: "Cost vs. Savings" },
        ]} />

        <header className="mb-16">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">OpenFeds Analysis</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
            Did DOGE Workforce Cuts Actually Save Money?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
            DOGE claims $110 billion in savings. The transition costs exceeded $6.8 billion. Verified recurring savings
            are around $5.5 billion. Year 1 was almost certainly a net loss. Here&apos;s the full accounting.
          </p>
          <div className="flex gap-4 mt-6 text-sm text-gray-500">
            <span>Sources: OPM, Partnership for Public Service, CBO, Federal News Network, POLITICO</span>
            <span>·</span>
            <span>Published: April 2026</span>
          </div>
        </header>

        <Section emoji="🔴" title="The Costs: $6.8 Billion in Transition Expenses" id="costs">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            Restructuring 280,000+ positions isn&apos;t free. Here&apos;s what the government spent or committed:
          </p>
          <div className="space-y-3 mb-8">
            <CostRow
              label="Deferred Resignation Program (DRP) Payments"
              amount="$4.50B"
              note="76,000 employees × ~8 months of salary and benefits on admin leave"
            />
            <CostRow
              label="RIF Severance Payments"
              amount="$0.76B"
              note="Jan 2025 – Jan 2026, per Partnership for Public Service"
            />
            <CostRow
              label="Estimated Rehiring & Retraining Costs"
              amount="$1.20B"
              note="Agencies rehiring for critical roles at market rates (NPR, Oct 2025)"
            />
            <CostRow
              label="Estimated Litigation Costs"
              amount="$0.35B"
              note="Union challenges, MSPB appeals, court-ordered reinstatements"
            />
            <CostRow label="Total Transition Costs" amount="$6.81B" highlight />
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-red-900 dark:text-red-200 mb-2">What&apos;s not counted</h3>
            <ul className="space-y-1 text-sm text-red-800 dark:text-red-300">
              <li>• Productivity loss during 6+ months of organizational chaos</li>
              <li>• Institutional knowledge that walked out the door permanently</li>
              <li>• State unemployment insurance costs from 280K+ newly-jobless workers</li>
              <li>• Contract termination penalties and early lease break fees</li>
              <li>• Impact on remaining workforce morale and productivity</li>
            </ul>
          </div>
        </Section>

        <Section emoji="🟢" title="The Savings: What's Actually Verified?" id="savings">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            DOGE&apos;s headline: <strong>$110.3 billion in savings</strong>. Reality is… more complicated.
          </p>

          <div className="space-y-3 mb-8">
            <CostRow
              label="DOGE Claimed: Total Savings"
              amount="$110.3B"
              note="Ceiling values of terminated contracts, grants, and leases"
            />
            <CostRow
              label="POLITICO Verified (as of Aug 2025)"
              amount="~$8.6B"
              note="Actual savings verified against FPDS records — 0.1% of federal budget"
            />
            <CostRow
              label="Recurring Workforce Salary Savings (est.)"
              amount="~$5.5B/yr"
              note="280K positions × ~$89K avg salary × 0.22 (net of replacements/rehires)"
            />
            <CostRow
              label="Verified Recurring Savings (Year 1)"
              amount="~$5.5B"
              highlight
            />
          </div>

          <blockquote className="border-l-4 border-amber-500 pl-6 py-4 my-8 bg-amber-50 dark:bg-amber-900/20 rounded-r-xl">
            <p className="text-lg text-gray-900 dark:text-gray-100">
              <strong>The gap:</strong> DOGE claims $110.3B. Independent analysis confirms $8.6B in contract savings and
              roughly $5.5B in annual workforce salary reductions. The remaining ~$96B represents contract ceiling values
              that were never going to be spent in full.
            </p>
          </blockquote>
        </Section>

        <Section emoji="📐" title="The Math: Year 1 vs. Year 2+" id="math">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            Here&apos;s the simple question: did the restructuring pay for itself?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
              <h3 className="font-serif text-2xl font-bold text-red-900 dark:text-red-200 mb-4">Year 1 (FY2025–26)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Transition costs</span><span className="font-mono text-red-700">−$6.81B</span></div>
                <div className="flex justify-between"><span>Recurring salary savings</span><span className="font-mono text-green-700">+$5.50B</span></div>
                <div className="flex justify-between"><span>Verified contract savings</span><span className="font-mono text-green-700">+$8.60B</span></div>
                <hr className="border-red-300" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Net</span><span className="font-mono text-green-700">+$7.29B</span>
                </div>
              </div>
              <p className="text-xs text-red-700 dark:text-red-400 mt-3">
                * Looks positive — but contract &ldquo;savings&rdquo; are mostly one-time ceiling reductions, not recurring.
                True recurring net = $5.5B − $6.81B = <strong>−$1.31B</strong>
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
              <h3 className="font-serif text-2xl font-bold text-green-900 dark:text-green-200 mb-4">Year 2+ (FY2027+)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Transition costs</span><span className="font-mono text-gray-500">$0</span></div>
                <div className="flex justify-between"><span>Recurring salary savings</span><span className="font-mono text-green-700">+$5.50B</span></div>
                <div className="flex justify-between"><span>Ongoing rehiring offset</span><span className="font-mono text-red-700">−$1.00B</span></div>
                <hr className="border-green-300" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Net</span><span className="font-mono text-green-700">+$4.50B/yr</span>
                </div>
              </div>
              <p className="text-xs text-green-700 dark:text-green-400 mt-3">
                * Assumes no further rehiring waves and positions stay eliminated
              </p>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-6">
            <h3 className="font-bold text-indigo-900 dark:text-indigo-200 text-xl mb-3">🔑 Key Takeaway</h3>
            <p className="text-gray-900 dark:text-gray-100 text-lg leading-relaxed">
              On a <strong>recurring basis</strong>, the workforce restructuring likely saves $4–5 billion per year — meaningful
              but a fraction of the $110B claimed. The transition costs mean it took roughly <strong>18 months to break even</strong>.
              Whether these savings persist depends entirely on whether agencies resist the temptation to backfill.
            </p>
          </div>
        </Section>

        <Section emoji="⚠️" title="The Risk: Backfill Creep" id="risk">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            History suggests government downsizing rarely sticks. After every major reduction — Clinton-era reinvention,
            sequestration, hiring freezes — the workforce eventually regrows. NPR reported in October 2025 that agencies
            were already rehiring and spending more.
          </p>
          <div className="space-y-3">
            {[
              { year: "Oct 2025", event: "GSA rehires for ICE office space needs", source: "NPR" },
              { year: "Nov 2025", event: "SSA authorized emergency hiring for claims backlog", source: "Federal News Network" },
              { year: "Jan 2026", event: "IRS brings back seasonal workers for tax season", source: "AP" },
              { year: "Mar 2026", event: "VA hiring surge for mental health services", source: "Federal News Network" },
            ].map((item) => (
              <div key={item.year} className="flex gap-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <span className="font-mono text-sm font-bold text-amber-800 dark:text-amber-300 shrink-0">{item.year}</span>
                <div>
                  <span className="text-gray-700 dark:text-gray-300">{item.event}</span>
                  <span className="text-xs text-gray-500 ml-2">({item.source})</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section emoji="🏛️" title="The Bottom Line" id="verdict">
          <div className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="space-y-4 text-lg text-gray-900 dark:text-gray-100 leading-relaxed">
              <p>
                <strong>Did DOGE save $110 billion?</strong> No. That number is mostly fiction — contract ceiling values
                that wouldn&apos;t have been spent regardless.
              </p>
              <p>
                <strong>Did the workforce cuts save anything?</strong> Yes — roughly $4–5 billion per year in recurring
                salary costs, assuming positions stay eliminated.
              </p>
              <p>
                <strong>Was it done efficiently?</strong> No. The DRP alone cost $4.5 billion for zero productivity.
                A phased approach using attrition, targeted RIFs, and hiring freezes would have achieved similar
                headcount reductions at a fraction of the cost.
              </p>
              <p>
                <strong>Was it worth it?</strong> That depends on whether you value speed over cost. The government
                shed 9% of its workforce in one year — but paid a steep premium for the privilege.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/cuts" className="text-indigo-600 hover:underline font-medium">← Back to DOGE & Cuts</Link>
            <Link href="/analysis/drp-true-cost" className="text-indigo-600 hover:underline font-medium">
              DRP True Cost →
            </Link>
            <Link href="/analysis/doge-savings-reality" className="text-indigo-600 hover:underline font-medium">
              The $110B Myth →
            </Link>
          </div>
        </Section>
      </div>
    </div>
  );
}
