import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contractors vs Federal Employees: Which Costs More? — OpenFeds",
  description:
    "Federal contractor spending vs federal employee costs compared. Data on the $700B+ contractor workforce, cost per head, and whether outsourcing actually saves money.",
  alternates: { canonical: "/analysis/contractor-vs-federal" },
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

export default function ContractorVsFederalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/analysis" className="hover:text-accent">Analysis</Link>
        <span>/</span>
        <span className="text-slate-300">Contractors vs Federal Employees</span>
      </nav>

      <header className="mb-16">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">OpenFeds Analysis</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Contractors vs Federal Employees: The $700 Billion Question
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          The federal government spends over <strong>$700 billion</strong> annually on contracts — more than
          double the entire civilian payroll of <strong>$300 billion</strong>. An estimated <strong>4.1 million</strong> contractor
          workers serve alongside 2.2 million federal employees. Is outsourcing saving money — or
          creating a shadow government that costs more and answers to less?
        </p>
        <div className="flex gap-4 mt-6 text-sm text-gray-500">
          <span>Sources: USAspending.gov, FPDS, CBO, POGO</span>
          <span>·</span>
          <span>March 18, 2026</span>
        </div>
      </header>

      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
        <h3 className="font-semibold text-gray-900 mb-3">In This Analysis</h3>
        <ol className="space-y-2 text-gray-700">
          <li><a href="#scale" className="hover:text-accent">1. The Shadow Workforce</a></li>
          <li><a href="#cost" className="hover:text-accent">2. Cost Comparison: Head to Head</a></li>
          <li><a href="#growth" className="hover:text-accent">3. Growth Trends</a></li>
          <li><a href="#accountability" className="hover:text-accent">4. The Accountability Gap</a></li>
          <li><a href="#editorial" className="hover:text-accent">5. The Real Question</a></li>
        </ol>
      </nav>

      <div id="scale">
        <Section emoji="👥" title="The Shadow Workforce">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            When politicians talk about &quot;shrinking government,&quot; they usually mean cutting federal employees.
            What they don&apos;t mention is the contractor workforce that has grown to nearly <strong>twice the size</strong> of
            the civilian federal workforce. The government didn&apos;t get smaller — the work just moved
            off the books.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DataCallout stat="2.2M" label="Federal Civilians" detail="Direct government employees" />
            <DataCallout stat="~4.1M" label="Contractor Workers" detail="Estimated (no official count)" />
            <DataCallout stat="$300B+" label="Federal Payroll" detail="Salary + benefits" />
            <DataCallout stat="$700B+" label="Contract Spending" detail="FY2024 obligations" />
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            Here&apos;s the remarkable part: the federal government doesn&apos;t officially count its contractor
            workforce. The 4.1 million estimate comes from researchers at NYU and the Brookings Institution
            who back-calculated from contract dollar values. The government tracks every federal employee
            in OPM&apos;s FedScope database — their <Link href="/occupations" className="text-accent hover:underline">occupation</Link>,
            grade, salary, and duty station. For contractors? We know how much we spend. That&apos;s about it.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-red-900 mb-2">📌 The Counting Problem</h4>
            <p className="text-red-800 text-sm leading-relaxed">
              No federal database tracks the total number of contractor workers. The Federal Procurement
              Data System (FPDS) records contract obligations but not headcount. Estimates range from
              3.7 million to 5.2 million depending on methodology and whether subcontractors are included.
              When the government can&apos;t even count its workforce, cost comparisons become guesswork.
            </p>
          </div>

          <PullQuote
            text="The federal government has spent 40 years 'shrinking' its workforce by hiring contractors instead. The workforce didn't shrink. It just became invisible — and more expensive."
            source="Paul Light, NYU, 'The True Size of Government'"
          />
        </Section>
      </div>

      <div id="cost">
        <Section emoji="💰" title="Cost Comparison: Head to Head">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The core question: does it cost more to have a federal employee do a job or to contract it out?
            The answer depends on the job — but the data increasingly suggests contractors cost more for
            comparable work.
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cost Component</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Federal Employee</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Contractor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { component: "Average annual salary", fed: "$103,000", contractor: "$110,000–$140,000" },
                  { component: "Benefits (health, pension, TSP)", fed: "$38,000", contractor: "Varies ($15K–$40K)" },
                  { component: "Overhead (facilities, IT, admin)", fed: "$25,000", contractor: "Included in rate" },
                  { component: "Company profit margin", fed: "N/A", contractor: "8–15% of contract value" },
                  { component: "Contract management/oversight", fed: "N/A", contractor: "$15,000–$25,000 per FTE" },
                  { component: "Total estimated cost per worker", fed: "$160,000–$170,000", contractor: "$175,000–$250,000" },
                ].map((r) => (
                  <tr key={r.component} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.component}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.fed}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.contractor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            A 2019 study by the Project on Government Oversight (POGO) compared federal and contractor
            costs across 35 occupational categories. In <strong>33 of 35 categories</strong>, contractors cost
            more than federal employees performing the same work. The average contractor premium was 1.83x —
            meaning the government paid nearly double for the same labor when contracted out.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-blue-900 mb-3">Where Contractors Cost Most vs Least</h4>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li><strong>Most expensive to contract:</strong> IT support ($268K contractor vs $131K federal), claims processing ($196K vs $100K), groundskeeping ($115K vs $42K)</li>
              <li><strong>Closest to parity:</strong> Engineering services, legal support, medical professionals</li>
              <li><strong>Cheaper to contract:</strong> Specialized short-term projects, surge capacity, niche expertise (AI, cybersecurity)</li>
            </ul>
          </div>

          <PullQuote
            text="The government pays contractors an average of 1.83 times more than it would cost to have federal employees do the same work. In IT services, the ratio is over 2:1. 'Outsourcing saves money' is the most expensive myth in Washington."
            source="POGO, 'Bad Business' Report, 2019"
          />
        </Section>
      </div>

      <div id="growth">
        <Section emoji="📈" title="Growth Trends">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            While the federal civilian workforce has been roughly flat at 2.0–2.2 million since the 1960s,
            contract spending has exploded. Adjusted for inflation, federal contract obligations have
            more than doubled since 2000.
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Year</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Federal Civilians</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Contract Spending</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Est. Contractor Workers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { year: "2000", feds: "1.78M", spend: "$235B", workers: "~2.4M" },
                  { year: "2005", feds: "1.87M", spend: "$390B", workers: "~3.3M" },
                  { year: "2010", feds: "2.13M", spend: "$540B", workers: "~3.8M" },
                  { year: "2015", feds: "2.08M", spend: "$440B", workers: "~3.5M" },
                  { year: "2020", feds: "2.10M", spend: "$665B", workers: "~3.9M" },
                  { year: "2024", feds: "2.20M", spend: "$700B+", workers: "~4.1M" },
                ].map((r) => (
                  <tr key={r.year} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.year}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.feds}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{r.spend}</td>
                    <td className="px-4 py-3 text-right font-mono text-gray-500">{r.workers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            The post-9/11 surge in contract spending was particularly dramatic. DOD, DHS, and intelligence
            agencies outsourced aggressively — hiring contractors for everything from interrogation to
            IT management. Even after the wars wound down, contract spending never returned to pre-2001
            levels. Once a function is outsourced, the in-house expertise to bring it back evaporates.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-amber-900 mb-2">🏭 The Top Federal Contractors (FY2024)</h4>
            <p className="text-amber-800 text-sm leading-relaxed mb-3">
              The ten largest federal contractors received over <strong>$200 billion</strong> in FY2024:
            </p>
            <ul className="space-y-1 text-amber-800 text-sm">
              <li><strong>Lockheed Martin:</strong> ~$50B</li>
              <li><strong>RTX (Raytheon):</strong> ~$28B</li>
              <li><strong>General Dynamics:</strong> ~$22B</li>
              <li><strong>Boeing:</strong> ~$18B</li>
              <li><strong>Northrop Grumman:</strong> ~$16B</li>
              <li>Plus Leidos, Booz Allen Hamilton, SAIC, Accenture Federal, and Deloitte rounding out the top 10.</li>
            </ul>
          </div>
        </Section>
      </div>

      <div id="accountability">
        <Section emoji="🔍" title="The Accountability Gap">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Federal employees are subject to ethics rules, financial disclosure, the Hatch Act, Freedom
            of Information Act requests, and congressional oversight. Contractors operating in the same
            offices, doing the same work, are subject to... their contract terms. The accountability
            asymmetry is enormous.
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Accountability Mechanism</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Federal Employee</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Contractor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { mechanism: "Congressional oversight", fed: "✅ Direct", con: "⚠️ Indirect" },
                  { mechanism: "FOIA requests", fed: "✅ Yes", con: "❌ No" },
                  { mechanism: "Ethics/financial disclosure", fed: "✅ Required", con: "❌ Rare" },
                  { mechanism: "Whistleblower protections", fed: "✅ Strong", con: "⚠️ Limited" },
                  { mechanism: "Inspector General audits", fed: "✅ Yes", con: "⚠️ Contract-dependent" },
                  { mechanism: "Merit system protections", fed: "✅ Yes", con: "❌ No" },
                  { mechanism: "Performance accountability", fed: "⚠️ Weak (hard to fire)", con: "✅ Can terminate contract" },
                ].map((r) => (
                  <tr key={r.mechanism} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.mechanism}</td>
                    <td className="px-4 py-3 text-center">{r.fed}</td>
                    <td className="px-4 py-3 text-center">{r.con}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PullQuote
            text="We've created a two-tier federal workforce. The employee sitting at Desk A is subject to financial disclosure, FOIA, and the Hatch Act. The contractor at Desk B — doing the same job — is subject to none of it. Same work, different rules, higher cost."
          />
        </Section>
      </div>

      <div id="editorial">
        <Section emoji="⚖️" title="The Real Question">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The debate shouldn&apos;t be &quot;federal employees vs. contractors&quot; — it should be &quot;what&apos;s the
            most cost-effective and accountable way to deliver each function?&quot; The data suggests a
            few clear principles:
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">When to Use Each:</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-2"><span className="text-accent font-bold">→</span>
                <span><strong>Use federal employees for:</strong> Core government functions, long-term steady-state work, roles requiring public accountability, positions where institutional knowledge matters. This includes most <Link href="/occupations" className="text-accent hover:underline">federal occupations</Link> in policy, regulation, and oversight.</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">→</span>
                <span><strong>Use contractors for:</strong> Surge capacity, specialized short-term expertise, commercial services (janitorial, food service), and cutting-edge technology where government can&apos;t compete on salary.</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">→</span>
                <span><strong>Stop using contractors for:</strong> Inherently governmental functions (policy, acquisition management, intelligence analysis core), long-term staff augmentation disguised as &quot;services,&quot; and any role where the contractor has been in the same seat for 5+ years.</span></li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            The uncomfortable truth for both sides: hiring freezes that cap federal headcount while
            allowing unlimited contract spending don&apos;t save money. They cost more. And blanket
            &quot;insourcing&quot; mandates that bring work in-house without the expertise to manage it create
            different problems. The government needs both workforces — but it needs to be honest about
            what each costs and manage them as a single workforce, not two parallel universes.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Until the government can answer a basic question — &quot;how many people work for us?&quot; — it
            can&apos;t meaningfully manage its workforce or its costs. The 2.2 million federal employees are
            tracked in detail. The 4+ million contractor workers are a rounding error in a spreadsheet.
            That&apos;s not oversight. That&apos;s negligence.
          </p>
        </Section>
      </div>

      <div className="bg-accent-50 border border-accent/20 rounded-xl p-8 text-center">
        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Related Analysis</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/spending" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90">
            Agency Spending →
          </Link>
          <Link href="/analysis/redundant-agencies" className="border border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent/5">
            Redundant Agencies
          </Link>
          <Link href="/agencies" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
            Browse Agencies
          </Link>
        </div>
      </div>
    </div>
  );
}
