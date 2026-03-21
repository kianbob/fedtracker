"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Treemap } from "recharts";
import { formatNumber } from "@/lib/format";

const COLORS = ["#dc2626", "#ea580c", "#ca8a04", "#65a30d", "#059669", "#0891b2", "#0284c7", "#3730a3"];

export default function ContractVendorNetworkClient() {
  // Vendor size distribution
  const vendorSizes = [
    { name: "Mega Vendors", count: 10, value: 26.4, avgLoss: 2640 },
    { name: "Large Vendors", count: 85, value: 21.3, avgLoss: 250 },
    { name: "Mid Vendors", count: 420, value: 8.9, avgLoss: 21 },
    { name: "Small Vendors", count: 3504, value: 4.4, avgLoss: 1.3 }
  ];

  // Industry breakdown
  const industryImpact = [
    { industry: "Management Consulting", amount: 8.2, companies: 156 },
    { industry: "Healthcare Services", amount: 6.8, companies: 89 },
    { industry: "IT Consulting", amount: 5.4, companies: 234 },
    { industry: "Immigration Services", amount: 3.9, companies: 12 },
    { industry: "Environmental", amount: 2.1, companies: 145 },
    { industry: "Social Services", amount: 1.8, companies: 178 },
    { industry: "R&D", amount: 1.6, companies: 298 },
    { industry: "Facilities", amount: 1.2, companies: 456 }
  ];

  // Top vendors data for treemap
  const topVendorsTree = [
    { name: "Walgreens", value: 3070, type: "Pharmacy" },
    { name: "Family Endeavors", value: 2900, type: "Immigration" },
    { name: "CVS Health", value: 1950, type: "Pharmacy" },
    { name: "Booz Allen", value: 1200, type: "Consulting" },
    { name: "Lockheed Martin", value: 980, type: "Defense" },
    { name: "General Dynamics", value: 850, type: "Defense" },
    { name: "Accenture", value: 720, type: "Consulting" },
    { name: "CACI", value: 650, type: "IT" },
    { name: "SAIC", value: 580, type: "IT" },
    { name: "Deloitte", value: 520, type: "Consulting" },
    { name: "Others", value: 15000, type: "Various" }
  ];

  const replacementData = [
    { category: "IT Services", replaced: 85, cost_change: 140 },
    { category: "Healthcare", replaced: 75, cost_change: 120 },
    { category: "Facilities", replaced: 90, cost_change: 105 },
    { category: "Consulting", replaced: 25, cost_change: 180 },
    { category: "Environmental", replaced: 15, cost_change: 200 },
    { category: "Social Services", replaced: 35, cost_change: 110 }
  ];

  return (
    <div className="space-y-8 mb-8">
      {/* Vendor Size Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Contract Value by Vendor Size</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vendorSizes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} (${((percent ?? 0) * 100).toFixed(1)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {vendorSizes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}B`, "Contract Value"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Industry Impact ($ Billions)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={industryImpact} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="industry" type="category" tick={{ fontSize: 11 }} width={100} />
              <Tooltip formatter={(value) => [`$${value}B`, "Contract Losses"]} />
              <Bar dataKey="amount" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service Replacement Analysis */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Service Replacement vs Cost Impact</h4>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={replacementData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="category" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value, name) => [
                name === "replaced" ? `${value}%` : `${value}%`,
                name === "replaced" ? "Services Replaced" : "Cost Change"
              ]} 
            />
            <Bar dataKey="replaced" fill="#059669" name="replaced" />
            <Bar dataKey="cost_change" fill="#dc2626" name="cost_change" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Vendor Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-900">4,019</div>
          <div className="text-red-700 text-sm">Vendors Affected</div>
          <div className="text-red-600 text-xs mt-1">Across all categories</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-900">$15.2M</div>
          <div className="text-orange-700 text-sm">Average Loss</div>
          <div className="text-orange-600 text-xs mt-1">Per vendor</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-900">87%</div>
          <div className="text-yellow-700 text-sm">Small/Mid Vendors</div>
          <div className="text-yellow-600 text-xs mt-1">By count</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-900">68%</div>
          <div className="text-blue-700 text-sm">Services Replaced</div>
          <div className="text-blue-600 text-xs mt-1">6 months later</div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Market Concentration Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">🎯 Value Concentration</h5>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• Top 10 vendors: 43% of total contract value</li>
              <li>• Top 100 vendors: 78% of total contract value</li>
              <li>• Bottom 3,500 vendors: Only 8% of value</li>
              <li>• Small contracts (under $100K): 60% of count, 0.1% of value</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">🔄 Replacement Patterns</h5>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• Essential services (IT, facilities): 85-90% replaced</li>
              <li>• Consulting services: Only 25% replaced</li>
              <li>• Environmental services: 85% permanently eliminated</li>
              <li>• Replacement cost: 110-200% of original contracts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}