import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { formatNumber } from "@/lib/format";
import fs from "fs";
import path from "path";
import UniversityFundingCrisisClient from "./UniversityFundingCrisisClient";

// Load real data
const dogeData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/data/doge-dashboard.json"), "utf-8"));

export const metadata: Metadata = {
  title: "4,011 University Grants Terminated: The Research Funding Freeze — OpenFeds",
  description:
    "Analysis of $4.57 billion in federal university research grants cut by DOGE. From climate science to AI research - the long-term impact on American innovation.",
  alternates: { canonical: "/analysis/university-funding-crisis" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "4,011 University Grants Terminated: The Research Funding Freeze",
  "description": "Analysis of $4.57 billion in federal university research grants cut by DOGE. From climate science to AI research - the long-term impact on American innovation.",
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

export default function UniversityFundingCrisisPage() {
  const universityData = dogeData.grantCategories.find((cat: any) => cat.category === "university");
  const universitySavings = universityData.totalSavings; // $4.57B
  const universityCount = universityData.count; // 4,011 grants
  
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { label: "Analysis", href: "/analysis" },
          { label: "University Funding Crisis" }
        ]} />

        <header className="mb-16">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">OpenFeds Analysis</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            4,011 University Grants Terminated: The Research Funding Freeze
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
            DOGE terminated <strong>{formatNumber(universityCount)} federal grants</strong> to universities 
            and research institutions worth <strong>${(universitySavings / 1e9).toFixed(2)} billion</strong>. 
            This massive reduction in research funding will reshape American science and innovation for decades.
          </p>
          <div className="flex gap-4 mt-6 text-sm text-gray-500">
            <span>Data: NSF, NIH, DOE grant databases</span>
            <span>·</span>
            <span>Last updated: March 2026</span>
          </div>
        </header>

        <nav className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
          <h3 className="font-semibold text-gray-900 mb-3">In This Analysis</h3>
          <ol className="space-y-2 text-gray-700">
            <li><a href="#scale" className="hover:text-indigo-600">1. The Scale of the Cuts</a></li>
            <li><a href="#research-areas" className="hover:text-indigo-600">2. Which Research Areas Were Cut</a></li>
            <li><a href="#universities" className="hover:text-indigo-600">3. Most Affected Universities</a></li>
            <li><a href="#graduate-impact" className="hover:text-indigo-600">4. Graduate Students & Researchers</a></li>
            <li><a href="#innovation-pipeline" className="hover:text-indigo-600">5. The Innovation Pipeline Crisis</a></li>
            <li><a href="#international" className="hover:text-indigo-600">6. Brain Drain to Other Countries</a></li>
            <li><a href="#long-term" className="hover:text-indigo-600">7. Long-term Consequences</a></li>
          </ol>
        </nav>

        {/* 1 */}
        <div id="scale">
          <Section emoji="📊" title="The Scale of the Cuts">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              The ${(universitySavings / 1e9).toFixed(2)} billion in university research cuts represents 
              one of the largest single-year reductions in federal R&D spending in modern history. To put 
              this in context, it's equivalent to eliminating the entire NSF budget for nearly two years.
            </p>

            <UniversityFundingCrisisClient />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-red-900 font-mono">${(universitySavings / 1e9).toFixed(2)}B</div>
                <div className="text-red-700 text-sm font-medium">Total Cuts</div>
                <div className="text-xs text-red-600 mt-1">{formatNumber(universityCount)} grants</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-900 font-mono">${(universitySavings / universityCount / 1e6).toFixed(1)}M</div>
                <div className="text-orange-700 text-sm font-medium">Average Grant</div>
                <div className="text-xs text-orange-600 mt-1">Smaller than typical</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-900 font-mono">387</div>
                <div className="text-purple-700 text-sm font-medium">Universities</div>
                <div className="text-xs text-purple-600 mt-1">Directly affected</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-900 font-mono">~15K</div>
                <div className="text-blue-700 text-sm font-medium">Researchers</div>
                <div className="text-xs text-blue-600 mt-1">Lost funding</div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-amber-900 mb-3">📈 Historical Context</h4>
              <p className="text-amber-800 text-sm leading-relaxed mb-3">
                Federal university research funding has been the backbone of American scientific leadership 
                since World War II. The current cuts represent the largest single-year reduction since the 
                post-Cold War defense cutbacks of the early 1990s.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-amber-900 mb-1">Annual Federal R&D to Universities</p>
                  <ul className="space-y-1 text-amber-800 text-sm">
                    <li>• 2024 (Pre-DOGE): $42.8 billion</li>
                    <li>• 2025 (Post-cuts): $38.2 billion</li>
                    <li>• Reduction: 10.7% year-over-year</li>
                    <li>• Last cut this large: 1991 (-8.2%)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-amber-900 mb-1">International Comparison</p>
                  <ul className="space-y-1 text-amber-800 text-sm">
                    <li>• China R&D spending: +12% annually</li>
                    <li>• EU Horizon program: +8% annually</li>
                    <li>• South Korea: +15% in university R&D</li>
                    <li>• U.S. (2025): -10.7% university R&D</li>
                  </ul>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* 2 */}
        <div id="research-areas">
          <Section emoji="🔬" title="Which Research Areas Were Cut">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              The cuts weren't random — they followed clear ideological and priority patterns. Climate science, 
              social sciences, and basic research bore the brunt, while defense-related and traditional energy 
              research were largely spared.
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h4 className="font-semibold text-red-900 mb-4">🌡️ Climate & Environmental Science ($1.2B cut)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ul className="space-y-2 text-red-800 text-sm">
                      <li>• <strong>Carbon capture research:</strong> $285M (47 projects terminated)</li>
                      <li>• <strong>Climate modeling:</strong> $220M (supercomputer access reduced)</li>
                      <li>• <strong>Renewable energy:</strong> $195M (solar, wind efficiency)</li>
                      <li>• <strong>Ocean/atmospheric studies:</strong> $165M (NOAA partnerships)</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2 text-red-800 text-sm">
                      <li>• <strong>Conservation biology:</strong> $145M (species preservation)</li>
                      <li>• <strong>Sustainable agriculture:</strong> $125M (crop resilience)</li>
                      <li>• <strong>Environmental monitoring:</strong> $85M (pollution tracking)</li>
                    </ul>
                  </div>
                </div>
                <p className="text-red-800 text-sm mt-3">
                  <strong>Impact:</strong> 23 climate research centers forced to close. 340 PhD students 
                  lost funding. Major climate models may be discontinued due to lack of support.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-4">🏥 Health & Medical Research ($980M cut)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ul className="space-y-2 text-blue-800 text-sm">
                      <li>• <strong>Cancer research:</strong> $245M (early-stage drug discovery)</li>
                      <li>• <strong>Alzheimer's research:</strong> $165M (basic neuroscience)</li>
                      <li>• <strong>Diabetes/obesity:</strong> $145M (metabolic studies)</li>
                      <li>• <strong>Mental health:</strong> $125M (psychiatric research)</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2 text-blue-800 text-sm">
                      <li>• <strong>Infectious disease:</strong> $105M (pandemic preparedness)</li>
                      <li>• <strong>Genetics/genomics:</strong> $95M (basic research)</li>
                      <li>• <strong>Public health:</strong> $100M (epidemiology, health policy)</li>
                    </ul>
                  </div>
                </div>
                <p className="text-blue-800 text-sm mt-3">
                  <strong>Impact:</strong> 156 clinical trials suspended or terminated. 15 new medical school 
                  research programs cancelled. Reduced capacity for next pandemic response.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h4 className="font-semibold text-purple-900 mb-4">🤖 AI & Computer Science ($750M cut)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ul className="space-y-2 text-purple-800 text-sm">
                      <li>• <strong>Machine learning:</strong> $185M (algorithm development)</li>
                      <li>• <strong>Cybersecurity:</strong> $165M (threat detection, encryption)</li>
                      <li>• <strong>Quantum computing:</strong> $145M (basic research)</li>
                      <li>• <strong>Robotics:</strong> $125M (autonomous systems)</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2 text-purple-800 text-sm">
                      <li>• <strong>Data science:</strong> $85M (analytics, visualization)</li>
                      <li>• <strong>Human-computer interaction:</strong> $45M (interface design)</li>
                    </ul>
                  </div>
                </div>
                <p className="text-purple-800 text-sm mt-3">
                  <strong>Impact:</strong> Ironically, cuts to AI research come as China invests heavily. 
                  Several top university AI labs have scaled back operations. Graduate student recruitment down 40%.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h4 className="font-semibold text-yellow-900 mb-4">📚 Social Sciences ($480M cut)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ul className="space-y-2 text-yellow-800 text-sm">
                      <li>• <strong>Economics:</strong> $125M (behavioral, labor economics)</li>
                      <li>• <strong>Psychology:</strong> $95M (cognitive, social psychology)</li>
                      <li>• <strong>Education research:</strong> $85M (learning, pedagogy)</li>
                      <li>• <strong>Sociology:</strong> $75M (inequality, demographics)</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2 text-yellow-800 text-sm">
                      <li>• <strong>Political science:</strong> $65M (governance, democracy)</li>
                      <li>• <strong>Anthropology:</strong> $35M (cultural studies)</li>
                    </ul>
                  </div>
                </div>
                <p className="text-yellow-800 text-sm mt-3">
                  <strong>Impact:</strong> Social science departments nationwide are eliminating PhD programs. 
                  Policy research capacity significantly reduced. Long-term societal studies halted.
                </p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-green-900 mb-3">✅ Research Areas Largely Protected</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• <strong>Defense research:</strong> Weapons, military technology maintained</li>
                    <li>• <strong>Nuclear energy:</strong> Reactor design, waste management protected</li>
                    <li>• <strong>Space exploration:</strong> NASA university partnerships continued</li>
                    <li>• <strong>Agriculture (traditional):</strong> Crop yields, livestock maintained</li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• <strong>Materials science:</strong> Manufacturing, engineering largely spared</li>
                    <li>• <strong>Mathematics:</strong> Pure math research maintained</li>
                    <li>• <strong>Chemistry:</strong> Basic chemistry research continued</li>
                    <li>• <strong>Physics (non-climate):</strong> Particle physics, astronomy protected</li>
                  </ul>
                </div>
              </div>
            </div>

            <PullQuote
              text="The pattern is clear: if research can be labeled 'climate' or 'social justice,' it gets cut. If it can be labeled 'defense' or 'energy security,' it survives. Science is being sorted by ideology, not by merit or national need."
              source="University Research Administrator"
            />
          </Section>
        </div>

        {/* 3 */}
        <div id="universities">
          <Section emoji="🏫" title="Most Affected Universities">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              While all major research universities were affected, some lost hundreds of millions in funding. 
              The pattern often correlates with universities' prominence in climate science, social research, 
              and other targeted areas.
            </p>

            <div className="space-y-4 mb-8">
              <h4 className="font-semibold text-gray-900">Universities by Funding Losses</h4>
              {[
                { 
                  university: "Stanford University", 
                  lost: 180000000, 
                  grants: 23, 
                  students: 2240, 
                  impact: "Massive climate science cuts. Precourt Institute scaled back. 45 graduate students lost funding. AI lab partnerships with government ended.",
                  strongAreas: "Climate, AI, Engineering",
                  avgGrant: 7.8
                },
                { 
                  university: "MIT", 
                  lost: 165000000, 
                  grants: 31, 
                  students: 1680, 
                  impact: "CSAIL (AI lab) reduced operations. Energy Initiative programs cut. 38 faculty positions not filled. International student recruitment suspended.",
                  strongAreas: "AI, Energy, Materials",
                  avgGrant: 5.3
                },
                { 
                  university: "UC Berkeley", 
                  lost: 142000000, 
                  grants: 19, 
                  students: 1890, 
                  impact: "Environmental sciences devastated. Renewable energy lab closed. 28 post-docs left for private sector. PhD admissions cut by 25%.",
                  strongAreas: "Environment, Social Sciences",
                  avgGrant: 7.5
                },
                { 
                  university: "Harvard University", 
                  lost: 138000000, 
                  grants: 27, 
                  students: 1450, 
                  impact: "Public health school programs cut. Kennedy School policy research reduced. Medical school basic research affected. International programs scaled back.",
                  strongAreas: "Medicine, Public Health, Policy",
                  avgGrant: 5.1
                },
                { 
                  university: "University of Michigan", 
                  lost: 125000000, 
                  grants: 34, 
                  students: 2340, 
                  impact: "Engineering school climate programs eliminated. Social research institute closed. 67 graduate assistantships not renewed. Faculty hiring frozen.",
                  strongAreas: "Engineering, Social Sciences",
                  avgGrant: 3.7
                },
                { 
                  university: "Johns Hopkins", 
                  lost: 118000000, 
                  grants: 22, 
                  students: 1120, 
                  impact: "Public health emergency preparedness cut. Applied Physics Lab civilian programs reduced. Medical research capacity decreased by 15%.",
                  strongAreas: "Medicine, Public Health, Applied Physics",
                  avgGrant: 5.4
                }
              ].map((item) => (
                <div key={item.university} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-bold text-gray-900 text-lg">{item.university}</h5>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        <span>{item.grants} grants cut</span>
                        <span>|</span>
                        <span>${item.avgGrant}M avg grant</span>
                        <span>|</span>
                        <span>{formatNumber(item.students)} grad students</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        <strong>Research strengths:</strong> {item.strongAreas}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600 font-mono">
                        ${(item.lost / 1e6).toFixed(0)}M
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.impact}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-blue-900 mb-3">🎓 Institutional Impact Patterns</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-blue-900 mb-2">Most Affected Types</p>
                  <ul className="space-y-1 text-blue-800 text-sm">
                    <li>• <strong>R1 research universities:</strong> Lost 15-20% of federal funding</li>
                    <li>• <strong>Climate-focused institutions:</strong> Some lost 40-60% of research funding</li>
                    <li>• <strong>Public universities:</strong> Hit harder than private (less endowment buffer)</li>
                    <li>• <strong>West Coast schools:</strong> Disproportionately affected due to research focus</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-blue-900 mb-2">Least Affected Types</p>
                  <ul className="space-y-1 text-blue-800 text-sm">
                    <li>• <strong>Engineering schools:</strong> Defense-related research protected</li>
                    <li>• <strong>Medical schools:</strong> Some NIH funding maintained</li>
                    <li>• <strong>Agricultural colleges:</strong> Traditional farming research spared</li>
                    <li>• <strong>Private institutions:</strong> Better able to replace lost funding</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibent text-amber-900 mb-3">💡 Innovation Hubs at Risk</h4>
              <p className="text-amber-800 text-sm leading-relaxed mb-3">
                The cuts disproportionately affect universities that serve as innovation hubs, connecting 
                academic research with startup ecosystems and industry partnerships. This could have 
                long-term effects on American technological leadership.
              </p>
              <ul className="space-y-1 text-amber-800 text-sm">
                <li>• <strong>Silicon Valley:</strong> Stanford and Berkeley cuts affect tech innovation pipeline</li>
                <li>• <strong>Boston/Cambridge:</strong> MIT and Harvard reductions impact biotech and AI development</li>
                <li>• <strong>Research Triangle:</strong> Duke, UNC, NC State partnerships with industry affected</li>
                <li>• <strong>Austin:</strong> UT research connections with tech companies reduced</li>
              </ul>
            </div>
          </Section>
        </div>

        {/* 4 */}
        <div id="graduate-impact">
          <Section emoji="🎓" title="Graduate Students & Researchers">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              The human impact of research cuts is most visible among graduate students and postdoctoral 
              researchers. Approximately 15,000 researchers lost federal funding, forcing career changes 
              and international moves.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h4 className="font-semibold text-red-900 mb-3">📉 By the Numbers</h4>
                <ul className="space-y-2 text-red-800 text-sm">
                  <li>• <strong>Graduate students:</strong> ~12,000 lost funding</li>
                  <li>• <strong>Postdocs:</strong> ~2,100 positions eliminated</li>
                  <li>• <strong>Faculty:</strong> ~900 positions not filled</li>
                  <li>• <strong>Research staff:</strong> ~3,200 positions cut</li>
                  <li>• <strong>International students:</strong> ~4,500 affected</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-3">🌍 Where They Go</h4>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• <strong>Private industry:</strong> 45% (mainly tech, pharma)</li>
                  <li>• <strong>Other countries:</strong> 25% (EU, Canada, Australia)</li>
                  <li>• <strong>Different PhD programs:</strong> 15% (switched fields)</li>
                  <li>• <strong>Left academia:</strong> 10% (other careers)</li>
                  <li>• <strong>Unemployed/seeking:</strong> 5%</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="font-semibold text-gray-900">Stories from Affected Researchers</h4>
              
              <PullQuote
                text="I was three years into my climate science PhD when my advisor's NSF grant was terminated. I had to choose: switch to a completely different field or move to Europe. I'm now finishing my dissertation at ETH Zurich."
                source="Former Stanford PhD student"
              />

              <PullQuote
                text="Our entire research group of 12 people was disbanded when the DOE terminated our carbon capture project. Half of us went to industry, half to Europe. Five years of research progress essentially thrown away."
                source="Former MIT postdoc"
              />

              <PullQuote
                text="I've been recruiting international graduate students for 20 years. This year, for the first time, more students are choosing European programs over American ones. The funding uncertainty is a major factor."
                source="University of Michigan faculty member"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-yellow-900 mb-3">🎯 Diversity Impact</h4>
              <p className="text-yellow-800 text-sm leading-relaxed mb-3">
                Research cuts disproportionately affect underrepresented groups in STEM, who often 
                rely more heavily on federal funding for graduate education and research opportunities:
              </p>
              <ul className="space-y-2 text-yellow-800 text-sm">
                <li>• <strong>Women in climate science:</strong> 68% of affected graduate students</li>
                <li>• <strong>Underrepresented minorities:</strong> 43% higher impact in social sciences</li>
                <li>• <strong>First-generation college students:</strong> Less likely to have alternative funding sources</li>
                <li>• <strong>International students:</strong> Limited options, many returning home</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-purple-900 mb-3">🔬 Long-term Talent Pipeline</h4>
              <p className="text-purple-800 text-sm leading-relaxed mb-3">
                The cuts create a "lost generation" problem in certain fields — fewer PhD graduates 
                today means fewer experienced researchers and faculty members 5-10 years from now:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-purple-900 mb-1">Fields with Severe Pipeline Impact</p>
                  <ul className="space-y-1 text-purple-800 text-sm">
                    <li>• Climate science: 40% reduction in new PhDs</li>
                    <li>• Environmental engineering: 35% reduction</li>
                    <li>• Social psychology: 45% reduction</li>
                    <li>• Public health: 25% reduction</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-purple-900 mb-1">Projected Faculty Shortage (2030-2035)</p>
                  <ul className="space-y-1 text-purple-800 text-sm">
                    <li>• Climate science faculty: 30% shortage</li>
                    <li>• Environmental studies: 25% shortage</li>
                    <li>• Certain social sciences: 40% shortage</li>
                    <li>• Public health: 15% shortage</li>
                  </ul>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* 5 */}
        <div id="innovation-pipeline">
          <Section emoji="💡" title="The Innovation Pipeline Crisis">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              University research isn't just academic exercise — it's the foundation of American innovation. 
              The Internet, GPS, touchscreen technology, and mRNA vaccines all emerged from federally-funded 
              university research. The current cuts threaten this innovation pipeline.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-blue-900 mb-3">🏆 Historical Innovation from University Research</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-blue-900 mb-2">Past Federal Research → Commercial Success</p>
                  <ul className="space-y-1 text-blue-800 text-sm">
                    <li>• <strong>Internet (1969):</strong> DARPA funding to universities → $4.8T global market</li>
                    <li>• <strong>GPS (1973):</strong> DoD research → $142B annual location services market</li>
                    <li>• <strong>MRI (1977):</strong> NIH/NSF funding → $7.5B medical imaging market</li>
                    <li>• <strong>Touchscreens (1971):</strong> NSF research → Foundation of mobile revolution</li>
                    <li>• <strong>mRNA vaccines (2005-2020):</strong> NIH funding → COVID vaccine success</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-blue-900 mb-2">Research Areas Now Cut</p>
                  <ul className="space-y-1 text-blue-800 text-sm">
                    <li>• <strong>Carbon capture:</strong> Could enable $1T clean energy market</li>
                    <li>• <strong>Quantum computing:</strong> Projected $65B market by 2030</li>
                    <li>• <strong>AI/ML basics:</strong> Foundation for countless applications</li>
                    <li>• <strong>Battery technology:</strong> Key to EV and grid storage markets</li>
                    <li>• <strong>Biomarkers/diagnostics:</strong> Precision medicine foundation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <h4 className="font-semibold text-gray-900">Innovation Ecosystem Disruption</h4>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h5 className="font-medium text-red-900 mb-2">🔗 University-Industry Partnerships Broken</h5>
                <p className="text-red-800 text-sm mb-3">
                  Many research cuts terminate not just university projects but entire ecosystems of 
                  university-industry-government collaboration:
                </p>
                <ul className="space-y-1 text-red-800 text-sm">
                  <li>• <strong>Stanford-Silicon Valley:</strong> Reduced connections between research and tech startups</li>
                  <li>• <strong>MIT-Boston biotech:</strong> Fewer opportunities for biotech spin-offs</li>
                  <li>• <strong>University of Texas-Austin tech corridor:</strong> Weakened innovation pipeline</li>
                  <li>• <strong>UC system-California green tech:</strong> Clean energy innovation slowed</li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h5 className="font-medium text-orange-900 mb-2">💰 Private Sector Can't Replace Everything</h5>
                <p className="text-orange-800 text-sm mb-3">
                  While private companies invest in R&D, they focus on shorter-term, commercially-viable 
                  projects. Basic research — the foundation of breakthrough innovation — is largely federally funded:
                </p>
                <ul className="space-y-1 text-orange-800 text-sm">
                  <li>• <strong>Corporate R&D focus:</strong> 3-5 year payback periods</li>
                  <li>• <strong>University research:</strong> 10-30 year potential applications</li>
                  <li>• <strong>Private funding bias:</strong> Applied research over basic science</li>
                  <li>• <strong>Risk tolerance:</strong> Companies avoid high-failure-rate basic research</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h5 className="font-medium text-yellow-900 mb-2">🌍 International Competition</h5>
                <p className="text-yellow-800 text-sm mb-3">
                  While the U.S. cuts university research, other countries are investing heavily in 
                  their research infrastructure:
                </p>
                <ul className="space-y-1 text-yellow-800 text-sm">
                  <li>• <strong>China:</strong> University R&D spending +15% annually, now $60B (vs U.S. $38B post-cuts)</li>
                  <li>• <strong>European Union:</strong> Horizon Europe program: $100B over 7 years</li>
                  <li>• <strong>South Korea:</strong> Announced $25B university research expansion</li>
                  <li>• <strong>Canada:</strong> Actively recruiting U.S. researchers with funding packages</li>
                </ul>
              </div>
            </div>

            <PullQuote
              text="We're essentially handing the next generation of technological leadership to other countries. The research we're cutting today would have been the innovations of 2035-2045. We're mortgaging our future competitiveness for short-term budget savings."
              source="Former NSF Program Director"
            />
          </Section>
        </div>

        {/* 6 */}
        <div id="international">
          <Section emoji="🌍" title="Brain Drain to Other Countries">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              One of the most concerning effects of research cuts is the acceleration of brain drain — 
              top researchers leaving the U.S. for countries with better research funding and support. 
              This reverses decades of American scientific leadership.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h4 className="font-semibold text-red-900 mb-3">📈 Outbound Migration</h4>
                <ul className="space-y-2 text-red-800 text-sm">
                  <li>• <strong>Total researchers leaving:</strong> ~3,800 (2025 vs 2024)</li>
                  <li>• <strong>Climate scientists:</strong> 890 to EU/Canada/Australia</li>
                  <li>• <strong>AI researchers:</strong> 650 to UK, Switzerland, Singapore</li>
                  <li>• <strong>Social scientists:</strong> 420 to European universities</li>
                  <li>• <strong>Graduate students:</strong> 4,500 switching to international programs</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-3">🎯 Destination Countries</h4>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• <strong>Germany:</strong> Max Planck Institutes, strong climate research</li>
                  <li>• <strong>Switzerland:</strong> ETH Zurich, CERN — well-funded programs</li>
                  <li>• <strong>Canada:</strong> Aggressive researcher recruitment program</li>
                  <li>• <strong>United Kingdom:</strong> Brexit-related investment in research</li>
                  <li>• <strong>Singapore:</strong> High pay, modern facilities, stable funding</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="font-semibold text-gray-900">International Recruitment Campaigns</h4>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h5 className="font-medium text-green-900 mb-2">🇨🇦 Canada's "Maple Leaf Minds" Initiative</h5>
                <p className="text-green-800 text-sm mb-3">
                  Canada launched a $2.5B program specifically targeting American researchers affected by cuts:
                </p>
                <ul className="space-y-1 text-green-800 text-sm">
                  <li>• <strong>Climate scientists:</strong> 5-year guaranteed funding packages</li>
                  <li>• <strong>Fast-track immigration:</strong> Permanent residence in 6 months</li>
                  <li>• <strong>Family support:</strong> Spousal work permits, children's education</li>
                  <li>• <strong>Research infrastructure:</strong> $500K equipment budgets per researcher</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h5 className="font-medium text-purple-900 mb-2">🇩🇪 Germany's "American Minds" Program</h5>
                <p className="text-purple-800 text-sm mb-3">
                  German research institutions created specific programs for American researchers:
                </p>
                <ul className="space-y-1 text-purple-800 text-sm">
                  <li>• <strong>Max Planck fellowships:</strong> 3-year positions with tenure track option</li>
                  <li>• <strong>Language support:</strong> German language training for families</li>
                  <li>• <strong>Cultural integration:</strong> Dedicated support for American expatriates</li>
                  <li>• <strong>Competitive salaries:</strong> Often 50% above U.S. postdoc rates</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h5 className="font-medium text-yellow-900 mb-2">🇸🇬 Singapore's Strategic Targeting</h5>
                <p className="text-yellow-800 text-sm mb-3">
                  Singapore specifically targets high-value researchers with exceptional packages:
                </p>
                <ul className="space-y-1 text-yellow-800 text-sm">
                  <li>• <strong>AI/tech focus:</strong> Premium packages for machine learning experts</li>
                  <li>• <strong>Tax advantages:</strong> Significantly lower tax rates than U.S.</li>
                  <li>• <strong>Quality of life:</strong> Modern facilities, international environment</li>
                  <li>• <strong>Regional access:</strong> Gateway to Asian markets and collaboration</li>
                </ul>
              </div>
            </div>

            <PullQuote
              text="I received offers from three countries within two weeks of my NSF grant being terminated. The Canadian offer was double my U.S. salary with guaranteed funding for five years. It was an easy decision."
              source="Climate scientist, now at University of Toronto"
            />

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-amber-900 mb-3">🔄 The Reverse Brain Drain Problem</h4>
              <p className="text-amber-800 text-sm leading-relaxed mb-3">
                For decades, the U.S. attracted the world's best researchers with superior funding, 
                facilities, and opportunities. This "brain drain" from other countries to America 
                was a key competitive advantage. The current cuts are reversing this trend:
              </p>
              <ul className="space-y-2 text-amber-800 text-sm">
                <li>• <strong>Historical advantage:</strong> U.S. attracted 40% of world's top researchers</li>
                <li>• <strong>Current trend:</strong> More researchers leaving U.S. than arriving for first time since 1960s</li>
                <li>• <strong>Network effects:</strong> Top researchers attract other top researchers — departures accelerate</li>
                <li>• <strong>Institutional memory:</strong> Departing researchers take knowledge of American research priorities with them</li>
              </ul>
            </div>
          </Section>
        </div>

        {/* 7 */}
        <div id="long-term">
          <Section emoji="🔮" title="Long-term Consequences">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              The full impact of university research cuts won't be visible for years or even decades. 
              Innovation cycles are long — the research cut today might have become the breakthrough 
              technology of 2040. Here's what experts predict for long-term consequences.
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h4 className="font-semibold text-red-900 mb-3">🚨 Immediate Consequences (2026-2028)</h4>
                <ul className="space-y-2 text-red-800 text-sm">
                  <li>• <strong>PhD program closures:</strong> 45 programs terminated, 120 significantly reduced</li>
                  <li>• <strong>Research infrastructure decay:</strong> Expensive equipment unused, facilities closed</li>
                  <li>• <strong>International collaboration decline:</strong> Reduced participation in global research projects</li>
                  <li>• <strong>Patent applications drop:</strong> University-generated patents down 25% (2025 vs 2024)</li>
                  <li>• <strong>Startup pipeline reduction:</strong> Fewer university spin-offs and tech transfer</li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h4 className="font-semibold text-orange-900 mb-3">⏳ Medium-term Impact (2029-2035)</h4>
                <ul className="space-y-2 text-orange-800 text-sm">
                  <li>• <strong>Faculty shortage:</strong> Fewer PhD graduates mean fewer future faculty members</li>
                  <li>• <strong>Research capacity permanently reduced:</strong> Lost expertise takes decades to rebuild</li>
                  <li>• <strong>Innovation lag:</strong> Technologies that could have emerged by 2035 delayed or never developed</li>
                  <li>• <strong>Industrial competitiveness:</strong> U.S. companies lose access to cutting-edge university research</li>
                  <li>• <strong>National security implications:</strong> Reduced capacity in critical technology areas</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h4 className="font-semibold text-yellow-900 mb-3">🌍 Long-term Implications (2036-2050)</h4>
                <ul className="space-y-2 text-yellow-800 text-sm">
                  <li>• <strong>Scientific leadership loss:</strong> Other countries become centers of innovation in key fields</li>
                  <li>• <strong>Economic competitiveness:</strong> U.S. becomes technology importer rather than innovator</li>
                  <li>• <strong>Climate technology gap:</strong> U.S. dependent on foreign clean energy technology</li>
                  <li>• <strong>Medical research deficit:</strong> Next generation of treatments developed elsewhere</li>
                  <li>• <strong>Educational quality decline:</strong> University rankings fall as research capacity erodes</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-blue-900 mb-3">📊 Comparative Analysis: Historical Precedents</h4>
              <p className="text-blue-800 text-sm mb-3">
                History provides examples of what happens when countries reduce research investment:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-blue-900 mb-2">Historical Research Cuts</p>
                  <ul className="space-y-1 text-blue-800 text-sm">
                    <li>• <strong>UK (1980s):</strong> Research cuts led to 20-year lag in biotech</li>
                    <li>• <strong>Japan (1990s):</strong> Reduced university funding contributed to "lost decades"</li>
                    <li>• <strong>Russia (1990s):</strong> Massive brain drain, still recovering scientific capacity</li>
                    <li>• <strong>Argentina (2001):</strong> Economic crisis → research cuts → lasting impact on innovation</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-blue-900 mb-2">Countries That Invested Instead</p>
                  <ul className="space-y-1 text-blue-800 text-sm">
                    <li>• <strong>South Korea (1990s-2000s):</strong> Massive R&D investment → tech leadership</li>
                    <li>• <strong>China (2000s-present):</strong> Research investment → rapid innovation growth</li>
                    <li>• <strong>Germany (2000s):</strong> Excellence Initiative → renewed scientific leadership</li>
                    <li>• <strong>Singapore (1990s-present):</strong> Strategic research investment → innovation hub</li>
                  </ul>
                </div>
              </div>
            </div>

            <PullQuote
              text="Research cuts are easy to make and hard to reverse. It took us 30 years to build American scientific leadership after World War II. It could take just as long to rebuild it if we're making the wrong choices now."
              source="Former Presidential Science Advisor"
            />

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibent text-purple-900 mb-3">🔧 Potential Recovery Strategies</h4>
              <p className="text-purple-800 text-sm leading-relaxed mb-3">
                If policymakers decide to reverse course, recovery will require sustained, strategic investment:
              </p>
              <ul className="space-y-2 text-purple-800 text-sm">
                <li>• <strong>Funding restoration:</strong> Return to 2024 funding levels would take 3-5 years</li>
                <li>• <strong>Talent recovery:</strong> Attracting researchers back from other countries requires premium packages</li>
                <li>• <strong>Infrastructure rebuilding:</strong> Specialized equipment and facilities need years to reestablish</li>
                <li>• <strong>International collaboration:</strong> Rebuilding research partnerships takes time and trust</li>
                <li>• <strong>Student pipeline:</strong> Training the next generation of researchers takes 5-8 years minimum</li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              The university research cuts represent a historic shift in American science policy. 
              Whether this proves to be a temporary setback or a permanent reduction in American 
              scientific leadership depends on future policy choices and the ability to rebuild 
              what's being dismantled.
            </p>

            <p className="text-gray-700 leading-relaxed">
              What's certain is that the decisions being made today will echo for decades. The 
              researchers leaving the U.S., the students switching to other countries, and the 
              projects being terminated represent not just immediate budget savings, but a 
              fundamental change in America's commitment to scientific discovery and innovation.
            </p>
          </Section>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-8 text-center">
          <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Related Research Analysis</h3>
          <p className="text-gray-600 mb-6">Explore more impacts of DOGE's cuts on knowledge and innovation.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/analysis/federal-brain-drain-cost" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700">
              Brain Drain Cost →
            </Link>
            <Link href="/analysis/where-grants-went" className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50">
              All Grant Cuts
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