"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Breadcrumb from "@/components/Breadcrumb";
import { formatSalary } from "@/lib/format";

interface DistBracket {
  bracket: string;
  employees: number;
}

interface StateData {
  code: string;
  name: string;
  employees: number;
  avgSalary: number;
}

interface OccupationData {
  code: string;
  name: string;
  family: string;
  employees: number;
  avgSalary: number;
}

interface SalaryStats {
  distribution: DistBracket[];
}

// Bracket order and upper bounds for percentile calculation
const BRACKET_ORDER: { bracket: string; upper: number }[] = [
  { bracket: "Under $30K", upper: 30000 },
  { bracket: "$30K-$50K", upper: 50000 },
  { bracket: "$50K-$75K", upper: 75000 },
  { bracket: "$75K-$100K", upper: 100000 },
  { bracket: "$100K-$125K", upper: 125000 },
  { bracket: "$125K-$150K", upper: 150000 },
  { bracket: "$150K-$200K", upper: 200000 },
  { bracket: "$200K+", upper: Infinity },
];

function calcPercentile(salary: number, distribution: DistBracket[]): number {
  const bracketMap = new Map(distribution.map((d) => [d.bracket, d.employees]));
  const total = distribution.reduce((s, d) => s + d.employees, 0);
  if (total === 0) return 0;

  let below = 0;
  for (const b of BRACKET_ORDER) {
    const count = bracketMap.get(b.bracket) || 0;
    if (salary >= b.upper) {
      below += count;
    } else {
      // Interpolate within this bracket
      const lowerBound = BRACKET_ORDER[BRACKET_ORDER.indexOf(b) - 1]?.upper ?? 0;
      const range = b.upper === Infinity ? 100000 : b.upper - lowerBound;
      const position = Math.min((salary - lowerBound) / range, 1);
      below += count * position;
      break;
    }
  }

  return Math.min(Math.round((below / total) * 100), 99);
}

function formatInputSalary(value: string): string {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
}

function SalaryGauge({ percentile }: { percentile: number }) {
  const gaugeRef = useRef<SVGSVGElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, [percentile]);

  // Semicircular gauge from 180deg to 0deg (left to right)
  const angle = 180 - (percentile / 100) * 180;
  const rad = (angle * Math.PI) / 180;
  const cx = 150, cy = 140, r = 110;
  const needleX = cx + r * 0.85 * Math.cos(rad);
  const needleY = cy - r * 0.85 * Math.sin(rad);

  return (
    <div className="flex flex-col items-center">
      <svg ref={gaugeRef} viewBox="0 0 300 170" className="w-full max-w-xs">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="65%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        {/* Background arc */}
        <path
          d="M 30 140 A 120 120 0 0 1 270 140"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="22"
          strokeLinecap="round"
        />
        {/* Colored arc */}
        <path
          d="M 30 140 A 120 120 0 0 1 270 140"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="22"
          strokeLinecap="round"
        />
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={animated ? needleX : cx - r * 0.85}
          y2={animated ? needleY : cy}
          stroke="#1f2937"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        />
        <circle cx={cx} cy={cy} r="6" fill="#1f2937" />
        {/* Labels */}
        <text x="20" y="165" fontSize="11" fill="#9ca3af">0%</text>
        <text x="140" y="25" fontSize="11" fill="#9ca3af" textAnchor="middle">50%</text>
        <text x="265" y="165" fontSize="11" fill="#9ca3af">100%</text>
      </svg>
      <p className="text-5xl font-serif font-bold text-gray-900 -mt-4">
        {percentile}%
      </p>
      <p className="text-sm text-gray-500 mt-1">percentile</p>
    </div>
  );
}

function ComparisonChart({
  userSalary,
  stateAvg,
  familyAvg,
  overallAvg,
  stateName,
  familyName,
}: {
  userSalary: number;
  stateAvg: number;
  familyAvg: number;
  overallAvg: number;
  stateName: string;
  familyName: string;
}) {
  const data = [
    { name: "Your Salary", value: userSalary },
    { name: stateName, value: stateAvg },
    { name: familyName, value: familyAvg },
    { name: "Federal Avg", value: overallAvg },
  ];
  const colors = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc"];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}`}
        />
        <Tooltip formatter={(v: any) => formatSalary(Number(v))} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function ShareButtons({ percentile }: { percentile: number }) {
  const text = `I compared my salary to federal workers — I earn more than ${percentile}% of them. Check yours at openfeds.org/salary-compare`;
  const url = "https://www.openfeds.org/salary-compare";

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex gap-3 mt-6">
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077b5] text-white text-sm font-medium rounded-lg hover:bg-[#006399] transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        Share on LinkedIn
      </a>
    </div>
  );
}

export default function SalaryCompare() {
  const [salaryInput, setSalaryInput] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [states, setStates] = useState<StateData[]>([]);
  const [occupations, setOccupations] = useState<OccupationData[]>([]);
  const [salaryStats, setSalaryStats] = useState<SalaryStats | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Fetch data
  useEffect(() => {
    Promise.all([
      fetch("/data/states.json").then((r) => r.json()),
      fetch("/data/occupations.json").then((r) => r.json()),
      fetch("/data/salary-stats.json").then((r) => r.json()),
    ]).then(([statesData, occsData, statsData]) => {
      setStates(
        (statesData as StateData[])
          .filter((s) => s.code !== "*" && s.code !== "NDR")
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      setOccupations(occsData as OccupationData[]);
      setSalaryStats(statsData as SalaryStats);
    });
  }, []);

  // Group occupations by family
  const families = useMemo(() => {
    const map = new Map<string, { name: string; totalSalary: number; totalEmployees: number }>();
    for (const occ of occupations) {
      if (occ.family === "Invalid" || !occ.family) continue;
      const existing = map.get(occ.family);
      if (existing) {
        existing.totalSalary += occ.avgSalary * occ.employees;
        existing.totalEmployees += occ.employees;
      } else {
        map.set(occ.family, {
          name: occ.family,
          totalSalary: occ.avgSalary * occ.employees,
          totalEmployees: occ.employees,
        });
      }
    }
    return Array.from(map.values())
      .map((f) => ({ ...f, avgSalary: Math.round(f.totalSalary / f.totalEmployees) }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [occupations]);

  const salary = parseInt(salaryInput.replace(/,/g, "")) || 0;
  const stateData = states.find((s) => s.code === selectedState);
  const familyData = families.find((f) => f.name === selectedFamily);
  const overallAvg = salaryStats
    ? Math.round(
        salaryStats.distribution.reduce((s, d) => {
          const b = BRACKET_ORDER.find((bo) => bo.bracket === d.bracket);
          if (!b) return s;
          const mid = b.upper === Infinity ? 250000 : b.upper === 30000 ? 20000 : (b.upper + (BRACKET_ORDER[BRACKET_ORDER.indexOf(b) - 1]?.upper ?? 0)) / 2;
          return s + mid * d.employees;
        }, 0) / salaryStats.distribution.reduce((s, d) => s + d.employees, 0)
      )
    : 115000;

  const allFilled = salary > 0 && !!selectedState && !!selectedFamily && !!salaryStats;

  // Show results when all inputs are filled
  useEffect(() => {
    if (allFilled) {
      setShowResults(false);
      const t = setTimeout(() => setShowResults(true), 100);
      return () => clearTimeout(t);
    } else {
      setShowResults(false);
    }
  }, [allFilled, salary, selectedState, selectedFamily]);

  const percentile = allFilled ? calcPercentile(salary, salaryStats!.distribution) : 0;
  const earnMore = percentile >= 50;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: "Workforce", href: "/workforce" },
          { label: "Salaries", href: "/salaries" },
          { label: "Salary Compare" },
        ]}
      />

      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">
        How Does Your Salary Compare?
      </h1>
      <p className="text-gray-600 mb-10 max-w-2xl">
        Enter your salary, state, and job category to see how you stack up against
        over 1 million federal employees.
      </p>

      {/* Input Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Annual Salary
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                $
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={salaryInput}
                onChange={(e) => setSalaryInput(formatInputSalary(e.target.value))}
                placeholder="85,000"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-lg"
              />
            </div>
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-lg bg-white"
            >
              <option value="">Select a state...</option>
              {states.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Job Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Category
            </label>
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-lg bg-white"
            >
              <option value="">Select a category...</option>
              {families.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {allFilled && showResults && stateData && familyData && (
        <div
          className="space-y-8"
          style={{
            animation: "fadeSlideIn 0.6s ease-out forwards",
          }}
        >
          {/* Main result */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <SalaryGauge percentile={percentile} />
            <h2 className="font-serif text-2xl font-bold text-gray-900 mt-6">
              You earn {earnMore ? "more" : "less"} than{" "}
              <span className="text-indigo-600">
                {earnMore ? percentile : 100 - percentile}%
              </span>{" "}
              of federal employees
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
              Your salary of {formatSalary(salary)} places you at the{" "}
              {percentile}th percentile among federal workers.
            </p>
            <ShareButtons percentile={percentile} />
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Federal Workers in {stateData.name}
              </p>
              <p className="mt-2 text-3xl font-serif font-bold text-gray-900">
                {formatSalary(stateData.avgSalary)}
              </p>
              <p className="mt-1 text-sm text-gray-500">average salary</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {familyData.name.length > 35
                  ? familyData.name.substring(0, 35) + "..."
                  : familyData.name}
              </p>
              <p className="mt-2 text-3xl font-serif font-bold text-gray-900">
                {formatSalary(familyData.avgSalary)}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                avg for this job category
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Salary Difference
              </p>
              <p
                className={`mt-2 text-3xl font-serif font-bold ${
                  salary >= overallAvg ? "text-green-600" : "text-red-600"
                }`}
              >
                {salary >= overallAvg ? "+" : ""}
                {formatSalary(salary - overallAvg)}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                vs federal average ({formatSalary(overallAvg)})
              </p>
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-4">
              Salary Comparison
            </h3>
            <ComparisonChart
              userSalary={salary}
              stateAvg={stateData.avgSalary}
              familyAvg={familyData.avgSalary}
              overallAvg={overallAvg}
              stateName={stateData.name + " Avg"}
              familyName={
                familyData.name.length > 20
                  ? familyData.name.substring(0, 20) + "..."
                  : familyData.name
              }
            />
          </div>
        </div>
      )}

      {/* Animation keyframes injected via style tag — JS-driven, not CSS-only opacity */}
      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
