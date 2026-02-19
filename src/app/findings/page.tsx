import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/StatCard";

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
      <header className="mb-16">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">FedTracker Analysis</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          The Federal Workforce in 2025:<br />What the Data Actually Shows
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          We analyzed 2 million employment records and 5 years of separation data from OPM FedScope. 
          Here are the most important findings — many of which contradict the political narratives on both sides.
        </p>
        <div className="flex gap-4 mt-6 text-sm text-gray-500">
          <span>Data: OPM FedScope Dec 2025</span>
          <span>·</span>
          <span>Separations: FY2020-2025</span>
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
        </ol>
      </nav>

      <div id="doge">
        <FindingSection emoji="🔥" title="The DOGE Effect">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The federal workforce shrank by approximately 217,000 positions between early 2025 and the end of the year. 
            This wasn&apos;t just attrition — it was a coordinated reduction driven by hiring freezes, 
            early retirement incentives, and a massive increase in Reductions in Force (RIFs).
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard label="Net Workforce Change" value="-217K" sub="Estimated reduction in 2025" />
            <StatCard label="RIF Increase" value="234x" sub="vs. FY2024 baseline" />
            <StatCard label="Early Retirements" value="4,000+" sub="SE separations surged" />
          </div>

          <PullQuote text="RIFs went from single digits per month to thousands. This isn't normal attrition — it's a deliberate restructuring of the federal government." />

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
            Nearly one in five federal employees is currently eligible to retire. This was already a crisis before 
            DOGE — now it&apos;s an emergency. As experienced workers accelerate their departures, agencies face a 
            compounding knowledge loss problem.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <StatCard label="Retirement Eligible" value="18.9%" sub="Of total workforce" />
            <StatCard label="Median Age" value="45-49" sub="Federal workforce skews older" />
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            Some agencies face far worse odds. Check the <Link href="/workforce-analysis" className="text-accent font-semibold hover:underline">deep dive analysis</Link> to 
            see which agencies have 25%+ of their workforce eligible to walk out tomorrow.
          </p>

          <PullQuote text="The federal government was already facing a retirement tsunami. The hiring freeze just turned it into a staffing catastrophe." />
        </FindingSection>
      </div>

      <div id="experience">
        <FindingSection emoji="🧠" title="The Experience Drain">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            It&apos;s not just how many people are leaving — it&apos;s who. Federal employees separating in 2025 
            had significantly longer tenures than in prior years. The people with the most institutional knowledge 
            are the ones heading for the exits.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <StatCard label="20+ Year Veterans Leaving" value="Rising" sub="Biggest experience cohort departing" />
            <StatCard label="Avg Tenure of Leavers" value="Higher" sub="vs. 2024 leavers" />
          </div>

          <p className="text-gray-700 leading-relaxed">
            This matters enormously for agencies that rely on deep institutional knowledge — regulatory agencies, 
            intelligence, defense logistics. You can&apos;t hire a replacement and expect them to be effective on day one.
            See the <Link href="/workforce-analysis" className="text-accent font-semibold hover:underline">experience exodus analysis</Link> for 
            agency-by-agency breakdowns.
          </p>
        </FindingSection>
      </div>

      <div id="stem">
        <FindingSection emoji="🔬" title="STEM Brain Drain">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The federal government employs hundreds of thousands of scientists, engineers, IT specialists, 
            and mathematicians. These are exactly the people the private sector is competing hardest for — 
            and exactly the people a hiring freeze makes hardest to replace.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            STEM employees earn more on average than their non-STEM counterparts in government, 
            but still significantly less than private sector equivalents. With the current uncertainty, 
            the government&apos;s ability to attract and retain technical talent is at serious risk.
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
            One of the central claims driving workforce reductions is that the federal government has too many 
            managers and not enough front-line workers. The data tells a more nuanced story.
          </p>

          <PullQuote text="The overall federal manager-to-staff ratio is roughly comparable to the private sector. But the variation between agencies is enormous." />

          <p className="text-gray-700 leading-relaxed mb-4">
            Some agencies genuinely have high supervisory ratios. Others are remarkably lean. 
            Blanket cuts don&apos;t account for this variation. A 1:5 ratio at a small policy shop means something 
            very different than 1:30 at a large service delivery agency.
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
            A surprisingly large portion of federal civilian employees work outside the United States. 
            These roles — from embassy staff to military support to scientific researchers — are often invisible 
            in the domestic workforce debate.
          </p>

          <p className="text-gray-700 leading-relaxed">
            The overseas workforce has different characteristics: different age distributions, different pay scales, 
            different occupations. Any workforce restructuring needs to account for these differences.
            Explore the details in the <Link href="/workforce-analysis" className="text-accent font-semibold hover:underline">overseas analysis</Link>.
          </p>
        </FindingSection>
      </div>

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
