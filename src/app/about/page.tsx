import Link from "next/link";

export const metadata = {
  title: "About — FedTracker",
  description: "About FedTracker, data sources, and methodology.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-8">About FedTracker</h1>

      <div className="prose prose-gray max-w-none">
        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">What is this?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            FedTracker is a data journalism project that makes federal workforce data accessible and explorable.
            We process raw data from the Office of Personnel Management (OPM) FedScope dataset to reveal
            patterns in federal employment, salaries, hiring, and separations.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">Data Sources</h2>
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Employment Data (March 2025)</h3>
              <p className="text-sm text-gray-600">
                Current federal workforce snapshot with ~811K employee records. Includes agency, occupation,
                location, salary, education level, and work schedule.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Separations Data (FY2020-2024)</h3>
              <p className="text-sm text-gray-600">
                ~953K records of employees leaving federal service. Includes separation type (quit, retirement,
                RIF, termination, etc.), effective date, and salary at separation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Accessions Data (FY2020-2024)</h3>
              <p className="text-sm text-gray-600">
                ~1.17M records of new hires entering federal service. Includes accession type (new hire,
                transfer), effective date, and starting salary.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            All data from{" "}
            <a href="https://www.opm.gov/data/datasets/" target="_blank" rel="noopener" className="text-accent hover:underline">
              OPM FedScope
            </a>
            . FedScope is a public data source maintained by the U.S. Office of Personnel Management.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">Methodology</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Employee counts are summed from individual records (each representing one or more employees with identical characteristics).</li>
            <li>Average salaries are weighted averages based on employee counts per record.</li>
            <li>Records with redacted or null salary values are excluded from salary calculations but included in headcounts.</li>
            <li>Separation types follow OPM definitions: RIF (Reduction in Force) is code SH, Termination is SJ, Quit is SC.</li>
            <li>Net workforce change = accessions minus separations for a given period.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">Limitations</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>This covers civilian federal employees only — not military, contractors, or postal workers (USPS has its own data).</li>
            <li>Some records have redacted values (marked as &quot;REDACTED&quot; or &quot;*&quot;) for privacy. These are excluded from salary calculations.</li>
            <li>The employment snapshot is a point-in-time view (March 2025), while separations and accessions span FY2020-2024.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">Open Source</h2>
          <p className="text-gray-700 leading-relaxed">
            This project is open source. The code and data processing scripts are available on{" "}
            <a href="https://github.com/kianbob/fedtracker" target="_blank" rel="noopener" className="text-accent hover:underline">
              GitHub
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
