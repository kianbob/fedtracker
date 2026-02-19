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
              <Link href="/layoffs" className="block text-gray-600 hover:text-accent">Layoffs & Separations</Link>
              <Link href="/occupations" className="block text-gray-600 hover:text-accent">Occupations</Link>
              <Link href="/states" className="block text-gray-600 hover:text-accent">States</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Data</h4>
            <div className="space-y-2 text-sm">
              <a href="https://www.opm.gov/data/datasets/" target="_blank" rel="noopener" className="block text-gray-600 hover:text-accent">OPM FedScope →</a>
              <Link href="/about" className="block text-gray-600 hover:text-accent">About & Methodology</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500">
          Data: OPM FedScope (March 2025 Employment, FY2020-2024 Separations & Accessions).
        </div>
      </div>
    </footer>
  );
}
