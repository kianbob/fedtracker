import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Explore */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wider">Explore</h4>
            <div className="space-y-2 text-sm">
              <Link href="/agencies" aria-label="Browse federal agencies" className="block text-gray-600 hover:text-accent">Agencies</Link>
              <Link href="/doge" aria-label="DOGE impact on federal workforce" className="block text-gray-600 hover:text-accent">DOGE Impact</Link>
              <Link href="/layoffs" aria-label="Federal layoffs and separations data" className="block text-gray-600 hover:text-accent">Layoffs & Separations</Link>
              <Link href="/trends" aria-label="Workforce trends over time" className="block text-gray-600 hover:text-accent">Workforce Trends</Link>
              <Link href="/occupations" aria-label="Federal occupations data" className="block text-gray-600 hover:text-accent">Occupations</Link>
              <Link href="/states" aria-label="Federal workforce by state" className="block text-gray-600 hover:text-accent">States</Link>
              <Link href="/salaries" aria-label="Federal salary data" className="block text-gray-600 hover:text-accent">Salaries</Link>
              <Link href="/salary-compare" aria-label="Compare your salary to federal employees" className="block text-gray-600 hover:text-accent">Salary Compare</Link>
              <Link href="/compare" aria-label="Compare federal agencies" className="block text-gray-600 hover:text-accent">Compare</Link>
              <Link href="/lookup" aria-label="Look up a federal agency" className="block text-gray-600 hover:text-accent">Agency Lookup</Link>
              <Link href="/downloads" aria-label="Download federal workforce data" className="block text-gray-600 hover:text-accent">Downloads</Link>
            </div>
          </div>

          {/* Analysis */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wider">Analysis</h4>
            <div className="space-y-2 text-sm">
              <Link href="/risk" aria-label="Agency risk score rankings" className="block text-gray-600 hover:text-accent">Agency Risk Scores</Link>
              <Link href="/impact" aria-label="State-level workforce impact" className="block text-gray-600 hover:text-accent">State Impact</Link>
              <Link href="/education" aria-label="Education levels and pay analysis" className="block text-gray-600 hover:text-accent">Education & Pay</Link>
              <Link href="/workforce-analysis" aria-label="Deep dive into workforce data" className="block text-gray-600 hover:text-accent">Workforce Deep Dive</Link>
              <Link href="/demographics" aria-label="Federal workforce demographics" className="block text-gray-600 hover:text-accent">Demographics</Link>
              <Link href="/subagencies" aria-label="Subagency-level data" className="block text-gray-600 hover:text-accent">Subagencies</Link>
              <Link href="/spending" aria-label="Agency spending and budget data" className="block text-gray-600 hover:text-accent">Agency Spending</Link>
              <Link href="/findings" aria-label="Key findings from the data" className="block text-gray-600 hover:text-accent">Key Findings</Link>
              <Link href="/timeline" aria-label="DOGE actions timeline" className="block text-gray-600 hover:text-accent">DOGE Timeline</Link>
              <Link href="/occupation-impact" aria-label="Impact on federal occupations" className="block text-gray-600 hover:text-accent">Occupation Impact</Link>
              <Link href="/appointments" aria-label="Appointment type breakdown" className="block text-gray-600 hover:text-accent">Appointment Types</Link>
            </div>
          </div>

          {/* Editorial */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wider">Editorial</h4>
            <div className="space-y-2 text-sm">
              <Link href="/federal-bloat" aria-label="Analysis: Is the federal workforce too big?" className="block text-gray-600 hover:text-accent">Federal Bloat</Link>
              <Link href="/who-got-cut" aria-label="Analysis: Who got cut in DOGE reductions" className="block text-gray-600 hover:text-accent">Who Got Cut</Link>
              <Link href="/salary-analysis" aria-label="Analysis: Federal pay compared to private sector" className="block text-gray-600 hover:text-accent">Salary Analysis</Link>
            </div>
          </div>

          {/* Data Sources + About */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wider">Data Sources</h4>
            <div className="space-y-2 text-sm">
              <a href="https://data.opm.gov/" target="_blank" rel="noopener noreferrer" aria-label="OPM data portal (external)" className="block text-gray-600 hover:text-accent">data.opm.gov ↗</a>
              <a href="https://www.opm.gov/data/datasets/" target="_blank" rel="noopener noreferrer" aria-label="OPM FedScope datasets (external)" className="block text-gray-600 hover:text-accent">OPM FedScope ↗</a>
            </div>
            <div className="mt-6">
              <Link href="/about" aria-label="About OpenFeds and methodology" className="text-sm text-gray-600 hover:text-accent font-medium">About & Methodology</Link>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wider">Sister Sites</h4>
              <div className="space-y-2 text-sm">
                <a href="https://www.openmedicare.us" target="_blank" rel="noopener noreferrer" className="block text-gray-600 hover:text-accent">OpenMedicare — Medicare Spending Tracker ↗</a>
                <a href="https://www.openmedicaid.org" target="_blank" rel="noopener noreferrer" className="block text-gray-600 hover:text-accent">OpenMedicaid — Medicaid Spending Tracker ↗</a>
                <a href="https://www.openspending.us" target="_blank" rel="noopener noreferrer" className="block text-gray-600 hover:text-accent">OpenSpending — Federal Spending Tracker ↗</a>
                <a href="https://www.openimmigration.us" target="_blank" rel="noopener noreferrer" className="block text-gray-600 hover:text-accent">OpenImmigration — Immigration Court Tracker ↗</a>
                <a href="https://www.openlobby.us" target="_blank" rel="noopener noreferrer" className="block text-gray-600 hover:text-accent">OpenLobby — Federal Lobbying Tracker ↗</a>
                <a href="https://www.vaccinewatch.org" target="_blank" rel="noopener noreferrer" className="block text-gray-600 hover:text-accent">VaccineWatch — Vaccine Safety Data ↗</a>
                <a href="https://www.opensubsidies.org" target="_blank" rel="noopener noreferrer" className="block text-gray-600 hover:text-accent">OpenSubsidies — Farm Subsidy Tracker ↗</a>
              </li>
              <li>
                <a href="https://openprescriber.vercel.app" target="_blank" rel="noopener noreferrer" className="block text-gray-600 hover:text-accent">OpenPrescriber — Medicare Prescriber Tracker ↗</a>              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-serif text-lg font-bold text-gray-900 mb-1">OpenFeds</h4>
              <p className="text-xs text-gray-500">
                Tracking the federal workforce with data from OPM FedScope.
                Open data, open source.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500">
          <p className="font-medium text-gray-600 mb-1">Data as of December 2025</p>
          <p>Sources: OPM FedScope (December 2025 Employment, FY2020–2025 Separations &amp; Accessions) | USASpending.gov (FY2025 Budget Authority).</p>
        </div>
      </div>
    </footer>
  );
}
