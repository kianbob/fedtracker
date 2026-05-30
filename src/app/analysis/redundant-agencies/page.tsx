import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Redundant Federal Agencies: Overlap Analysis",
  description:
    "Data-driven analysis of overlapping federal agencies with duplicate missions. How many agencies does it take to manage workforce training, food safety, or cybersecurity?",
  alternates: { canonical: "/analysis/redundant-agencies" },
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

function DataCallout({ stat, label, detail }: { stat: string; label: string; detail?: string }) {
  return (
    <div className="bg-accent-50 border border-accent/20 rounded-xl p-5 text-center">
      <p className="text-3xl font-bold text-accent font-mono">{stat}</p>
      <p className="text-sm font-semibold text-gray-900 mt-1">{label}</p>
      {detail && <p className="text-xs text-gray-500 mt-1">{detail}</p>}
    </div>
  );
}

export default function RedundantAgenciesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/analysis" className="hover:text-accent">Analysis</Link>
        <span>/</span>
        <span className="text-slate-300">Redundant Agencies</span>
      </nav>

      <header className="mb-16">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">OpenFeds Analysis</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Redundant Federal Agencies: How Many Bureaucracies Does It Take?
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          The federal government employs <strong>2.2 million</strong> civilians across <strong>438 agencies and sub-agencies</strong>.
          GAO has identified over <strong>160 areas</strong> of fragmentation, overlap, and duplication.
          Taxpayers fund multiple agencies doing the same job — and nobody seems to mind.
        </p>
        <div className="flex gap-4 mt-6 text-sm text-gray-500">
          <span>Sources: GAO, OPM FedScope, CRS</span>
          <span>·</span>
          <span>March 18, 2026</span>
        </div>
      </header>

      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
        <h3 className="font-semibold text-gray-900 mb-3">In This Analysis</h3>
        <ol className="space-y-2 text-gray-700">
          <li><a href="#scope" className="hover:text-accent">1. The Scale of Duplication</a></li>
          <li><a href="#examples" className="hover:text-accent">2. The Worst Offenders</a></li>
          <li><a href="#cost" className="hover:text-accent">3. What Overlap Costs</a></li>
          <li><a href="#why" className="hover:text-accent">4. Why It Persists</a></li>
          <li><a href="#editorial" className="hover:text-accent">5. The Consolidation Question</a></li>
        </ol>
      </nav>

      <div id="scope">
        <Section emoji="📊" title="The Scale of Duplication">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Every year since 2011, the Government Accountability Office has published a report on federal
            fragmentation, overlap, and duplication. The 2024 edition identified <strong>162 areas</strong> where
            multiple agencies perform similar or identical functions. Since GAO began tracking, they&apos;ve
            made over 2,000 recommendations — only about 60% have been fully addressed.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DataCallout stat="162" label="Areas of Overlap" detail="Identified by GAO (2024)" />
            <DataCallout stat="2,000+" label="GAO Recommendations" detail="Since 2011" />
            <DataCallout stat="~60%" label="Fully Addressed" detail="40% still pending or ignored" />
            <DataCallout stat="$375B+" label="Potential Savings" detail="If all recommendations adopted" />
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            This isn&apos;t about two agencies accidentally stepping on each other&apos;s toes. These are
            systemic, structural overlaps where Congress has created multiple programs across multiple
            agencies to address the same problem. Each program has its own staff, its own budget,
            its own reporting requirements, and its own bureaucratic inertia.
          </p>

          <PullQuote
            text="There are 47 federal job training programs across 9 agencies. Most overlap in who they serve and what they provide. Only 5 have had an impact study in the last decade."
            source="GAO-23-106834"
          />
        </Section>
      </div>

      <div id="examples">
        <Section emoji="🏛️" title="The Worst Offenders">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Some areas of overlap are well-known. Others are absurd enough to seem invented. They&apos;re not.
          </p>

          <div className="space-y-6 mb-8">
            {[
              {
                area: "Food Safety",
                agencies: "USDA, FDA, EPA, CDC, NOAA, CBP",
                count: "15+ agencies involved",
                detail: "The USDA inspects meat. The FDA inspects everything else — except catfish, which Congress moved to USDA in 2008. A cheese pizza is FDA jurisdiction. Add pepperoni and it's USDA. An open-faced sandwich? FDA. Close it? USDA. This isn't a joke — it's federal law.",
                cost: "~$2.5B combined annual budget"
              },
              {
                area: "Cybersecurity",
                agencies: "CISA, NSA, FBI, DOD Cyber Command, DOE CESER, NIST",
                count: "6+ agencies with major cyber missions",
                detail: "CISA handles civilian federal network defense. NSA handles classified networks and signals intelligence. FBI investigates cybercrimes. DOD Cyber Command does offensive operations. DOE protects energy infrastructure. NIST writes the standards everyone ignores. Coordination happens through meetings about having meetings.",
                cost: "~$20B+ combined cyber spending"
              },
              {
                area: "Job Training & Workforce Development",
                agencies: "DOL, Education, HHS, VA, SBA, Commerce, USDA, HUD, Interior",
                count: "47 programs across 9 agencies",
                detail: "Nine different cabinet departments run workforce training programs that serve overlapping populations with similar services. A displaced worker might qualify for programs at DOL, Education, and Commerce — each with its own application, eligibility rules, and case manager. Congress has been told about this since 2003.",
                cost: "~$18B annually"
              },
              {
                area: "STEM Education",
                agencies: "NSF, DOE, NASA, NOAA, NIH, DOD, ED, USDA",
                count: "209 programs across 13 agencies",
                detail: "Two hundred and nine federal STEM education programs. Many target the same grade levels with similar curricula. Schools receive grants from multiple agencies for nearly identical after-school science programs, each with its own reporting requirements and evaluation criteria.",
                cost: "~$3.4B annually"
              },
              {
                area: "Counter-Drug Efforts",
                agencies: "DEA, FBI, CBP, ICE, Coast Guard, ONDCP, DOD",
                count: "7+ agencies with drug enforcement missions",
                detail: "DEA is the primary drug enforcement agency. But the FBI also investigates drug trafficking. CBP intercepts drugs at borders. ICE handles drug-related immigration cases. The Coast Guard interdicts at sea. DOD provides intelligence and surveillance. ONDCP is supposed to coordinate — but has no operational authority.",
                cost: "~$35B+ across all agencies"
              },
            ].map((item) => (
              <div key={item.area} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-serif text-xl font-bold text-gray-900">{item.area}</h4>
                  <span className="text-xs font-semibold text-accent bg-accent-50 px-3 py-1 rounded-full shrink-0 ml-2">{item.count}</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{item.agencies}</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">{item.detail}</p>
                <p className="text-xs font-semibold text-gray-500">{item.cost}</p>
              </div>
            ))}
          </div>

          <PullQuote
            text="A cheese pizza is FDA jurisdiction. Add pepperoni and it becomes USDA's problem. That sentence should be enough to justify reorganization — but the system has resisted consolidation for 118 years."
          />
        </Section>
      </div>

      <div id="cost">
        <Section emoji="💰" title="What Overlap Costs">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The direct cost of duplication is hard to pin down — agencies don&apos;t report &quot;money wasted
            on overlap&quot; as a line item. But GAO has estimated that fully implementing their recommendations
            could save or redirect over $375 billion. Even the conservative estimates are staggering.
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cost Category</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Annual Estimate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { cat: "Duplicative administrative overhead", cost: "$5-10B", note: "HR, IT, legal, finance teams replicated across overlapping programs" },
                  { cat: "Conflicting regulations", cost: "Unquantified", note: "Businesses comply with multiple agencies for the same activity" },
                  { cat: "Coordination costs", cost: "$1-2B", note: "Interagency councils, MOUs, liaison offices" },
                  { cat: "Gap exploitation", cost: "Unquantified", note: "Bad actors fall through cracks between agencies" },
                  { cat: "Missed economies of scale", cost: "$3-5B", note: "Each agency builds its own IT, procurement, HR systems" },
                ].map((r) => (
                  <tr key={r.cat} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.cat}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{r.cost}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            Beyond direct costs, overlap creates confusion for the public. A small business owner seeking
            federal help might interact with the SBA, Commerce Department, USDA (if rural), HUD (if in
            a target zone), and their state&apos;s federal programs office — all offering variants of the
            same assistance with different rules. The compliance burden alone discourages participation.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-amber-900 mb-2">🤔 The Hidden Cost: IT Systems</h4>
            <p className="text-amber-800 text-sm leading-relaxed">
              The federal government operates over 7,000 IT systems. Many are redundant — each agency
              builds its own HR system, its own financial management platform, its own case tracking
              software. The Office of Management and Budget estimated in 2023 that consolidating
              duplicative IT systems across agencies could save $3-5 billion annually. Instead, each
              agency guards its systems like territory.
            </p>
          </div>
        </Section>
      </div>

      <div id="why">
        <Section emoji="🔒" title="Why It Persists">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            If duplication is this obvious and this costly, why hasn&apos;t Congress fixed it? Because every
            redundant program has a constituency that fights to keep it alive.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-blue-900 mb-3">The Four Forces That Protect Redundancy</h4>
            <ul className="space-y-3 text-blue-800 text-sm">
              <li><strong>Congressional committee jurisdiction:</strong> Different committees control different agencies.
                The Agriculture Committee won&apos;t surrender food safety jurisdiction to the Health Committee.
                Merging programs means merging turf — and chairmanships.</li>
              <li><strong>Agency self-preservation:</strong> No agency volunteers to be consolidated out of existence.
                Each argues its approach is unique and essential. The ~2.2 million federal employees represented
                by their <Link href="/agencies" className="text-accent hover:underline">respective agencies</Link> have
                strong institutional incentives to resist merger.</li>
              <li><strong>Lobbyist alignment:</strong> Defense contractors lobby DOD. Health companies lobby HHS.
                Each industry prefers &quot;their&quot; agency with &quot;their&quot; relationships. Consolidation disrupts
                these comfortable arrangements.</li>
              <li><strong>Fear of disruption:</strong> Consolidation means temporary chaos — new org charts,
                relocated employees, merged IT systems. Politicians prefer the known cost of duplication
                over the visible pain of reorganization.</li>
            </ul>
          </div>

          <PullQuote
            text="Every GAO report on duplication gets bipartisan applause, bipartisan press releases, and bipartisan inaction. Eliminating overlap is popular in theory and impossible in practice because nobody wants to lose 'their' program."
          />
        </Section>
      </div>

      <div id="editorial">
        <Section emoji="⚖️" title="The Consolidation Question">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The case for consolidation is overwhelming on paper. Merge the 15 food safety agencies into one.
            Combine the 47 job training programs into 5. Create a single cybersecurity agency with real
            authority. The savings would be substantial, the service delivery would improve, and the
            accountability would be clearer.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">Low-Hanging Fruit for Consolidation:</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-2"><span className="text-accent font-bold">→</span>
                <span><strong>Single food safety agency:</strong> Merge USDA FSIS and FDA food functions. Canada, the UK, and the EU all have unified food safety regulators. We have 15 agencies and a pizza jurisdiction problem.</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">→</span>
                <span><strong>Workforce training consolidation:</strong> Reduce 47 programs to a single workforce development block grant. Let states administer with federal oversight.</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">→</span>
                <span><strong>Shared services mandate:</strong> Force agencies to use common HR, payroll, and IT platforms instead of building their own. OPM started this with shared service providers — and most agencies opted out.</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">→</span>
                <span><strong>Sunset clauses:</strong> Every new program should expire after 7 years unless reauthorized with evidence of effectiveness. Currently, programs live forever by default.</span></li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            The federal government&apos;s <Link href="/agencies" className="text-accent hover:underline">438 agencies</Link> and
            their $300 billion+ payroll represent an enormous investment of taxpayer money. When multiple agencies
            perform the same function, taxpayers pay for redundant leadership, redundant overhead, and redundant
            bureaucracy. Every dollar spent on a duplicative program manager is a dollar not spent on
            actual service delivery.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            The 2.2 million federal employees aren&apos;t the problem — the structure they work within is.
            Reorganizing agencies around missions rather than historical accidents would let the same
            workforce deliver more with less overhead. But that requires Congress to care more about
            taxpayers than committee chairmanships. Don&apos;t hold your breath.
          </p>
        </Section>
      </div>

      <div className="bg-accent-50 border border-accent/20 rounded-xl p-8 text-center">
        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Related Analysis</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/analysis/contractor-vs-federal" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90">
            Contractors vs Feds →
          </Link>
          <Link href="/agencies" className="border border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent/5">
            Browse Agencies
          </Link>
          <Link href="/spending" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
            Agency Spending
          </Link>
        </div>
      </div>
    </div>
  );
}
