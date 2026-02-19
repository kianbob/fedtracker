import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "Data Downloads — FedTracker",
  description: "Download federal workforce data as JSON or CSV. Agency lists, DOGE impact, risk scores, demographics, and more.",
};

interface Dataset {
  file: string;
  name: string;
  description: string;
  size: string;
  csvFile?: string;
  csvSize?: string;
}

interface Category {
  title: string;
  datasets: Dataset[];
}

function getFileSize(filename: string): string {
  try {
    const p = path.join(process.cwd(), "public", "data", filename);
    const stats = fs.statSync(p);
    const kb = stats.size / 1024;
    if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
    return `${Math.round(kb)} KB`;
  } catch {
    return "—";
  }
}

function getCategories(): Category[] {
  return [
    {
      title: "Core Data",
      datasets: [
        { file: "agency-list.json", name: "Agency List", description: "All 128 federal agencies with employee counts and salaries", size: getFileSize("agency-list.json"), csvFile: "csv/agencies.csv", csvSize: getFileSize("csv/agencies.csv") },
        { file: "occupations.json", name: "Occupations", description: "Federal occupation codes and statistics", size: getFileSize("occupations.json"), csvFile: "csv/occupations.csv", csvSize: getFileSize("csv/occupations.csv") },
        { file: "states.json", name: "States", description: "Federal employees by state", size: getFileSize("states.json") },
        { file: "separations.json", name: "Separations", description: "Monthly separation counts by type (FY2020–2025)", size: getFileSize("separations.json"), csvFile: "csv/separations.csv", csvSize: getFileSize("csv/separations.csv") },
        { file: "salary-stats.json", name: "Salary Statistics", description: "Salary distribution data", size: getFileSize("salary-stats.json") },
        { file: "trends.json", name: "Workforce Trends", description: "Monthly workforce trends FY2020–2025", size: getFileSize("trends.json") },
      ],
    },
    {
      title: "DOGE Impact",
      datasets: [
        { file: "doge-impact.json", name: "DOGE Impact Summary", description: "DOGE workforce reduction summary", size: getFileSize("doge-impact.json") },
        { file: "doge-timeline.json", name: "DOGE Timeline", description: "Month-by-month 2025 timeline", size: getFileSize("doge-timeline.json") },
        { file: "occupation-impact.json", name: "Occupation Impact", description: "Occupation-level DOGE impact", size: getFileSize("occupation-impact.json") },
        { file: "appointment-impact.json", name: "Appointment Impact", description: "Impact by appointment type", size: getFileSize("appointment-impact.json") },
        { file: "state-impact.json", name: "State Impact", description: "State-by-state job losses", size: getFileSize("state-impact.json"), csvFile: "csv/state-impact.csv", csvSize: getFileSize("csv/state-impact.csv") },
        { file: "hardest-hit.json", name: "Hardest Hit", description: "Most reduced agencies", size: getFileSize("hardest-hit.json") },
      ],
    },
    {
      title: "Analysis",
      datasets: [
        { file: "agency-risk.json", name: "Agency Risk Scores", description: "Composite risk scores for 128 agencies", size: getFileSize("agency-risk.json") },
        { file: "education-salary.json", name: "Education & Salary", description: "Pay by education level", size: getFileSize("education-salary.json") },
        { file: "demographics.json", name: "Demographics", description: "Workforce demographics", size: getFileSize("demographics.json") },
        { file: "retirement-risk.json", name: "Retirement Risk", description: "Retirement eligibility by agency", size: getFileSize("retirement-risk.json") },
      ],
    },
  ];
}

export default function DownloadsPage() {
  const categories = getCategories();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-3">Data Downloads</h1>
        <p className="text-lg text-gray-600">
          Download the raw data behind FedTracker in JSON or CSV format.
        </p>
      </div>

      {categories.map((cat) => (
        <div key={cat.title} className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">{cat.title}</h2>
          <div className="grid gap-3">
            {cat.datasets.map((ds) => (
              <div
                key={ds.file}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-accent-200 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{ds.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{ds.description}</p>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <a
                    href={`/data/${ds.file}`}
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-light transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    JSON
                    <span className="text-xs opacity-75">{ds.size}</span>
                  </a>
                  {ds.csvFile && (
                    <a
                      href={`/data/${ds.csvFile}`}
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-accent text-accent text-sm font-medium rounded-lg hover:bg-accent-50 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      CSV
                      <span className="text-xs opacity-75">{ds.csvSize}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-xl text-center">
        <p className="text-sm text-gray-600">
          All data derived from{" "}
          <a href="https://data.opm.gov/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-light underline">
            OPM FedScope
          </a>
          . Free to use with attribution.
        </p>
      </div>
    </div>
  );
}
