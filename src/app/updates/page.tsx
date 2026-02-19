import type { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
  title: "Updates — FedTracker",
  description: "Data updates and changelog for FedTracker federal workforce data.",
};

const updates = [
  {
    date: "February 2025",
    title: "Added December 2025 employment data",
    details:
      "Updated employment snapshot to December 2025. Added DOGE Impact Dashboard, Who Got Cut analysis, and agency risk scores.",
  },
  {
    date: "January 2025",
    title: "Initial launch with Oct 2023 – Nov 2025 data",
    details:
      "Launched FedTracker with OPM FedScope employment snapshots and separation/accession flow data covering FY2020–2025. Includes agency profiles, occupation explorer, state breakdowns, salary analysis, and editorial analysis pages.",
  },
  {
    date: "January 2025",
    title: "DOGE Impact Dashboard added",
    details:
      "Added interactive dashboard tracking the 2025 federal workforce restructuring: 217K net positions reduced, agency-by-agency breakdown, and monthly trends.",
  },
];

export default function UpdatesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-indigo-400">Home</Link>
        <span>/</span>
        <span className="text-slate-300">Updates</span>
      </nav>
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Updates</h1>
      <p className="text-gray-500 mb-10">Data updates and site changelog.</p>

      <div className="relative border-l-2 border-gray-200 ml-4">
        {updates.map((u, i) => (
          <div key={i} className="relative pl-8 pb-10 last:pb-0">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white" />
            <p className="text-sm font-medium text-indigo-600 mb-1">{u.date}</p>
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">{u.title}</h2>
            <p className="text-gray-600 leading-relaxed">{u.details}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          FedTracker updates after each new OPM FedScope data release. See{" "}
          <Link href="/about" className="text-indigo-600 hover:underline">About</Link> for data sources and methodology.
        </p>
      </div>
    </div>
  );
}
