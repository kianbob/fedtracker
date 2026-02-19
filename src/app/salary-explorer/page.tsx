import type { Metadata } from "next";
import Link from "next/link";
import { SalaryExplorerClient } from "./SalaryExplorerClient";

export const metadata: Metadata = {
  title: "Federal Salary Explorer: What Does Government Pay? — FedTracker",
  description:
    "Interactive tool to explore federal salaries by agency and grade. Compare pay across 128 agencies, see GS grade distributions, and find out what government jobs really pay.",
};

export default function SalaryExplorerPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-indigo-400">Home</Link>
        <span>/</span>
        <span>Analysis</span>
        <span>/</span>
        <span className="text-slate-300">Salary Explorer</span>
      </nav>
      <header className="mb-12">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">
          Interactive Tool
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Federal Salary Explorer
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          What does the federal government actually pay? Explore salaries across 128 agencies,
          see how GS grades translate to real compensation, and compare agencies side by side.
        </p>
      </header>
      <SalaryExplorerClient />
      <section className="mt-16 prose prose-slate max-w-none">
        <h2 className="font-serif text-2xl font-bold text-gray-900">How Federal Pay Works</h2>
        <p>
          Most federal civilian employees are paid under the <strong>General Schedule (GS)</strong> system,
          which has 15 grades (GS-1 through GS-15) with 10 steps each. Pay varies by locality —
          a GS-13 in San Francisco earns significantly more than one in rural Alabama. Senior executives
          (SES) and certain specialized roles (doctors, scientists, IT) have separate pay systems.
        </p>
        <p>
          The data here comes from OPM FedScope and reflects actual salaries, not just base pay tables.
          This includes locality adjustments, special pay rates, and other supplements.
        </p>
      </section>
    </div>
  );
}
