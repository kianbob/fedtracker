import Link from "next/link";

export const metadata = {
  title: "About OpenFeds — Data Sources & Methodology — OpenFeds",
  description: "About OpenFeds, data sources, and methodology.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-8">About OpenFeds</h1>

      <div className="prose prose-gray max-w-none">
        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">What is this?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            OpenFeds is a data journalism project that makes federal workforce data accessible and explorable.
            We process raw data from the Office of Personnel Management (OPM) FedScope dataset to reveal
            patterns in federal employment, salaries, hiring, and separations.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">Data Sources</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            OpenFeds uses two distinct types of OPM FedScope data: <strong>employment snapshots</strong> and <strong>flow data</strong>.
            Employment snapshots capture the state of the federal workforce at a single point in time — who works where,
            in what occupation, at what salary. Flow data (separations and accessions) tracks employees entering and
            leaving federal service over time, enabling trend analysis.
          </p>
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Employment Snapshot (December 2025)</h3>
              <p className="text-sm text-gray-600">
                Point-in-time federal workforce snapshot with ~2.07M employee records. Each record represents
                one or more employees sharing identical characteristics. Includes agency, sub-agency, occupation series,
                duty location (state), salary, pay plan and grade, education level, age bracket, supervisory status,
                and work schedule. This powers agency profiles, occupation pages, state pages, and salary analysis.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Separations (FY2020–2025)</h3>
              <p className="text-sm text-gray-600">
                ~953K records of employees leaving federal service. Each record includes the separation type
                (coded SA through SL — covering transfers, quits, retirements, RIFs, terminations, and more),
                effective date, agency, occupation, and salary at separation. This flow data enables tracking of
                monthly separation trends by type, agency, and occupation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Accessions (FY2020–2025)</h3>
              <p className="text-sm text-gray-600">
                ~1.17M records of new hires entering federal service. Includes accession type (new hire,
                transfer in, reinstatement), effective date, agency, and starting salary. Combined with
                separations data, this powers net workforce change analysis.
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
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">Update Schedule</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            OPM publishes FedScope data on a monthly basis. OpenFeds currently reflects:
          </p>
          <div className="bg-gray-50 rounded-xl p-6">
            <ul className="list-none space-y-2 text-sm text-gray-700">
              <li><strong>Employment snapshot:</strong> December 2025</li>
              <li><strong>Separations data:</strong> October 2019 through November 2025</li>
              <li><strong>Accessions data:</strong> October 2019 through November 2025</li>
            </ul>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            We update OpenFeds after each new OPM data release. There is typically a 1–2 month lag between
            the end of a reporting period and when OPM publishes the corresponding data.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">Methodology</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Employee Counts</h3>
              <p className="text-sm">
                Employee counts are summed from individual FedScope records. Each record may represent one or
                more employees sharing identical characteristics (agency, occupation, location, salary, etc.).
                The &quot;count&quot; field in each record is summed to produce totals by agency, occupation, state, and other dimensions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Average Salaries</h3>
              <p className="text-sm">
                Average salaries are weighted averages based on employee counts per record. Records with redacted,
                null, or zero salary values are excluded from salary calculations but still included in headcounts.
                Salary figures represent adjusted basic pay as reported by OPM.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Separation Types</h3>
              <p className="text-sm">
                Separation types follow OPM&apos;s standard coding: SA (Transfer Out), SB (Transfer Out — Mass),
                SC (Quit), SD (Retirement), SE (Early Retirement), SF (Disability Retirement),
                SG (Termination), SH (RIF — Reduction in Force), SI (Resignation in Lieu of Termination),
                SK (Death), and SL (Other).
                Monthly separation counts are aggregated by type to produce trend charts and breakdowns.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Net Workforce Change</h3>
              <p className="text-sm">
                Net workforce change is computed as accessions minus separations for a given month or period.
                A negative value indicates the workforce shrank (more departures than hires).
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">Limitations</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>
              <strong>Civilian only.</strong> FedScope covers civilian federal employees only. Active-duty military
              personnel, federal contractors, and U.S. Postal Service employees are not included (USPS publishes
              its own workforce data separately).
            </li>
            <li>
              <strong>Military agency salary redaction.</strong> Salary data for Department of Defense military
              agencies (DD, AR, AF, NV) is redacted by OPM. These agencies show &quot;N/A&quot; for salary
              figures rather than misleading $0 values. Employee counts for these agencies are still accurate.
            </li>
            <li>
              <strong>Privacy redactions.</strong> Some records have values marked as &quot;REDACTED&quot; or
              &quot;*&quot; to protect individual privacy, typically when a combination of attributes would identify
              a specific person. These records are excluded from salary and demographic calculations but included
              in headcounts.
            </li>
            <li>
              <strong>Snapshot vs. flow data.</strong> The employment snapshot is a point-in-time view (December 2025),
              while separations and accessions data spans FY2020–2025. An agency&apos;s current employee count may
              not match the net of historical accessions and separations due to agency reorganizations, reclassifications,
              and data corrections.
            </li>
            <li>
              <strong>OPM reporting lag.</strong> There is a 1–2 month lag between events and their appearance in
              FedScope data. Recent months may undercount separations or accessions that have not yet been processed.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">Embeddable Charts</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            OpenFeds offers embeddable charts that you can include on your own website via iframe.
            Each embed is a self-contained HTML page with no external dependencies.
          </p>
          <div className="bg-gray-50 rounded-xl p-6 space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">DOGE Timeline — Monthly Separations</h3>
              <code className="text-xs text-indigo-600 break-all">&lt;iframe src=&quot;/api/embed/doge-timeline&quot; width=&quot;100%&quot; height=&quot;400&quot; frameborder=&quot;0&quot;&gt;&lt;/iframe&gt;</code>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Agency Risk Scores — Top 20</h3>
              <code className="text-xs text-indigo-600 break-all">&lt;iframe src=&quot;/api/embed/risk-scores&quot; width=&quot;100%&quot; height=&quot;600&quot; frameborder=&quot;0&quot;&gt;&lt;/iframe&gt;</code>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">State Impact — Top 15 by Job Losses</h3>
              <code className="text-xs text-indigo-600 break-all">&lt;iframe src=&quot;/api/embed/state-impact&quot; width=&quot;100%&quot; height=&quot;500&quot; frameborder=&quot;0&quot;&gt;&lt;/iframe&gt;</code>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">Open Source</h2>
          <p className="text-gray-700 leading-relaxed">
            This project is open source. The code and data processing scripts are available on{" "}
            <a href="https://github.com/kianbob/openfeds" target="_blank" rel="noopener" className="text-accent hover:underline">
              GitHub
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
