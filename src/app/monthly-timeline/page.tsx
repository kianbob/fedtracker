import type { Metadata } from "next";
import Link from "next/link";
import { MonthlyTimelineClient } from "./MonthlyTimelineClient";

export const metadata: Metadata = {
  title: "Month by Month: How the Federal Workforce Changed (FY2020-2024) — FedTracker",
  description:
    "48 months of federal workforce data: separations, accessions, quits, retirements, RIFs, and net change. See the patterns the annual numbers hide.",
};

export default function MonthlyTimelinePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-indigo-400">Home</Link>
        <span>/</span>
        <span>Analysis</span>
        <span>/</span>
        <span className="text-slate-300">Monthly Timeline</span>
      </nav>
      <header className="mb-12">
        <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">
          FedTracker Analysis
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Month by Month: How the Federal Workforce Changed
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          48 months of workforce data reveal patterns that annual summaries hide.
          December is consistently devastating for headcount. COVID suppressed both
          hiring and departures. And the Great Resignation hit government too.
        </p>
      </header>
      <MonthlyTimelineClient />
      <section className="mt-16 space-y-8 max-w-3xl">
        <h2 className="font-serif text-3xl font-bold text-gray-900">
          <span className="mr-3">📝</span>What the Monthly View Reveals
        </h2>
        <div className="prose prose-slate max-w-none">
          <p>
            Annual workforce reports smooth over the dramatic monthly swings that define
            the federal employment cycle. The monthly data tells a more honest story.
          </p>
          <p>
            <strong>December is the cruelest month.</strong> Every December shows a massive spike
            in retirements — end-of-year departures that are deeply embedded in federal culture.
            December 2021 was the worst single month in our data: a net loss of 18,323 employees,
            driven by 18,920 retirements alone.
          </p>
          <p>
            <strong>COVID suppressed movement in both directions.</strong> In early 2020, both
            hiring and separations dropped as the government froze in place. But by mid-2020,
            agencies were on a hiring surge — March through August 2020 saw consistently positive
            net gains as the government ramped up pandemic response.
          </p>
          <p>
            <strong>The Great Resignation arrived late.</strong> While the private sector saw
            quit rates spike in 2021, federal quits peaked in mid-2021 through early 2022.
            Government employees, with better job security, took longer to join the trend —
            but they did join it.
          </p>
          <p>
            <strong>2023 was a recovery year.</strong> Every month of 2023 in our data shows
            positive net change — the government was actively rebuilding headcount after
            the 2021-2022 exodus.
          </p>
          <p className="text-sm text-gray-500 italic">
            Note: This data covers FY2020 through September 2023 from OPM FedScope bulk files.
            For 2025 data including DOGE workforce reduction impacts, see the{" "}
            <Link href="/doge" className="text-indigo-600 hover:text-indigo-800">DOGE Impact Dashboard</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
