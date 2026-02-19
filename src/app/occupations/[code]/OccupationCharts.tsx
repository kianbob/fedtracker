"use client";
import { SimpleBarChart, SimplePieChart } from "@/components/Charts";
import { toTitleCase, fixAgencyName } from "@/lib/format";

function shortenEd(s: string): string {
  return s
    .replace("High School Graduate or Certificate of Equivalency", "High School/GED")
    .replace("No Formal Education or Some Elementary School - Did Not Complete", "Less Than High School")
    .replace("Terminal Occupational Program - Certificate of Completion, Diploma or Equivalent", "Vocational Certificate")
    .replace("Some College - Less Than One Year", "Some College (<1yr)")
    .replace("One Year College", "1 Year College")
    .replace("Two Years College", "2 Years College")
    .replace("Four Years College", "4 Years College")
    .replace("First Professional", "Professional Degree")
    .replace(/(.{25}).+/, "$1…");
}

export function OccupationCharts({ data }: { data: any }) {
  return (
    <div className="space-y-12">
      {data.topAgencies?.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Top Agencies</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <SimpleBarChart
              data={data.topAgencies.slice(0, 10).map((a: any) => ({ name: fixAgencyName(a.name || a.code), count: a.count }))}
              dataKey="count" nameKey="name" color="#3730a3"
            />
          </div>
        </div>
      )}
      {data.ageDistribution?.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Age Distribution</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <SimpleBarChart
              data={data.ageDistribution.map((a: any) => ({ name: toTitleCase(a.label), count: a.count }))}
              dataKey="count" nameKey="name" color="#6366f1"
            />
          </div>
        </div>
      )}
      {data.educationDistribution?.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Education Breakdown</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <SimplePieChart
              data={data.educationDistribution.slice(0, 8).map((e: any) => ({ name: shortenEd(toTitleCase(e.label)), count: e.count }))}
              dataKey="count" nameKey="name"
            />
          </div>
        </div>
      )}
    </div>
  );
}
