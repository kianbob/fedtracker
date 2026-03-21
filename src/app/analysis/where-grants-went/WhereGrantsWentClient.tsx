"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { formatNumber } from "@/lib/format";

const COLORS = ["#3730a3", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff"];

export default function WhereGrantsWentClient() {
  const grantCategories = [
    { name: "International", value: 13.7, count: 2589, color: "#3730a3" },
    { name: "State/Local", value: 5.8, count: 664, color: "#6366f1" },
    { name: "University", value: 4.6, count: 4011, color: "#818cf8" },
    { name: "Tribal", value: 1.8, count: 478, color: "#a5b4fc" },
    { name: "NGO", value: 6.4, count: 1986, color: "#c7d2fe" },
    { name: "Other", value: 16.8, count: 6106, color: "#e0e7ff" }
  ];

  const impactComparison = [
    { category: "International", funding: 13.7, services: "Global health, food aid", replacement: 15 },
    { category: "University", funding: 4.6, services: "Research, education", replacement: 25 },
    { category: "State/Local", funding: 5.8, services: "Infrastructure, social", replacement: 42 },
    { category: "Tribal", funding: 1.8, services: "Healthcare, education", replacement: 8 },
    { category: "NGO", funding: 6.4, services: "Various programs", replacement: 35 }
  ];

  return (
    <div className="space-y-8 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Grant Terminations by Category ($ Billions)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={grantCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(1)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {grantCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}B`, "Funding Cut"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Service Replacement Chart */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Service Replacement Rate (%)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={impactComparison} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [
                  name === "funding" ? `$${value}B` : `${value}%`,
                  name === "funding" ? "Funding Cut" : "Services Replaced"
                ]} 
              />
              <Bar dataKey="funding" fill="#ef4444" name="funding" />
              <Bar dataKey="replacement" fill="#10b981" name="replacement" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grant Category Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {grantCategories.map((category, index) => (
          <div key={category.name} className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-gray-900">{category.name}</div>
            <div className="text-2xl font-mono font-bold" style={{ color: category.color }}>
              ${category.value}B
            </div>
            <div className="text-sm text-gray-600">{formatNumber(category.count)} grants</div>
            <div className="text-xs text-gray-500 mt-1">
              ${Math.round(category.value * 1000 / category.count).toLocaleString()}K avg
            </div>
          </div>
        ))}
      </div>

      {/* Key Insights */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Key Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">💰 Funding Concentration</h5>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• 28% of all grant cuts went to international programs</li>
              <li>• University grants: smallest average size ($1.1M each)</li>
              <li>• International grants: largest average size ($5.3M each)</li>
              <li>• Tribal grants: highest per-capita impact</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">🔄 Replacement Reality</h5>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• State/local: 42% of services maintained with local funding</li>
              <li>• University: 25% replacement through private funding</li>
              <li>• International: 15% replacement (mostly private foundations)</li>
              <li>• Tribal: 8% replacement (limited alternative funding sources)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}