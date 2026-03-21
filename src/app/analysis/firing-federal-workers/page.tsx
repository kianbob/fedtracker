import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Firing Federal Workers: Why It's Nearly Impossible — OpenFeds",
  description:
    "Data on federal employee termination rates, the appeals process, MSPB reinstatement rates, and why it takes 6-12 months to fire a federal worker for poor performance.",
  alternates: { canonical: "/analysis/firing-federal-workers" },
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

export default function FiringFederalWorkersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/analysis" className="hover:text-accent">Analysis</Link>
        <span>/</span>
        <span className="text-slate-300">Firing Federal Workers</span>
      </nav>

      <header className="mb-16">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">OpenFeds Analysis</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Firing Federal Workers: A 170-Day Obstacle Course
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          The federal government fires about <strong>0.5%</strong> of its workforce per year for cause —
          roughly <strong>11,000</strong> out of 2.2 million. The private sector rate is 2-3x higher. It&apos;s
          not that federal workers are 3x better — it&apos;s that firing them requires navigating a
          bureaucratic process so painful that most managers don&apos;t bother.
        </p>
        <div className="flex gap-4 mt-6 text-sm text-gray-500">
          <span>Sources: MSPB, OPM, GAO, FedScope</span>
          <span>·</span>
          <span>March 18, 2026</span>
        </div>
      </header>

      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
        <h3 className="font-semibold text-gray-900 mb-3">In This Analysis</h3>
        <ol className="space-y-2 text-gray-700">
          <li><a href="#rates" className="hover:text-accent">1. Termination by the Numbers</a></li>
          <li><a href="#process" className="hover:text-accent">2. The Firing Process</a></li>
          <li><a href="#mspb" className="hover:text-accent">3. The MSPB Appeals Machine</a></li>
          <li><a href="#probation" className="hover:text-accent">4. The Probationary Loophole</a></li>
          <li><a href="#editorial" className="hover:text-accent">5. The Accountability Deficit</a></li>
        </ol>
      </nav>

      <div id="rates">
        <Section emoji="📊" title="Termination by the Numbers">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Let&apos;s start with the data. Federal employee termination rates are dramatically lower than
            the private sector — and the gap has been consistent for decades.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DataCallout stat="0.5%" label="Federal Firing Rate" detail="For-cause terminations annually" />
            <DataCallout stat="1.5%" label="Private Sector Rate" detail="For-cause terminations" />
            <DataCallout stat="~11,000" label="Fired Per Year" detail="Out of 2.2M federal workers" />
            <DataCallout stat="170+ days" label="Avg Time to Fire" detail="For performance-based removal" />
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Separation Type</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Annual Count</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">% of Workforce</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { type: "Removal for cause (misconduct)", count: "~7,500", pct: "0.34%", note: "Includes attendance, conduct, criminal" },
                  { type: "Removal for performance", count: "~3,500", pct: "0.16%", note: "Documented poor performance" },
                  { type: "Probationary termination", count: "~15,000", pct: "0.68%", note: "During first 1-2 year probation" },
                  { type: "Voluntary resignation (in lieu)", count: "~8,000", pct: "0.36%", note: "Quit before formal firing" },
                  { type: "Retirement (in lieu)", count: "~5,000", pct: "0.23%", note: "Retired rather than face action" },
                  { type: "Total involuntary + quasi-involuntary", count: "~39,000", pct: "1.77%", note: "All categories combined" },
                ].map((r) => (
                  <tr key={r.type} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.type}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{r.count}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.pct}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            The 0.5% for-cause rate understates the picture because many poor performers exit through
            &quot;voluntary&quot; resignation or retirement when they see the writing on the wall. Including these
            quasi-involuntary separations brings the effective rate closer to 1.8% — still below
            private sector norms but less extreme than the headline number suggests.
          </p>

          <PullQuote
            text="Federal managers report that it takes 6-12 months of documentation, counseling, and progressive discipline to remove a poor performer. Most say the process is so arduous that they transfer problem employees instead — making them someone else's problem."
            source="MSPB Merit Principles Survey, 2022"
          />
        </Section>
      </div>

      <div id="process">
        <Section emoji="📋" title="The Firing Process">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Firing a federal employee for poor performance under Chapter 43 of Title 5 is a multi-step
            process that would make Kafka proud. Here&apos;s what a manager faces:
          </p>

          <div className="space-y-4 mb-8">
            {[
              {
                step: "1. Document Performance Deficiencies",
                time: "Ongoing (30-90 days minimum)",
                detail: "The manager must identify specific, measurable performance standards that the employee is failing to meet. Vague complaints like 'bad attitude' or 'not a team player' won't survive review. Every deficiency needs documentation — emails, work products, missed deadlines."
              },
              {
                step: "2. Issue a Performance Improvement Plan (PIP)",
                time: "30-120 days",
                detail: "The employee gets a formal written PIP with specific improvement targets and a deadline (minimum 30 days, often 60-120). During this period, the manager must provide coaching, resources, and regular feedback — all documented. If the employee improves, the process stops."
              },
              {
                step: "3. Propose Removal",
                time: "30 days advance notice required",
                detail: "If the employee fails the PIP, the manager proposes removal in writing. The employee gets at least 30 days' advance notice and can respond in writing or orally. They can also have a representative (usually a union rep) present."
              },
              {
                step: "4. Deciding Official Review",
                time: "15-30 days",
                detail: "A separate, higher-level official (not the direct supervisor) reviews the case and makes the final removal decision. This official must consider the employee's response and can uphold, modify, or withdraw the action."
              },
              {
                step: "5. Employee Appeals",
                time: "30-120+ days",
                detail: "The terminated employee can appeal to the Merit Systems Protection Board (MSPB), file an EEO complaint, file a union grievance, or pursue all three simultaneously. Each track has its own timeline and proceedings."
              },
              {
                step: "6. MSPB Adjudication",
                time: "120-365+ days",
                detail: "If appealed to MSPB, an administrative judge holds a hearing (often months after the appeal). The agency bears the burden of proof. If the judge finds any procedural error — missed documentation, inadequate PIP, or insufficient notice — the removal can be reversed."
              },
            ].map((item) => (
              <div key={item.step} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{item.step}</h4>
                  <span className="text-xs font-semibold text-accent bg-accent-50 px-3 py-1 rounded-full shrink-0 ml-2">{item.time}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-amber-900 mb-2">⏱️ Total Timeline</h4>
            <p className="text-amber-800 text-sm leading-relaxed">
              From first documented deficiency to final, un-appealable removal: <strong>6-18 months</strong> minimum.
              If the employee appeals to MSPB and wins reinstatement, the agency can start over — or, more
              commonly, gives up and reassigns the employee to a position where they can do less damage.
              During the entire process, the employee continues to receive full pay and benefits.
            </p>
          </div>
        </Section>
      </div>

      <div id="mspb">
        <Section emoji="⚖️" title="The MSPB Appeals Machine">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The Merit Systems Protection Board is the federal government&apos;s employment court. Created in
            1978 to protect employees from political interference, it has become the primary mechanism
            through which fired employees fight — and often win — their jobs back.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DataCallout stat="~6,000" label="Appeals Filed Annually" detail="To MSPB" />
            <DataCallout stat="25%" label="Employee Win Rate" detail="Reversed or settled" />
            <DataCallout stat="243 days" label="Avg Case Duration" detail="Initial adjudication" />
            <DataCallout stat="~1,500" label="Reinstated Per Year" detail="Returned to their position" />
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Appeal Outcome</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">% of Cases</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">What Happens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { outcome: "Agency action upheld", pct: "~55%", desc: "Firing stands. Employee is out." },
                  { outcome: "Settlement agreement", pct: "~15%", desc: "Agency and employee negotiate. Often includes back pay and resignation instead of removal on record." },
                  { outcome: "Reversed (agency error)", pct: "~10%", desc: "Procedural defect found. Employee reinstated with full back pay." },
                  { outcome: "Mitigated (penalty reduced)", pct: "~8%", desc: "Judge agrees misconduct occurred but reduces penalty (e.g., suspension instead of removal)." },
                  { outcome: "Dismissed (procedural)", pct: "~12%", desc: "Appeal dismissed on technical grounds — late filing, wrong forum, etc." },
                ].map((r) => (
                  <tr key={r.outcome} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.outcome}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{r.pct}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{r.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PullQuote
            text="One in four federal employees who appeal their firing get some form of relief — reversal, mitigation, or settlement with back pay. That's not a system that makes it easy to fire poor performers. That's a system that makes it expensive to try."
          />

          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-red-900 mb-2">📌 The MSPB Vacancy Crisis</h4>
            <p className="text-red-800 text-sm leading-relaxed">
              From 2017 to 2022, MSPB had <strong>zero board members</strong> — no quorum to decide appeals.
              Over 3,600 cases piled up without final resolution. Employees in limbo for years — neither
              fully fired nor fully reinstated. The board was finally reconstituted in 2022, but the backlog
              took years to clear. A system that can&apos;t function for five years because of Senate inaction
              is a system designed to fail.
            </p>
          </div>
        </Section>
      </div>

      <div id="probation">
        <Section emoji="🔑" title="The Probationary Loophole">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            There is exactly one window where firing a federal employee is straightforward: the
            probationary period. New hires typically serve a 1-year probationary period (2 years for
            some positions) during which they can be terminated with minimal process and no MSPB
            appeal rights.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-blue-900 mb-3">Probationary vs Tenured Termination</h4>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li><strong>Probationary employee:</strong> Manager can terminate with a brief written notice. No PIP required. No MSPB appeal. Process takes days, not months.</li>
              <li><strong>Tenured employee:</strong> Full Chapter 43/75 process. PIP, 30-day notice, deciding official, MSPB rights. Process takes 6-18 months.</li>
              <li><strong>The cliff:</strong> The day an employee completes probation, firing difficulty increases by an order of magnitude. Smart managers make retention decisions before this date — but many don&apos;t.</li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            About 15,000 probationary employees are terminated each year — more than the number of tenured
            employees fired for cause and performance combined. This suggests the probationary period
            works as intended: it identifies poor fits early. The problem is what happens after. Once an
            employee crosses the probationary threshold, the protections make removal so difficult that
            managers essentially stop trying.
          </p>

          <PullQuote
            text="In FY2023, 79% of federal supervisors reported that they had managed an employee they considered a poor performer. Only 8% initiated formal removal proceedings. The most common response? Transfer the employee to another unit."
            source="MSPB Merit Principles Survey"
          />
        </Section>
      </div>

      <div id="editorial">
        <Section emoji="🎯" title="The Accountability Deficit">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Federal employee protections exist for good reason — they prevent political firings, protect
            whistleblowers, and ensure that career civil servants can tell truth to power without fear.
            The Pendleton Act of 1883 was a direct response to the spoils system. These aren&apos;t protections
            to be discarded lightly.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            But the current system has swung too far. When it takes 170+ days to fire someone for
            documented poor performance, when 25% of firings are reversed on appeal, and when 79% of
            managers say they&apos;ve managed a poor performer but only 8% take action — the system isn&apos;t
            protecting merit. It&apos;s protecting mediocrity.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">Reforms That Could Work:</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-2"><span className="text-accent font-bold">→</span>
                <span><strong>Shorten the PIP to 30 days maximum.</strong> The current 60-120 day PIPs are a courtesy that delays accountability. If an employee can&apos;t demonstrate improvement in 30 days, another 90 won&apos;t help.</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">→</span>
                <span><strong>Extend probation to 2 years for all positions.</strong> One year isn&apos;t enough to evaluate performance in complex roles. The DOD already uses 2-year probation for many positions.</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">→</span>
                <span><strong>Time-limit MSPB appeals.</strong> Require initial decisions within 90 days. The current 243-day average is unacceptable for both employees and agencies.</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">→</span>
                <span><strong>Raise the bar for reversal.</strong> MSPB should reverse removals only for substantive errors, not technical procedural defects like a missed form or late notice.</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">→</span>
                <span><strong>Train managers to manage.</strong> Most federal supervisors receive little training on performance management or the removal process. They avoid it because they don&apos;t understand it.</span></li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            The 2.2 million federal employees include hundreds of thousands of dedicated professionals
            working in <Link href="/occupations" className="text-accent hover:underline">critical occupations</Link> —
            from air traffic controllers to VA nurses to FBI agents. They deserve colleagues who pull
            their weight. The current system fails them by making it nearly impossible to remove the
            small percentage who don&apos;t.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Protecting federal employees from political retaliation is essential. Protecting them from
            accountability is not. The challenge is building a system that does the first without enabling
            the second. Right now, we have the opposite — a system so focused on preventing unjust
            terminations that it makes just terminations nearly impossible.
          </p>
        </Section>
      </div>

      <div className="bg-accent-50 border border-accent/20 rounded-xl p-8 text-center">
        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Related Analysis</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/analysis/political-appointees" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90">
            Political Appointees →
          </Link>
          <Link href="/analysis/remote-work-feds" className="border border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent/5">
            Remote Work Analysis
          </Link>
          <Link href="/layoffs" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
            Layoff Tracker
          </Link>
        </div>
      </div>
    </div>
  );
}
