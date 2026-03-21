import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Political Appointees: The 4,000 People Who Actually Run the Government — OpenFeds",
  description:
    "Analysis of federal political appointee positions: how many exist, what they earn, turnover rates, and the revolving door between government and industry.",
  alternates: { canonical: "/analysis/political-appointees" },
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

export default function PoliticalAppointeesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/analysis" className="hover:text-accent">Analysis</Link>
        <span>/</span>
        <span className="text-slate-300">Political Appointees</span>
      </nav>

      <header className="mb-16">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">OpenFeds Analysis</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Political Appointees: The 4,000 People Who Actually Run the Government
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          Out of <strong>2.2 million</strong> federal civilian employees, roughly <strong>4,000</strong> are
          political appointees — chosen by the President to lead agencies, set policy, and direct the
          bureaucracy. They represent 0.2% of the workforce but control 100% of the direction.
        </p>
        <div className="flex gap-4 mt-6 text-sm text-gray-500">
          <span>Sources: Plum Book, CRS, Partnership for Public Service</span>
          <span>·</span>
          <span>March 18, 2026</span>
        </div>
      </header>

      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
        <h3 className="font-semibold text-gray-900 mb-3">In This Analysis</h3>
        <ol className="space-y-2 text-gray-700">
          <li><a href="#types" className="hover:text-accent">1. Types of Political Appointees</a></li>
          <li><a href="#numbers" className="hover:text-accent">2. By the Numbers</a></li>
          <li><a href="#turnover" className="hover:text-accent">3. The Turnover Problem</a></li>
          <li><a href="#pay" className="hover:text-accent">4. What Appointees Earn</a></li>
          <li><a href="#editorial" className="hover:text-accent">5. Too Many Chiefs?</a></li>
        </ol>
      </nav>

      <div id="types">
        <Section emoji="🏛️" title="Types of Political Appointees">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Not all political appointees are created equal. The &quot;Plum Book&quot; — published after each
            presidential election — lists every policy and supporting position appointed by the President.
            They fall into distinct categories with very different levels of power and accountability.
          </p>

          <div className="space-y-4 mb-8">
            {[
              {
                type: "PAS — Presidential Appointees with Senate Confirmation",
                count: "~1,200 positions",
                examples: "Cabinet secretaries, agency heads, ambassadors, federal judges, U.S. Attorneys",
                detail: "The most senior positions. Require Senate confirmation, which can take 6-18 months. These are the roles that make headlines — and the vacancies that create leadership voids."
              },
              {
                type: "PA — Presidential Appointees (No Senate Confirmation)",
                count: "~500 positions",
                examples: "Senior White House staff, some commission members, special envoys",
                detail: "The President's inner circle and trusted operatives. No Senate vetting means faster placement but less oversight."
              },
              {
                type: "Schedule C — Confidential/Policy-Determining",
                count: "~1,500 positions",
                examples: "Chiefs of staff, special assistants, policy advisors, press secretaries at agencies",
                detail: "The real machinery of political control. Schedule C appointees serve at agency heads' pleasure and can be hired and fired at will. They're the political layer between Senate-confirmed leaders and career civil servants."
              },
              {
                type: "SES — Non-Career Senior Executive Service",
                count: "~700 positions",
                examples: "Deputy assistant secretaries, senior policy officials, program directors",
                detail: "Senior executives who serve at the pleasure of agency heads. Limited to 10% of total SES positions per agency. They bridge the gap between political leadership and career management."
              },
            ].map((item) => (
              <div key={item.type} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{item.type}</h4>
                  <span className="text-xs font-semibold text-accent bg-accent-50 px-3 py-1 rounded-full shrink-0 ml-2">{item.count}</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">Examples: {item.examples}</p>
                <p className="text-gray-700 text-sm leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          <PullQuote
            text="The United States has more political appointees than any other developed democracy. The UK has about 100 ministerial appointments. Germany has roughly 500. The US has 4,000. Whether that's democratic accountability or political patronage depends on your priors."
            source="Brookings Institution, 2024"
          />
        </Section>
      </div>

      <div id="numbers">
        <Section emoji="📊" title="By the Numbers">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The number of political appointee positions has grown steadily over the decades, even as
            reformers periodically call for reduction. Each administration adds positions; few are
            ever eliminated.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DataCallout stat="~4,000" label="Total Appointee Positions" detail="Listed in the Plum Book" />
            <DataCallout stat="~1,200" label="Require Senate Confirmation" detail="PAS positions" />
            <DataCallout stat="0.2%" label="Share of Federal Workforce" detail="4,000 of 2.2 million" />
            <DataCallout stat="237" label="Avg Days to Confirm" detail="Senate-confirmed nominees" />
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Agency</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">PAS Positions</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total Appointees</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total Employees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { agency: "Department of Defense", pas: "53", total: "350+", employees: "750,000+" },
                  { agency: "Department of State", pas: "189", total: "280+", employees: "77,000" },
                  { agency: "Department of Justice", pas: "120+", total: "310+", employees: "115,000" },
                  { agency: "Department of HHS", pas: "24", total: "180+", employees: "90,000" },
                  { agency: "Department of Treasury", pas: "28", total: "160+", employees: "95,000" },
                  { agency: "Department of Homeland Security", pas: "22", total: "200+", employees: "240,000" },
                  { agency: "White House / EOP", pas: "25+", total: "400+", employees: "1,800" },
                ].map((r) => (
                  <tr key={r.agency} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.agency}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.pas}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{r.total}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{r.employees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            State Department stands out with 189 PAS positions — mostly ambassadorships. Historically,
            about 30% of ambassadors are political appointees (often major donors) rather than career
            Foreign Service officers. The practice of rewarding donors with ambassadorships to cushy
            European postings is bipartisan and has persisted for over a century.
          </p>
        </Section>
      </div>

      <div id="turnover">
        <Section emoji="🚪" title="The Turnover Problem">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Political appointees don&apos;t stick around. The average tenure for a Senate-confirmed appointee
            is just <strong>2.5 years</strong> — barely enough to learn the job, let alone transform an
            agency. For Schedule C appointees, it&apos;s even shorter at about 18 months.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-blue-900 mb-3">The Vacancy Problem</h4>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li><strong>At the 1-year mark:</strong> New administrations typically have only 30-40% of PAS positions filled. The rest operate with &quot;acting&quot; officials or career placeholders.</li>
              <li><strong>At the 2-year mark:</strong> About 70% filled — but early appointees are already leaving.</li>
              <li><strong>Year 3-4:</strong> Turnover accelerates. Many positions are filled 2-3 times in a single term. Average tenure of just 2.5 years means constant churn.</li>
              <li><strong>Senate obstruction:</strong> Confirmation takes an average of 237 days. Some nominees wait over a year. Many withdraw before confirmation.</li>
            </ul>
          </div>

          <PullQuote
            text="The typical political appointee arrives knowing little about their agency, spends a year learning, implements for a year, and then starts planning their exit. Career staff call it the 'turkey farm' — appointees rotate through while the permanent bureaucracy waits them out."
          />

          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-red-900 mb-2">📌 The &quot;Acting&quot; Loophole</h4>
            <p className="text-red-800 text-sm leading-relaxed">
              When PAS positions sit vacant, agencies rely on &quot;acting&quot; officials under the Federal
              Vacancies Reform Act. An acting official can serve for 210 days — but administrations
              routinely exploit loopholes to extend acting service indefinitely. At any given time,
              20-30% of Senate-confirmed positions are filled by acting officials who never faced
              Senate scrutiny. It&apos;s an end-run around the confirmation process that both parties use
              and neither wants to fix.
            </p>
          </div>
        </Section>
      </div>

      <div id="pay">
        <Section emoji="💰" title="What Appointees Earn">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Political appointee <Link href="/salaries" className="text-accent hover:underline">salaries</Link> are
            set by the Executive Schedule (EX) for top officials and vary for lower-level appointees.
            Compared to what most could earn in the private sector, government pay is a substantial
            pay cut — which creates its own problems.
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Level</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Positions</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">2025 Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { level: "EX Level I", positions: "Cabinet Secretaries", salary: "$246,400" },
                  { level: "EX Level II", positions: "Deputy Secretaries, agency heads", salary: "$221,900" },
                  { level: "EX Level III", positions: "Under Secretaries, agency heads", salary: "$204,000" },
                  { level: "EX Level IV", positions: "Assistant Secretaries, General Counsels", salary: "$191,900" },
                  { level: "EX Level V", positions: "Administrators, Commissioners", salary: "$179,700" },
                  { level: "Non-career SES", positions: "Deputy Assistant Secretaries", salary: "$147K–$212K" },
                  { level: "Schedule C (typical)", positions: "Special Assistants, Advisors", salary: "$60K–$155K" },
                ].map((r) => (
                  <tr key={r.level} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.level}</td>
                    <td className="px-4 py-3 text-gray-600">{r.positions}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{r.salary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            A Cabinet secretary earns $246,400 overseeing agencies with budgets exceeding $100 billion and
            workforces of hundreds of thousands. The CEO of a comparably-sized private organization would
            earn $10-50 million. The pay gap means appointees are either independently wealthy, ideologically
            motivated, or — most commonly — planning to cash in on the private sector afterward.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-amber-900 mb-2">🔄 The Revolving Door</h4>
            <p className="text-amber-800 text-sm leading-relaxed">
              A 2022 study found that 65% of former political appointees at financial regulatory agencies
              took jobs in the industries they regulated within two years of leaving government. Former
              DOD appointees routinely join defense contractors. Former HHS appointees join pharmaceutical
              companies. Government service has become an investment — low pay now, high returns later
              from the relationships and knowledge gained in office.
            </p>
          </div>
        </Section>
      </div>

      <div id="editorial">
        <Section emoji="⚖️" title="Too Many Chiefs?">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The United States appoints more political officials than any peer democracy — by an order
            of magnitude. Whether that produces better governance is debatable. What&apos;s clear is that
            it produces constant churn, extended vacancies, and a patronage system that serves political
            parties more than the public.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">Questions Worth Asking:</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-2"><span className="text-accent font-bold">→</span>
                <span><strong>Do we need 4,000 political appointees?</strong> The UK runs with ~100. Germany with ~500. Most democracies entrust career civil servants with roles we politicize.</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">→</span>
                <span><strong>Does the confirmation process work?</strong> When it takes 237 days to confirm a nominee and 30% of positions are vacant at the one-year mark, the system is broken by design.</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">→</span>
                <span><strong>Should Schedule C positions be reduced?</strong> The 1,500 Schedule C appointees exist to ensure political loyalty, not expertise. Many are 20-somethings whose primary qualification is campaign work.</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">→</span>
                <span><strong>Is the revolving door acceptable?</strong> If government service is primarily a stepping stone to industry riches, the public interest is secondary to private career advancement.</span></li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            The appointee system reflects a fundamental tension in American governance: the desire for
            democratic control of the bureaucracy versus the need for competent, stable management of
            complex institutions. The <Link href="/agencies" className="text-accent hover:underline">438 federal agencies</Link> and
            their 2.2 million employees need leadership. But leadership that turns over every 2.5 years,
            arrives without expertise, and leaves for K Street isn&apos;t leadership — it&apos;s tourism.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            The career civil service exists precisely because we learned that patronage doesn&apos;t work — a
            lesson from the 1883 Pendleton Act, passed after a disappointed office-seeker assassinated
            President Garfield. A century and a half later, we&apos;re still debating how much political
            control is too much. The data suggests we passed that threshold a long time ago.
          </p>
        </Section>
      </div>

      <div className="bg-accent-50 border border-accent/20 rounded-xl p-8 text-center">
        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Related Analysis</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/analysis/firing-federal-workers" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90">
            Firing Federal Workers →
          </Link>
          <Link href="/appointments" className="border border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent/5">
            Appointment Types
          </Link>
          <Link href="/agencies" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
            Browse Agencies
          </Link>
        </div>
      </div>
    </div>
  );
}
