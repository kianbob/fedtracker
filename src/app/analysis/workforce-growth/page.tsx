import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { formatNumber, fixAgencyName } from "@/lib/format";
import agencyList from "../../../../public/data/agency-list.json";
import trends from "../../../../public/data/trends.json";

export const metadata: Metadata = {
  title: "Federal Workforce Growth: 1940 to 2025 — OpenFeds",
  description:
    "How the federal workforce grew from 1 million to 3.1 million and back. Which agencies expanded most, and whether the current size makes sense.",
  alternates: { canonical: "/analysis/workforce-growth" },
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

const historicalData = [
  { year: "1940", employees: 1042000, population: 132165000, pct: "0.79%" },
  { year: "1945", employees: 3816000, population: 139928000, pct: "2.73%", note: "WWII peak" },
  { year: "1950", employees: 1961000, population: 151326000, pct: "1.30%" },
  { year: "1960", employees: 2399000, population: 179323000, pct: "1.34%" },
  { year: "1970", employees: 2997000, population: 203212000, pct: "1.48%" },
  { year: "1980", employees: 2876000, population: 226546000, pct: "1.27%" },
  { year: "1990", employees: 3128000, population: 248710000, pct: "1.26%", note: "Peacetime peak" },
  { year: "2000", employees: 2708000, population: 281422000, pct: "0.96%", note: "Post-Cold War cuts" },
  { year: "2010", employees: 2776000, population: 308746000, pct: "0.90%" },
  { year: "2020", employees: 2100000, population: 331000000, pct: "0.63%" },
  { year: "2025", employees: 2070000, population: 340000000, pct: "0.61%", note: "Post-DOGE" },
];

const biggestAgencies = [...agencyList]
  .filter(a => a.code !== "*")
  .sort((a, b) => b.employees - a.employees)
  .slice(0, 12);

export default function WorkforceGrowthPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/analysis" className="hover:text-accent">Analysis</Link>
        <span>/</span>
        <span className="text-slate-300">Workforce Growth</span>
      </nav>

      <header className="mb-16">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">OpenFeds Analysis</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          The Federal Workforce: 85 Years of Growth and Contraction
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          From 1 million in 1940 to 3.8 million during WWII, peaking again at 3.1 million in 1990, and
          now down to 2.07 million. The federal workforce tells the story of American government itself.
        </p>
        <div className="flex gap-4 mt-6 text-sm text-gray-500">
          <span>Sources: OPM, BLS, Census Bureau</span>
          <span>·</span>
          <span>Last updated: March 2026</span>
        </div>
      </header>

      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
        <h3 className="font-semibold text-gray-900 mb-3">In This Analysis</h3>
        <ol className="space-y-2 text-gray-700">
          <li><a href="#timeline" className="hover:text-accent">1. The 85-Year Timeline</a></li>
          <li><a href="#eras" className="hover:text-accent">2. Four Eras of Federal Employment</a></li>
          <li><a href="#biggest" className="hover:text-accent">3. The Biggest Agencies Today</a></li>
          <li><a href="#growers" className="hover:text-accent">4. Who Grew the Most</a></li>
          <li><a href="#relative" className="hover:text-accent">5. Relative to Population</a></li>
          <li><a href="#editorial" className="hover:text-accent">6. Is 2 Million the Right Number?</a></li>
        </ol>
      </nav>

      {/* 1 */}
      <div id="timeline">
        <Section emoji="📅" title="The 85-Year Timeline">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The federal civilian workforce has gone through dramatic swings — driven by wars, policy shifts,
            and political movements. Here are the key milestones:
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Year</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Fed Employees</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">U.S. Population</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">% of Pop</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historicalData.map((d) => (
                  <tr key={d.year} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-semibold">{d.year}</td>
                    <td className="px-4 py-3 text-right font-mono">{(d.employees / 1e6).toFixed(2)}M</td>
                    <td className="px-4 py-3 text-right font-mono text-gray-500">{(d.population / 1e6).toFixed(0)}M</td>
                    <td className="px-4 py-3 text-right font-mono">{d.pct}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{d.note ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PullQuote
            text="The federal government employed a smaller share of the population in 2025 than at any point since before the New Deal. Whether that's a triumph of efficiency or a symptom of outsourcing depends on who you ask."
          />
        </Section>
      </div>

      {/* 2 */}
      <div id="eras">
        <Section emoji="🏛️" title="Four Eras of Federal Employment">
          <div className="space-y-6 mb-8">
            {[
              {
                era: "1940-1945: The War Machine",
                color: "red",
                text: "WWII transformed the federal government overnight. Civilian employment nearly quadrupled to 3.8 million to support the war effort. Most of these were temporary positions in defense agencies. After the war, the workforce shrank dramatically — but never back to pre-war levels. The national security state was born."
              },
              {
                era: "1946-1990: The Great Expansion",
                color: "blue",
                text: "The Cold War, Great Society, environmental regulation, and the creation of new cabinet departments (HUD, Transportation, Energy, Education) drove steady growth. The workforce peaked at 3.1 million in 1990. Every new social program required new administrators, every new regulation required new enforcers. Government grew because its mission grew."
              },
              {
                era: "1991-2016: The Reinvention",
                color: "green",
                text: "The Clinton-era 'Reinventing Government' initiative and the post-Cold War 'peace dividend' cut 350,000+ positions. The workforce dropped to 2.7 million by 2000. But here's the catch: much of this 'reduction' was accomplished by shifting work to contractors, not by eliminating it. The true government workforce — including contractor-supported positions — barely changed."
              },
              {
                era: "2017-2025: DOGE and Disruption",
                color: "amber",
                text: "The Trump administration's workforce reduction efforts, culminating in the Department of Government Efficiency (DOGE), brought the civilian workforce to ~2.07 million. Hiring freezes, RIFs, and early retirement incentives removed over 200,000 positions. This represents the most aggressive peacetime workforce reduction in federal history."
              },
            ].map((item) => (
              <div key={item.era} className={`bg-${item.color}-50 border border-${item.color}-200 rounded-xl p-6`}>
                <h4 className={`font-semibold text-${item.color}-900 mb-2`}>{item.era}</h4>
                <p className={`text-${item.color}-800 text-sm leading-relaxed`}>{item.text}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* 3 */}
      <div id="biggest">
        <Section emoji="📊" title="The Biggest Agencies Today">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Just five agencies account for over 60% of the federal civilian workforce. The VA alone employs
            more people than the next two agencies combined.
          </p>

          <div className="space-y-3 mb-8">
            {biggestAgencies.map((a) => {
              const pct = (a.employees / agencyList[0].employees) * 100;
              return (
                <div key={a.code} className="flex items-center gap-3">
                  <Link href={`/agencies/${a.code}`} className="w-48 text-sm text-accent hover:underline truncate shrink-0">
                    {fixAgencyName(a.name)}
                  </Link>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div className="bg-accent h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm text-gray-600 w-20 text-right shrink-0">{formatNumber(a.employees)}</span>
                </div>
              );
            })}
          </div>

          <PullQuote
            text="The VA employs 451,000 people — more than Apple, Google, and Meta combined. It runs 1,298 healthcare facilities. Whether that's 'bloat' or 'caring for veterans' is a matter of perspective."
          />
        </Section>
      </div>

      {/* 4 */}
      <div id="growers">
        <Section emoji="📈" title="Who Grew the Most">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The story of federal workforce growth is really the story of a few agencies. Since 2000,
            the biggest growers have been:
          </p>

          <div className="space-y-4 mb-8">
            {[
              { agency: "DHS (created 2002)", growth: "0 → 228K", reason: "Post-9/11 consolidation of 22 agencies. TSA alone added 60K+ screeners." },
              { agency: "VA", growth: "235K → 451K", reason: "Post-9/11 veteran influx, ACA-era healthcare expansion, Choice Act." },
              { agency: "DOD Civilian", growth: "600K → 707K", reason: "War on Terror support, base operations, intelligence." },
              { agency: "HHS", growth: "58K → 75K", reason: "ACA implementation, Medicare/Medicaid growth, pandemic response." },
            ].map((item) => (
              <div key={item.agency} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{item.agency}</h4>
                  <span className="text-accent font-mono font-semibold text-sm">{item.growth}</span>
                </div>
                <p className="text-gray-600 text-sm">{item.reason}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* 5 */}
      <div id="relative">
        <Section emoji="📉" title="Relative to Population">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The most important chart in this analysis is one of ratios. As a share of the total U.S.
            population, the federal workforce has been in steady decline for 65 years.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="1945 (WWII)" value="2.73%" sub="of U.S. population" />
            <StatCard label="1970" value="1.48%" sub="of U.S. population" />
            <StatCard label="1990 Peak" value="1.26%" sub="of U.S. population" />
            <StatCard label="2025" value="0.61%" sub="of U.S. population" />
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            In 1970, 1 in 68 Americans was a federal civilian employee. Today it&apos;s 1 in 164. The U.S.
            population nearly doubled while the federal workforce shrank. Either government got dramatically
            more efficient, or it shifted work elsewhere (spoiler: it&apos;s mostly the latter — contractors and
            state/local grant recipients now perform much of what federal employees once did).
          </p>
        </Section>
      </div>

      {/* 6 */}
      <div id="editorial">
        <Section emoji="🎯" title="Is 2 Million the Right Number?">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            This is the fundamental question that no politician honestly answers. Both parties use the
            workforce as a political football without grappling with the real tradeoffs.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">The Honest Questions:</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-2">
                <span className="text-accent font-bold">→</span>
                <span>If we cut 200,000 federal positions, did the work disappear — or did it shift to contractors billing $150/hour?</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">→</span>
                <span>Is a smaller federal headcount actually cheaper if you&apos;re paying 3x per hour in contract labor?</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">→</span>
                <span>How many of the 2 million current employees do work that&apos;s genuinely necessary vs. mandated by obsolete statutes?</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">→</span>
                <span>What would happen if we sunset every regulation more than 20 years old and rebuilt from scratch?</span>
              </li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            The right number of federal employees is whatever it takes to execute the missions Congress has
            authorized — efficiently, transparently, and without waste. By that standard, we might need
            more workers in some areas (cybersecurity, VA healthcare) and far fewer in others (administrative
            overhead, redundant oversight layers). Raw headcount is a poor metric. Cost-per-outcome is better.
          </p>
        </Section>
      </div>

      <div className="bg-accent-50 border border-accent/20 rounded-xl p-8 text-center">
        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Explore Workforce Data</h3>
        <p className="text-gray-600 mb-6">Dive into agency-level employment trends, separations, and hiring patterns.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/trends" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90">
            Workforce Trends →
          </Link>
          <Link href="/agencies" className="border border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent/5">
            Browse Agencies
          </Link>
        </div>
      </div>
    </div>
  );
}
