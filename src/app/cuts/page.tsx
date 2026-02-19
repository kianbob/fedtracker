import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DOGE & Cuts — OpenFeds",
  description: "Track federal workforce reductions, DOGE impact, separations, geographic effects, and risk analysis.",
};

const items = [
  { href: "/doge", title: "DOGE Impact Dashboard", stat: "Live", desc: "Real-time workforce reduction tracker" },
  { href: "/layoffs", title: "Separations", stat: "📊", desc: "All types of federal departures" },
  { href: "/timeline", title: "Timeline", stat: "📅", desc: "Month-by-month workforce changes" },
  { href: "/who-got-cut", title: "Who Got Cut", stat: "🔎", desc: "Detailed reduction breakdown" },
  { href: "/impact", title: "State Impact", stat: "🗺️", desc: "Geographic effects of cuts" },
  { href: "/occupation-impact", title: "Occupation Impact", stat: "👷", desc: "Which jobs are most at risk" },
  { href: "/risk", title: "Risk Scores", stat: "⚡", desc: "Which agencies are most vulnerable" },
];

export default function CutsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-12">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">OpenFeds</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          ⚠️ DOGE & Cuts
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
          Track federal workforce reductions — who is being cut, where, and what the impact looks like across agencies and states.
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
