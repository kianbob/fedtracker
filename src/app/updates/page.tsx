import type { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
  title: "Updates — OpenFeds",
  description: "Data updates and changelog for OpenFeds federal workforce data.",
};

const updates = [
  {
    date: "February 19, 2026",
    items: [
      {
        title: "Rebranded from FedTracker to OpenFeds",
        details:
          "Renamed the project to OpenFeds with a new domain at openfeds.org. Updated all references, canonical URLs, and metadata across the site.",
      },
      {
        title: "Added 6 new analysis pages",
        details:
          "Launched Brain Drain, Retirement Cliff, Geographic Impact, STEM Workforce, Monthly Timeline, and Salary Explorer pages with interactive charts and data breakdowns.",
      },
      {
        title: "Redesigned navigation with dropdown categories",
        details:
          "Reorganized navigation into grouped dropdown menus (Explore, Workforce, Analysis, Cuts) for easier discovery across the growing number of pages.",
      },
      {
        title: "Added sister site cross-linking with OpenMedicaid",
        details:
          "Added footer link to OpenMedicaid, our companion site for Medicaid enrollment and spending data.",
      },
    ],
  },
  {
    date: "February 18, 2026",
    items: [
      {
        title: "Added SEO structured data and breadcrumbs",
        details:
          "Implemented JSON-LD structured data (WebSite and Dataset schemas) for search engine discoverability. Added breadcrumb navigation to all pages.",
      },
    ],
  },
  {
    date: "February 17, 2026",
    items: [
      {
        title: "Initial launch with December 2025 OPM data",
        details:
          "Launched OpenFeds with OPM FedScope employment snapshots and separation/accession flow data covering FY2020–2025. Includes agency profiles, occupation explorer, state breakdowns, salary analysis, DOGE impact dashboard, and editorial analysis pages.",
      },
    ],
  },
];

export default function UpdatesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Updates</span>
      </nav>
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Changelog</h1>
      <p className="text-gray-500 mb-10">Data updates and site changelog for OpenFeds.</p>

      <div className="space-y-0">
        {updates.map((group, gi) => (
          <div key={gi} className="relative">
            {/* Date header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100 flex-shrink-0" />
              <time className="text-sm font-semibold text-indigo-600">{group.date}</time>
            </div>

            {/* Items for this date */}
            <div className={`ml-1.5 border-l-2 ${gi < updates.length - 1 ? "border-gray-200" : "border-transparent"} pl-7 pb-8`}>
              <div className="space-y-6">
                {group.items.map((item, ii) => (
                  <div key={ii}>
                    <h2 className="font-serif text-lg font-bold text-gray-900 mb-1">{item.title}</h2>
                    <p className="text-gray-600 leading-relaxed text-sm">{item.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          OpenFeds updates after each new OPM FedScope data release. See{" "}
          <Link href="/about" className="text-indigo-600 hover:underline">About</Link> for data sources and methodology.
        </p>
      </div>
    </div>
  );
}
