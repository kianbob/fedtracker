import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Analysis — OpenFeds",
  description: "In-depth federal workforce analysis: key findings, risk scores, brain drain, retirement cliff, and more.",
  alternates: { canonical: "/analysis" },
};

const items = [
  { href: "/findings", title: "Key Findings", stat: "🏆", desc: "Major insights and discoveries" },
  { href: "/risk", title: "Risk Scores", stat: "⚡", desc: "Agency vulnerability assessment" },
  { href: "/brain-drain", title: "Brain Drain Index", stat: "🧠", desc: "Who is really leaving" },
  { href: "/retirement-cliff", title: "Retirement Cliff", stat: "⏳", desc: "Aging workforce risk analysis" },
  { href: "/geographic-impact", title: "Geographic Impact", stat: "🗺️", desc: "Where federal jobs are concentrated" },
  { href: "/monthly-timeline", title: "Monthly Timeline", stat: "📅", desc: "Month-by-month workforce changes" },
  { href: "/federal-bloat", title: "Federal Bloat", stat: "🏛️", desc: "Federal workforce size and efficiency" },
  { href: "/salary-analysis", title: "Salary Analysis", stat: "💵", desc: "Deep pay pattern analysis" },
  { href: "/spending", title: "Agency Spending", stat: "💰", desc: "Budget per employee by agency" },
  { href: "/stem-workforce", title: "STEM Workforce", stat: "🔬", desc: "Technical workforce analysis" },
  { href: "/salary-explorer", title: "Salary Explorer", stat: "🔎", desc: "Interactive pay lookup tool" },
  { href: "/demographics", title: "Demographics", stat: "2M+", desc: "Age, gender, and veteran statistics" },
  { href: "/education", title: "Education & Pay", stat: "🎓", desc: "How degrees affect federal salaries" },
  { href: "/occupations", title: "Occupations", stat: "540+", desc: "Every federal job series analyzed" },
  { href: "/trends", title: "Workforce Trends", stat: "5yr", desc: "Employment changes over time" },
  { href: "/impact", title: "State Impact", stat: "🗺️", desc: "Geographic effects of cuts" },
  { href: "/appointments", title: "Appointments", stat: "📋", desc: "Hiring types and patterns" },
  { href: "/occupation-impact", title: "Occupation Impact", stat: "👷", desc: "Which jobs are most at risk" },
  { href: "/who-got-cut", title: "Who Got Cut", stat: "🔎", desc: "Detailed reduction breakdown" },
];

export default function AnalysisPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-12">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">OpenFeds</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          📈 Analysis
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
          In-depth analysis of the federal workforce — key findings, risk assessments, brain drain trends, and spending patterns.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
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
    </div>
  );
}
