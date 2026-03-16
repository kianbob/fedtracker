import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/StatCard";

export const metadata: Metadata = {
  title: "Federal Benefits: FERS, TSP, FEHB — Total Compensation Worth — OpenFeds",
  description:
    "What's a federal job really worth? FERS pension, TSP match, FEHB health insurance, paid leave, and job security add 40-50% on top of salary.",
  alternates: { canonical: "/analysis/federal-benefits" },
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

export default function FederalBenefitsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/analysis" className="hover:text-accent">Analysis</Link>
        <span>/</span>
        <span className="text-slate-300">Federal Benefits</span>
      </nav>

      <header className="mb-16">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">OpenFeds Analysis</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          The Golden Handcuffs: What Federal Benefits Are Really Worth
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          A federal employee earning $100,000 in salary actually costs taxpayers about <strong>$148,000</strong> when
          you add benefits. The pension alone is worth $15,000-30,000 per year. Here&apos;s the complete picture.
        </p>
        <div className="flex gap-4 mt-6 text-sm text-gray-500">
          <span>Sources: OPM, CBO, BLS</span>
          <span>·</span>
          <span>Last updated: March 2026</span>
        </div>
      </header>

      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
        <h3 className="font-semibold text-gray-900 mb-3">In This Analysis</h3>
        <ol className="space-y-2 text-gray-700">
          <li><a href="#total" className="hover:text-accent">1. Total Compensation Breakdown</a></li>
          <li><a href="#fers" className="hover:text-accent">2. FERS Pension: The Crown Jewel</a></li>
          <li><a href="#tsp" className="hover:text-accent">3. TSP: The Best 401(k) in America</a></li>
          <li><a href="#fehb" className="hover:text-accent">4. FEHB: Health Insurance for Life</a></li>
          <li><a href="#leave" className="hover:text-accent">5. Paid Leave: 5-6 Weeks Off</a></li>
          <li><a href="#security" className="hover:text-accent">6. Job Security: The Invisible Benefit</a></li>
          <li><a href="#editorial" className="hover:text-accent">7. Are Benefits Too Generous?</a></li>
        </ol>
      </nav>

      {/* 1 */}
      <div id="total">
        <Section emoji="💰" title="Total Compensation Breakdown">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            When you see a federal salary number, you&apos;re seeing roughly two-thirds of the story.
            Here&apos;s what a typical GS-13 Step 5 in Washington, DC actually costs:
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Component</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Annual Value</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { component: "Base Salary (w/ locality)", value: "$131,890", pct: "67.5%" },
                  { component: "FERS Pension (employer contribution)", value: "$22,270", pct: "11.4%" },
                  { component: "TSP Match (5%)", value: "$6,595", pct: "3.4%" },
                  { component: "FEHB (employer share)", value: "$14,520", pct: "7.4%" },
                  { component: "FICA/Medicare (employer)", value: "$10,090", pct: "5.2%" },
                  { component: "FEGLI Life Insurance", value: "$560", pct: "0.3%" },
                  { component: "Paid Leave Value", value: "$9,890", pct: "5.1%" },
                  { component: "Other (transit, training, etc.)", value: "$1,500", pct: "0.8%" },
                ].map((r) => (
                  <tr key={r.component} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.component}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{r.value}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{r.pct}</td>
                  </tr>
                ))}
                <tr className="bg-accent-50 font-bold">
                  <td className="px-4 py-3">TOTAL</td>
                  <td className="px-4 py-3 text-right font-mono">$197,315</td>
                  <td className="px-4 py-3 text-right">100%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Salary" value="$131,890" sub="What they report" />
            <StatCard label="True Cost" value="$197,315" sub="What taxpayers pay" />
            <StatCard label="Benefits Premium" value="+49.6%" sub="On top of salary" />
            <StatCard label="Private Sector Avg" value="+31%" sub="Benefits as % of salary" />
          </div>

          <PullQuote
            text="The CBO found that federal benefits are worth 47% more than private sector benefits. The salary gap is debatable. The benefits gap isn't."
            source="CBO, 2024"
          />
        </Section>
      </div>

      {/* 2 */}
      <div id="fers">
        <Section emoji="🏦" title="FERS Pension: The Crown Jewel">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The Federal Employees Retirement System (FERS) provides a <strong>defined benefit pension</strong> —
            a guaranteed monthly payment for life after retirement. In the private sector, these are nearly
            extinct. Only 4% of private sector workers have a defined benefit pension. 100% of federal
            employees do.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-blue-900 mb-3">How FERS Works</h4>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li><strong>Formula:</strong> 1% × years of service × high-3 average salary (1.1% if retiring at 62+ with 20+ years)</li>
              <li><strong>Example:</strong> 30 years, high-3 of $130,000 = $42,900/year pension (~$3,575/month)</li>
              <li><strong>Employee contribution:</strong> 4.4% of salary for newer hires (FERS-FRAE)</li>
              <li><strong>Employer cost:</strong> ~16.9% of salary (yes, the government contributes 4x what the employee does)</li>
              <li><strong>COLA:</strong> Adjusted annually for inflation (partial CPI adjustment)</li>
              <li><strong>Survivor benefit:</strong> Spouse can receive 50% of pension after death</li>
              <li><strong>Supplement:</strong> Special retirement supplement bridges the gap until Social Security at 62</li>
            </ul>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Scenario</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">High-3 Salary</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Years</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Annual Pension</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Lump Sum Value*</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { scenario: "GS-12, 25 years", salary: "$100,000", years: "25", pension: "$25,000", lump: "$475,000" },
                  { scenario: "GS-13, 30 years", salary: "$130,000", years: "30", pension: "$42,900", lump: "$815,000" },
                  { scenario: "GS-14, 30 years", salary: "$155,000", years: "30", pension: "$51,150", lump: "$972,000" },
                  { scenario: "GS-15, 35 years, age 62+", salary: "$180,000", years: "35", pension: "$69,300", lump: "$1,317,000" },
                  { scenario: "SES, 30 years, age 62+", salary: "$200,000", years: "30", pension: "$66,000", lump: "$1,254,000" },
                ].map((r) => (
                  <tr key={r.scenario} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.scenario}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.salary}</td>
                    <td className="px-4 py-3 text-right">{r.years}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{r.pension}</td>
                    <td className="px-4 py-3 text-right font-mono text-accent">{r.lump}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-400 p-3">*Approximate present value assuming 4% discount rate, 25-year payout period.</p>
          </div>

          <PullQuote
            text="A GS-15 who retires at 62 with 35 years of service gets a pension worth $1.3 million in present value — on top of their TSP savings and Social Security. Find that in the private sector."
          />
        </Section>
      </div>

      {/* 3 */}
      <div id="tsp">
        <Section emoji="📈" title="TSP: The Best 401(k) in America">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The Thrift Savings Plan (TSP) is the federal government&apos;s defined contribution retirement
            plan — essentially a 401(k) on steroids. With 5% automatic matching and rock-bottom expense
            ratios, it&apos;s objectively one of the best retirement plans available anywhere.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Auto Enrollment" value="5%" sub="Of salary, immediate" />
            <StatCard label="Employer Match" value="5%" sub="Dollar-for-dollar up to 5%" />
            <StatCard label="Expense Ratio" value="0.043%" sub="vs 0.5-1% typical 401(k)" />
            <StatCard label="Total TSP Assets" value="$870B" sub="Largest DC plan in world" />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-green-900 mb-3">TSP Match Structure</h4>
            <ul className="space-y-2 text-green-800 text-sm">
              <li><strong>1% automatic:</strong> Agency contributes 1% even if employee contributes nothing</li>
              <li><strong>3% dollar-for-dollar:</strong> First 3% of employee contribution matched 100%</li>
              <li><strong>2% at 50 cents:</strong> Next 2% of employee contribution matched at 50%</li>
              <li><strong>Total:</strong> Employee puts in 5%, gets 10% total (5% own + 5% match)</li>
              <li><strong>Vesting:</strong> 3 years for match contributions (1% automatic is immediate)</li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            The TSP&apos;s expense ratio of 0.043% means a federal worker pays $43 per year on a $100,000 balance.
            A private sector worker in a typical 401(k) paying 0.5% pays $500. Over a 30-year career, that
            fee difference alone can mean $50,000+ more in retirement savings.
          </p>
        </Section>
      </div>

      {/* 4 */}
      <div id="fehb">
        <Section emoji="🏥" title="FEHB: Health Insurance for Life">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The Federal Employees Health Benefits (FEHB) program covers 8 million people — federal employees,
            retirees, and dependents. The government pays 72-75% of premiums, and critically, coverage
            continues into retirement (most private employers cut you off at 65).
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard label="Govt Contribution" value="72-75%" sub="Of premium cost" />
            <StatCard label="Avg Family Premium" value="$21,600/yr" sub="Total (govt + employee)" />
            <StatCard label="Employee Cost" value="~$5,400/yr" sub="For family coverage" />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-amber-900 mb-2">The Retirement Health Insurance Superpower</h4>
            <p className="text-amber-800 text-sm leading-relaxed">
              If you retire from federal service with 5+ years of FEHB enrollment, you keep your health
              insurance <strong>for life</strong> at the same employer contribution rate. In the private sector,
              retiree health coverage is nearly extinct. A federal retiree from age 57 to 65 (before Medicare)
              gets ~$12,000/year in health insurance subsidies. That&apos;s worth $96,000+ in pre-Medicare coverage
              alone — and it continues as a Medicare supplement after 65.
            </p>
          </div>
        </Section>
      </div>

      {/* 5 */}
      <div id="leave">
        <Section emoji="🌴" title="Paid Leave: 5-6 Weeks Off">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Federal leave policies are significantly more generous than private sector norms:
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Leave Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Federal</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Private Avg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { type: "Annual Leave (0-3 yrs)", fed: "13 days", priv: "10 days" },
                  { type: "Annual Leave (3-15 yrs)", fed: "20 days", priv: "15 days" },
                  { type: "Annual Leave (15+ yrs)", fed: "26 days", priv: "15-20 days" },
                  { type: "Sick Leave", fed: "13 days (unlimited accrual)", priv: "6-8 days (often PTO combined)" },
                  { type: "Federal Holidays", fed: "11 days", priv: "6-8 days" },
                  { type: "Paid Parental Leave", fed: "12 weeks", priv: "0-8 weeks (varies widely)" },
                  { type: "Total Possible Time Off (15+ yrs)", fed: "50+ days", priv: "25-35 days" },
                ].map((r) => (
                  <tr key={r.type} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.type}</td>
                    <td className="px-4 py-3 text-accent font-medium">{r.fed}</td>
                    <td className="px-4 py-3 text-gray-500">{r.priv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            The sick leave provision is particularly notable: federal employees accrue 13 sick days per year
            with <strong>no cap on accumulation</strong>. A 30-year employee could have 390 days of sick leave
            banked. At retirement, unused sick leave adds to years of service for pension calculation.
            A 30-year employee with 6 months of banked sick leave effectively has a 30.5-year pension.
          </p>
        </Section>
      </div>

      {/* 6 */}
      <div id="security">
        <Section emoji="🔒" title="Job Security: The Invisible Benefit">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            How do you value something that doesn&apos;t show up on a pay stub? Job security is arguably
            the most valuable federal benefit — and the hardest to quantify.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Fed Quit Rate" value="1.0%" sub="Annual voluntary turnover" />
            <StatCard label="Private Quit Rate" value="3.5%" sub="Annual voluntary turnover" />
            <StatCard label="Fed Firing Rate" value="0.5%" sub="Annual involuntary separation" />
            <StatCard label="Private Firing Rate" value="1.8%" sub="Annual involuntary separation" />
          </div>

          <PullQuote
            text="Federal employees are fired at one-quarter the rate of private sector workers. In some agencies, you're more likely to die on the job than be fired for poor performance. That level of job security has a quantifiable economic value — economists estimate 5-15% of compensation."
          />

          <p className="text-gray-700 leading-relaxed mb-4">
            The economic value of job security can be estimated by looking at the wage premium workers demand
            to accept less secure employment. Research suggests workers value job security at 5-15% of
            compensation. For a $130K federal employee, that&apos;s an implicit $6,500-$19,500 in annual value
            that doesn&apos;t appear anywhere on their W-2.
          </p>
        </Section>
      </div>

      {/* 7 */}
      <div id="editorial">
        <Section emoji="⚖️" title="Are Benefits Too Generous?">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Let&apos;s be direct: yes, for most roles, federal benefits exceed what the private sector offers.
            The pension alone puts federal total compensation above market for administrative and clerical positions.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">The Accountability Lens:</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-2">
                <span className="text-accent font-bold">→</span>
                <span>The FERS pension costs taxpayers 16.9% of each employee&apos;s salary — 4x what the employee contributes. Should taxpayers subsidize retirement at this rate for 2 million workers?</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">→</span>
                <span>Why should federal retirees keep employer health insurance subsidies for life when almost no private workers do?</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">→</span>
                <span>Unlimited sick leave accrual that converts to pension credit is a perk that no private employer offers. Is it justified?</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">→</span>
                <span>A firing rate of 0.5% means 99.5% of federal workers keep their jobs every year regardless of performance. Is that accountability?</span>
              </li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            That said, the answer isn&apos;t to slash benefits to private-sector minimums. The government needs
            to attract competent people, and competitive benefits are part of that. The answer is to be honest
            about total compensation, tie benefits more closely to performance, and stop pretending that
            federal workers are underpaid when the total package is examined honestly.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Every dollar in federal benefits is funded by taxpayers who, in many cases, don&apos;t have
            comparable benefits themselves. That deserves at least acknowledgment, if not reform.
          </p>
        </Section>
      </div>

      <div className="bg-accent-50 border border-accent/20 rounded-xl p-8 text-center">
        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Related Analysis</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/analysis/overpaid-bureaucrats" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90">
            Fed vs Private Pay →
          </Link>
          <Link href="/analysis/federal-salary-breakdown" className="border border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent/5">
            Salary Breakdown
          </Link>
          <Link href="/retirement-cliff" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
            Retirement Cliff
          </Link>
        </div>
      </div>
    </div>
  );
}
