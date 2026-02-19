import type { Metadata } from "next";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { formatNumber, fixAgencyName } from "@/lib/format";
import hardestHit from "../../../public/data/hardest-hit.json";
import knowledgeLoss from "../../../public/data/knowledge-loss.json";
import tenureSeparations from "../../../public/data/tenure-separations.json";

export const metadata: Metadata = {
  title: "Key Findings — The Real State of the Federal Workforce — FedTracker",
  description: "Data-driven analysis of the federal workforce in 2025: the DOGE effect, retirement cliff, experience drain, STEM brain drain, and more.",
};

function PullQuote({ text, source }: { text: string; source?: string }) {
  return (
    <blockquote className="border-l-4 border-accent pl-6 py-4 my-8 bg-accent-50 rounded-r-xl">
      <p className="text-xl font-serif italic text-gray-900">{text}</p>
      {source && <cite className="text-sm text-gray-500 mt-2 block not-italic">— {source}</cite>}
    </blockquote>
  );
}

function FindingSection({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16 scroll-mt-8">
      <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">
        <span className="mr-3">{emoji}</span>{title}
      </h2>
      {children}
    </section>
  );
}

export default function FindingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-indigo-400">Home</Link>
        <span>/</span>
        <span className="text-slate-300">Key Findings</span>
      </nav>
      <header className="mb-16">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">FedTracker Analysis</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          The Federal Workforce in 2025:<br />What the Data Actually Shows
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          We analyzed 2 million employment records and 5 years of separation data from OPM FedScope. 
          For decades, the federal workforce has grown with little accountability. 2025 was the year 
          that finally changed. Here&apos;s what the data shows about the long-overdue restructuring.
        </p>
        <div className="flex gap-4 mt-6 text-sm text-gray-500">
          <span>Data: OPM FedScope Dec 2025</span>
          <span>·</span>
          <span>Separations: FY2020-2025</span>
        </div>
        <div className="flex gap-3 mt-4">
          <a
            href="https://twitter.com/intent/tweet?text=Key%20Findings%3A%20The%20Federal%20Workforce%20in%202025&url=https%3A%2F%2Ffedtracker.vercel.app%2Ffindings"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            Share on X
          </a>
          <a
            href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Ffedtracker.vercel.app%2Ffindings"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#0A66C2] rounded-lg hover:bg-[#004182] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            Share on LinkedIn
          </a>
        </div>
      </header>

      {/* TABLE OF CONTENTS */}
      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-16">
        <h3 className="font-semibold text-gray-900 mb-3">In This Report</h3>
        <ol className="space-y-2 text-gray-700">
          <li><a href="#doge" className="hover:text-accent">1. The DOGE Effect: -217K Employees</a></li>
          <li><a href="#retirement" className="hover:text-accent">2. The Retirement Cliff</a></li>
          <li><a href="#experience" className="hover:text-accent">3. The Experience Drain</a></li>
          <li><a href="#stem" className="hover:text-accent">4. STEM Brain Drain</a></li>
          <li><a href="#managers" className="hover:text-accent">5. The Manager Ratio Myth</a></li>
          <li><a href="#overseas" className="hover:text-accent">6. The Overseas Workforce</a></li>
          <li><a href="#hardest-hit" className="hover:text-accent">7. Who Got Hit Hardest</a></li>
          <li><a href="#experience-drain" className="hover:text-accent">8. The Experience Drain (by Agency)</a></li>
          <li><a href="#tenure" className="hover:text-accent">9. Who&apos;s Leaving by Tenure</a></li>
        </ol>
      </nav>

      <div id="doge">
        <FindingSection emoji="🔥" title="The DOGE Effect">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The federal workforce shrank by approximately 217,000 positions between early 2025 and the end of the year. 
            After decades of unchecked growth, this was the first serious attempt to right-size the federal bureaucracy.
            The reduction came through hiring freezes, early retirement incentives, and Reductions in Force (RIFs).
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard label="Net Workforce Change" value="-217K" sub="Estimated reduction in 2025" />
            <StatCard label="RIF Increase" value="234x" sub="vs. FY2024 baseline" />
            <StatCard label="Early Retirements" value="4,000+" sub="SE separations surged" />
          </div>

          <PullQuote text="RIFs went from single digits per month to thousands. For the first time in modern history, the federal government got smaller instead of bigger." />

          <p className="text-gray-700 leading-relaxed mb-4">
            The most dramatic signal is in <Link href="/separations/SH" className="text-accent font-semibold hover:underline">RIF data (code SH)</Link>. 
            From FY2020 through mid-2024, monthly RIFs rarely exceeded 15. By late 2025, they spiked into the hundreds.
            Meanwhile, <Link href="/separations/SC" className="text-accent font-semibold hover:underline">voluntary resignations</Link> and 
            <Link href="/separations/SD" className="text-accent font-semibold hover:underline"> retirements</Link> also surged, 
            suggesting many employees chose to leave rather than wait.
          </p>
        </FindingSection>
      </div>

      <div id="retirement">
        <FindingSection emoji="⏰" title="The Retirement Cliff">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Nearly one in five federal employees is currently eligible to retire. This has been true for years — 
            the government has long been top-heavy with high-tenure, high-salary employees nearing retirement age. 
            The question isn&apos;t whether these retirements will happen, but whether agencies actually need to 
            backfill all of these positions, or whether this is a natural opportunity to streamline.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <StatCard label="Retirement Eligible" value="18.9%" sub="Of total workforce" />
            <StatCard label="Median Age" value="45-49" sub="Federal workforce skews older" />
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            Some agencies face far worse odds. Check the <Link href="/workforce-analysis" className="text-accent font-semibold hover:underline">deep dive analysis</Link> to 
            see which agencies have 25%+ of their workforce eligible to walk out tomorrow.
          </p>

          <PullQuote text="A workforce where 1 in 5 employees can retire tomorrow was never sustainable. The question is whether agencies will use this moment to modernize or just reflexively replace every headcount." />
        </FindingSection>
      </div>

      <div id="experience">
        <FindingSection emoji="🧠" title="The Experience Drain">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Federal employees separating in 2025 had significantly longer tenures than in prior years. 
            While critics frame this as a &quot;brain drain,&quot; it&apos;s worth noting that many of these long-tenure 
            employees were among the highest-paid in government, and &quot;institutional knowledge&quot; can also mean 
            &quot;institutional inertia.&quot; Fresh perspectives and modern skills aren&apos;t always a bad trade.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <StatCard label="20+ Year Veterans Leaving" value="Rising" sub="Biggest experience cohort departing" />
            <StatCard label="Avg Tenure of Leavers" value="Higher" sub="vs. 2024 leavers" />
          </div>

          <p className="text-gray-700 leading-relaxed">
            For genuinely critical roles — intelligence, defense logistics, nuclear safety — experience matters.
            But the data doesn&apos;t distinguish between irreplaceable expertise and bureaucratic tenure.
            The real question is which of these roles were essential and which were the product of decades of empire-building.
            See the <Link href="/workforce-analysis" className="text-accent font-semibold hover:underline">experience analysis</Link> for 
            agency-by-agency breakdowns.
          </p>
        </FindingSection>
      </div>

      <div id="stem">
        <FindingSection emoji="🔬" title="STEM Brain Drain">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The federal government employs hundreds of thousands of scientists, engineers, IT specialists, 
            and mathematicians. These are arguably the most defensible government roles — the ones even 
            small-government advocates agree the private sector can&apos;t easily replace.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            STEM employees earn about 44% more than non-STEM feds, but still less than private sector equivalents. 
            This is the one area where workforce reductions need to be surgical, not blunt. Losing a GS-15 
            program analyst is very different from losing a nuclear physicist or cybersecurity engineer.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Explore the <Link href="/workforce-analysis" className="text-accent font-semibold hover:underline">STEM analysis</Link> to 
            see which agencies depend most heavily on STEM workers.
          </p>
        </FindingSection>
      </div>

      <div id="managers">
        <FindingSection emoji="👔" title="The Manager Ratio Myth">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Is the federal government really overrun with middle managers? The overall ratio is roughly 1:5, 
            which is actually comparable to the private sector. But some agencies tell a very different story.
          </p>

          <PullQuote text="Some agencies have a manager for every 2-3 employees. In the private sector, that kind of overhead gets you fired. In government, it gets you a bigger budget." />

          <p className="text-gray-700 leading-relaxed mb-4">
            The variation between agencies is enormous. Small policy shops with 1:2 or 1:3 ratios are the 
            textbook definition of bureaucratic bloat. Large service delivery agencies like the VA actually 
            run leaner than many private companies. The data supports targeted cuts, not blanket ones.
          </p>

          <p className="text-gray-700 leading-relaxed">
            See the <Link href="/workforce-analysis" className="text-accent font-semibold hover:underline">manager ratio breakdown</Link> for 
            the actual numbers by agency.
          </p>
        </FindingSection>
      </div>

      <div id="overseas">
        <FindingSection emoji="🌍" title="The Overseas Workforce">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The federal government maintains a massive civilian workforce overseas — a legacy of America&apos;s 
            post-WWII global footprint that has never been seriously questioned. Do we still need the same 
            overseas staffing levels we had during the Cold War?
          </p>

          <p className="text-gray-700 leading-relaxed">
            Some overseas positions are genuinely essential (embassy security, military support). Others are 
            relics of an era when the U.S. thought it needed to manage the world. The data shows the scale 
            of this commitment — taxpayers should decide if it&apos;s still justified.
            Explore the details in the <Link href="/workforce-analysis" className="text-accent font-semibold hover:underline">overseas analysis</Link>.
          </p>
        </FindingSection>
      </div>

      {/* WHO GOT HIT HARDEST */}
      <div id="hardest-hit">
        <FindingSection emoji="💥" title="Who Got Hit Hardest">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Some agencies saw dramatic workforce reductions. The Department of Education lost 79.3% of its workforce — 
            which, depending on your view of federal involvement in education, is either alarming or long overdue.
            USAID was effectively dismantled. Here&apos;s who shrank the most.
          </p>
          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-6">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Agency</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Employees</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">2025 Seps</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">% Reduction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {hardestHit.slice(0, 10).map((a) => (
                  <tr key={a.code} className={a.code === "ED" ? "bg-red-50/50 font-medium" : "hover:bg-gray-50"}>
                    <td className="px-3 py-3">
                      <Link href={`/agencies/${a.code}`} className="text-accent hover:underline">
                        {fixAgencyName(a.name)}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-gray-700">{formatNumber(a.employees)}</td>
                    <td className="px-3 py-3 text-gray-700">{formatNumber(a.seps2025)}</td>
                    <td className="px-3 py-3">
                      <span className={a.reductionPct > 50 ? "text-red-600 font-bold" : "text-red-600 font-semibold"}>
                        {a.reductionPct > 100 ? '>100' : a.reductionPct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FindingSection>
      </div>

      {/* EXPERIENCE DRAIN BY AGENCY */}
      <div id="experience-drain">
        <FindingSection emoji="📉" title="The Experience Drain: Agency by Agency">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            When experienced employees leave, they take decades of institutional knowledge with them. Here are
            the agencies that lost the most cumulative years of federal experience in 2025.
          </p>
          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-6">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Agency</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Experience Lost</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">2025 Seps</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Avg Tenure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {knowledgeLoss.slice(0, 15).map((a) => (
                  <tr key={a.code} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <Link href={`/agencies/${a.code}`} className="text-accent hover:underline">
                        {fixAgencyName(a.name)}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-gray-900 font-semibold">{formatNumber(a.experienceLostYears)} years</td>
                    <td className="px-3 py-3 text-gray-700">{formatNumber(a.seps2025)}</td>
                    <td className="px-3 py-3 text-gray-700">{a.avgTenure} yrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PullQuote text="The VA alone lost 542,000 years of combined experience. Whether that experience was being used effectively is a separate question — but the scale is undeniable." />
        </FindingSection>
      </div>

      {/* TENURE SEPARATIONS */}
      <div id="tenure">
        <FindingSection emoji="📊" title="Who's Leaving by Tenure">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The newest employees (0–4 years) account for the largest share of departures, driven overwhelmingly by quits.
            But the 20+ year veterans are leaving in huge numbers too — mostly through retirement programs.
          </p>
          <div className="space-y-6">
            {[...tenureSeparations].sort((a, b) => b.total - a.total).map((bracket) => {
              const topTypes = Object.entries(bracket.byType)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);
              return (
                <div key={bracket.bracket} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{bracket.bracket}</h3>
                    <span className="text-xl font-bold text-accent">{formatNumber(bracket.total)}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topTypes.map(([type, count]) => (
                      <span key={type} className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                        <span className="text-gray-500">{type}:</span>{" "}
                        <span className="font-semibold text-gray-900">{formatNumber(count as number)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </FindingSection>
      </div>

      {/* Related Analysis */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Related Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/federal-bloat", title: "Federal Bloat Myth", desc: "Is the federal workforce really bloated? The data tells a different story than the headlines." },
            { href: "/who-got-cut", title: "Who Got Cut", desc: "Agency-by-agency breakdown of the 2025 DOGE-driven workforce reductions." },
            { href: "/salary-analysis", title: "Salary Analysis", desc: "Are federal workers overpaid? A deep dive into GS grades, agency pay, and private sector comparisons." },
            { href: "/doge", title: "DOGE Impact Dashboard", desc: "Full breakdown of 2025 federal workforce restructuring by agency, month, and separation type." },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group">
              <h3 className="font-serif font-bold text-gray-900 group-hover:text-indigo-700 transition-colors mb-1">{link.title}</h3>
              <p className="text-sm text-gray-500">{link.desc}</p>
              <span className="text-indigo-600 text-sm font-medium mt-2 inline-block">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="bg-gray-50 border border-gray-200 rounded-xl p-8 mt-16">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Methodology & Data Sources</h2>
        <div className="text-gray-700 space-y-3">
          <p>
            All data comes from the <strong>Office of Personnel Management (OPM) FedScope</strong> database, 
            which is the authoritative source for federal civilian workforce statistics.
          </p>
          <p>
            <strong>Employment data:</strong> December 2025 snapshot, covering 2.07 million individual position records.
          </p>
          <p>
            <strong>Separation data:</strong> FY2020 through November 2025, including all separation types 
            (transfers, quits, retirements, RIFs, terminations, deaths).
          </p>
          <p>
            <strong>Limitations:</strong> Military personnel are excluded. Intelligence community agencies 
            have limited data. Some fields are redacted for privacy. Contractor workforce is not included.
          </p>
        </div>
        <div className="mt-6">
          <Link href="/about" className="text-accent font-semibold hover:underline">Full methodology →</Link>
        </div>
      </section>
    </div>
  );
}
