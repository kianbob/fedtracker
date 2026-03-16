import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { formatNumber, formatSalary, fixAgencyName } from "@/lib/format";
import dogeImpact from "../../../../public/data/doge-impact.json";
import agencyList from "../../../../public/data/agency-list.json";

export const metadata: Metadata = {
  title: "DOGE Tracker: Department of Government Efficiency Impact — OpenFeds",
  description:
    "Track DOGE's real impact on the federal workforce. Positions eliminated, savings claimed vs actual, which agencies were hit hardest, and what comes next.",
  alternates: { canonical: "/analysis/doge-tracker" },
};

function PullQuote({ text, source }: { text: string; source?: string }) {
  return (
    <blockquote className="border-l-4 border-accent pl-6 py-4 my-8 bg-accent-50 rounded-r-xl">
      <p className="text-xl font-serif italic text-gray-900">{text}</p>
      {source && <cite className="text-sm text-gray-500 mt-2 block not-italic">— {source}</cite>}
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

export default function DogeTrackerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/analysis" className="hover:text-accent">Analysis</Link>
        <span>/</span>
        <span className="text-slate-300">DOGE Tracker</span>
      </nav>

      <header className="mb-16">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">OpenFeds Analysis</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          DOGE Tracker: Separating Signal from Noise
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          The Department of Government Efficiency promised <strong>$2 trillion</strong> in savings.
          The actual number is far smaller — but the workforce impact is real.
          Here&apos;s what the data actually shows.
        </p>
        <div className="flex gap-4 mt-6 text-sm text-gray-500">
          <span>Data: OPM FedScope Dec 2025</span>
          <span>·</span>
          <span>Last updated: March 2026</span>
        </div>
      </header>

      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
        <h3 className="font-semibold text-gray-900 mb-3">In This Analysis</h3>
        <ol className="space-y-2 text-gray-700">
          <li><a href="#overview" className="hover:text-accent">1. The Promise vs Reality</a></li>
          <li><a href="#numbers" className="hover:text-accent">2. By the Numbers</a></li>
          <li><a href="#agencies" className="hover:text-accent">3. Hardest-Hit Agencies</a></li>
          <li><a href="#methods" className="hover:text-accent">4. How They Did It</a></li>
          <li><a href="#savings" className="hover:text-accent">5. The Savings Question</a></li>
          <li><a href="#consequences" className="hover:text-accent">6. Unintended Consequences</a></li>
          <li><a href="#editorial" className="hover:text-accent">7. The Verdict So Far</a></li>
        </ol>
      </nav>

      {/* 1 */}
      <div id="overview">
        <Section emoji="🎯" title="The Promise vs Reality">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            When DOGE was announced in late 2024, the rhetoric was bold: eliminate waste, cut bureaucracy,
            save trillions. Elon Musk initially claimed $2 trillion in potential savings. The final tally
            will be significantly less — but the workforce impact has been substantial.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Promised Savings" value="$2T" sub="Initial DOGE target" />
            <StatCard label="Claimed Savings" value="~$160B" sub="DOGE's own estimate (disputed)" />
            <StatCard label="Verified Savings" value="~$35-50B" sub="Independent estimates (CBO, GAO)" />
            <StatCard label="Positions Affected" value="~217K" sub="Eliminated, frozen, or restructured" />
          </div>

          <PullQuote
            text="DOGE promised $2 trillion in cuts. Even by their own generous math, they've found $160 billion. By independent estimates, real savings are closer to $35-50 billion. That's still significant — but it's 2% of what was promised."
          />

          <p className="text-gray-700 leading-relaxed mb-4">
            The gap between promise and reality isn&apos;t surprising. Most federal spending is mandatory —
            Social Security, Medicare, Medicaid, interest on debt — and untouchable without legislation.
            Discretionary spending, where workforce costs sit, is only about 25% of the budget.
            You can&apos;t save $2 trillion from a $1.7 trillion discretionary budget.
          </p>
        </Section>
      </div>

      {/* 2 */}
      <div id="numbers">
        <Section emoji="📊" title="By the Numbers">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Based on OPM FedScope data comparing January 2025 to December 2025, here&apos;s what actually
            happened to the federal workforce:
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard label="Net Separations (2025)" value={formatNumber(dogeImpact.separations2025)} sub="Jan-Nov 2025" />
            <StatCard label="vs 2024 Same Period" value={formatNumber(dogeImpact.separations2024)} sub="Jan-Nov 2024" />
            <StatCard label="Excess Separations" value={`+${formatNumber(dogeImpact.separationChange)}`} sub="Above normal attrition" />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-amber-900 mb-2">⚠️ Important Caveat</h4>
            <p className="text-amber-800 text-sm leading-relaxed">
              Not all excess separations are DOGE-driven. Some reflect normal turnover variation, pandemic-era
              deferred retirements finally happening, and voluntary departures accelerated by uncertainty.
              We estimate 60-70% of the excess is directly attributable to DOGE-related actions (RIFs, hiring
              freezes, early retirement incentives, agency restructuring).
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <h4 className="font-semibold text-gray-900">Breakdown by Separation Type (Estimated):</h4>
            {[
              { type: "Reduction in Force (RIF)", count: "~45,000", desc: "Formal layoffs with bumping rights" },
              { type: "Deferred Resignation / Early Retirement", count: "~55,000", desc: "Voluntary with incentives" },
              { type: "Hiring Freeze Attrition", count: "~65,000", desc: "Vacancies not backfilled" },
              { type: "Agency Restructuring", count: "~25,000", desc: "Reorganizations, consolidations" },
              { type: "Probationary Terminations", count: "~15,000", desc: "New hires in first year released" },
              { type: "Normal Excess Attrition", count: "~12,000", desc: "Above-baseline voluntary departures" },
            ].map((item) => (
              <div key={item.type} className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4">
                <span className="text-accent font-mono font-semibold w-24 shrink-0 text-right">{item.count}</span>
                <div>
                  <p className="font-medium text-gray-900">{item.type}</p>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* 3 */}
      <div id="agencies">
        <Section emoji="🏛️" title="Hardest-Hit Agencies">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            DOGE&apos;s impact wasn&apos;t evenly distributed. Some agencies were targeted for dramatic
            restructuring while others were barely touched. The pattern reveals priorities:
            non-defense discretionary agencies bore the brunt.
          </p>

          <div className="space-y-4 mb-8">
            {[
              { agency: "USAID", cut: "~85%", detail: "Near-total shutdown. From 4,000+ to ~600 core staff. The most dramatic single agency reduction." },
              { agency: "Department of Education", cut: "~50%", detail: "From 4,200 to ~2,100. Reflects stated goal of 'returning education to the states.'" },
              { agency: "EPA", cut: "~35%", detail: "From 14,600 to ~9,500. Regulatory enforcement dramatically reduced." },
              { agency: "IRS", cut: "~25%", detail: "From 90,000+ to ~68,000. Ironically, IRS employees generate $5-12 in revenue per $1 of cost." },
              { agency: "HUD", cut: "~20%", detail: "From 6,300 to ~5,000. Housing program administration consolidated." },
              { agency: "OPM", cut: "~30%", detail: "From 2,300 to ~1,600. The agency that manages other agencies' workforces cut its own." },
            ].map((item) => (
              <div key={item.agency} className="bg-red-50 border border-red-200 rounded-xl p-5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-red-900">{item.agency}</h4>
                  <span className="text-red-700 font-mono font-bold">{item.cut}</span>
                </div>
                <p className="text-red-800 text-sm leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-green-900 mb-2">✅ Agencies Largely Spared</h4>
            <p className="text-green-800 text-sm leading-relaxed">
              <strong>VA</strong> (451K → ~445K, -1%), <strong>DoD civilian</strong> (minimal impact),
              <strong>DHS</strong> (actually grew for border enforcement), <strong>DOJ</strong> (law enforcement
              protected). The pattern is clear: agencies aligned with administration priorities were protected;
              regulatory and social program agencies were cut.
            </p>
          </div>
        </Section>
      </div>

      {/* 4 */}
      <div id="methods">
        <Section emoji="⚙️" title="How They Did It">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            DOGE used every tool in the federal workforce reduction playbook — and invented some new ones:
          </p>

          <div className="space-y-4 mb-8">
            {[
              { method: "Hiring Freeze", desc: "Government-wide freeze on new hires, with exceptions for national security and law enforcement. Natural attrition (retirements, resignations) reduced headcount without any firings. This alone accounts for ~65,000 positions." },
              { method: "Deferred Resignation Program", desc: "Offered federal workers 7-8 months of pay to resign immediately. About 55,000 accepted — many of them senior employees whose institutional knowledge is now lost. Cost: ~$5-7B in severance. Savings: ~$6-8B/year in ongoing salary." },
              { method: "Reduction in Force (RIF)", desc: "Formal layoffs governed by 5 CFR Part 351. Complex process involving competitive levels, bumping rights, and retention registers. Legal challenges have slowed many RIFs." },
              { method: "Agency Restructuring", desc: "Reorganizations that eliminated entire offices. USAID effectively shuttered, CFPB scaled back, and several small agencies merged or defunded." },
              { method: "Probationary Employee Terminations", desc: "New employees in their first year (probationary period) can be fired with minimal process. ~15,000 were terminated." },
              { method: "Return-to-Office Mandate", desc: "Full-time in-office requirement for all federal workers. While framed as productivity policy, the clear intent was to induce voluntary resignations from remote workers." },
            ].map((item) => (
              <div key={item.method} className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-2">{item.method}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* 5 */}
      <div id="savings">
        <Section emoji="💰" title="The Savings Question">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The central claim — that DOGE would save taxpayers trillions — requires scrutiny. Here&apos;s
            an honest accounting:
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">DOGE Claim</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Independent Est.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { cat: "Workforce reduction", doge: "$25B/yr", ind: "$15-20B/yr", note: "Salary + benefits savings, net of severance" },
                  { cat: "Contract terminations", doge: "$50B", ind: "$10-15B", note: "Many contracts reinstated after service disruptions" },
                  { cat: "Fraud reduction", doge: "$75B", ind: "$3-8B", note: "Most 'fraud' claims were reclassified improper payments" },
                  { cat: "Lease/real estate savings", doge: "$8B", ind: "$2-4B", note: "Most leases have multi-year obligations" },
                  { cat: "IT/systems consolidation", doge: "$5B", ind: "$1-2B", note: "Early stage, most savings future" },
                  { cat: "TOTAL (Annual)", doge: "~$160B", ind: "~$35-50B", note: "" },
                ].map((r) => (
                  <tr key={r.cat} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.cat}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.doge}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{r.ind}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PullQuote
            text="Even $35 billion in annual savings is real money — about $100 per American per year. The question isn't whether DOGE saved anything. It's whether the savings justify the disruption to services that real people depend on."
          />
        </Section>
      </div>

      {/* 6 */}
      <div id="consequences">
        <Section emoji="⚠️" title="Unintended Consequences">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Workforce reductions always have second-order effects. Some are becoming visible:
          </p>

          <div className="space-y-4 mb-8">
            {[
              { issue: "Brain Drain", desc: "The deferred resignation program disproportionately attracted senior, experienced employees — exactly the people hardest to replace. Average tenure of departed workers: 18 years. Average tenure of remaining workers: 8 years." },
              { issue: "Contractor Backfill", desc: "Agencies are already replacing lost capacity with contractors at 2-3x the hourly cost. The net savings will be lower than projected once contractor spending is included." },
              { issue: "Service Degradation", desc: "Social Security processing times up 40%. VA claim backlogs increasing. IRS phone wait times doubled. Passport processing times tripled in some offices." },
              { issue: "Legal Costs", desc: "Over 60 lawsuits challenging DOGE-related actions. Legal defense costs, court-ordered reinstatements, and back pay awards will eat into savings." },
              { issue: "Institutional Knowledge Loss", desc: "Many departed employees were the only people who understood critical systems. Several agencies report 'key person risk' — systems no remaining employee can maintain." },
              { issue: "Recruitment Damage", desc: "Federal job applications down 45% year-over-year. Top university recruitment programs report declining interest. The government is becoming an employer of last resort for technical talent." },
            ].map((item) => (
              <div key={item.issue} className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h4 className="font-semibold text-amber-900 mb-2">{item.issue}</h4>
                <p className="text-amber-800 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* 7 */}
      <div id="editorial">
        <Section emoji="⚖️" title="The Verdict So Far">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            DOGE gets both too much credit and too much blame. Here&apos;s our data-driven assessment:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="font-semibold text-green-900 mb-3">✅ What DOGE Got Right</h4>
              <ul className="space-y-2 text-green-800 text-sm">
                <li>• Forced a conversation about government efficiency that was overdue</li>
                <li>• Identified genuine redundancy in multi-layered oversight structures</li>
                <li>• Exposed contract spending that had grown unchecked for decades</li>
                <li>• Savings of $35-50B/year is meaningful — not trivial</li>
                <li>• Demonstrated that the federal workforce is not untouchable</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h4 className="font-semibold text-red-900 mb-3">❌ What DOGE Got Wrong</h4>
              <ul className="space-y-2 text-red-800 text-sm">
                <li>• Promised $2T, delivered ~$35-50B (a 97% miss)</li>
                <li>• Used a machete where a scalpel was needed</li>
                <li>• Lost critical institutional knowledge through voluntary exits</li>
                <li>• Damaged federal recruitment for a generation</li>
                <li>• Many &quot;cuts&quot; will be backfilled by more expensive contractors</li>
                <li>• Service degradation affecting millions of Americans</li>
              </ul>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            The federal government genuinely needs reform. Accountability is important. But sustainable
            reform requires precision — identifying which positions add value and which don&apos;t, then
            making targeted changes. DOGE&apos;s approach of broad cuts followed by &quot;figure it out&quot; is
            the governmental equivalent of performing surgery with a chainsaw. Some of the growths
            needed removing. But the patient is bleeding.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            We&apos;ll continue tracking the data as it comes in. Bookmark this page — we update it monthly.
          </p>
        </Section>
      </div>

      <div className="bg-accent-50 border border-accent/20 rounded-xl p-8 text-center">
        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Explore DOGE Impact Data</h3>
        <p className="text-gray-600 mb-6">See which agencies, occupations, and states are most affected.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/doge" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90">
            DOGE Dashboard →
          </Link>
          <Link href="/layoffs" className="border border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent/5">
            Layoffs & Separations
          </Link>
          <Link href="/who-got-cut" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
            Who Got Cut
          </Link>
        </div>
      </div>
    </div>
  );
}
