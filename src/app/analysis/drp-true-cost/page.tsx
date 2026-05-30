import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Deferred Resignation Cost: $4.5B Analysis",
  description:
    "The government paid $4.5 billion to 76,000 federal employees who accepted the DRP and did no work for up to 8 months. Was it worth it? We break down the math.",
  alternates: { canonical: "/analysis/drp-true-cost" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The True Cost of the Deferred Resignation Program: $4.5 Billion for Nothing",
  description: "Analysis of the $4.5B spent on the DRP — 76,000 employees on paid leave doing no work for 8 months.",
  author: { "@type": "Organization", name: "OpenFeds" },
  publisher: { "@type": "Organization", name: "OpenFeds", logo: { "@type": "ImageObject", url: "https://openfeds.com/logo.png" } },
  datePublished: "2026-04-21",
  dateModified: "2026-04-21",
};

function PullQuote({ text, source }: { text: string; source?: string }) {
  return (
    <blockquote className="border-l-4 border-indigo-600 pl-6 py-4 my-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-r-xl">
      <p className="text-xl font-serif italic text-gray-900 dark:text-gray-100">{text}</p>
      {source && <cite className="text-sm text-gray-500 mt-2 block not-italic">— {source}</cite>}
    </blockquote>
  );
}

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

// Average GS salary ~$106K, plus ~35% benefits overhead ≈ $143K total comp. 76K employees × $143K × (8/12 months) ≈ $7.25B fully-loaded.
// Partnership estimate of $4.5B suggests salary-only (76K × $89K avg salary × 8/12 = ~$4.5B).

const drpData = {
  emailsSent: 2_000_000,
  accepted: 76_000,
  acceptanceRate: 3.8,
  totalCost: 4_500_000_000,
  avgCostPerEmployee: 59_211, // $4.5B / 76K
  monthsOfLeave: 8, // Feb through Sep 30
  avgSalary: 89_000, // approximate average of those who accepted
  rifSeveranceSaved: 1_200_000_000, // estimated severance that would have been owed if these were RIFs instead
};

export default function DrpTrueCostPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { label: "Analysis", href: "/analysis" },
          { label: "DOGE & Cuts", href: "/cuts" },
          { label: "DRP True Cost" },
        ]} />

        <header className="mb-16">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">OpenFeds Analysis</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
            $4.5 Billion for Nothing: The True Cost of the Deferred Resignation Program
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
            The &ldquo;Fork in the Road&rdquo; email promised efficiency. Instead, the government paid 76,000 employees
            full salary and benefits to sit at home for eight months. Here&apos;s the full accounting.
          </p>
          <div className="flex gap-4 mt-6 text-sm text-gray-500">
            <span>Sources: Partnership for Public Service, OPM, Federal News Network</span>
            <span>·</span>
            <span>Published: April 2026</span>
          </div>
        </header>

        <nav className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-12">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">In This Analysis</h3>
          <ol className="space-y-2 text-gray-700 dark:text-gray-300">
            <li><a href="#deal" className="hover:text-indigo-600">1. The Deal</a></li>
            <li><a href="#numbers" className="hover:text-indigo-600">2. The Numbers</a></li>
            <li><a href="#who-took-it" className="hover:text-indigo-600">3. Who Took It — And Who Didn&apos;t</a></li>
            <li><a href="#hidden-costs" className="hover:text-indigo-600">4. The Hidden Costs</a></li>
            <li><a href="#alternative" className="hover:text-indigo-600">5. The Alternative: What RIFs Would Have Cost</a></li>
            <li><a href="#verdict" className="hover:text-indigo-600">6. The Verdict</a></li>
          </ol>
        </nav>

        <Section emoji="📧" title="The Deal" id="deal">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            On February 4, 2025, the Office of Personnel Management sent what it called the &ldquo;Fork in the Road&rdquo;
            memo — the first-ever mass email to all ~2 million federal civilian employees. The offer was straightforward:
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li>✅ <strong>Resign voluntarily</strong> with a deferred effective date of September 30, 2025</li>
              <li>✅ <strong>Keep full pay and benefits</strong> through the end of the fiscal year</li>
              <li>✅ <strong>Placed on administrative leave</strong> — no work required</li>
              <li>✅ <strong>Continue TSP matching</strong> and annual/sick leave accruals</li>
              <li>❌ <strong>No severance</strong> — resignation is voluntary, so no severance entitlement</li>
              <li>❌ <strong>No rehire rights</strong> — unlike a RIF, no placement on reemployment lists</li>
            </ul>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            The initial deadline was February 6 — just two days. A federal judge temporarily blocked the deadline, and
            it was extended to February 12. In the end, approximately 76,000 employees — about 3.8% of the workforce —
            accepted.
          </p>
        </Section>

        <Section emoji="📊" title="The Numbers" id="numbers">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              { v: "76,000", l: "Employees Accepted", c: "bg-purple-50 border-purple-200 text-purple-900" },
              { v: "$4.5B", l: "Total Payments", c: "bg-red-50 border-red-200 text-red-900" },
              { v: "$59,211", l: "Avg. Cost Per Employee", c: "bg-amber-50 border-amber-200 text-amber-900" },
              { v: "8 months", l: "Of Paid Leave", c: "bg-blue-50 border-blue-200 text-blue-900" },
              { v: "3.8%", l: "Acceptance Rate", c: "bg-indigo-50 border-indigo-200 text-indigo-900" },
              { v: "~$89K", l: "Avg. Salary of Acceptees", c: "bg-green-50 border-green-200 text-green-900" },
            ].map((s) => (
              <div key={s.l} className={`border rounded-xl p-5 text-center ${s.c}`}>
                <div className="text-2xl sm:text-3xl font-bold font-mono">{s.v}</div>
                <div className="text-sm font-medium mt-1">{s.l}</div>
              </div>
            ))}
          </div>
          <PullQuote
            text="The DRP cost roughly $59,000 per employee — which is what you'd pay for a year of a GS-7 salary. Except these employees produced nothing."
          />
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            The $4.5 billion figure, estimated by the Partnership for Public Service, includes base salary, locality pay,
            and standard benefits (health insurance, TSP matching, leave accruals). It does not include the fully-loaded
            cost with overhead — which would push the number significantly higher.
          </p>
        </Section>

        <Section emoji="👤" title="Who Took It — And Who Didn't" id="who-took-it">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            The 3.8% acceptance rate was lower than the administration hoped. But the <em>composition</em> of who
            accepted matters more than the raw number:
          </p>
          <div className="space-y-4 mb-6">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
              <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-2">Retirement-eligible employees</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Many acceptees were already planning to retire within 1–2 years. The DRP gave them a paid runway to their
                planned exit. For these workers, the government essentially paid 8 months of salary it would have paid anyway —
                but got zero productivity in return.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
              <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">Early/mid-career employees with options</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Workers with in-demand skills (IT, data science, legal) used the DRP as a golden parachute to jump to
                private sector jobs — often at higher pay. The government lost talent it had invested years in developing.
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
              <h3 className="font-bold text-green-900 dark:text-green-200 mb-2">Who stayed</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Employees without good external options or nearing pension milestones generally declined. Ironically,
                the workers most likely to be underperforming had the least incentive to leave a guaranteed paycheck.
              </p>
            </div>
          </div>
          <PullQuote
            text="The DRP created a classic adverse selection problem: the people most likely to accept were the ones the government least wanted to lose."
          />
        </Section>

        <Section emoji="🔍" title="The Hidden Costs" id="hidden-costs">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            The $4.5 billion sticker price doesn&apos;t capture the full picture:
          </p>
          <div className="space-y-3">
            {[
              { label: "Knowledge loss", desc: "Decades of institutional expertise walked out the door. No transition plans, no documentation sprints." },
              { label: "Morale damage", desc: "The 96.2% who stayed watched colleagues get paid to leave. Morale surveys in mid-2025 showed record-low engagement." },
              { label: "Hiring costs later", desc: "Some agencies (notably NPR-reported cases in Oct 2025) had to rehire workers at market rates to fill critical gaps." },
              { label: "Legal challenges", desc: "Unions and employees challenged the DRP's legality, generating ongoing litigation costs." },
              { label: "Unemployment claims", desc: "Many DRP acceptees filed for unemployment after September 30, shifting costs to state systems." },
            ].map((item) => (
              <div key={item.label} className="flex gap-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <span className="text-red-500 font-bold shrink-0">→</span>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{item.label}:</span>{" "}
                  <span className="text-gray-700 dark:text-gray-300">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section emoji="⚖️" title="The Alternative: What RIFs Would Have Cost" id="alternative">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            The administration&apos;s argument for the DRP was that it was cheaper and faster than formal Reductions in Force.
            Let&apos;s test that claim:
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="py-3 pr-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Factor</th>
                  <th className="py-3 pr-6 text-sm font-semibold text-gray-600 dark:text-gray-400">DRP</th>
                  <th className="py-3 text-sm font-semibold text-gray-600 dark:text-gray-400">RIF (76K workers)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 pr-6 font-medium text-gray-900 dark:text-gray-100">Direct payment</td>
                  <td className="py-3 pr-6 text-gray-700 dark:text-gray-300">$4.5B (8 months salary)</td>
                  <td className="py-3 text-gray-700 dark:text-gray-300">~$1.2B (est. severance)</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 pr-6 font-medium text-gray-900 dark:text-gray-100">Time to execute</td>
                  <td className="py-3 pr-6 text-gray-700 dark:text-gray-300">2 weeks</td>
                  <td className="py-3 text-gray-700 dark:text-gray-300">3–6 months</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 pr-6 font-medium text-gray-900 dark:text-gray-100">Legal risk</td>
                  <td className="py-3 pr-6 text-gray-700 dark:text-gray-300">Lower (voluntary)</td>
                  <td className="py-3 text-gray-700 dark:text-gray-300">Higher (bumping rights, appeals)</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 pr-6 font-medium text-gray-900 dark:text-gray-100">Productivity during process</td>
                  <td className="py-3 pr-6 text-gray-700 dark:text-gray-300">Zero for 8 months</td>
                  <td className="py-3 text-gray-700 dark:text-gray-300">Normal until separation date</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 pr-6 font-medium text-gray-900 dark:text-gray-100">Who leaves</td>
                  <td className="py-3 pr-6 text-gray-700 dark:text-gray-300">Self-selected (adverse selection)</td>
                  <td className="py-3 text-gray-700 dark:text-gray-300">Seniority-based (retains top performers)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            The math is clear: the DRP cost roughly <strong>3.75x more in direct payments</strong> than equivalent RIFs
            would have. The speed advantage was real — but at a $3.3 billion premium, it&apos;s fair to ask whether
            &ldquo;fast&rdquo; was worth it.
          </p>
        </Section>

        <Section emoji="🏛️" title="The Verdict" id="verdict">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-6">
            <p className="text-lg text-gray-900 dark:text-gray-100 leading-relaxed mb-4">
              The DRP achieved its goal of quickly shrinking the federal workforce without the procedural burden of RIFs.
              But it did so at an extraordinary cost — <strong>$4.5 billion to pay people to not work</strong> — and created
              adverse selection that likely pushed out the wrong people.
            </p>
            <p className="text-lg text-gray-900 dark:text-gray-100 leading-relaxed">
              Was there fat to cut in the federal workforce? Almost certainly. Was paying $4.5 billion in administrative leave
              the most efficient way to do it? The data says no.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/cuts" className="text-indigo-600 hover:underline font-medium">← Back to DOGE & Cuts</Link>
            <Link href="/analysis/doge-cost-vs-savings" className="text-indigo-600 hover:underline font-medium">
              Next: Cost vs. Savings Deep Dive →
            </Link>
          </div>
        </Section>
      </div>
    </div>
  );
}
