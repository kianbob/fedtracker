import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { formatNumber, fixAgencyName } from "@/lib/format";
import dogeImpact from "../../../public/data/doge-impact.json";
import hardestHit from "../../../public/data/hardest-hit.json";

export const metadata: Metadata = {
  title: "Who Got Cut: The DOGE Workforce Reduction — OpenFeds",
  description:
    "335,000 federal separations in 2025 — a 67% increase. RIFs surged from 46 to 10,721. Here's who was affected, which agencies shrank, and where the jobs disappeared.",
};

function PullQuote({ text, source }: { text: string; source?: string }) {
  return (
    <blockquote className="border-l-4 border-accent pl-6 py-4 my-8 bg-accent-50 rounded-r-xl">
      <p className="text-xl font-serif italic text-gray-900">{text}</p>
      {source && (
        <cite className="text-sm text-gray-500 mt-2 block not-italic">
          — {source}
        </cite>
      )}
    </blockquote>
  );
}

function Section({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16 scroll-mt-8">
      <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">
        <span className="mr-3">{emoji}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

const topRifAgencies = dogeImpact.rifByAgency2025.slice(0, 10);
const topNetLoss = dogeImpact.topAgenciesByNetLoss;
const topReduction = [...hardestHit]
  .filter((a) => a.employees > 500)
  .sort((a, b) => b.reductionPct - a.reductionPct)
  .slice(0, 10);

const totalRifs2025 = dogeImpact.rifByYear["2025"];
const totalQuits = hardestHit.reduce((s, a) => s + a.quitCount, 0);
const totalRetirements = hardestHit.reduce(
  (s, a) => s + a.retirementCount, 0
);
const totalTerminations = hardestHit.reduce(
  (s, a) => s + a.terminationCount, 0
);

export default function WhoGotCutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-indigo-400">Home</Link>
        <span>/</span>
        <span>Analysis</span>
        <span>/</span>
        <span className="text-slate-300">Who Got Cut</span>
      </nav>
      <header className="mb-16">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">
          OpenFeds Editorial
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Who Got Cut: The DOGE
          <br className="hidden sm:block" /> Workforce Reduction
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          In 2025, the federal government shed an estimated{" "}
          <strong>217,000 net positions</strong>. Total separations hit{" "}
          {formatNumber(dogeImpact.separations2025)} &mdash; a{" "}
          {dogeImpact.separationChangePct}% increase over 2024. Here&apos;s
          where the cuts landed.
        </p>
        <div className="flex gap-4 mt-6 text-sm text-gray-500">
          <span>Data: OPM FedScope Separations Jan&ndash;Nov 2025</span>
          <span>&middot;</span>
          <span>Accessions: FY2025</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">Last updated: February 2026</p>
      </header>

      {/* TOC */}
      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">In This Analysis</h3>
        <ol className="space-y-2 text-gray-700">
          <li>
            <a href="#overview" className="hover:text-accent">
              1. The Numbers
            </a>
          </li>
          <li>
            <a href="#rifs" className="hover:text-accent">
              2. Reductions in Force (RIFs)
            </a>
          </li>
          <li>
            <a href="#agencies" className="hover:text-accent">
              3. Hardest-Hit Agencies
            </a>
          </li>
          <li>
            <a href="#how" className="hover:text-accent">
              4. How People Left
            </a>
          </li>
          <li>
            <a href="#monthly" className="hover:text-accent">
              5. The Monthly Timeline
            </a>
          </li>
          <li>
            <a href="#editorial" className="hover:text-accent">
              6. What It Means
            </a>
          </li>
        </ol>
      </nav>

      {/* 1 */}
      <div id="overview">
        <Section emoji="📊" title="The Numbers">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Between January and November 2025, the federal government recorded{" "}
            <strong>{formatNumber(dogeImpact.separations2025)}</strong>{" "}
            separations and only{" "}
            <strong>{formatNumber(dogeImpact.accessions2025)}</strong> new
            hires. That&apos;s a net loss of{" "}
            <strong>
              {formatNumber(Math.abs(dogeImpact.netChangeSinceJan2025))}
            </strong>{" "}
            positions &mdash; driven by hiring freezes, early retirement
            incentives, and outright RIFs.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Separations"
              value={formatNumber(dogeImpact.separations2025)}
              sub={`+${dogeImpact.separationChangePct}% vs 2024`}
            />
            <StatCard
              label="New Hires"
              value={formatNumber(dogeImpact.accessions2025)}
              sub={`${dogeImpact.accessionChangePct}% vs 2024`}
            />
            <StatCard
              label="Net Change"
              value={`-${formatNumber(Math.abs(dogeImpact.netChangeSinceJan2025))}`}
              sub="Jan-Nov 2025"
            />
            <StatCard
              label="RIFs"
              value={formatNumber(totalRifs2025)}
              sub={`vs ${dogeImpact.rifByYear["2024"]} in 2024`}
            />
          </div>

          <PullQuote text="New hiring dropped 54% while separations surged 67%. The government didn't just shrink through attrition &mdash; the door out was wide open while the door in was locked." />
        </Section>
      </div>

      {/* 2 */}
      <div id="rifs">
        <Section emoji="🪓" title="Reductions in Force">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            RIFs &mdash; involuntary layoffs &mdash; jumped from{" "}
            <strong>46 in all of FY2024</strong> to{" "}
            <strong>{formatNumber(totalRifs2025)} in 2025</strong>. That&apos;s
            a{" "}
            <strong>
              {Math.round(totalRifs2025 / dogeImpact.rifByYear["2024"])}x
            </strong>{" "}
            increase. HHS and USAID alone accounted for over 8,000 RIFs.
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-6">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Agency
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    RIFs (2025)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topRifAgencies.map((a) => (
                  <tr
                    key={a.code}
                    className={
                      a.rifCount > 1000
                        ? "bg-red-50/50 font-medium"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-3 py-3">
                      <Link
                        href={`/agencies/${a.code}`}
                        className="text-accent hover:underline"
                      >
                        {fixAgencyName(a.name)}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-gray-900">
                      {formatNumber(a.rifCount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 leading-relaxed">
            For historical context: between 2020 and 2023, total annual RIFs
            across the entire federal government were in the{" "}
            <strong>single digits</strong>. See the full{" "}
            <Link
              href="/doge"
              className="text-accent font-semibold hover:underline"
            >
              DOGE impact analysis
            </Link>{" "}
            for monthly trends.
          </p>
        </Section>
      </div>

      {/* 3 */}
      <div id="agencies">
        <Section emoji="🏛️" title="Hardest-Hit Agencies">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            As a percentage of workforce, the Department of Education lost
            nearly 80% of its employees. USAID was effectively dismantled. But
            in raw numbers, the largest agencies &mdash; VA, Treasury,
            Agriculture &mdash; shed the most positions.
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-6">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Agency
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Employees
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    2025 Seps
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    % Reduced
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topReduction.map((a) => (
                  <tr
                    key={a.code}
                    className={
                      a.reductionPct > 50
                        ? "bg-red-50/50 font-medium"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-3 py-3">
                      <Link
                        href={`/agencies/${a.code}`}
                        className="text-accent hover:underline"
                      >
                        {fixAgencyName(a.name)}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-right text-gray-700">
                      {formatNumber(a.employees)}
                    </td>
                    <td className="px-3 py-3 text-right text-gray-700">
                      {formatNumber(a.seps2025)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span
                        className={
                          a.reductionPct > 50
                            ? "text-red-600 font-bold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {a.reductionPct > 100 ? ">100" : a.reductionPct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            The top 10 agencies by net loss tell a similar story:
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl mb-6">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Agency
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Net Change
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Seps
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Hires
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topNetLoss.map((a) => (
                  <tr key={a.code} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <Link
                        href={`/agencies/${a.code}`}
                        className="text-accent hover:underline"
                      >
                        {fixAgencyName(a.name)}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-red-600">
                      {formatNumber(a.netChange)}
                    </td>
                    <td className="px-3 py-3 text-right text-gray-700">
                      {formatNumber(a.separations)}
                    </td>
                    <td className="px-3 py-3 text-right text-gray-700">
                      {formatNumber(a.accessions)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PullQuote text="Treasury lost 25,000 net positions &mdash; mostly IRS employees. Whether that means fewer audits of the wealthy or less bureaucratic overhead depends on which positions were cut." />
        </Section>
      </div>

      {/* 4 */}
      <div id="how">
        <Section emoji="🚪" title="How People Left">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Most departures weren&apos;t forced layoffs. The majority were
            voluntary &mdash; quits and retirements &mdash; though many were
            influenced by the chaotic environment, hiring freezes, and the
            &quot;deferred resignation&quot; program that offered employees a
            paid exit through September 2025.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Quits"
              value={formatNumber(totalQuits)}
              sub="Voluntary resignations"
            />
            <StatCard
              label="Retirements"
              value={formatNumber(totalRetirements)}
              sub="Voluntary & early"
            />
            <StatCard
              label="RIFs"
              value={formatNumber(totalRifs2025)}
              sub="Involuntary layoffs"
            />
            <StatCard
              label="Terminations"
              value={formatNumber(totalTerminations)}
              sub="For cause or probationary"
            />
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            The &quot;deferred resignation&quot; program, announced in early
            2025, offered federal employees a chance to resign with pay through
            the end of the fiscal year. While exact participation numbers are
            difficult to isolate from OPM data, the surge in voluntary
            separations beginning in February 2025 suggests significant uptake.
          </p>

          <p className="text-gray-700 leading-relaxed">
            For a detailed breakdown by separation type, see the{" "}
            <Link
              href="/layoffs"
              className="text-accent font-semibold hover:underline"
            >
              separations dashboard
            </Link>{" "}
            or drill into specific types like{" "}
            <Link
              href="/separations/SC"
              className="text-accent font-semibold hover:underline"
            >
              quits
            </Link>
            ,{" "}
            <Link
              href="/separations/SD"
              className="text-accent font-semibold hover:underline"
            >
              retirements
            </Link>
            , and{" "}
            <Link
              href="/separations/SH"
              className="text-accent font-semibold hover:underline"
            >
              RIFs
            </Link>
            .
          </p>
        </Section>
      </div>

      {/* 5 */}
      <div id="monthly">
        <Section emoji="📅" title="The Monthly Timeline">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The reductions didn&apos;t happen all at once. January looked
            normal. Then the freeze hit.
          </p>

          <div className="space-y-3 mb-8">
            {dogeImpact.monthlyBreakdown2025.map((m) => {
              const month = new Date(
                parseInt(m.month.slice(0, 4)),
                parseInt(m.month.slice(4)) - 1
              ).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              });
              const maxSep = 125589;
              const width = Math.max(
                4,
                Math.round((m.separations / maxSep) * 100)
              );
              return (
                <div key={m.month}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 w-20">
                      {month}
                    </span>
                    <span className="text-gray-500">
                      {formatNumber(m.separations)} seps &middot;{" "}
                      {formatNumber(m.accessions)} hires &middot;{" "}
                      <span
                        className={
                          m.net < 0
                            ? "text-red-600 font-semibold"
                            : "text-green-600 font-semibold"
                        }
                      >
                        {m.net > 0 ? "+" : ""}
                        {formatNumber(m.net)}
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-accent h-2.5 rounded-full"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <PullQuote text="September 2025 saw 125,589 separations in a single month &mdash; more than the prior five months combined. The end-of-fiscal-year deadline created a mass exodus." />
        </Section>
      </div>

      {/* 6 */}
      <div id="editorial">
        <Section emoji="⚖️" title="What It Means">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Right-sizing government means making hard choices. The data shows
            exactly where the cuts landed &mdash; now the question is whether
            services deteriorated or taxpayers got a better deal.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Some reductions were clearly surgical: USAID and the Department of
            Education were targeted for ideological and policy reasons. Others
            were blunt: Treasury and Agriculture lost tens of thousands through
            hiring freezes and attrition, with less regard for which specific
            positions were essential.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            The September cliff &mdash; where deferred resignations, early
            retirements, and end-of-fiscal-year deadlines converged &mdash;
            suggests many employees chose to leave on their own terms rather
            than wait for the axe. That&apos;s not necessarily a bad outcome,
            but it means the government lost people it didn&apos;t choose to
            lose.
          </p>

          <PullQuote text="The hardest part of government reform isn't cutting &mdash; it's cutting the right things. The data shows the scale. The question is whether it was precise." />

          <p className="text-gray-700 leading-relaxed">
            Dive deeper:{" "}
            <Link
              href="/doge"
              className="text-accent font-semibold hover:underline"
            >
              DOGE Impact
            </Link>{" "}
            &middot;{" "}
            <Link
              href="/impact"
              className="text-accent font-semibold hover:underline"
            >
              State Impact
            </Link>{" "}
            &middot;{" "}
            <Link
              href="/states"
              className="text-accent font-semibold hover:underline"
            >
              States
            </Link>{" "}
            &middot;{" "}
            <Link
              href="/risk"
              className="text-accent font-semibold hover:underline"
            >
              Agency Risk Scores
            </Link>
          </p>
        </Section>
      </div>

      {/* Related Analysis */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Related Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/doge", title: "DOGE Impact Dashboard", desc: "Full breakdown of 2025 federal workforce restructuring by agency, month, and separation type." },
            { href: "/impact", title: "State-by-State Impact", desc: "How DOGE-driven federal workforce reductions affect each state — DC, Maryland, and Virginia hit hardest." },
            { href: "/states", title: "State Explorer", desc: "Explore federal employment by state — where the jobs are and where the cuts hit hardest." },
            { href: "/risk", title: "Agency Risk Dashboard", desc: "Which agencies face the highest restructuring risk based on workforce trends." },
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
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
          Sources & Methodology
        </h2>
        <div className="text-gray-700 space-y-3">
          <p>
            All separation and accession data from{" "}
            <strong>OPM FedScope</strong> (January&ndash;November 2025 vs.
            FY2024). RIF counts derived from separation type code SH. Net
            change calculations compare total separations minus total accessions
            for the same period. Reduction percentages calculated as 2025
            separations divided by December 2025 employment count.
          </p>
        </div>
        <div className="mt-6">
          <Link
            href="/about"
            className="text-accent font-semibold hover:underline"
          >
            Full methodology →
          </Link>
        </div>
      </section>
    </div>
  );
}
