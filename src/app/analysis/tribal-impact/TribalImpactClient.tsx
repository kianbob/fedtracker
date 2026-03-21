"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";
import { formatNumber } from "@/lib/format";

const COLORS = ["#dc2626", "#ea580c", "#ca8a04", "#059669", "#0891b2", "#3730a3"];

export default function TribalImpactClient() {
  // Program cuts by category
  const programCuts = [
    { category: "Healthcare", amount: 420, programs: 89, color: "#dc2626" },
    { category: "Housing/Infrastructure", amount: 405, programs: 95, color: "#ea580c" },
    { category: "Economic Development", amount: 340, programs: 78, color: "#ca8a04" },
    { category: "Education", amount: 295, programs: 112, color: "#059669" },
    { category: "Cultural/Language", amount: 185, programs: 67, color: "#0891b2" },
    { category: "Legal/Governance", amount: 125, programs: 37, color: "#3730a3" }
  ];

  // Most affected tribes
  const tribalNationsImpact = [
    { tribe: "Navajo Nation", lost: 285, population: 399494, perCapita: 713 },
    { tribe: "Cherokee Nation", lost: 198, population: 392623, perCapita: 504 },
    { tribe: "Choctaw Nation", lost: 142, population: 223279, perCapita: 636 },
    { tribe: "Sioux Tribes", lost: 165, population: 156906, perCapita: 1052 },
    { tribe: "Pueblo Communities", lost: 128, population: 89432, perCapita: 1431 },
    { tribe: "Menominee Nation", lost: 45, population: 8700, perCapita: 5172 }
  ];

  // Healthcare impact timeline
  const healthcareImpact = [
    { month: "Pre-DOGE", clinics: 156, programs: 89, funding: 420 },
    { month: "Mar 2025", clinics: 148, programs: 76, funding: 385 },
    { month: "Jun 2025", clinics: 141, programs: 65, funding: 295 },
    { month: "Sep 2025", clinics: 133, programs: 52, funding: 180 },
    { month: "Dec 2025", clinics: 133, programs: 48, funding: 165 }
  ];

  // Per capita impact by region
  const regionalImpact = [
    { region: "Great Plains", avgLoss: 1285, tribes: 28, description: "Sioux, Blackfeet, others" },
    { region: "Southwest", avgLoss: 758, tribes: 45, description: "Navajo, Apache, Pueblo" },
    { region: "Southeast", avgLoss: 542, tribes: 12, description: "Cherokee, Choctaw, Creek" },
    { region: "California", avgLoss: 398, tribes: 67, description: "Diverse smaller tribes" },
    { region: "Alaska Native", avgLoss: 892, tribes: 89, description: "Villages and corporations" },
    { region: "Great Lakes", avgLoss: 1456, tribes: 23, description: "Ojibwe, Menominee" }
  ];

  return (
    <div className="space-y-8 mb-8">
      {/* Program Cuts Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Grant Cuts by Program Category</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={programCuts}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }: any) => `${category} (${(percent * 100).toFixed(1)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
              >
                {programCuts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}M`, "Funding Cut"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Per Capita Impact by Tribal Nation</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tribalNationsImpact} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
              <YAxis dataKey="tribe" type="category" tick={{ fontSize: 10 }} width={80} />
              <Tooltip formatter={(value) => [`$${value} per capita`, "Loss"]} />
              <Bar dataKey="perCapita" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Healthcare Impact Timeline */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Healthcare Services Decline Over Time</h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={healthcareImpact} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="clinics" 
              stackId="1" 
              stroke="#dc2626" 
              fill="#fca5a5" 
              name="Health Clinics"
            />
            <Area 
              type="monotone" 
              dataKey="programs" 
              stackId="2" 
              stroke="#ea580c" 
              fill="#fed7aa" 
              name="Health Programs"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Regional Impact Breakdown */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Average Per Capita Loss by Region</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regionalImpact.map((region, index) => (
            <div key={region.region} className="border border-gray-200 rounded-lg p-4">
              <div className="text-center mb-2">
                <div className="text-lg font-bold text-red-600">${formatNumber(region.avgLoss)}</div>
                <div className="text-sm font-medium text-gray-900">{region.region}</div>
              </div>
              <div className="text-xs text-gray-600 text-center">
                {region.tribes} tribal nations<br/>
                {region.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-900">478</div>
          <div className="text-red-700 text-sm">Grants Cut</div>
          <div className="text-red-600 text-xs mt-1">Across all tribal nations</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-900">23</div>
          <div className="text-orange-700 text-sm">Clinics Closed</div>
          <div className="text-orange-600 text-xs mt-1">Rural health facilities</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-900">$713</div>
          <div className="text-yellow-700 text-sm">Navajo Per Capita</div>
          <div className="text-yellow-600 text-xs mt-1">Loss per tribal member</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-900">23</div>
          <div className="text-blue-700 text-sm">Legal Challenges</div>
          <div className="text-blue-600 text-xs mt-1">Federal lawsuits filed</div>
        </div>
      </div>

      {/* Treaty Obligations Context */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Treaty Obligations at Stake</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">📜 Legal Foundation</h5>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• 367 ratified treaties (1778-1871)</li>
              <li>• Federal trust responsibility doctrine</li>
              <li>• Snyder Act healthcare obligations (1921)</li>
              <li>• Self-Determination Act (1975)</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">⚖️ Current Legal Challenges</h5>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• Navajo Nation: $45M healthcare cuts</li>
              <li>• Sioux Tribes: Education treaty violations</li>
              <li>• Cherokee: Language preservation rights</li>
              <li>• Multi-tribal: Trust responsibility breach</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}