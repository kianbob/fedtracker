import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-lg font-bold text-gray-900 mb-3">FedTracker</h3>
            <p className="text-sm text-gray-600">
              Tracking the federal workforce with data from OPM FedScope.
              Open data, open source.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Explore</h4>
            <div className="space-y-2 text-sm">
              <Link href="/agencies" className="block text-gray-600 hover:text-accent">Agencies</Link>
              <Link href="/doge" className="block text-gray-600 hover:text-accent">DOGE Impact</Link>
              <Link href="/layoffs" className="block text-gray-600 hover:text-accent">Layoffs & Separations</Link>
              <Link href="/trends" className="block text-gray-600 hover:text-accent">Workforce Trends</Link>
              <Link href="/occupations" className="block text-gray-600 hover:text-accent">Occupations</Link>
              <Link href="/states" className="block text-gray-600 hover:text-accent">States</Link>
              <Link href="/salaries" className="block text-gray-600 hover:text-accent">Salaries</Link>
              <Link href="/compare" className="block text-gray-600 hover:text-accent">Compare Agencies</Link>
              <Link href="/lookup" className="block text-gray-600 hover:text-accent">Agency Lookup</Link>
              <Link href="/downloads" className="block text-gray-600 hover:text-accent">Downloads</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Analysis</h4>
            <div className="space-y-2 text-sm">
              <Link href="/risk" className="block text-gray-600 hover:text-accent">Agency Risk Scores</Link>
              <Link href="/impact" className="block text-gray-600 hover:text-accent">State Impact</Link>
              <Link href="/education" className="block text-gray-600 hover:text-accent">Education & Pay</Link>
              <Link href="/workforce-analysis" className="block text-gray-600 hover:text-accent">Workforce Deep Dive</Link>
              <Link href="/demographics" className="block text-gray-600 hover:text-accent">Demographics</Link>
              <Link href="/subagencies" className="block text-gray-600 hover:text-accent">Subagencies</Link>
              <Link href="/spending" className="block text-gray-600 hover:text-accent">Agency Spending</Link>
              <Link href="/findings" className="block text-gray-600 hover:text-accent">Key Findings</Link>
              <Link href="/timeline" className="block text-gray-600 hover:text-accent">DOGE Timeline</Link>
              <Link href="/occupation-impact" className="block text-gray-600 hover:text-accent">Occupation Impact</Link>
              <Link href="/appointments" className="block text-gray-600 hover:text-accent">Appointment Types</Link>
              <Link href="/about" className="block text-gray-600 hover:text-accent">About & Methodology</Link>
            </div>
            <h4 className="font-semibold text-gray-900 mb-3 mt-6">Editorial</h4>
            <div className="space-y-2 text-sm">
              <Link href="/federal-bloat" className="block text-gray-600 hover:text-accent">Is the Federal Workforce Too Big?</Link>
              <Link href="/who-got-cut" className="block text-gray-600 hover:text-accent">Who Got Cut: DOGE Reductions</Link>
              <Link href="/salary-analysis" className="block text-gray-600 hover:text-accent">Federal Pay Analysis</Link>
            </div>
            <h4 className="font-semibold text-gray-900 mb-3 mt-6">Data Sources</h4>
            <div className="space-y-2 text-sm">
              <a href="https://data.opm.gov/" target="_blank" rel="noopener" className="block text-gray-600 hover:text-accent">data.opm.gov →</a>
              <a href="https://www.opm.gov/data/datasets/" target="_blank" rel="noopener" className="block text-gray-600 hover:text-accent">OPM FedScope →</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500">
          Data: OPM FedScope (December 2025 Employment, FY2020-2025 Separations &amp; Accessions) | USASpending.gov (FY2025 Budget Authority).
        </div>
      </div>
    </footer>
  );
}
