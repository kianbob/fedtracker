import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { formatNumber, formatSalary } from "@/lib/format";

export const metadata: Metadata = {
  title: "Agency by Agency Federal Cuts 2026: Who Lost the Most | OpenFeds",
  description:
    "Detailed breakdown of 2026 federal workforce cuts by agency. Which agencies lost the most employees, what positions were eliminated, and where the government is smaller.",
  alternates: { canonical: "/analysis/agency-cuts-2026" },
  openGraph: {
    title: "Agency by Agency: Federal Cuts in 2026",
    description: "Which agencies shrank the most in 2026? Complete breakdown of positions eliminated, methods used, and current staffing levels.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Agency by Agency Federal Cuts 2026: Who Lost the Most",
  description: "Detailed breakdown of 2026 federal workforce cuts by agency, including positions eliminated, methods used, and what roles were cut.",
  author: { "@type": "Organization", name: "OpenFeds" },
  publisher: { "@type": "Organization", name: "OpenFeds" },
  datePublished: "2026-07-10",
  dateModified: "2026-07-10",
};

function Section({ emoji, title, id, children }: { emoji: string; title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-8">
      <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        <span className="mr-3">{emoji}</span>{title}
      </h2>
      {children}
    </section>
  );
}

interface AgencyData {
  name: string;
  preDoge: number;
  current: number;
  cut: number;
  pctCut: number;
  topCuts: string[];
  avgSalaryCut: number;
  status: string;
  verdict: "overdue" | "reasonable" | "questionable" | "mixed";
}

const agencies: AgencyData[] = [
  {
    name: "USAID",
    preDoge: 10000, current: 1500, cut: 8500, pctCut: 85,
    topCuts: ["Program officers", "Country directors", "Grant administrators", "Policy analysts"],
    avgSalaryCut: 105000,
    status: "Effectively absorbed by State Dept. Most foreign aid programs restructured or eliminated.",
    verdict: "mixed",
  },
  {
    name: "Dept. of Health & Human Services",
    preDoge: 85000, current: 56800, cut: 28200, pctCut: 33,
    topCuts: ["Administrative staff", "Grant program managers", "Policy coordinators", "DEI offices", "Communications staff"],
    avgSalaryCut: 89000,
    status: "NIH research grants backlogged. CDC restructured. FDA inspection schedules reduced.",
    verdict: "mixed",
  },
  {
    name: "IRS / Treasury",
    preDoge: 90000, current: 65000, cut: 25000, pctCut: 28,
    topCuts: ["IRA-surge hires", "Revenue agents", "Customer service reps", "IT modernization staff"],
    avgSalaryCut: 76000,
    status: "Enforcement capacity reduced ~35%. Much of the Inflation Reduction Act hiring reversed.",
    verdict: "reasonable",
  },
  {
    name: "Dept. of Education",
    preDoge: 14400, current: 7200, cut: 7200, pctCut: 50,
    topCuts: ["Program specialists", "Compliance officers", "Regional representatives", "Policy staff"],
    avgSalaryCut: 94000,
    status: "Legislation to abolish pending. Student loan servicing transferred to Treasury.",
    verdict: "overdue",
  },
  {
    name: "EPA",
    preDoge: 16700, current: 10200, cut: 6500, pctCut: 39,
    topCuts: ["Environmental scientists", "Enforcement officers", "Regional staff", "Climate program staff"],
    avgSalaryCut: 97000,
    status: "Permit processing reportedly faster. Environmental enforcement significantly reduced.",
    verdict: "mixed",
  },
  {
    name: "General Services Administration",
    preDoge: 11900, current: 6200, cut: 5700, pctCut: 48,
    topCuts: ["Real estate specialists", "Procurement officers", "IT support", "Administrative staff"],
    avgSalaryCut: 82000,
    status: "Scrambled to support ICE facility expansion after cutting facility management staff.",
    verdict: "questionable",
  },
  {
    name: "Veterans Affairs",
    preDoge: 433000, current: 427800, cut: 5200, pctCut: 1.2,
    topCuts: ["Administrative assistants", "HR specialists", "Training coordinators", "Compliance officers"],
    avgSalaryCut: 68000,
    status: "Healthcare delivery maintained. Administrative processing slower.",
    verdict: "reasonable",
  },
  {
    name: "Dept. of Energy",
    preDoge: 15200, current: 11100, cut: 4100, pctCut: 27,
    topCuts: ["Clean energy program staff", "Administrative positions", "Policy analysts", "Grant managers"],
    avgSalaryCut: 101000,
    status: "National labs protected. Clean energy and climate programs largely frozen.",
    verdict: "reasonable",
  },
  {
    name: "Social Security Administration",
    preDoge: 63300, current: 59500, cut: 3800, pctCut: 6,
    topCuts: ["Field office staff", "Claims processors", "IT positions", "Management layers"],
    avgSalaryCut: 62000,
    status: "Wait times up 40% at field offices. Already understaffed before cuts.",
    verdict: "questionable",
  },
  {
    name: "Small Business Administration",
    preDoge: 9000, current: 5400, cut: 3600, pctCut: 40,
    topCuts: ["Disaster loan processors", "District office staff", "Program managers", "Outreach coordinators"],
    avgSalaryCut: 74000,
    status: "Disaster loan backlog significant. Lending programs slowed.",
    verdict: "mixed",
  },
  {
    name: "CFPB",
    preDoge: 2000, current: 800, cut: 1200, pctCut: 60,
    topCuts: ["Enforcement attorneys", "Examiners", "Research analysts", "Policy staff"],
    avgSalaryCut: 118000,
    status: "Near-shutdown. Minimal enforcement activity. Legal challenges ongoing.",
    verdict: "overdue",
  },
  {
    name: "Dept. of Commerce",
    preDoge: 47000, current: 41500, cut: 5500, pctCut: 12,
    topCuts: ["Census follow-up staff", "Trade compliance officers", "NOAA administrative", "BEA analysts"],
    avgSalaryCut: 87000,
    status: "Census 2030 prep slowed. Weather forecasting capacity maintained.",
    verdict: "reasonable",
  },
];

const verdictConfig: Record<string, { label: string; color: string; bg: string }> = {
  overdue: { label: "Overdue", color: "text-green-700 dark:text-green-300", bg: "bg-green-100 dark:bg-green-900/30" },
  reasonable: { label: "Reasonable", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-900/30" },
  mixed: { label: "Mixed", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-900/30" },
  questionable: { label: "Questionable", color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-900/30" },
};

const positionCategories = [
  { category: "Administrative & Support", pct: 34, count: 87000, description: "Schedulers, admin assistants, HR generalists, mail clerks. Many positions that could be automated or consolidated." },
  { category: "Management & Supervisory", pct: 22, count: 56000, description: "GS-14/15 managers, division directors, branch chiefs. Flattened org charts from 4.1:1 to 3.2:1 manager ratio." },
  { category: "Policy & Program Staff", pct: 19, count: 49000, description: "Program analysts, policy advisors, compliance coordinators. Often the most controversial cuts — some essential, some not." },
  { category: "IT & Modernization", pct: 8, count: 20000, description: "Including many IRA-funded IRS modernization hires. Some argue these cuts will cost more long-term." },
  { category: "Communications & DEI", pct: 7, count: 18000, description: "Public affairs officers, DEI coordinators, social media managers. Targeted early and aggressively." },
  { category: "Scientific & Technical", pct: 6, count: 15000, description: "Researchers, scientists, engineers. Mostly at EPA, NOAA, and HHS. Brain drain concerns legitimate here." },
  { category: "Field Operations", pct: 4, count: 11000, description: "Regional office staff, field inspectors, outreach workers. Cuts with the most visible public impact." },
];

export default function AgencyCuts2026Page() {
  const sorted = [...agencies].sort((a, b) => b.pctCut - a.pctCut);
  const totalCut = agencies.reduce((s, a) => s + a.cut, 0);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { label: "Analysis", href: "/analysis" },
          { label: "DOGE & Cuts", href: "/cuts" },
          { label: "Agency Cuts 2026" },
        ]} />

        <header className="mb-16">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">OpenFeds Analysis</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
            Agency by Agency: Federal Cuts in 2026
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
            Not all agencies were treated equally — and not all agencies <em>deserved</em> equal treatment.
            Some had genuine bloat. Others were lean operations that got cut anyway. Here&apos;s agency-level data
            on what was eliminated, what positions were lost, and our assessment of whether each cut made sense.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-500">
            <span>Sources: OPM, GAO, Federal News Network, agency reports</span>
            <span>·</span>
            <span>Updated: July 2026</span>
          </div>
        </header>

        {/* Ranking table */}
        <Section emoji="📊" title="Cuts by Agency (Ranked by Severity)" id="ranking">
          <div className="space-y-3">
            {sorted.map((a) => (
              <div key={a.name} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-gray-100">{a.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${verdictConfig[a.verdict].color} ${verdictConfig[a.verdict].bg}`}>
                      {verdictConfig[a.verdict].label}
                    </span>
                  </div>
                  <span className="text-lg font-bold font-mono text-red-700 dark:text-red-400">−{a.pctCut}%</span>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-3 text-center">
                  <div>
                    <div className="text-lg font-bold font-mono text-gray-900 dark:text-gray-100">{formatNumber(a.preDoge)}</div>
                    <div className="text-xs text-gray-500">Pre-DOGE</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold font-mono text-red-700 dark:text-red-400">−{formatNumber(a.cut)}</div>
                    <div className="text-xs text-gray-500">Cut</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold font-mono text-gray-900 dark:text-gray-100">{formatNumber(a.current)}</div>
                    <div className="text-xs text-gray-500">Current</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold font-mono text-gray-900 dark:text-gray-100">{formatSalary(a.avgSalaryCut)}</div>
                    <div className="text-xs text-gray-500">Avg Salary Cut</div>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 mb-3">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${Math.min(a.pctCut, 100)}%` }} />
                </div>

                <div className="mb-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Top positions cut:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {a.topCuts.map((c) => (
                      <span key={c} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{c}</span>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{a.status}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* What was cut */}
        <Section emoji="🗂️" title="What Types of Positions Were Cut?" id="positions">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            The composition of cuts matters more than the total number. Here&apos;s what types of roles were eliminated:
          </p>
          <div className="space-y-4">
            {positionCategories.map((p) => (
              <div key={p.category} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{p.category}</h3>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-bold font-mono text-gray-900 dark:text-gray-100">{formatNumber(p.count)}</span>
                    <span className="text-sm text-gray-500 ml-2">({p.pct}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 mb-3">
                  <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${p.pct * 2.5}%` }} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{p.description}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Bottom line */}
        <Section emoji="⚖️" title="The Bottom Line" id="bottom-line">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              Were all of these cuts smart? No. GSA cutting facility staff and then scrambling to find ICE office 
              space is Exhibit A of poor planning. SSA cuts hitting elderly Americans who need in-person help is 
              a genuine problem.
            </p>
            <p>
              Were most of these cuts defensible? The data suggests yes. When 34% of eliminations are administrative 
              roles, 22% are excess management layers, and 23% were vacant positions nobody missed — the 
              &ldquo;devastating cuts&rdquo; narrative doesn&apos;t hold up for the majority of reductions.
            </p>
            <p>
              The federal government had 4.1 managers for every frontline worker. That&apos;s now 3.2:1 — still 
              higher than the private sector average of 2.5:1, but moving in the right direction. A leaner 
              government isn&apos;t inherently a worse government. Often, it&apos;s the opposite.
            </p>
          </div>
        </Section>

        <div className="flex flex-wrap gap-4 mt-8 mb-16">
          <Link href="/cuts" className="text-indigo-600 hover:underline font-medium">← DOGE & Cuts Hub</Link>
          <Link href="/analysis/workforce-reductions-2025-2026" className="text-indigo-600 hover:underline font-medium">
            Full Reductions Data →
          </Link>
          <Link href="/analysis/workforce-trends" className="text-indigo-600 hover:underline font-medium">
            Historical Trends →
          </Link>
        </div>
      </div>
    </div>
  );
}
