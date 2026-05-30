import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Agency Departures: Where 280K Feds Went",
  description:
    "Detailed breakdown of federal workforce departures by agency. From USAID's 85% gutting to VA's surgical trims — how DOGE cuts hit each agency differently.",
  alternates: { canonical: "/analysis/agency-departure-breakdown" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Agency-by-Agency: Where 280,000 Federal Workers Went",
  description: "Detailed breakdown of federal workforce departures by agency under DOGE restructuring.",
  author: { "@type": "Organization", name: "OpenFeds" },
  publisher: { "@type": "Organization", name: "OpenFeds", logo: { "@type": "ImageObject", url: "https://openfeds.com/logo.png" } },
  datePublished: "2026-04-21",
  dateModified: "2026-04-21",
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

const agencyDetails = [
  {
    name: "USAID",
    cuts: 8500,
    pctCut: 85,
    preCut: 10000,
    category: "gutted",
    summary: "Effectively shut down. Secretary of State Rubio placed the agency under State Dept. control. Courts ordered some reinstatements but the agency is a shell of its former self.",
    methods: ["Full agency restructuring", "RIF", "Contract terminations"],
    status: "Most functions transferred to State Dept. Ongoing litigation.",
  },
  {
    name: "Health & Human Services (HHS)",
    cuts: 28200,
    pctCut: 33,
    preCut: 85000,
    category: "heavy",
    summary: "The largest absolute reduction. NIH, CDC, and FDA all took significant hits. Research grants frozen, public health infrastructure hollowed out.",
    methods: ["RIF", "DRP", "Grant cancellations", "Reorganization"],
    status: "Rehiring some critical positions. NIH grant backlog growing.",
  },
  {
    name: "IRS / Treasury",
    cuts: 25000,
    pctCut: 28,
    preCut: 90000,
    category: "heavy",
    summary: "Post-tax-season layoffs began May 2025. Wiped out much of the Inflation Reduction Act hiring surge. Customer service wait times increasing.",
    methods: ["RIF", "Attrition", "Hiring freeze"],
    status: "Seasonal rehiring for tax season. Enforcement capacity reduced.",
  },
  {
    name: "Dept. of Education",
    cuts: 7200,
    pctCut: 50,
    preCut: 14400,
    category: "heavy",
    summary: "Administration signaled intent to abolish the department entirely. Half the workforce gone through a combination of RIFs and voluntary exits.",
    methods: ["RIF", "DRP", "Proposed abolition"],
    status: "Legislation pending. Student loan servicing disrupted.",
  },
  {
    name: "EPA",
    cuts: 6500,
    pctCut: 39,
    preCut: 16700,
    category: "heavy",
    summary: "Environmental enforcement teams decimated. Regional offices closed or consolidated. Permit review timelines extended.",
    methods: ["RIF", "DRP", "Office closures"],
    status: "Industry groups reporting faster permits; environmental groups suing.",
  },
  {
    name: "General Services Administration",
    cuts: 5700,
    pctCut: 48,
    preCut: 11900,
    category: "heavy",
    summary: "Nearly half the agency cut. Then had to scramble to find office space for ICE expansion. A case study in cutting before thinking.",
    methods: ["RIF", "Lease cancellations"],
    status: "Rehiring for ICE support. Lease management in chaos.",
  },
  {
    name: "Dept. of Energy",
    cuts: 4100,
    pctCut: 27,
    preCut: 15200,
    category: "moderate",
    summary: "National lab workforce largely protected. Cuts concentrated in clean energy programs and administrative functions.",
    methods: ["RIF", "DRP", "Program eliminations"],
    status: "Lab operations stable. Clean energy programs frozen.",
  },
  {
    name: "Social Security Administration",
    cuts: 3800,
    pctCut: 6,
    preCut: 63300,
    category: "light",
    summary: "Relatively light cuts percentage-wise, but on an already understaffed agency. Field office closures affecting beneficiaries.",
    methods: ["Attrition", "Hiring freeze"],
    status: "Wait times at field offices up 40%. Claims backlog growing.",
  },
  {
    name: "Small Business Administration",
    cuts: 3600,
    pctCut: 40,
    preCut: 9000,
    category: "heavy",
    summary: "Disaster loan processing severely impacted. SBA lending programs slowed.",
    methods: ["RIF", "DRP"],
    status: "Disaster loan backlog significant.",
  },
  {
    name: "Veterans Affairs",
    cuts: 5200,
    pctCut: 1.2,
    preCut: 433000,
    category: "light",
    summary: "As the largest civilian agency, VA was largely shielded. Cuts focused on administrative roles, not healthcare delivery.",
    methods: ["Targeted RIF", "Attrition"],
    status: "Healthcare delivery mostly maintained. Admin backlogs increasing.",
  },
  {
    name: "Consumer Financial Protection Bureau",
    cuts: 1200,
    pctCut: 60,
    preCut: 2000,
    category: "gutted",
    summary: "Near-shutdown. Director effectively halted all enforcement actions. Workforce cut by 60%.",
    methods: ["RIF", "Enforcement halt"],
    status: "Minimal operations. Legal challenges ongoing.",
  },
];

const categoryConfig: Record<string, { label: string; color: string }> = {
  gutted: { label: "Gutted (50%+)", color: "bg-red-600" },
  heavy: { label: "Heavy (25-50%)", color: "bg-orange-500" },
  moderate: { label: "Moderate (10-25%)", color: "bg-amber-400" },
  light: { label: "Light (<10%)", color: "bg-green-500" },
};

export default function AgencyDepartureBreakdownPage() {
  const sorted = [...agencyDetails].sort((a, b) => b.pctCut - a.pctCut);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { label: "Analysis", href: "/analysis" },
          { label: "DOGE & Cuts", href: "/cuts" },
          { label: "Agency Departures" },
        ]} />

        <header className="mb-16">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">OpenFeds Analysis</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
            Agency-by-Agency: Where 280,000 Federal Workers Went
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
            Not all agencies were cut equally. USAID lost 85% of its workforce while VA lost just over 1%.
            Here&apos;s how each major agency was affected, what methods were used, and what the consequences look like.
          </p>
          <div className="flex gap-4 mt-6 text-sm text-gray-500">
            <span>Sources: OPM, AP, Federal News Network, agency reports</span>
            <span>·</span>
            <span>Published: April 2026</span>
          </div>
        </header>

        {/* Visual overview bar chart */}
        <Section emoji="📊" title="The Big Picture" id="overview">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            Agencies ranked by percentage of workforce eliminated:
          </p>
          <div className="space-y-3 mb-8">
            {sorted.map((a) => (
              <div key={a.name} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-48 shrink-0 truncate" title={a.name}>
                  {a.name}
                </span>
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${categoryConfig[a.category].color} flex items-center justify-end pr-2`}
                    style={{ width: `${Math.min(a.pctCut, 100)}%` }}
                  >
                    {a.pctCut >= 15 && (
                      <span className="text-xs font-bold text-white">{a.pctCut}%</span>
                    )}
                  </div>
                </div>
                {a.pctCut < 15 && <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{a.pctCut}%</span>}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {Object.entries(categoryConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${cfg.color}`} />
                <span className="text-sm text-gray-600 dark:text-gray-400">{cfg.label}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Individual agency cards */}
        <Section emoji="🏛️" title="Agency Details" id="details">
          <div className="space-y-8">
            {sorted.map((a) => (
              <div key={a.name} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-gray-100">{a.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${categoryConfig[a.category].color}`}>
                    {a.pctCut}% cut
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono text-gray-900 dark:text-gray-100">{formatNumber(a.preCut)}</div>
                    <div className="text-xs text-gray-500">Pre-DOGE</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono text-red-700 dark:text-red-400">−{formatNumber(a.cuts)}</div>
                    <div className="text-xs text-gray-500">Eliminated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono text-gray-900 dark:text-gray-100">{formatNumber(a.preCut - a.cuts)}</div>
                    <div className="text-xs text-gray-500">Remaining</div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{a.summary}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {a.methods.map((m) => (
                    <span key={m} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                      {m}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Current status:</strong> {a.status}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section emoji="🔑" title="Key Patterns" id="patterns">
          <div className="space-y-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-5">
              <h3 className="font-bold text-indigo-900 dark:text-indigo-200 mb-2">Pattern 1: Ideological targeting</h3>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                Agencies with missions the administration opposed (EPA, Education, CFPB, USAID) faced disproportionately
                deep cuts. National security and law enforcement agencies were largely spared.
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
              <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-2">Pattern 2: Cut now, think later</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                GSA cut half its workforce, then had to scramble to support ICE expansion. IRS cut enforcement,
                then rehired seasonal workers. Planning was… minimal.
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
              <h3 className="font-bold text-green-900 dark:text-green-200 mb-2">Pattern 3: Some cuts made sense</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Administrative bloat in some agencies was real. Consolidating redundant functions and reducing
                management layers in agencies with top-heavy org charts addressed legitimate inefficiency.
              </p>
            </div>
          </div>
        </Section>

        <div className="flex flex-wrap gap-4 mt-8 mb-16">
          <Link href="/cuts" className="text-indigo-600 hover:underline font-medium">← Back to DOGE & Cuts</Link>
          <Link href="/analysis/drp-true-cost" className="text-indigo-600 hover:underline font-medium">
            DRP True Cost →
          </Link>
          <Link href="/analysis/doge-cost-vs-savings" className="text-indigo-600 hover:underline font-medium">
            Cost vs. Savings →
          </Link>
        </div>
      </div>
    </div>
  );
}
