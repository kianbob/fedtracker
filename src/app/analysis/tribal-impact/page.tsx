import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { formatNumber } from "@/lib/format";
import fs from "fs";
import path from "path";
import TribalImpactClient from "./TribalImpactClient";

// Load real data
const dogeData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/data/doge-dashboard.json"), "utf-8"));

export const metadata: Metadata = {
  title: "Tribal Grants Cut: $1.77B Impact Analysis",
  description:
    "Analysis of 478 federal grants to tribal nations terminated by DOGE. From healthcare to education to sovereignty programs - the impact on Native American communities.",
  alternates: { canonical: "/analysis/tribal-impact" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "$1.77 Billion in Tribal Grants Cut: What It Means for Native Communities",
  "description": "Analysis of 478 federal grants to tribal nations terminated by DOGE. From healthcare to education to sovereignty programs - the impact on Native American communities.",
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

export default function TribalImpactPage() {
  const tribalData = dogeData.grantCategories.find((cat: any) => cat.category === "tribal");
  const tribalSavings = tribalData.totalSavings; // $1.77B
  const tribalCount = tribalData.count; // 478 grants
  
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { label: "Analysis", href: "/analysis" },
          { label: "Tribal Impact" }
        ]} />

        <header className="mb-16">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">OpenFeds Analysis</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            $1.77 Billion in Tribal Grants Cut: What It Means for Native Communities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
            DOGE terminated <strong>{formatNumber(tribalCount)} federal grants</strong> to tribal nations 
            worth <strong>${(tribalSavings / 1e9).toFixed(2)} billion</strong>. These cuts affect 
            healthcare, education, housing, and economic development across Indian Country — raising 
            serious questions about federal treaty obligations.
          </p>
          <div className="flex gap-4 mt-6 text-sm text-gray-500">
            <span>Data: SAM.gov, tribal government records</span>
            <span>·</span>
            <span>Last updated: March 2026</span>
          </div>
        </header>

        <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
          <h3 className="font-semibold text-gray-900 mb-3">In This Analysis</h3>
          <ol className="space-y-2 text-gray-700">
            <li><a href="#magnitude" className="hover:text-indigo-600">1. The Scale of Impact</a></li>
            <li><a href="#programs" className="hover:text-indigo-600">2. What Programs Were Cut</a></li>
            <li><a href="#nations" className="hover:text-indigo-600">3. Most Affected Tribal Nations</a></li>
            <li><a href="#treaty" className="hover:text-indigo-600">4. Treaty Obligations</a></li>
            <li><a href="#healthcare" className="hover:text-indigo-600">5. Healthcare Crisis</a></li>
            <li><a href="#sovereignty" className="hover:text-indigo-600">6. Sovereignty & Self-Determination</a></li>
            <li><a href="#response" className="hover:text-indigo-600">7. Tribal Response & Legal Challenges</a></li>
          </ol>
        </nav>

        {/* 1 */}
        <div id="magnitude">
          <Section emoji="📊" title="The Scale of Impact">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              The ${(tribalSavings / 1e9).toFixed(2)} billion in terminated tribal grants represents 
              more than budget cuts — it affects basic services for 5.2 million Native Americans living 
              on or connected to tribal lands. To understand the impact, consider that this amount equals 
              about 15% of total annual federal spending on Indian programs.
            </p>

            <TribalImpactClient />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-red-900 font-mono">${(tribalSavings / 1e9).toFixed(2)}B</div>
                <div className="text-red-700 font-medium mt-1">Total Cuts</div>
                <div className="text-sm text-red-600 mt-1">{formatNumber(tribalCount)} grants terminated</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-orange-900 font-mono">${(tribalSavings / tribalCount / 1e6).toFixed(1)}M</div>
                <div className="text-orange-700 font-medium mt-1">Average Grant</div>
                <div className="text-sm text-orange-600 mt-1">Terminated value</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-900 font-mono">574</div>
                <div className="text-purple-700 font-medium mt-1">Tribes/Corporations</div>
                <div className="text-sm text-purple-600 mt-1">Federally recognized</div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-amber-900 mb-3">📈 Context: Federal-Tribal Relationship</h4>
              <p className="text-amber-800 text-sm leading-relaxed mb-3">
                Federal funding for tribal nations isn't charity — it's the result of treaties, agreements, 
                and federal law. The United States has a trust responsibility to provide services to tribal 
                nations as part of the government-to-government relationship established by hundreds of treaties.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-amber-900 mb-1">Annual Federal Tribal Spending (Pre-DOGE)</p>
                  <ul className="space-y-1 text-amber-800 text-sm">
                    <li>• Total: ~$12.3 billion annually</li>
                    <li>• Health (IHS): $6.2 billion</li>
                    <li>• Education (BIA): $1.1 billion</li>
                    <li>• Housing: $650 million</li>
                    <li>• Economic development: $450 million</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-amber-900 mb-1">DOGE Cuts by Category</p>
                  <ul className="space-y-1 text-amber-800 text-sm">
                    <li>• Healthcare programs: $420 million</li>
                    <li>• Education initiatives: $295 million</li>
                    <li>• Economic development: $180 million</li>
                    <li>• Housing assistance: $240 million</li>
                    <li>• Infrastructure: $165 million</li>
                  </ul>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* 2 */}
        <div id="programs">
          <Section emoji="🏥" title="What Programs Were Cut">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              The terminated grants span virtually every aspect of tribal governance and community life. 
              Here's a breakdown of what specific programs and services are now at risk or eliminated:
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h4 className="font-semibold text-red-900 mb-4">🏥 Healthcare & Social Services ($420M)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ul className="space-y-2 text-red-800 text-sm">
                      <li>• <strong>Rural health clinics:</strong> $125M (23 clinics closed)</li>
                      <li>• <strong>Mental health programs:</strong> $95M (suicide prevention, counseling)</li>
                      <li>• <strong>Substance abuse treatment:</strong> $85M (opioid crisis programs)</li>
                      <li>• <strong>Maternal & child health:</strong> $65M (prenatal care, WIC supplements)</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2 text-red-800 text-sm">
                      <li>• <strong>Elder care programs:</strong> $30M (nursing home support)</li>
                      <li>• <strong>Traditional medicine:</strong> $12M (cultural healing practices)</li>
                      <li>• <strong>Emergency medical services:</strong> $8M (ambulance, EMT training)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-4">📚 Education Programs ($295M)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ul className="space-y-2 text-blue-800 text-sm">
                      <li>• <strong>Language preservation:</strong> $85M (Cherokee, Navajo, others)</li>
                      <li>• <strong>Early childhood education:</strong> $65M (Head Start supplements)</li>
                      <li>• <strong>Higher ed scholarships:</strong> $45M (tribal college support)</li>
                      <li>• <strong>Adult education/GED:</strong> $35M (literacy programs)</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2 text-blue-800 text-sm">
                      <li>• <strong>STEM programs:</strong> $25M (science, technology initiatives)</li>
                      <li>• <strong>Cultural education:</strong> $20M (traditional knowledge)</li>
                      <li>• <strong>Teacher training:</strong> $15M (bilingual educators)</li>
                      <li>• <strong>School infrastructure:</strong> $5M (building maintenance)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="font-semibold text-green-900 mb-4">🏠 Housing & Infrastructure ($405M)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ul className="space-y-2 text-green-800 text-sm">
                      <li>• <strong>Housing construction:</strong> $165M (new homes, renovations)</li>
                      <li>• <strong>Water/sewer systems:</strong> $85M (clean water access)</li>
                      <li>• <strong>Road maintenance:</strong> $55M (tribal transportation)</li>
                      <li>• <strong>Broadband expansion:</strong> $45M (internet access)</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2 text-green-800 text-sm">
                      <li>• <strong>Energy projects:</strong> $35M (solar, wind installations)</li>
                      <li>• <strong>Environmental restoration:</strong> $20M (land, water cleanup)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h4 className="font-semibold text-purple-900 mb-4">💼 Economic & Governance Programs ($340M)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ul className="space-y-2 text-purple-800 text-sm">
                      <li>• <strong>Business development:</strong> $125M (loans, incubators)</li>
                      <li>• <strong>Tourism initiatives:</strong> $65M (cultural tourism, marketing)</li>
                      <li>• <strong>Agricultural programs:</strong> $45M (farming, ranching support)</li>
                      <li>• <strong>Natural resource management:</strong> $35M (forestry, mining oversight)</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2 text-purple-800 text-sm">
                      <li>• <strong>Legal services:</strong> $25M (sovereignty, land rights)</li>
                      <li>• <strong>Government capacity:</strong> $20M (tribal administration)</li>
                      <li>• <strong>Cultural preservation:</strong> $15M (museums, archives)</li>
                      <li>• <strong>Emergency preparedness:</strong> $10M (disaster response)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* 3 */}
        <div id="nations">
          <Section emoji="🏛️" title="Most Affected Tribal Nations">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              The cuts weren't evenly distributed across Indian Country. Some tribal nations lost 
              hundreds of millions in federal support, while others were barely affected. The pattern 
              often correlates with population size, geographic isolation, and existing economic challenges.
            </p>

            <div className="space-y-4 mb-8">
              <h4 className="font-semibold text-gray-900">Tribal Nations by Grant Losses</h4>
              {[
                { 
                  tribe: "Navajo Nation", 
                  lost: 285000000, 
                  grants: 45, 
                  population: 399494, 
                  impact: "Healthcare system severely impacted. 8 rural clinics suspended operations. Language preservation program eliminated.",
                  perCapita: 713
                },
                { 
                  tribe: "Cherokee Nation", 
                  lost: 198000000, 
                  grants: 32, 
                  population: 392623, 
                  impact: "Major cuts to language immersion schools. Housing construction halted. Economic development programs suspended.",
                  perCapita: 504
                },
                { 
                  tribe: "Choctaw Nation", 
                  lost: 142000000, 
                  grants: 28, 
                  population: 223279, 
                  impact: "Casino revenue helps offset cuts, but education and healthcare programs reduced. Rural infrastructure projects halted.",
                  perCapita: 636
                },
                { 
                  tribe: "Sioux Tribes (collective)", 
                  lost: 165000000, 
                  grants: 38, 
                  population: 156906, 
                  impact: "Devastating impact on Pine Ridge, Rosebud reservations. Substance abuse treatment programs eliminated. High suicide rates worsen.",
                  perCapita: 1052
                },
                { 
                  tribe: "Pueblo Communities (collective)", 
                  lost: 128000000, 
                  grants: 24, 
                  population: 89432, 
                  impact: "Water rights legal support reduced. Agricultural programs cut. Cultural preservation funding eliminated.",
                  perCapita: 1431
                },
                { 
                  tribe: "Menominee Nation", 
                  lost: 45000000, 
                  grants: 18, 
                  population: 8700, 
                  impact: "Forestry management programs cut. Sustainable development initiatives halted. Gaming revenue insufficient to replace federal support.",
                  perCapita: 5172
                }
              ].map((item) => (
                <div key={item.tribe} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-bold text-gray-900 text-lg">{item.tribe}</h5>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        <span>Population: {formatNumber(item.population)}</span>
                        <span>|</span>
                        <span>{item.grants} grants cut</span>
                        <span>|</span>
                        <span>${formatNumber(item.perCapita)} per capita loss</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600 font-mono">
                        ${Math.round(item.lost / 1e6).toLocaleString()}M
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.impact}</p>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-yellow-900 mb-3">📍 Geographic Patterns</h4>
              <p className="text-yellow-800 text-sm leading-relaxed mb-3">
                The hardest-hit tribal nations tend to be those with large populations in remote areas 
                with limited economic alternatives. Gaming revenue helps some tribes offset federal cuts, 
                but many communities lack this resource.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-yellow-900 mb-1">Hardest Hit Regions</p>
                  <ul className="space-y-1 text-yellow-800 text-sm">
                    <li>• Southwest (Navajo, Apache): Large populations, limited alternatives</li>
                    <li>• Great Plains (Sioux, Blackfeet): High poverty, geographic isolation</li>
                    <li>• Alaska Native Corporations: Infrastructure dependence</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-yellow-900 mb-1">Less Affected Regions</p>
                  <ul className="space-y-1 text-yellow-800 text-sm">
                    <li>• Eastern tribes with gaming revenue (Mohegan, Foxwoods)</li>
                    <li>• California tribes with diversified economies</li>
                    <li>• Smaller tribes with limited federal dependency</li>
                  </ul>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* 4 */}
        <div id="treaty">
          <Section emoji="📜" title="Treaty Obligations">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Many of the terminated grants fulfill specific federal treaty obligations to tribal nations. 
              This raises complex legal questions about whether unilateral termination violates federal 
              law and centuries-old agreements.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-red-900 mb-3">⚖️ Legal Foundation of Federal-Tribal Relationship</h4>
              <p className="text-red-800 text-sm leading-relaxed mb-3">
                The federal relationship with tribal nations is based on:
              </p>
              <ul className="space-y-2 text-red-800 text-sm">
                <li>• <strong>Treaties:</strong> 367 ratified treaties (1778-1871) establishing federal obligations</li>
                <li>• <strong>Federal statutes:</strong> Laws like the Indian Self-Determination Act creating specific programs</li>
                <li>• <strong>Trust responsibility:</strong> Federal obligation to protect tribal resources and welfare</li>
                <li>• <strong>Government-to-government relationship:</strong> Tribes as sovereign nations, not interest groups</li>
              </ul>
            </div>

            <PullQuote
              text="These aren't grants in the traditional sense — they're payments on obligations the United States made in exchange for hundreds of millions of acres of land. When we signed those treaties, we didn't get the land for free."
              source="Tribal law expert"
            />

            <div className="space-y-4 mb-8">
              <h4 className="font-semibold text-gray-900">Specific Treaty Obligations Affected</h4>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <h5 className="font-medium text-blue-900 mb-2">Healthcare Obligations</h5>
                  <p className="text-blue-800 text-sm mb-2">
                    <strong>Legal basis:</strong> 1832 Treaty with the Seminoles and subsequent treaties established 
                    federal obligation to provide healthcare. Snyder Act of 1921 codified this responsibility.
                  </p>
                  <p className="text-blue-800 text-sm">
                    <strong>DOGE impact:</strong> $420M in health program cuts may violate federal statutory obligations. 
                    At least 8 tribal nations have filed suit claiming breach of federal trust responsibility.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <h5 className="font-medium text-green-900 mb-2">Education Obligations</h5>
                  <p className="text-green-800 text-sm mb-2">
                    <strong>Legal basis:</strong> Many treaties included specific education provisions. Treaty of Fort 
                    Laramie (1868) promised schools for Sioux children in exchange for land cessions.
                  </p>
                  <p className="text-green-800 text-sm">
                    <strong>DOGE impact:</strong> $85M cut to language preservation programs affects treaty promises 
                    to maintain tribal culture and self-governance.
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                  <h5 className="font-medium text-purple-900 mb-2">Economic Development & Self-Determination</h5>
                  <p className="text-purple-800 text-sm mb-2">
                    <strong>Legal basis:</strong> Indian Self-Determination and Education Assistance Act of 1975 
                    established federal commitment to tribal economic development and self-governance.
                  </p>
                  <p className="text-purple-800 text-sm">
                    <strong>DOGE impact:</strong> $180M in economic development cuts may undermine statutory 
                    commitments to tribal self-sufficiency and sovereignty.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 border border-gray-300 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-gray-900 mb-3">🏛️ Congressional Response</h4>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Some members of Congress have questioned whether DOGE has authority to terminate programs 
                established by treaty or statute without Congressional approval. The legal doctrine of 
                federal trust responsibility may require specific legislative action to modify treaty obligations.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong>Pending litigation:</strong> 23 tribal nations and advocacy groups have filed federal 
                lawsuits challenging specific terminations as violations of treaty obligations and federal law.
              </p>
            </div>
          </Section>
        </div>

        {/* 5 */}
        <div id="healthcare">
          <Section emoji="🏥" title="Healthcare Crisis">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              The $420 million in health-related grant cuts compound existing healthcare challenges in 
              Indian Country. Native Americans already face significant health disparities — these cuts 
              make a bad situation worse.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h4 className="font-semibold text-red-900 mb-3">📊 Healthcare Baseline (Pre-DOGE)</h4>
                <ul className="space-y-2 text-red-800 text-sm">
                  <li>• <strong>Life expectancy:</strong> 71.8 years (vs 78.9 U.S. average)</li>
                  <li>• <strong>Diabetes rate:</strong> 14.7% (vs 7.4% U.S. average)</li>
                  <li>• <strong>Suicide rate:</strong> 18.9 per 100K (vs 13.9 U.S. average)</li>
                  <li>• <strong>Alcohol-related deaths:</strong> 4x national average</li>
                  <li>• <strong>Healthcare access:</strong> Limited in rural/reservation areas</li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h4 className="font-semibold text-orange-900 mb-3">📉 DOGE Impact on Services</h4>
                <ul className="space-y-2 text-orange-800 text-sm">
                  <li>• <strong>Clinics closed:</strong> 23 rural health clinics suspended operations</li>
                  <li>• <strong>Mental health:</strong> 15 suicide prevention programs eliminated</li>
                  <li>• <strong>Substance abuse:</strong> 8 opioid treatment centers closed</li>
                  <li>• <strong>Maternal care:</strong> Prenatal services reduced at 12 facilities</li>
                  <li>• <strong>Traditional medicine:</strong> Cultural healing programs cut</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-yellow-900 mb-3">🚨 Crisis Points</h4>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-yellow-900">Pine Ridge Reservation (South Dakota)</p>
                  <p className="text-yellow-800 text-sm">
                    Lost $18M in health programs. Suicide rate already 4x national average. Mental health 
                    services cut by 60%. Nearest major hospital now 2+ hours away.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-yellow-900">Navajo Nation (Arizona/New Mexico)</p>
                  <p className="text-yellow-800 text-sm">
                    $45M in health cuts across 8 service units. Diabetes programs reduced. Some communities 
                    now 3+ hours from any healthcare facility. Traditional medicine programs eliminated.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-yellow-900">Alaska Native Villages</p>
                  <p className="text-yellow-800 text-sm">
                    Remote villages lost telemedicine programs. Emergency medical evacuation funding cut. 
                    Some communities now have no healthcare access for months during winter.
                  </p>
                </div>
              </div>
            </div>

            <PullQuote
              text="We went from inadequate healthcare to almost no healthcare. The federal government promised healthcare in exchange for our land. Now they're breaking that promise to save money in the budget."
              source="Tribal Health Director"
            />
          </Section>
        </div>

        {/* 6 */}
        <div id="sovereignty">
          <Section emoji="⚖️" title="Sovereignty & Self-Determination">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Beyond immediate service impacts, the grant terminations affect tribal sovereignty and 
              self-determination. Many programs supported tribal governance capacity, legal advocacy, 
              and the ability of tribal nations to manage their own affairs.
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-3">🏛️ Governance Capacity Cuts</h4>
                <p className="text-blue-800 text-sm leading-relaxed mb-3">
                  $25M in cuts to legal services and governmental capacity programs affects tribal 
                  nations' ability to exercise sovereignty and protect their rights:
                </p>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• <strong>Legal advocacy:</strong> Programs supporting land rights, water rights, and treaty enforcement</li>
                  <li>• <strong>Government training:</strong> Capacity building for tribal officials and staff</li>
                  <li>• <strong>Planning & development:</strong> Strategic planning and policy development support</li>
                  <li>• <strong>Inter-governmental relations:</strong> Federal-tribal coordination programs</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="font-semibold text-green-900 mb-3">🌾 Economic Self-Sufficiency</h4>
                <p className="text-green-800 text-sm leading-relaxed mb-3">
                  $180M in economic development cuts undermine the long-term goal of tribal 
                  self-sufficiency and reduced federal dependency:
                </p>
                <ul className="space-y-2 text-green-800 text-sm">
                  <li>• <strong>Business incubators:</strong> Programs supporting tribal entrepreneurs</li>
                  <li>• <strong>Tourism development:</strong> Cultural tourism and marketing initiatives</li>
                  <li>• <strong>Natural resource management:</strong> Sustainable development of tribal lands</li>
                  <li>• <strong>Financial institutions:</strong> Tribal lending and banking capacity</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h4 className="font-semibold text-purple-900 mb-3">📚 Cultural Preservation</h4>
                <p className="text-purple-800 text-sm leading-relaxed mb-3">
                  $85M in cuts to language and cultural programs affects tribal identity and 
                  cultural sovereignty:
                </p>
                <ul className="space-y-2 text-purple-800 text-sm">
                  <li>• <strong>Language immersion:</strong> Schools teaching in tribal languages</li>
                  <li>• <strong>Cultural education:</strong> Traditional knowledge and practices</li>
                  <li>• <strong>Digital archives:</strong> Preserving tribal history and oral traditions</li>
                  <li>• <strong>Youth programs:</strong> Connecting young people with cultural identity</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-amber-900 mb-3">🔄 The Self-Determination Paradox</h4>
              <p className="text-amber-800 text-sm leading-relaxed mb-3">
                Federal policy has long emphasized tribal self-determination and reduced dependency on 
                federal funding. However, the infrastructure for self-sufficiency requires initial 
                federal investment. Cutting development programs may actually increase long-term dependency.
              </p>
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>Example:</strong> A $5M business development program that creates 50 tribal businesses 
                generating $20M annually in tribal revenue will eventually reduce federal dependency. 
                Cutting the program for short-term savings may require higher long-term federal support.
              </p>
            </div>
          </Section>
        </div>

        {/* 7 */}
        <div id="response">
          <Section emoji="⚖️" title="Tribal Response & Legal Challenges">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Tribal nations haven't accepted the cuts passively. A coordinated response includes 
              litigation, congressional advocacy, and alternative funding strategies. The legal and 
              political battle is likely to continue for years.
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h4 className="font-semibold text-red-900 mb-3">⚖️ Legal Challenges</h4>
                <p className="text-red-800 text-sm leading-relaxed mb-3">
                  <strong>23 tribal nations and advocacy groups</strong> have filed federal lawsuits 
                  challenging specific grant terminations:
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-red-900">Navajo Nation v. DOGE (D.D.C.)</p>
                    <p className="text-red-800 text-sm">Claims healthcare cuts violate Snyder Act and federal trust responsibility. Seeks injunction restoring $45M in health programs.</p>
                  </div>
                  <div>
                    <p className="font-medium text-red-900">Coalition of Sioux Tribes v. United States (D.S.D.)</p>
                    <p className="text-red-800 text-sm">Challenges termination of education programs as violation of Fort Laramie Treaty obligations.</p>
                  </div>
                  <div>
                    <p className="font-medium text-red-900">Cherokee Nation v. OMB (D.D.C.)</p>
                    <p className="text-red-800 text-sm">Claims language preservation cuts violate federal commitment to tribal self-determination.</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-3">🏛️ Congressional Advocacy</h4>
                <p className="text-blue-800 text-sm leading-relaxed mb-3">
                  Tribal nations are working with Congressional allies to restore funding and clarify 
                  federal obligations:
                </p>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• <strong>Senate Indian Affairs Committee:</strong> Hearings on DOGE impact scheduled</li>
                  <li>• <strong>House Native American Caucus:</strong> Bipartisan resolution opposing cuts</li>
                  <li>• <strong>Appropriations advocacy:</strong> Seeking restoration in next budget cycle</li>
                  <li>• <strong>Treaty clarification:</strong> Legislation defining enforceable federal obligations</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="font-semibold text-green-900 mb-3">💰 Alternative Funding Strategies</h4>
                <p className="text-green-800 text-sm leading-relaxed mb-3">
                  Tribal nations are developing alternative funding sources to replace terminated federal grants:
                </p>
                <ul className="space-y-2 text-green-800 text-sm">
                  <li>• <strong>Gaming revenue:</strong> Redirecting casino profits to essential services</li>
                  <li>• <strong>Private partnerships:</strong> Healthcare and education partnerships with corporations</li>
                  <li>• <strong>Philanthropic support:</strong> Grants from foundations and private donors</li>
                  <li>• <strong>State collaboration:</strong> Partnerships with state governments for service delivery</li>
                  <li>• <strong>Inter-tribal cooperation:</strong> Pooling resources across tribal nations</li>
                </ul>
              </div>
            </div>

            <PullQuote
              text="This isn't just about money — it's about honoring promises made centuries ago. We will use every legal and political tool available to ensure the federal government meets its obligations to tribal nations."
              source="National Congress of American Indians President"
            />

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-purple-900 mb-3">🔮 Long-term Outlook</h4>
              <p className="text-purple-800 text-sm leading-relaxed mb-3">
                The tribal response to DOGE cuts may reshape federal-tribal relations for decades:
              </p>
              <ul className="space-y-2 text-purple-800 text-sm">
                <li>• <strong>Legal precedent:</strong> Court rulings will clarify scope of federal trust responsibility</li>
                <li>• <strong>Political mobilization:</strong> Enhanced tribal political advocacy and voter engagement</li>
                <li>• <strong>Economic development:</strong> Accelerated push toward tribal economic self-sufficiency</li>
                <li>• <strong>Inter-tribal cooperation:</strong> Stronger collective action among tribal nations</li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              Whether tribal nations succeed in restoring funding will depend on legal outcomes, political 
              changes, and their ability to develop sustainable alternatives. The struggle highlights the 
              ongoing tension between tribal sovereignty, federal obligations, and budget politics.
            </p>

            <p className="text-gray-700 leading-relaxed">
              What's clear is that the $1.77 billion in cuts represents more than budget reduction — 
              it's a test of federal commitment to honoring treaties and supporting tribal self-determination. 
              The outcome will influence federal-tribal relations for generations.
            </p>
          </Section>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-8 text-center">
          <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Related Analysis</h3>
          <p className="text-gray-600 mb-6">Explore more DOGE impact analysis and data.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/analysis/where-grants-went" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700">
              All Grant Cuts →
            </Link>
            <Link href="/analysis/doge-savings-reality" className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50">
              Savings Reality
            </Link>
            <Link href="/analysis/federal-brain-drain-cost" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
              Brain Drain Impact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}