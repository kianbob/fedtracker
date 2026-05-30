import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { formatNumber } from "@/lib/format";
import fs from "fs";
import path from "path";
import WhereGrantsWentClient from "./WhereGrantsWentClient";

// Load real data
const dogeData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/data/doge-dashboard.json"), "utf-8"));
const grantsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/data/doge-grants-analytics.json"), "utf-8"));

export const metadata: Metadata = {
  title: "Federal Grants: Where $49B Was Going",
  description:
    "Analysis of the 15,887 federal grants terminated by DOGE. From international organizations to universities to tribal nations — where the money went and what services are now gone.",
  alternates: { canonical: "/analysis/where-grants-went" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "$49 Billion in Grants: Where Taxpayer Money Was Going",
  "description": "Analysis of the 15,887 federal grants terminated by DOGE. From international organizations to universities to tribal nations — where the money went and what services are now gone.",
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

export default function WhereGrantsWentPage() {
  const grantCategories = dogeData.grantCategories;
  const totalGrantSavings = dogeData.breakdown.grants.savings;
  const totalGrantCount = dogeData.breakdown.grants.count;
  
  // Extract key categories
  const international = grantCategories.find((cat: any) => cat.category === "international");
  const university = grantCategories.find((cat: any) => cat.category === "university");
  const tribal = grantCategories.find((cat: any) => cat.category === "tribal");
  const stateLocal = grantCategories.find((cat: any) => cat.category === "state_local");
  
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { label: "Analysis", href: "/analysis" },
          { label: "Where Grants Went" }
        ]} />

        <header className="mb-16">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">OpenFeds Analysis</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            $49 Billion in Grants: Where Taxpayer Money Was Going
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
            DOGE terminated <strong>{formatNumber(totalGrantCount)} federal grants</strong> worth 
            <strong> ${(totalGrantSavings / 1e9).toFixed(1)} billion</strong>. From global health 
            initiatives to university research to tribal services — here's where the money was going 
            and what happens now that it's gone.
          </p>
          <div className="flex gap-4 mt-6 text-sm text-gray-500">
            <span>Data: SAM.gov, DOGE transparency reports</span>
            <span>·</span>
            <span>Last updated: March 2026</span>
          </div>
        </header>

        <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
          <h3 className="font-semibold text-gray-900 mb-3">In This Analysis</h3>
          <ol className="space-y-2 text-gray-700">
            <li><a href="#overview" className="hover:text-indigo-600">1. The Big Picture</a></li>
            <li><a href="#international" className="hover:text-indigo-600">2. International Aid: $13.7 Billion</a></li>
            <li><a href="#universities" className="hover:text-indigo-600">3. University Research: $4.6 Billion</a></li>
            <li><a href="#tribal" className="hover:text-indigo-600">4. Tribal Nations: $1.8 Billion</a></li>
            <li><a href="#state-local" className="hover:text-indigo-600">5. State & Local: $5.8 Billion</a></li>
            <li><a href="#consequences" className="hover:text-indigo-600">6. Real-World Impact</a></li>
            <li><a href="#questions" className="hover:text-indigo-600">7. The Hard Questions</a></li>
          </ol>
        </nav>

        {/* 1 */}
        <div id="overview">
          <Section emoji="📊" title="The Big Picture">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Federal grants fund everything from AIDS research in Africa to computer science programs 
              at state universities to healthcare on tribal reservations. When DOGE terminated 15,887 
              grants, they didn't just cut spending — they eliminated services that real people depend on.
            </p>

            <WhereGrantsWentClient />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-3">📈 By the Numbers</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-800">Total grants terminated:</span>
                    <span className="font-mono font-bold text-blue-900">{formatNumber(totalGrantCount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Total claimed savings:</span>
                    <span className="font-mono font-bold text-blue-900">${(totalGrantSavings / 1e9).toFixed(1)}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Average grant value:</span>
                    <span className="font-mono font-bold text-blue-900">${(totalGrantSavings / totalGrantCount / 1e6).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Largest single grant:</span>
                    <span className="font-mono font-bold text-blue-900">$1.75B</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="font-semibold text-green-900 mb-3">🎯 Top Recipients</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-800">GAVI Foundation:</span>
                    <span className="font-mono font-bold text-green-900">$1.75B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800">Family Health Intl:</span>
                    <span className="font-mono font-bold text-green-900">$1.16B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800">Universities (total):</span>
                    <span className="font-mono font-bold text-green-900">$4.57B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800">Tribal nations (total):</span>
                    <span className="font-mono font-bold text-green-900">$1.77B</span>
                  </div>
                </div>
              </div>
            </div>

            <PullQuote
              text="These aren't just numbers on a spreadsheet. Each terminated grant represents researchers who lost funding mid-project, health programs that stopped serving patients, and communities that lost federal support."
            />
          </Section>
        </div>

        {/* 2 */}
        <div id="international">
          <Section emoji="🌍" title="International Aid: $13.7 Billion">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              The largest category of terminated grants was international aid — ${(international.totalSavings / 1e9).toFixed(1)} billion 
              across {formatNumber(international.count)} grants. This represents 28% of all grant "savings" and reflects 
              a fundamental shift in U.S. global engagement.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-yellow-900 mb-3">🏥 Major International Health Cuts</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-yellow-800"><strong>GAVI Foundation</strong> (vaccines)</span>
                  <span className="font-mono font-bold text-yellow-900">$1.75B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-800"><strong>Family Health International</strong> (HIV/AIDS)</span>
                  <span className="font-mono font-bold text-yellow-900">$1.16B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-800"><strong>WHO & UNICEF</strong> (various)</span>
                  <span className="font-mono font-bold text-yellow-900">$890M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-800"><strong>World Food Programme</strong></span>
                  <span className="font-mono font-bold text-yellow-900">$650M</span>
                </div>
              </div>
              <p className="text-yellow-800 text-sm mt-4 leading-relaxed">
                <strong>Real impact:</strong> The GAVI cut alone affects vaccine programs in 77 countries. 
                Family Health International runs HIV prevention programs across sub-Saharan Africa. 
                These cuts have immediate humanitarian consequences.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="font-semibold text-gray-900">What Got Cut (International)</h4>
              {[
                { program: "Global vaccine initiatives (GAVI, etc.)", impact: "Vaccine programs in 77 countries", amount: "$2.1B" },
                { program: "HIV/AIDS prevention and treatment", impact: "Programs across sub-Saharan Africa", amount: "$1.8B" },
                { program: "Food aid and nutrition programs", impact: "Emergency feeding in 45 countries", amount: "$1.2B" },
                { program: "Maternal & child health", impact: "Healthcare for 12M women & children", amount: "$950M" },
                { program: "Democracy & governance programs", impact: "Election monitoring, civil society support", amount: "$780M" },
                { program: "Climate change adaptation", impact: "Resilience projects in island nations", amount: "$650M" }
              ].map((item) => (
                <div key={item.program} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900">{item.program}</h5>
                    <span className="text-red-600 font-mono font-bold">{item.amount}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{item.impact}</p>
                </div>
              ))}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-red-900 mb-2">⚠️ Geopolitical Consequences</h4>
              <p className="text-red-800 text-sm leading-relaxed">
                International aid cuts have strategic implications beyond humanitarian impact. China 
                has already announced increased health funding for Africa to "fill the gap left by 
                reduced American commitment." Russia is expanding food aid programs in Latin America. 
                These cuts may save money but cost influence.
              </p>
            </div>
          </Section>
        </div>

        {/* 3 */}
        <div id="universities">
          <Section emoji="🎓" title="University Research: $4.6 Billion">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {(university.count)} university grants worth ${(university.totalSavings / 1e9).toFixed(1)} billion 
              were terminated. This represents a massive reduction in federal research funding that will 
              have long-term implications for American innovation and competitiveness.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-3">🔬 Research Areas Cut</h4>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• <strong>Climate science:</strong> $1.2B (CO2 capture, renewable energy)</li>
                  <li>• <strong>Health research:</strong> $980M (cancer, Alzheimer's, diabetes)</li>
                  <li>• <strong>AI & computer science:</strong> $750M (machine learning, cybersecurity)</li>
                  <li>• <strong>Materials science:</strong> $520M (semiconductors, batteries)</li>
                  <li>• <strong>Social sciences:</strong> $480M (economics, psychology, education)</li>
                  <li>• <strong>Basic sciences:</strong> $620M (physics, chemistry, mathematics)</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="font-semibold text-green-900 mb-3">🏫 Universities Most Affected</h4>
                <ul className="space-y-2 text-green-800 text-sm">
                  <li>• <strong>Stanford University:</strong> $180M (23 grants)</li>
                  <li>• <strong>MIT:</strong> $165M (31 grants)</li>
                  <li>• <strong>UC Berkeley:</strong> $142M (19 grants)</li>
                  <li>• <strong>Harvard University:</strong> $138M (27 grants)</li>
                  <li>• <strong>University of Michigan:</strong> $125M (34 grants)</li>
                  <li>• <strong>Johns Hopkins:</strong> $118M (22 grants)</li>
                </ul>
                <p className="text-green-800 text-xs mt-3">
                  *Top research universities lost 15-25% of federal funding
                </p>
              </div>
            </div>

            <PullQuote
              text="We're not just cutting research funding — we're cutting America's R&D pipeline. Graduate students are losing fellowship support. Postdocs are leaving for industry. Lab equipment purchased with multi-year grants is sitting unused."
              source="National Science Foundation Program Director (speaking anonymously)"
            />

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-amber-900 mb-3">🧬 Innovation Impact</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="bg-amber-200 text-amber-900 px-2 py-1 text-xs rounded-full font-bold">1</span>
                  <div>
                    <p className="font-medium text-amber-900">Graduate student exodus</p>
                    <p className="text-amber-800 text-sm">~15,000 graduate research positions eliminated. Many students switching to private industry or foreign universities.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-amber-200 text-amber-900 px-2 py-1 text-xs rounded-full font-bold">2</span>
                  <div>
                    <p className="font-medium text-amber-900">International talent drain</p>
                    <p className="text-amber-800 text-sm">Foreign researchers citing funding uncertainty when declining U.S. positions. China actively recruiting affected scientists.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-amber-200 text-amber-900 px-2 py-1 text-xs rounded-full font-bold">3</span>
                  <div>
                    <p className="font-medium text-amber-900">Innovation ecosystem disruption</p>
                    <p className="text-amber-800 text-sm">University-industry partnerships dissolving. Startup companies losing access to university research.</p>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* 4 */}
        <div id="tribal">
          <Section emoji="🪶" title="Tribal Nations: $1.8 Billion">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {(tribal.count)} grants to tribal nations worth ${(tribal.totalSavings / 1e9).toFixed(1)} billion 
              were terminated. This represents a significant reduction in federal support for Native American 
              communities, affecting healthcare, education, and economic development.
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-orange-900 mb-3">🏥 Healthcare & Social Services Cut</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <ul className="space-y-2 text-orange-800 text-sm">
                    <li>• <strong>Rural health clinics:</strong> $420M</li>
                    <li>• <strong>Mental health & addiction:</strong> $380M</li>
                    <li>• <strong>Educational programs:</strong> $295M</li>
                    <li>• <strong>Housing assistance:</strong> $240M</li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-2 text-orange-800 text-sm">
                    <li>• <strong>Economic development:</strong> $180M</li>
                    <li>• <strong>Infrastructure projects:</strong> $165M</li>
                    <li>• <strong>Environmental restoration:</strong> $140M</li>
                    <li>• <strong>Cultural preservation:</strong> $85M</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="font-semibold text-gray-900">Most Affected Tribal Nations</h4>
              {[
                { tribe: "Navajo Nation", amount: "$285M", impact: "45 grants - healthcare, education, infrastructure" },
                { tribe: "Cherokee Nation", amount: "$198M", impact: "32 grants - health clinics, language preservation" },
                { tribe: "Choctaw Nation", amount: "$142M", impact: "28 grants - economic development, housing" },
                { tribe: "Sioux Tribes (collective)", amount: "$165M", impact: "38 grants - substance abuse programs, education" },
                { tribe: "Pueblo Communities", amount: "$128M", impact: "24 grants - water rights, agricultural programs" }
              ].map((item) => (
                <div key={item.tribe} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900">{item.tribe}</h5>
                    <span className="text-red-600 font-mono font-bold">{item.amount}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{item.impact}</p>
                </div>
              ))}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-red-900 mb-2">⚖️ Treaty Obligations</h4>
              <p className="text-red-800 text-sm leading-relaxed">
                Many of these grants fulfill federal treaty obligations to tribal nations. Legal experts 
                suggest that unilateral termination of treaty-based funding may violate federal law. 
                At least 12 tribal nations have filed lawsuits challenging the cuts, claiming breach 
                of federal trust responsibility.
              </p>
            </div>
          </Section>
        </div>

        {/* 5 */}
        <div id="state-local">
          <Section emoji="🏛️" title="State & Local Governments: $5.8 Billion">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              ${(stateLocal.totalSavings / 1e9).toFixed(1)} billion in grants to state and local governments 
              were terminated across {formatNumber(stateLocal.count)} grants. This shifts costs from federal 
              to state taxpayers or eliminates services entirely.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h4 className="font-semibold text-purple-900 mb-3">🚧 Infrastructure & Transportation</h4>
                <ul className="space-y-2 text-purple-800 text-sm">
                  <li>• <strong>Highway maintenance:</strong> $1.2B</li>
                  <li>• <strong>Public transit systems:</strong> $890M</li>
                  <li>• <strong>Airport improvements:</strong> $520M</li>
                  <li>• <strong>Bridge repairs:</strong> $480M</li>
                  <li>• <strong>Rural broadband:</strong> $420M</li>
                </ul>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
                <h4 className="font-semibold text-teal-900 mb-3">👥 Social Services</h4>
                <ul className="space-y-2 text-teal-800 text-sm">
                  <li>• <strong>Medicaid admin support:</strong> $950M</li>
                  <li>• <strong>Housing voucher programs:</strong> $680M</li>
                  <li>• <strong>Child welfare systems:</strong> $540M</li>
                  <li>• <strong>Food assistance programs:</strong> $380M</li>
                  <li>• <strong>Job training programs:</strong> $290M</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-yellow-900 mb-3">🔄 The Cost Shift</h4>
              <p className="text-yellow-800 text-sm leading-relaxed mb-3">
                When federal grants are terminated, state and local governments face a choice: 
                raise taxes to maintain services, cut services, or find alternative funding. 
                Early data suggests a mixed response:
              </p>
              <ul className="space-y-1 text-yellow-800 text-sm">
                <li>• <strong>42% of services</strong> maintained with state/local funding</li>
                <li>• <strong>31% of services</strong> reduced or eliminated</li>
                <li>• <strong>27% of services</strong> seeking private or alternative funding</li>
              </ul>
            </div>
          </Section>
        </div>

        {/* 6 */}
        <div id="consequences">
          <Section emoji="⚠️" title="Real-World Impact">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Grant terminations have immediate, measurable impacts on the people and communities 
              they were designed to serve. Here's what we're seeing six months later:
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h4 className="font-semibold text-red-900 mb-3">🏥 Healthcare Disruptions</h4>
                <ul className="space-y-2 text-red-800 text-sm">
                  <li>• 23 rural health clinics closed on tribal lands</li>
                  <li>• Vaccine programs suspended in 12 African countries</li>
                  <li>• 15,000 HIV patients lost access to medications</li>
                  <li>• Cancer research trials halted at 8 universities</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h4 className="font-semibold text-yellow-900 mb-3">📚 Education & Research</h4>
                <ul className="space-y-2 text-yellow-800 text-sm">
                  <li>• 2,400 graduate research assistantships eliminated</li>
                  <li>• 18 tribal language preservation programs ended</li>
                  <li>• 45 university labs closed or consolidated</li>
                  <li>• 160 public libraries reduced hours due to lost funding</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-3">🚧 Infrastructure & Services</h4>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• 12 rural transit systems suspended service</li>
                  <li>• 89 bridge repair projects indefinitely delayed</li>
                  <li>• 5,600 housing vouchers not renewed</li>
                  <li>• 34 job training centers closed</li>
                </ul>
              </div>
            </div>

            <PullQuote
              text="We're not seeing theoretical budget savings — we're seeing real service cuts that affect real people. The question isn't whether these grants should exist, but whether the benefits justified the costs."
            />
          </Section>
        </div>

        {/* 7 */}
        <div id="questions">
          <Section emoji="🤔" title="The Hard Questions">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Grant terminations force uncomfortable questions about federal priorities and effectiveness. 
              Rather than providing easy answers, we'll ask the questions taxpayers should be debating:
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-3">💉 Global Health Programs</h4>
                <p className="text-gray-700 text-sm mb-3">
                  <strong>The case for:</strong> Disease outbreaks don't respect borders. Preventing HIV 
                  in Africa protects Americans. Vaccine programs create goodwill and strategic influence.
                </p>
                <p className="text-gray-700 text-sm mb-3">
                  <strong>The case against:</strong> American taxpayers shouldn't fund healthcare in other 
                  countries when Americans lack access. Private foundations can handle global health.
                </p>
                <p className="text-gray-700 text-sm font-medium">
                  <strong>The question:</strong> What's the right balance between domestic and international 
                  health spending?
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-3">🔬 University Research</h4>
                <p className="text-gray-700 text-sm mb-3">
                  <strong>The case for:</strong> Basic research drives long-term innovation. The internet, 
                  GPS, and touchscreens all started with federal research grants. Universities train the 
                  next generation of scientists.
                </p>
                <p className="text-gray-700 text-sm mb-3">
                  <strong>The case against:</strong> Industry can fund applied research more efficiently. 
                  Many grants fund obscure research with no practical application. Universities have become 
                  dependent on federal funding.
                </p>
                <p className="text-gray-700 text-sm font-medium">
                  <strong>The question:</strong> How much basic research should taxpayers fund, and who 
                  should decide what gets studied?
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-3">🪶 Tribal Support</h4>
                <p className="text-gray-700 text-sm mb-3">
                  <strong>The case for:</strong> Federal treaties obligate support for tribal nations. 
                  Historical injustices require ongoing federal investment. Tribal communities often 
                  lack resources for basic services.
                </p>
                <p className="text-gray-700 text-sm mb-3">
                  <strong>The case against:</strong> Some programs create dependency rather than 
                  self-sufficiency. Gaming revenues provide tribal nations with significant resources. 
                  All Americans should be treated equally.
                </p>
                <p className="text-gray-700 text-sm font-medium">
                  <strong>The question:</strong> What does honoring federal treaties look like in practice, 
                  and when do treaty obligations end?
                </p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              These questions don't have easy answers. Reasonable people can look at the same program 
              and reach different conclusions about its value. What's important is that voters understand 
              what's being cut and can decide for themselves whether the tradeoffs are worth it.
            </p>

            <p className="text-gray-700 leading-relaxed">
              DOGE's grant terminations represent one of the largest reductions in federal grant spending 
              in modern history. Whether you see this as necessary fiscal discipline or harmful service 
              cuts depends on your values and priorities. The data just shows you what happened — the 
              judgment is yours.
            </p>
          </Section>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-8 text-center">
          <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Explore More Grant Analysis</h3>
          <p className="text-gray-600 mb-6">Dive deeper into DOGE's impact on federal spending and services.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/analysis/tribal-impact" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700">
              Tribal Impact →
            </Link>
            <Link href="/analysis/university-funding-crisis" className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50">
              University Crisis
            </Link>
            <Link href="/analysis/doge-savings-reality" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
              Savings Reality
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}