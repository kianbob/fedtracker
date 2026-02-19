import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Explore — OpenFeds",
  description: "Browse all OpenFeds data: agencies, occupations, states, workforce trends, DOGE impact, and analysis.",
};

const sections = [
  {
    title: "Explore Data",
    emoji: "🔍",
    items: [
      { href: "/agencies", title: "Agencies", stat: "128", desc: "Browse all federal agencies with workforce data" },
      { href: "/occupations", title: "Occupations", stat: "540+", desc: "Every federal job series analyzed" },
      { href: "/states", title: "States", stat: "50", desc: "Federal employment by state" },
      { href: "/subagencies", title: "Subagencies", stat: "500+", desc: "Drill into agency subdivisions" },
      { href: "/lookup", title: "Agency Lookup", stat: "⚡", desc: "Search and find any agency instantly" },
    ],
  },
  {
    title: "Workforce",
    emoji: "👥",
    items: [
      { href: "/trends", title: "Workforce Trends", stat: "5yr", desc: "Track federal employment changes over time" },
      { href: "/demographics", title: "Demographics", stat: "2M+", desc: "Age, gender, and veteran statistics" },
      { href: "/salaries", title: "Salaries", stat: "$$$", desc: "Federal pay grades and analysis" },
      { href: "/appointments", title: "Appointments", stat: "📋", desc: "Hiring types and patterns" },
      { href: "/education", title: "Education & Pay", stat: "🎓", desc: "How degrees affect federal salaries" },
      { href: "/spending", title: "Agency Spending", stat: "💰", desc: "Budget per employee by agency" },
    ],
  },
  {
    title: "DOGE & Cuts",
    emoji: "⚠️",
    items: [
      { href: "/doge", title: "DOGE Impact Dashboard", stat: "Live", desc: "Real-time workforce reduction tracker" },
      { href: "/layoffs", title: "Separations", stat: "📊", desc: "All types of federal departures" },
      { href: "/who-got-cut", title: "Who Got Cut", stat: "🔎", desc: "Detailed reduction breakdown" },
      { href: "/risk", title: "Risk Scores", stat: "⚡", desc: "Which agencies are most vulnerable" },
      { href: "/impact", title: "State Impact", stat: "🗺️", desc: "Geographic effects of cuts" },
      { href: "/timeline", title: "Timeline", stat: "📅", desc: "Month-by-month workforce changes" },
      { href: "/occupation-impact", title: "Occupation Impact", stat: "👷", desc: "Which jobs are most at risk" },
    ],
  },
  {
    title: "Analysis",
    emoji: "📈",
    items: [
      { href: "/findings", title: "Key Findings", stat: "🏆", desc: "Major insights and discoveries" },
      { href: "/workforce-analysis", title: "Workforce Deep Dive", stat: "📖", desc: "Comprehensive workforce analysis" },
      { href: "/federal-bloat", title: "Federal Bloat", stat: "🏛️", desc: "Federal workforce size & efficiency" },
      { href: "/salary-analysis", title: "Salary Analysis", stat: "💵", desc: "Deep pay pattern analysis" },
      { href: "/compare", title: "Compare Agencies", stat: "⚖️", desc: "Side-by-side agency comparison" },
      { href: "/brain-drain", title: "Brain Drain Index", stat: "🧠", desc: "Who is really leaving" },
      { href: "/retirement-cliff", title: "Retirement Cliff", stat: "⏳", desc: "Aging workforce risk analysis" },
      { href: "/geographic-impact", title: "Geographic Impact", stat: "🗺️", desc: "Where federal jobs are concentrated" },
      { href: "/stem-workforce", title: "STEM Brain Drain", stat: "🔬", desc: "Technical workforce analysis" },
      { href: "/salary-explorer", title: "Salary Explorer", stat: "🔎", desc: "Interactive pay lookup tool" },
      { href: "/monthly-timeline", title: "Monthly Timeline", stat: "📅", desc: "Month-by-month workforce changes" },
    ],
  },
];

export default function ExplorePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-12">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">OpenFeds</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Explore the Data
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
          Everything OpenFeds offers in one place. Browse federal workforce data across agencies, occupations, states, and more.
        </p>
      </header>

      {sections.map((section) => (
        <section key={section.title} className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            <span className="mr-2">{section.emoji}</span>
            {section.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group block p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-accent hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-lg font-bold text-accent ml-2 shrink-0">{item.stat}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
