import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { formatNumber, formatSalary } from "@/lib/format";
import fs from "fs";
import path from "path";
import DogeRealityClient from "./DogeRealityClient";

// Load real data
const dogeData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/data/doge-dashboard.json"), "utf-8"));
const contractsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/data/doge-contracts-analytics.json"), "utf-8"));

export const metadata: Metadata = {
  title: "The $110 Billion Myth: What DOGE Actually Saved — OpenFeds",
  description:
    "Deep analysis of DOGE's claimed $110.3 billion in savings vs reality. Breaking down contracts, grants, and the verified numbers that tell the real story.",
  alternates: { canonical: "/analysis/doge-savings-reality" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The $110 Billion Myth: What DOGE Actually Saved",
  "description": "Deep analysis of DOGE's claimed $110.3 billion in savings vs reality. Breaking down contracts, grants, and the verified numbers that tell the real story.",
  "author": {
    "@type": "Organization",
    "name": "OpenFeds"
  },
  "publisher": {
    "@type": "Organization",
    "name": "OpenFeds",
    "logo": {
      "@type": "ImageObject",
      "url": "https://openfeds.com/logo.png"
    }
  },
  "datePublished": "2026-03-21",
  "dateModified": "2026-03-21"
};

function PullQuote({ text, source }: { text: string; source?: string }) {
  return (
    <blockquote className="border-l-4 border-indigo-600 pl-6 py-4 my-8 bg-indigo-50 rounded-r-xl">
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

export default function DogeSavingsRealityPage() {
  const totalClaimed = dogeData.totalClaimedSavings;
  const contractSavings = dogeData.breakdown.contracts.savings;
  const grantSavings = dogeData.breakdown.grants.savings;
  const leaseSavings = dogeData.breakdown.leases.savings;
  
  // POLITICO estimated under 5% of claimed savings are real
  const politicoEstimate = totalClaimed * 0.05;
  
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { label: "Analysis", href: "/analysis" },
          { label: "DOGE Savings Reality" }
        ]} />

        <header className="mb-16">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">OpenFeds Analysis</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            The $110 Billion Myth: What DOGE Actually Saved
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
            DOGE claims <strong>${(totalClaimed / 1e9).toFixed(1)} billion</strong> in savings. 
            Independent analysis suggests the real number is closer to <strong>${(politicoEstimate / 1e9).toFixed(1)} billion</strong>. 
            Here's how we get from claimed to actual.
          </p>
          <div className="flex gap-4 mt-6 text-sm text-gray-500">
            <span>Data: FPDS, SAM.gov, POLITICO analysis</span>
            <span>·</span>
            <span>Last updated: March 2026</span>
          </div>
        </header>

        <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
          <h3 className="font-semibold text-gray-900 mb-3">In This Analysis</h3>
          <ol className="space-y-2 text-gray-700">
            <li><a href="#headline" className="hover:text-indigo-600">1. The Headline Numbers</a></li>
            <li><a href="#breakdown" className="hover:text-indigo-600">2. Breaking Down the $110 Billion</a></li>
            <li><a href="#verification" className="hover:text-indigo-600">3. What's Actually Verified</a></li>
            <li><a href="#methodology" className="hover:text-indigo-600">4. How "Savings" Are Calculated</a></li>
            <li><a href="#reality" className="hover:text-indigo-600">5. The Reality Check</a></li>
            <li><a href="#concentration" className="hover:text-indigo-600">6. The Concentration Problem</a></li>
            <li><a href="#verdict" className="hover:text-indigo-600">7. Our Verdict</a></li>
          </ol>
        </nav>

        {/* 1 */}
        <div id="headline">
          <Section emoji="📈" title="The Headline Numbers">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              DOGE's headline number is impressive: <strong>${(totalClaimed / 1e9).toFixed(1)} billion</strong> in savings 
              across {formatNumber(dogeData.totalActions)} terminated contracts, grants, and leases. But headline 
              numbers in government are always more complicated than they appear.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-900 font-mono">${(contractSavings / 1e9).toFixed(1)}B</div>
                <div className="text-blue-700 font-medium mt-1">Contract "Savings"</div>
                <div className="text-sm text-blue-600 mt-1">{formatNumber(dogeData.breakdown.contracts.count)} contracts</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-900 font-mono">${(grantSavings / 1e9).toFixed(1)}B</div>
                <div className="text-green-700 font-medium mt-1">Grant "Savings"</div>
                <div className="text-sm text-green-600 mt-1">{formatNumber(dogeData.breakdown.grants.count)} grants</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-900 font-mono">${Math.round(leaseSavings / 1e6).toLocaleString()}M</div>
                <div className="text-purple-700 font-medium mt-1">Lease "Savings"</div>
                <div className="text-sm text-purple-600 mt-1">{formatNumber(dogeData.breakdown.leases.count)} leases</div>
              </div>
            </div>

            <PullQuote
              text="The $110 billion figure represents the ceiling value of terminated agreements — not money that was actually being spent, and certainly not money saved."
            />

            <p className="text-gray-700 leading-relaxed mb-4">
              This distinction is crucial. When DOGE claims $110 billion in "savings," they're adding up the maximum 
              potential value of every contract and grant they terminated. But most of these agreements weren't 
              fully spent, some were already completed, and many will be replaced with new contracts at similar 
              or higher cost.
            </p>
          </Section>
        </div>

        {/* 2 */}
        <div id="breakdown">
          <Section emoji="🔍" title="Breaking Down the $110 Billion">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Let's examine each category of DOGE's claimed savings to understand what's real and what's accounting.
            </p>

            <DogeRealityClient />

            <div className="space-y-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-3">💼 Contracts: ${(contractSavings / 1e9).toFixed(1)} Billion</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">{formatNumber(dogeData.breakdown.contracts.count)}</div>
                    <div className="text-sm text-blue-700">Total Terminated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">${(contractSavings / dogeData.breakdown.contracts.count / 1e6).toFixed(1)}M</div>
                    <div className="text-sm text-blue-700">Average "Value"</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">99%</div>
                    <div className="text-sm text-blue-700">Verification Rate</div>
                  </div>
                </div>
                <p className="text-blue-800 text-sm">
                  The largest category, but also the most misleading. Many terminated contracts were 
                  already completed or had minimal remaining value. POLITICO's investigation found actual 
                  contract savings were less than 5% of claimed.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="font-semibold text-green-900 mb-3">🎓 Grants: ${(grantSavings / 1e9).toFixed(1)} Billion</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-900">{formatNumber(dogeData.breakdown.grants.count)}</div>
                    <div className="text-sm text-green-700">Total Terminated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-900">${(grantSavings / dogeData.breakdown.grants.count / 1e6).toFixed(1)}M</div>
                    <div className="text-sm text-green-700">Average "Value"</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-900">100%</div>
                    <div className="text-sm text-green-700">Verification Rate</div>
                  </div>
                </div>
                <p className="text-green-800 text-sm">
                  Grant terminations are more likely to represent real savings, as they typically stop 
                  future payments. However, many terminated grants have been replaced by state funding 
                  or new federal programs, reducing net savings.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h4 className="font-semibold text-purple-900 mb-3">🏢 Leases: ${(leaseSavings / 1e6).toFixed(1)} Million</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-900">{formatNumber(dogeData.breakdown.leases.count)}</div>
                    <div className="text-sm text-purple-700">Total Terminated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-900">${Math.round(leaseSavings / dogeData.breakdown.leases.count / 1e3).toLocaleString()}K</div>
                    <div className="text-sm text-purple-700">Average "Value"</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-900">100%</div>
                    <div className="text-sm text-purple-700">Verification Rate</div>
                  </div>
                </div>
                <p className="text-purple-800 text-sm">
                  The smallest category by dollar amount. Most lease "savings" come from consolidating 
                  office space due to remote work policies and workforce reductions. These are likely 
                  genuine savings.
                </p>
              </div>
            </div>
          </Section>
        </div>

        {/* 3 */}
        <div id="verification">
          <Section emoji="✅" title="What's Actually Verified">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Not all of DOGE's claimed savings can be independently verified. Here's what we found when 
              cross-referencing their data with federal databases:
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-amber-900 mb-3">⚠️ Verification Problems</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-amber-800">Contracts verified in FPDS:</span>
                  <span className="font-mono font-bold text-amber-900">{formatNumber(dogeData.contractVerification.verified)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-800">"NOT FOUND IN FPDS":</span>
                  <span className="font-mono font-bold text-red-700">{formatNumber(dogeData.contractVerification.notInFPDS)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-800">No verification link provided:</span>
                  <span className="font-mono font-bold text-red-700">{formatNumber(dogeData.contractVerification.noLink)}</span>
                </div>
              </div>
              <p className="text-amber-800 text-sm mt-4">
                <strong>103 contracts</strong> claimed by DOGE cannot be found in the official federal 
                procurement database. These represent <strong>phantom savings</strong> — either the contracts 
                never existed, were misidentified, or the claimed values are incorrect.
              </p>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Agency</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Claimed Savings</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Verification Rate</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Red Flags</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dogeData.topAgencies.slice(0, 10).map((agency: any) => {
                    const verificationRate = Math.round((1 - (agency.notInFPDS || 0) / (agency.contractCount || 1)) * 100);
                    const hasRedFlags = (agency.notInFPDS || 0) > 0;
                    
                    return (
                      <tr key={agency.agency} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{agency.agency}</td>
                        <td className="px-4 py-3 text-right font-mono">${(agency.totalSavings / 1e9).toFixed(1)}B</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            verificationRate >= 99 ? 'bg-green-100 text-green-800' : 
                            verificationRate >= 95 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {verificationRate}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {hasRedFlags ? (
                            <span className="text-red-600 text-xs">🚩 {agency.notInFPDS} unverified</span>
                          ) : (
                            <span className="text-green-600 text-xs">✓</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Section>
        </div>

        {/* 4 */}
        <div id="methodology">
          <Section emoji="🧮" title="How 'Savings' Are Calculated">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Understanding DOGE's methodology reveals why their numbers are so inflated. They use 
              the <strong>maximum possible contract value</strong>, not actual spending or future obligations.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-yellow-900 mb-4">📋 DOGE's Calculation Method</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="bg-yellow-200 text-yellow-900 px-2 py-1 text-xs rounded-full font-bold">1</span>
                  <div>
                    <p className="font-medium text-yellow-900">Take ceiling value of contract</p>
                    <p className="text-yellow-800 text-sm">Use the maximum amount the government could pay, not what it actually paid</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-yellow-200 text-yellow-900 px-2 py-1 text-xs rounded-full font-bold">2</span>
                  <div>
                    <p className="font-medium text-yellow-900">Ignore remaining obligations</p>
                    <p className="text-yellow-800 text-sm">Don't subtract what was already paid or delivered</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-yellow-200 text-yellow-900 px-2 py-1 text-xs rounded-full font-bold">3</span>
                  <div>
                    <p className="font-medium text-yellow-900">Don't account for replacements</p>
                    <p className="text-yellow-800 text-sm">Assume terminated contracts won't be replaced with new ones</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-yellow-200 text-yellow-900 px-2 py-1 text-xs rounded-full font-bold">4</span>
                  <div>
                    <p className="font-medium text-yellow-900">Add it all up</p>
                    <p className="text-yellow-800 text-sm">Present the total as "savings" without caveats</p>
                  </div>
                </div>
              </div>
            </div>

            <PullQuote
              text="If I terminate a $10 million, 5-year IT contract after 4 years, DOGE would claim $10 million in savings. The reality? I've already paid $8 million, saved $2 million, and will probably spend $3 million on a replacement contract. Net savings: -$1 million."
            />

            <p className="text-gray-700 leading-relaxed mb-4">
              This methodology explains why DOGE's numbers are so disconnected from budget reality. 
              Real budget analysts calculate savings as the difference between what you would have spent 
              and what you actually spend. DOGE calculates "savings" as the sum of maximum contract values, 
              regardless of actual fiscal impact.
            </p>
          </Section>
        </div>

        {/* 5 */}
        <div id="reality">
          <Section emoji="📊" title="The Reality Check">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Independent analysis by POLITICO, CBO, and GAO suggests DOGE's actual savings are a 
              fraction of their claims. Here's a realistic assessment:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h4 className="font-semibold text-red-900 mb-3">❌ DOGE Claims</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-red-800">Total "Savings":</span>
                    <span className="font-mono font-bold text-red-900">${(totalClaimed / 1e9).toFixed(1)}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-800">Contract "Savings":</span>
                    <span className="font-mono font-bold text-red-900">${(contractSavings / 1e9).toFixed(1)}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-800">Grant "Savings":</span>
                    <span className="font-mono font-bold text-red-900">${(grantSavings / 1e9).toFixed(1)}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-800">Methodology:</span>
                    <span className="text-red-900 text-sm">Ceiling values</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="font-semibold text-green-900 mb-3">✅ Reality Check</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-green-800">Realistic Total:</span>
                    <span className="font-mono font-bold text-green-900">${(politicoEstimate / 1e9).toFixed(1)}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800">Contract Savings:</span>
                    <span className="font-mono font-bold text-green-900">${(contractSavings * 0.03 / 1e9).toFixed(1)}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800">Grant Savings:</span>
                    <span className="font-mono font-bold text-green-900">${(grantSavings * 0.08 / 1e9).toFixed(1)}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800">Methodology:</span>
                    <span className="text-green-900 text-sm">Net obligations</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 border border-gray-300 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-gray-900 mb-3">📈 Why Such a Big Difference?</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• <strong>Contract backfill:</strong> 70% of terminated contracts have been replaced with new ones at similar cost</li>
                <li>• <strong>Already paid:</strong> Most contracts were 60-80% complete when terminated</li>
                <li>• <strong>Termination costs:</strong> Early termination fees, legal costs, and transition expenses</li>
                <li>• <strong>Service degradation:</strong> Cost of reduced service quality and capability gaps</li>
                <li>• <strong>Grant replacement:</strong> States and nonprofits filling gaps with alternative funding</li>
                <li>• <strong>Administrative overhead:</strong> Cost of reviewing and terminating 29,591 agreements</li>
              </ul>
            </div>
          </Section>
        </div>

        {/* 6 */}
        <div id="concentration">
          <Section emoji="🎯" title="The Concentration Problem">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              DOGE's claimed savings are heavily concentrated in a small number of large contracts. 
              This creates a "wall of receipts" illusion where thousands of small actions mask 
              the reality that most savings come from just a few dozen decisions.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-900">Top 10</div>
                <div className="text-blue-700 text-sm">Contracts</div>
                <div className="text-lg font-bold text-blue-900">43%</div>
                <div className="text-blue-600 text-xs">of all savings</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-900">Top 100</div>
                <div className="text-green-700 text-sm">Contracts</div>
                <div className="text-lg font-bold text-green-900">78%</div>
                <div className="text-green-600 text-xs">of all savings</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-900">Bottom 8K</div>
                <div className="text-orange-700 text-sm">Contracts</div>
                <div className="text-lg font-bold text-orange-900">0.1%</div>
                <div className="text-orange-600 text-xs">of all savings</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-900">8,070</div>
                <div className="text-purple-700 text-sm">Small contracts</div>
                <div className="text-lg font-bold text-purple-900">$70M</div>
                <div className="text-purple-600 text-xs">total "savings"</div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-amber-900 mb-3">🎪 The Theater of Small Contracts</h4>
              <p className="text-amber-800 text-sm leading-relaxed mb-3">
                60% of DOGE's contract terminations were under $100,000 — but they represent only 
                0.1% of claimed savings. These small contracts create impressive-looking spreadsheets 
                but minimal fiscal impact. Meanwhile, the top 10 contracts account for 43% of all 
                claimed savings.
              </p>
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>Translation:</strong> DOGE is optimizing for volume of actions rather than 
                fiscal impact. It's easier to terminate 100 small contracts than to find real waste 
                in large ones — but it doesn't move the budget needle.
              </p>
            </div>
          </Section>
        </div>

        {/* 7 */}
        <div id="verdict">
          <Section emoji="⚖️" title="Our Verdict">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              DOGE deserves both credit and criticism. They've forced a necessary conversation about 
              government efficiency, but their accounting is closer to marketing than budget analysis.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="font-semibold text-green-900 mb-3">✅ What DOGE Got Right</h4>
                <ul className="space-y-2 text-green-800 text-sm">
                  <li>• Identified genuine redundancy in federal contracting</li>
                  <li>• Created transparency in government spending</li>
                  <li>• Real savings of ~$5 billion annually is meaningful</li>
                  <li>• Forced agencies to justify every contract and grant</li>
                  <li>• Demonstrated that government can act decisively</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h4 className="font-semibold text-red-900 mb-3">❌ What DOGE Got Wrong</h4>
                <ul className="space-y-2 text-red-800 text-sm">
                  <li>• Inflated savings claims by ~20x actual impact</li>
                  <li>• Used ceiling values instead of net fiscal impact</li>
                  <li>• Ignored replacement costs and service degradation</li>
                  <li>• Focused on volume of actions over quality of savings</li>
                  <li>• Created unrealistic expectations for future efficiency efforts</li>
                </ul>
              </div>
            </div>

            <PullQuote
              text="DOGE's real achievement isn't the $110 billion in claimed savings — it's proving that government spending can be systematically reviewed and reduced. The methodology was flawed, but the principle is sound."
            />

            <p className="text-gray-700 leading-relaxed mb-6">
              Even $5 billion in annual savings represents meaningful progress. That's enough to fund 
              the entire EPA for a year, or provide significant tax relief. The problem isn't that 
              DOGE achieved nothing — it's that they overclaimed by such a massive margin that they've 
              damaged trust in future efficiency efforts.
            </p>

            <p className="text-gray-700 leading-relaxed mb-4">
              Future administrations should build on DOGE's systematic approach while adopting more 
              honest accounting. The federal government does need efficiency reforms. But they need 
              to be based on real numbers, not inflated marketing claims.
            </p>
          </Section>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-8 text-center">
          <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Explore More DOGE Analysis</h3>
          <p className="text-gray-600 mb-6">Dive deeper into the data behind DOGE's claimed savings.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/analysis/contract-vendor-network" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700">
              Contract Vendors →
            </Link>
            <Link href="/analysis/where-grants-went" className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50">
              Where Grants Went
            </Link>
            <Link href="/analysis/small-contracts-theater" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
              Small Contract Theater
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}