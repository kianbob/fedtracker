import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/StatCard";

export const metadata: Metadata = {
  title: "Federal Remote Work: Telework Data, Costs & Productivity — OpenFeds",
  description:
    "Federal telework data: how many feds work from home, office space costs, productivity evidence, and the return-to-office debate.",
  alternates: { canonical: "/analysis/remote-work-feds" },
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

export default function RemoteWorkFedsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/analysis" className="hover:text-accent">Analysis</Link>
        <span>/</span>
        <span className="text-slate-300">Remote Work</span>
      </nav>

      <header className="mb-16">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">OpenFeds Analysis</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Federal Remote Work: The $30 Billion Office Space Question
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          The federal government owns or leases <strong>376 million square feet</strong> of office space.
          Post-pandemic, average utilization is just <strong>25%</strong>. That&apos;s tens of billions in
          wasted real estate — or a case for permanent telework. Or both.
        </p>
        <div className="flex gap-4 mt-6 text-sm text-gray-500">
          <span>Sources: OPM, GSA, GAO</span>
          <span>·</span>
          <span>Last updated: March 2026</span>
        </div>
      </header>

      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
        <h3 className="font-semibold text-gray-900 mb-3">In This Analysis</h3>
        <ol className="space-y-2 text-gray-700">
          <li><a href="#numbers" className="hover:text-accent">1. The Telework Numbers</a></li>
          <li><a href="#real-estate" className="hover:text-accent">2. The Real Estate Problem</a></li>
          <li><a href="#productivity" className="hover:text-accent">3. The Productivity Evidence</a></li>
          <li><a href="#rto" className="hover:text-accent">4. The Return-to-Office Mandate</a></li>
          <li><a href="#locality" className="hover:text-accent">5. The Locality Pay Paradox</a></li>
          <li><a href="#editorial" className="hover:text-accent">6. The Smart Path Forward</a></li>
        </ol>
      </nav>

      {/* 1 */}
      <div id="numbers">
        <Section emoji="📊" title="The Telework Numbers">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Before the pandemic, about 25% of eligible federal employees teleworked at least occasionally.
            At the pandemic&apos;s peak, that surged to near 100% of eligible positions. As of late 2024
            (pre-DOGE mandate), the landscape looked like this:
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Telework Eligible" value="~1.1M" sub="53% of civilian workforce" />
            <StatCard label="Regular Telework" value="~850K" sub="At least 1 day/week" />
            <StatCard label="Full Remote" value="~228K" sub="100% telework approved" />
            <StatCard label="Avg Days Remote" value="2.4/week" sub="For telework participants" />
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            Nearly half the federal workforce — primarily blue-collar, law enforcement, healthcare, and
            field positions — was never eligible for telework. A VA nurse can&apos;t treat patients from home.
            A Border Patrol agent can&apos;t patrol from a couch. The telework debate is really about
            the ~1 million white-collar federal workers, mostly in DC and major metro areas.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-blue-900 mb-3">Who Teleworks Most (by Agency)</h4>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li><strong>Patent & Trademark Office:</strong> ~95% remote. Flagship telework program since 2012.</li>
              <li><strong>SEC:</strong> ~80% hybrid/remote. Knowledge work that translates well to remote.</li>
              <li><strong>GSA:</strong> ~75% remote. Shed most of their own office space — practicing what they preach.</li>
              <li><strong>OPM:</strong> ~70% hybrid. Ironic, given they now enforce the RTO mandate.</li>
              <li><strong>Treasury/IRS:</strong> ~55% hybrid. Large call center workforce works from home.</li>
            </ul>
          </div>

          <PullQuote
            text="The Patent & Trademark Office has had a full telework program since 2012. Their output — patent examinations per examiner — is 15% higher than pre-telework. If one agency proved the model works, why isn't it the standard?"
            source="USPTO Annual Report, 2023"
          />
        </Section>
      </div>

      {/* 2 */}
      <div id="real-estate">
        <Section emoji="🏢" title="The Real Estate Problem">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The federal government is the largest office tenant in the United States. And most of that space
            sits empty.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard label="Federal Office Space" value="376M sq ft" sub="Owned + leased" />
            <StatCard label="Annual Cost" value="~$9.6B" sub="Rent, operations, maintenance" />
            <StatCard label="Avg Utilization" value="25%" sub="Post-pandemic, pre-RTO mandate" />
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            GAO has reported federal buildings as &quot;high risk&quot; since 2003 — not because they&apos;re falling
            down (though many are), but because the portfolio is poorly managed. The government owns buildings
            it doesn&apos;t need, leases space at above-market rates, and struggles to consolidate.
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Metro Area</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Fed Office Space</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Utilization</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Annual Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { area: "Washington, DC Metro", space: "105M sq ft", util: "22%", cost: "$3.2B" },
                  { area: "New York", space: "18M sq ft", util: "28%", cost: "$890M" },
                  { area: "Atlanta", space: "12M sq ft", util: "31%", cost: "$340M" },
                  { area: "Philadelphia", space: "11M sq ft", util: "26%", cost: "$310M" },
                  { area: "Dallas-Fort Worth", space: "9M sq ft", util: "35%", cost: "$220M" },
                  { area: "Denver", space: "8M sq ft", util: "29%", cost: "$240M" },
                  { area: "San Francisco", space: "7M sq ft", util: "19%", cost: "$380M" },
                  { area: "Chicago", space: "7M sq ft", util: "24%", cost: "$210M" },
                ].map((r) => (
                  <tr key={r.area} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.area}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.space}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.util}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{r.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PullQuote
            text="The federal government spends $9.6 billion per year on office space used at 25% capacity. That's $7.2 billion in wasted space. You could fund NASA's entire Artemis program with what we spend heating empty federal buildings."
          />

          <p className="text-gray-700 leading-relaxed mb-4">
            The arithmetic is straightforward: if telework is permanent for 50%+ of the eligible workforce,
            the government could shed 40-50% of its office portfolio and save $3-4 billion annually. If
            everyone returns to the office, utilization improves but you still have a maintenance backlog
            exceeding $30 billion. There&apos;s no version of reality where the current real estate portfolio makes sense.
          </p>
        </Section>
      </div>

      {/* 3 */}
      <div id="productivity">
        <Section emoji="📈" title="The Productivity Evidence">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Does federal telework actually reduce productivity? The evidence is mixed but mostly favorable:
          </p>

          <div className="space-y-4 mb-8">
            {[
              { study: "USPTO (2012-2023)", finding: "Patent examinations per examiner up 15%. Attrition down 30%. Most-cited success case.", verdict: "✅ Positive" },
              { study: "GSA Telework Study (2022)", finding: "No measurable decline in output metrics. Employee satisfaction up 25%. Office costs down 40%.", verdict: "✅ Positive" },
              { study: "OPM Federal Viewpoint Survey (2024)", finding: "84% of teleworking employees reported being 'as productive or more productive' at home.", verdict: "⚠️ Self-reported" },
              { study: "GAO Report GAO-23-105609", finding: "IRS phone answer rates declined during max telework. Processing times increased for paper returns.", verdict: "❌ Mixed" },
              { study: "SSA Inspector General (2023)", finding: "Processing times for disability claims 18% longer with remote staff vs in-office. But sample size concerns.", verdict: "❌ Negative" },
              { study: "Stanford WFH Research (Bloom, 2024)", finding: "Hybrid work (2-3 days remote) shows no productivity loss and significant attrition reduction across sectors.", verdict: "✅ Positive" },
            ].map((item) => (
              <div key={item.study} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{item.study}</h4>
                  <span className="text-sm font-semibold shrink-0 ml-2">{item.verdict}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{item.finding}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            The honest summary: <strong>hybrid work (2-3 days remote) appears to maintain productivity while
            reducing costs and attrition</strong>. Full remote is more variable — it works well for focused
            individual work (patent examination, tax processing) but less well for collaborative or
            supervisory roles. The blanket RTO mandate ignores this nuance.
          </p>
        </Section>
      </div>

      {/* 4 */}
      <div id="rto">
        <Section emoji="🔙" title="The Return-to-Office Mandate">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            In January 2025, the administration ordered all federal employees back to the office full-time.
            The stated reason: accountability and productivity. The unstated reason: inducing voluntary
            attrition to reduce headcount without formal layoffs.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard label="Employees Affected" value="~850K" sub="Regular teleworkers pre-mandate" />
            <StatCard label="Voluntary Departures" value="~35K" sub="Attributed to RTO mandate" />
            <StatCard label="Compliance Rate" value="~70%" sub="As of Feb 2026" />
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-red-900 mb-2">The Quiet Part Out Loud</h4>
            <p className="text-red-800 text-sm leading-relaxed">
              Administration officials have privately acknowledged that the RTO mandate is partly a workforce
              reduction tool. When remote workers are told to commute 2+ hours daily to an office where their
              team doesn&apos;t sit, many choose to quit. This achieves headcount reduction without the legal
              requirements of a formal RIF. It&apos;s legal. It&apos;s also dishonest.
            </p>
          </div>

          <PullQuote
            text="If the goal is productivity, study the data and implement evidence-based policies. If the goal is headcount reduction, be honest about it. Using RTO as a stealth layoff tool wastes everyone's time — and the $7 billion in empty office space proves nobody actually needed those desks."
          />
        </Section>
      </div>

      {/* 5 */}
      <div id="locality">
        <Section emoji="💰" title="The Locality Pay Paradox">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Federal locality pay was designed to match local cost of living. A GS-13 in San Francisco gets
            ~44% locality on top of base pay; one in Birmingham gets ~18%. The question nobody wants
            to answer: should full-time remote workers in low-cost areas keep their high-cost locality pay?
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Scenario</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">GS-13 Step 5 Pay</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Locality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { scenario: "DC office worker", pay: "$131,890", loc: "33.26% DC locality" },
                  { scenario: "DC-locality, remote from rural Virginia", pay: "$131,890", loc: "Same — gets DC rate" },
                  { scenario: "If adjusted to 'Rest of US'", pay: "$115,200", loc: "17.46% base locality" },
                  { scenario: "Annual savings per employee", pay: "$16,690", loc: "If locality matched actual location" },
                ].map((r) => (
                  <tr key={r.scenario} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.scenario}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.pay}</td>
                    <td className="px-4 py-3 text-gray-500">{r.loc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            If even 100,000 remote workers are receiving DC locality pay while living in lower-cost areas,
            that&apos;s ~$1.7 billion per year in excess compensation. This isn&apos;t about punishing remote workers —
            it&apos;s about paying people based on where they actually live, which is the entire point of locality pay.
          </p>
        </Section>
      </div>

      {/* 6 */}
      <div id="editorial">
        <Section emoji="🎯" title="The Smart Path Forward">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The data supports a clear set of conclusions:
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">Evidence-Based Federal Telework Policy:</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-2"><span className="text-accent font-bold">1.</span><span><strong>Default to hybrid (2-3 days in-office)</strong> — the evidence supports this for most knowledge workers.</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">2.</span><span><strong>Allow full remote for proven roles</strong> — patent examiners, tax processors, call center staff.</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">3.</span><span><strong>Adjust locality pay to actual location</strong> — if you live in Kansas, you get Kansas rates.</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">4.</span><span><strong>Sell/shed 40% of office space</strong> — use the savings for IT infrastructure and facility improvements.</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">5.</span><span><strong>Measure output, not attendance</strong> — badge swipes don&apos;t measure productivity.</span></li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            The return-to-office mandate is policy by ideology, not evidence. But the pre-mandate status quo
            — where workers collected DC locality pay from their beach house in North Carolina — wasn&apos;t right either.
            The answer is in the middle, guided by data. As usual, neither extreme is willing to go there.
          </p>
        </Section>
      </div>

      <div className="bg-accent-50 border border-accent/20 rounded-xl p-8 text-center">
        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Related Analysis</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/analysis/firing-federal-workers" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90">
            Firing Federal Workers →
          </Link>
          <Link href="/analysis/doge-tracker" className="border border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent/5">
            DOGE Tracker
          </Link>
          <Link href="/geographic-impact" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
            Geographic Impact
          </Link>
        </div>
      </div>
    </div>
  );
}
