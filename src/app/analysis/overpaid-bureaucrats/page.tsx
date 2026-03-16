import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { formatNumber, formatSalary, fixAgencyName } from "@/lib/format";
import salaryStats from "../../../../public/data/salary-stats.json";
import agencyList from "../../../../public/data/agency-list.json";

export const metadata: Metadata = {
  title: "Overpaid Bureaucrats? Federal vs Private Sector Pay — OpenFeds",
  description:
    "Are federal employees overpaid compared to private sector workers? Data-driven comparison of federal vs private pay by occupation, education, and agency.",
  alternates: { canonical: "/analysis/overpaid-bureaucrats" },
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

const topAgencies = salaryStats.topPaidAgencies.slice(0, 10);

const privateSectorComparisons = [
  { role: "Software Engineer", federal: 130000, private: 185000, fedTitle: "IT Specialist (GS-13)", gap: "-30%" },
  { role: "Attorney", federal: 175000, private: 190000, fedTitle: "General Attorney (GS-14)", gap: "-8%" },
  { role: "HR Specialist", federal: 105000, private: 75000, fedTitle: "HR Specialist (GS-12)", gap: "+40%" },
  { role: "Administrative Assistant", federal: 62000, private: 45000, fedTitle: "Secretary (GS-7)", gap: "+38%" },
  { role: "Accountant", federal: 112000, private: 82000, fedTitle: "Accountant (GS-12)", gap: "+37%" },
  { role: "Cybersecurity Analyst", federal: 135000, private: 165000, fedTitle: "Infosec Specialist (GS-13)", gap: "-18%" },
  { role: "Program Manager", federal: 178000, private: 145000, fedTitle: "Program Manager (GS-14)", gap: "+23%" },
  { role: "Data Scientist", federal: 125000, private: 175000, fedTitle: "Statistician (GS-13)", gap: "-29%" },
  { role: "Nurse (RN)", federal: 95000, private: 82000, fedTitle: "Nurse (VN)", gap: "+16%" },
  { role: "Physician", federal: 297000, private: 320000, fedTitle: "Medical Officer", gap: "-7%" },
  { role: "Janitor/Custodian", federal: 42000, private: 32000, fedTitle: "Custodial Worker (WG-3)", gap: "+31%" },
  { role: "Security Guard", federal: 55000, private: 35000, fedTitle: "Security Guard (GS-6)", gap: "+57%" },
];

export default function OverpaidBureaucratsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/analysis" className="hover:text-accent">Analysis</Link>
        <span>/</span>
        <span className="text-slate-300">Overpaid Bureaucrats?</span>
      </nav>

      <header className="mb-16">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">OpenFeds Analysis</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Overpaid Bureaucrats? Federal vs Private Sector Pay
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          The CBO says federal workers earn <strong>17% more</strong> in total compensation than private sector
          equivalents. Federal unions say they&apos;re <strong>22% underpaid</strong>. Both are right — depending
          on which workers you&apos;re looking at.
        </p>
        <div className="flex gap-4 mt-6 text-sm text-gray-500">
          <span>Sources: OPM FedScope, BLS, CBO</span>
          <span>·</span>
          <span>Last updated: March 2026</span>
        </div>
      </header>

      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
        <h3 className="font-semibold text-gray-900 mb-3">In This Analysis</h3>
        <ol className="space-y-2 text-gray-700">
          <li><a href="#headline" className="hover:text-accent">1. The Headline Numbers</a></li>
          <li><a href="#comparison" className="hover:text-accent">2. Role-by-Role Comparison</a></li>
          <li><a href="#winners" className="hover:text-accent">3. Where Feds Win</a></li>
          <li><a href="#losers" className="hover:text-accent">4. Where Feds Lose</a></li>
          <li><a href="#benefits" className="hover:text-accent">5. The Benefits Multiplier</a></li>
          <li><a href="#agencies" className="hover:text-accent">6. The Agencies That Pay the Most</a></li>
          <li><a href="#editorial" className="hover:text-accent">7. The Bottom Line</a></li>
        </ol>
      </nav>

      {/* 1 */}
      <div id="headline">
        <Section emoji="📊" title="The Headline Numbers">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The debate over federal pay has raged for decades, with wildly different conclusions depending
            on methodology. Here&apos;s what the major studies find:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard label="CBO (2024)" value="+17%" sub="Total comp premium (salary + benefits)" />
            <StatCard label="Federal Pay Council" value="-22.47%" sub="Salary gap (their methodology)" />
            <StatCard label="AEI/Heritage" value="+30-40%" sub="Total comp including job security" />
          </div>

          <PullQuote
            text="The federal pay 'gap' depends entirely on what you measure. Salary alone? Feds are slightly behind. Add pension, health insurance, and near-absolute job security? They're way ahead — especially for non-professional roles."
            source="Congressional Budget Office, 2024"
          />

          <p className="text-gray-700 leading-relaxed mb-4">
            The key insight: the federal pay premium is <strong>inversely correlated with education</strong>.
            Federal workers with a high school diploma earn 17% more than private equivalents. Federal workers
            with a professional degree earn 24% less. The GS system compresses pay — lifting the bottom while
            capping the top.
          </p>
        </Section>
      </div>

      {/* 2 */}
      <div id="comparison">
        <Section emoji="⚖️" title="Role-by-Role Comparison">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Aggregate numbers hide more than they reveal. Here&apos;s what specific roles pay in government
            versus the private sector (median total cash compensation, 2024-2025 data):
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Federal Title</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Federal</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Private</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {privateSectorComparisons.map((c) => (
                  <tr key={c.role} className="hover:bg-gray-50">
                    <td className="px-3 py-3 font-medium">{c.role}</td>
                    <td className="px-3 py-3 text-gray-500 text-xs">{c.fedTitle}</td>
                    <td className="px-3 py-3 text-right font-mono">{formatSalary(c.federal)}</td>
                    <td className="px-3 py-3 text-right font-mono">{formatSalary(c.private)}</td>
                    <td className={`px-3 py-3 text-right font-mono font-semibold ${c.gap.startsWith("+") ? "text-red-600" : "text-green-600"}`}>
                      {c.gap}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-400 mb-8">
            Federal figures from OPM FedScope Dec 2025 (avg salary for occupation series). Private sector figures
            from BLS OES and Glassdoor median total compensation, 2024. Gap shows federal premium (+) or discount (-).
          </p>
        </Section>
      </div>

      {/* 3 */}
      <div id="winners">
        <Section emoji="🏆" title="Where Feds Win Big">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            For administrative, clerical, and blue-collar roles, federal employment is a significantly
            better deal than the private sector. These are the categories where the &quot;overpaid bureaucrat&quot;
            criticism has the most merit:
          </p>

          <div className="space-y-4 mb-8">
            {[
              { title: "Security Guards: +57%", desc: "Federal security guards earn $55K vs $35K private. With FERS pension and FEHB, total comp gap exceeds 80%. Is standing at a metal detector in a federal building really worth 57% more than standing at one in a corporate lobby?" },
              { title: "HR Specialists: +40%", desc: "GS-12 HR specialists earn $105K. Private sector HR generalists with similar experience average $75K. The federal government employs 35,000+ HR specialists — one of the largest concentrations of any occupation." },
              { title: "Administrative Assistants: +38%", desc: "GS-7 secretaries earn $62K with full benefits. Private sector admin assistants average $45K, often without pension or comparable health insurance." },
              { title: "Accountants: +37%", desc: "Federal accountants at GS-12 average $112K. Private sector accountants at similar experience levels average $82K. The gap narrows at senior levels but remains significant for mid-career staff." },
              { title: "Custodians: +31%", desc: "Federal janitors earn $42K plus full benefits. Private sector custodians average $32K, frequently without any retirement benefits at all." },
            ].map((item) => (
              <div key={item.title} className="bg-red-50 border border-red-200 rounded-xl p-5">
                <h4 className="font-semibold text-red-900 mb-2">{item.title}</h4>
                <p className="text-red-800 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <PullQuote
            text="The federal government is the best employer in America — if you're in an administrative role. For those workers, quitting would mean a 30-40% pay cut and losing a pension. No wonder federal quit rates are a third of the private sector."
          />
        </Section>
      </div>

      {/* 4 */}
      <div id="losers">
        <Section emoji="📉" title="Where Feds Lose">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            For technical, scientific, and specialized roles, the federal government genuinely struggles
            to compete. This is where the &quot;underpaid&quot; argument holds:
          </p>

          <div className="space-y-4 mb-8">
            {[
              { title: "Software Engineers: -30%", desc: "GS-13 IT specialists earn $130K. A mid-level software engineer at a major tech company earns $185K+ in base salary alone, often with $50-100K in stock compensation on top. The talent gap is real and growing." },
              { title: "Data Scientists: -29%", desc: "Federal statisticians and data scientists top out around $125K at GS-13. Private sector data scientists with 5+ years earn $175K+ at most companies, $250K+ at FAANG." },
              { title: "Cybersecurity: -18%", desc: "Federal infosec specialists earn $135K. Private sector cybersecurity engineers earn $165K+. Given the critical nature of government systems, this gap is arguably the most dangerous." },
            ].map((item) => (
              <div key={item.title} className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h4 className="font-semibold text-green-900 mb-2">{item.title}</h4>
                <p className="text-green-800 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            This creates a perverse outcome: the government overpays for roles it doesn&apos;t need to compete
            for (there&apos;s no shortage of HR applicants) while underpaying for critical technical roles
            where talent is scarce. The GS system&apos;s one-size-fits-all approach is the root cause.
          </p>
        </Section>
      </div>

      {/* 5 */}
      <div id="benefits">
        <Section emoji="🎁" title="The Benefits Multiplier">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Salary comparisons alone understate federal compensation by 25-40%. Federal benefits are
            extraordinarily generous compared to the private sector:
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Benefit</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Federal</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Private Sector (Typical)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { benefit: "Pension", fed: "FERS: 1-1.1% × years × high-3 salary", priv: "Rare (4% of private workers)" },
                  { benefit: "Retirement Match", fed: "TSP: 5% automatic match", priv: "401(k): 3-4% average match" },
                  { benefit: "Health Insurance", fed: "FEHB: 72-75% employer-paid", priv: "~70% employer-paid average" },
                  { benefit: "Paid Leave", fed: "13-26 days vacation + 13 sick days", priv: "10-15 days PTO average" },
                  { benefit: "Job Security", fed: "Near-absolute (0.5% fired/year)", priv: "At-will employment" },
                  { benefit: "Student Loan Forgiveness", fed: "PSLF after 10 years", priv: "Rare" },
                ].map((r) => (
                  <tr key={r.benefit} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.benefit}</td>
                    <td className="px-4 py-3 text-accent font-medium">{r.fed}</td>
                    <td className="px-4 py-3 text-gray-500">{r.priv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            The CBO estimates that federal benefits are worth <strong>47% more</strong> than private sector benefits
            on average. When you combine a 17% total compensation premium with near-absolute job security,
            federal employment is a very good deal for most workers — especially those without specialized
            technical skills.
          </p>
        </Section>
      </div>

      {/* 6 */}
      <div id="agencies">
        <Section emoji="🏛️" title="The Agencies That Pay the Most">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Some agencies have broken free from the GS system&apos;s constraints entirely. These self-funded
            regulators set their own pay scales:
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Agency</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Avg Salary</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Employees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topAgencies.map((a) => (
                  <tr key={a.code} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/agencies/${a.code}`} className="text-accent hover:underline font-medium">
                        {fixAgencyName(a.name)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{formatSalary(a.avgSalary)}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{formatNumber(a.employees)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      {/* 7 */}
      <div id="editorial">
        <Section emoji="🎯" title="The Bottom Line">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Are federal employees overpaid? For <strong>most roles, yes</strong> — when you include benefits
            and job security. For specialized technical roles, no. The problem isn&apos;t that individual
            workers are greedy; it&apos;s that the system is rigid.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">What Reform Should Look Like:</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-2"><span className="text-accent font-bold">1.</span><span>Pay-for-performance instead of automatic step increases</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">2.</span><span>Market-based pay bands for technical roles (like the FAA already does)</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">3.</span><span>Honest total compensation disclosure (salary + benefits value)</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">4.</span><span>Reduce the benefits premium for non-competitive roles</span></li>
              <li className="flex gap-2"><span className="text-accent font-bold">5.</span><span>End locality pay for full-time remote workers</span></li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            The goal should be a federal workforce that pays market rates — not above, not below. Taxpayers
            deserve efficiency. Workers deserve fairness. The current system delivers neither.
          </p>
        </Section>
      </div>

      <div className="bg-accent-50 border border-accent/20 rounded-xl p-8 text-center">
        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Compare Salaries Yourself</h3>
        <p className="text-gray-600 mb-6">Explore federal pay data by agency, occupation, and grade level.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/salary-explorer" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90">
            Salary Explorer →
          </Link>
          <Link href="/analysis/federal-salary-breakdown" className="border border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent/5">
            Full Salary Breakdown
          </Link>
        </div>
      </div>
    </div>
  );
}
