import Link from "next/link";
import { formatNumber, formatSalary } from "@/lib/format";
import states from "../../../public/data/states.json";
import { StatesClient } from "./StatesClient";

export const metadata = {
  title: "Federal Employees by State — Geographic Distribution — FedTracker",
  description: "See where federal employees work across all 50 states and territories. Employee counts and average salaries by location from OPM FedScope.",
};

export default function StatesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Federal Employees by State</h1>
      <p className="text-gray-600 mb-8">Where {formatNumber(states.reduce((s, st) => s + st.employees, 0))} federal employees work.</p>

      <StatesClient states={states.filter((s) => s.code !== '*' && s.code !== 'NDR')} />

      {/* Related Analysis */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Related Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/impact", title: "DOGE Impact by State", desc: "How DOGE-driven workforce reductions impact each state — DC, Maryland, and Virginia hit hardest." },
            { href: "/doge", title: "DOGE Impact Dashboard", desc: "Full breakdown of 2025 federal workforce restructuring by agency and month." },
            { href: "/risk", title: "Agency Risk Dashboard", desc: "Which agencies face the highest restructuring risk based on workforce trends." },
            { href: "/demographics", title: "Workforce Demographics", desc: "Age, education, veteran status, and geographic distribution of federal employees." },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group">
              <h3 className="font-serif font-bold text-gray-900 group-hover:text-indigo-700 transition-colors mb-1">{link.title}</h3>
              <p className="text-sm text-gray-500">{link.desc}</p>
              <span className="text-indigo-600 text-sm font-medium mt-2 inline-block">Explore →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
