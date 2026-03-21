"use client";

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { formatNumber } from "@/lib/format";

export default function GreatResignationClient() {
  // Monthly separation data showing the September spike
  const monthlyData = [
    { month: "Jan 2025", separations: 48200, normal: 45000, type: "typical" },
    { month: "Feb 2025", separations: 52100, normal: 46000, type: "typical" },
    { month: "Mar 2025", separations: 58900, normal: 47000, type: "elevated" },
    { month: "Apr 2025", separations: 61200, normal: 44000, type: "elevated" },
    { month: "May 2025", separations: 67800, normal: 43000, type: "elevated" },
    { month: "Jun 2025", separations: 71500, normal: 48000, type: "elevated" },
    { month: "Jul 2025", separations: 78900, normal: 46000, type: "elevated" },
    { month: "Aug 2025", separations: 84600, normal: 47000, type: "high" },
    { month: "Sep 2025", separations: 125589, normal: 45000, type: "crisis" },
    { month: "Oct 2025", separations: 89200, normal: 44000, type: "aftershock" },
    { month: "Nov 2025", separations: 76300, normal: 43000, type: "elevated" },
    { month: "Dec 2025", separations: 92100, normal: 55000, type: "elevated" }
  ];

  // September daily breakdown showing the concentration
  const septemberDaily = [
    { day: "Sep 1-7", quits: 8200, retirements: 6800, rifs: 120, terminations: 180 },
    { day: "Sep 8-14", quits: 18900, retirements: 12400, rifs: 890, terminations: 1200 },
    { day: "Sep 15-21", quits: 31200, retirements: 18200, rifs: 1250, terminations: 1890 },
    { day: "Sep 22-28", quits: 9850, retirements: 8950, rifs: 180, terminations: 520 },
    { day: "Sep 29-30", quits: 2502, retirements: 2188, rifs: 51, terminations: 118 }
  ];

  // Agency impact comparison
  const agencyImpact = [
    { agency: "FTC", rate: 60.8, departures: 680 },
    { agency: "VA", rate: 52.5, departures: 23677 },
    { agency: "Treasury", rate: 49.4, departures: 42380 },
    { agency: "EPA", rate: 47.2, departures: 6890 },
    { agency: "CFPB", rate: 43.1, departures: 650 },
    { agency: "Education", rate: 38.7, departures: 1625 },
    { agency: "HUD", rate: 31.2, departures: 1965 }
  ];

  return (
    <div className="space-y-8 mb-8">
      {/* Monthly Trend */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Federal Employee Separations by Month (2025)</h4>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${Math.round(value / 1000)}K`} />
            <Tooltip formatter={(value: any) => [formatNumber(value), "Separations"]} />
            <Area 
              type="monotone" 
              dataKey="normal" 
              stroke="#94a3b8" 
              fill="#e2e8f0" 
              fillOpacity={0.6}
              name="Historical Average"
            />
            <Area 
              type="monotone" 
              dataKey="separations" 
              stroke="#dc2626" 
              fill="#fecaca" 
              fillOpacity={0.8}
              name="Actual Separations"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* September Daily Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">September 2025 Weekly Breakdown</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={septemberDaily} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="quits" stackId="a" fill="#dc2626" name="Voluntary Quits" />
              <Bar dataKey="retirements" stackId="a" fill="#ea580c" name="Retirements" />
              <Bar dataKey="rifs" stackId="a" fill="#ca8a04" name="RIFs" />
              <Bar dataKey="terminations" stackId="a" fill="#65a30d" name="Terminations" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Agencies by Separation Rate (%)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agencyImpact} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="agency" type="category" tick={{ fontSize: 11 }} width={60} />
              <Tooltip formatter={(value: any) => [`${value}%`, "Separation Rate"]} />
              <Bar dataKey="rate" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-900">3x</div>
          <div className="text-red-700 text-sm">vs Normal September</div>
          <div className="text-red-600 text-xs mt-1">125K vs 45K typical</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-900">56.3%</div>
          <div className="text-orange-700 text-sm">Voluntary Quits</div>
          <div className="text-orange-600 text-xs mt-1">70,652 resignations</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-900">38.6%</div>
          <div className="text-purple-700 text-sm">Retirements</div>
          <div className="text-purple-600 text-xs mt-1">48,538 retirees</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-900">5.8%</div>
          <div className="text-blue-700 text-sm">Of Total Workforce</div>
          <div className="text-blue-600 text-xs mt-1">In one month</div>
        </div>
      </div>

      {/* Timeline Callouts */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">September Crisis Points</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="bg-red-100 text-red-900 px-3 py-1 rounded-full text-sm font-bold mb-2">
              Sept 1
            </div>
            <div className="font-medium text-gray-900">RTO Mandate</div>
            <div className="text-gray-600 text-sm">Return to office required</div>
          </div>
          <div className="text-center">
            <div className="bg-red-100 text-red-900 px-3 py-1 rounded-full text-sm font-bold mb-2">
              Sept 15
            </div>
            <div className="font-medium text-gray-900">Black Monday</div>
            <div className="text-gray-600 text-sm">7,890 resignations in one day</div>
          </div>
          <div className="text-center">
            <div className="bg-red-100 text-red-900 px-3 py-1 rounded-full text-sm font-bold mb-2">
              Sept 30
            </div>
            <div className="font-medium text-gray-900">Fiscal Year End</div>
            <div className="text-gray-600 text-sm">65% of departures effective</div>
          </div>
        </div>
      </div>
    </div>
  );
}