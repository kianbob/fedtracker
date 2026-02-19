import Link from "next/link";
import { formatNumber, formatSalary } from "@/lib/format";
import states from "../../../public/data/states.json";

export const metadata = {
  title: "Federal Employees by State — Geographic Distribution — FedTracker",
  description: "See where federal employees work across all 50 states and territories. Employee counts and average salaries by location from OPM FedScope.",
};

export default function StatesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Federal Employees by State</h1>
      <p className="text-gray-600 mb-8">Where {formatNumber(states.reduce((s, st) => s + st.employees, 0))} federal employees work.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {states.map((s) => (
          <Link
            key={s.code}
            href={`/states/${s.code}`}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-accent-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-accent">{s.name || s.code}</h3>
              <span className="text-xs text-gray-400 font-mono">{s.code}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{formatNumber(s.employees)} employees</span>
              <span>Avg {formatSalary(s.avgSalary)}</span>
            </div>
            {/* Bar visualization */}
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full accent-gradient rounded-full"
                style={{ width: `${Math.min(100, (s.employees / states[0].employees) * 100)}%` }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
