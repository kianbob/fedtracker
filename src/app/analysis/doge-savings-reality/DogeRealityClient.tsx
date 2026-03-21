"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#3730a3", "#6366f1", "#818cf8", "#a5b4fc"];

export default function DogeRealityClient() {
  const savingsBreakdown = [
    { name: "Contracts", value: 61.0, color: "#3730a3", claimed: 61.0, estimated: 1.8 },
    { name: "Grants", value: 49.2, color: "#6366f1", claimed: 49.2, estimated: 3.9 },
    { name: "Leases", value: 0.054, color: "#818cf8", claimed: 0.054, estimated: 0.05 }
  ];

  const realityComparison = [
    { category: "DOGE Claims", contracts: 61.0, grants: 49.2, leases: 0.054 },
    { category: "Realistic Est.", contracts: 1.8, grants: 3.9, leases: 0.05 }
  ];

  return (
    <div className="space-y-8 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">DOGE's Claimed Savings Breakdown</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={savingsBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(1)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {savingsBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}B`, "Value"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Reality Check Bar Chart */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Claims vs Reality ($ Billions)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={realityComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`$${value}B`, ""]} />
              <Bar dataKey="contracts" fill="#3730a3" name="Contracts" />
              <Bar dataKey="grants" fill="#6366f1" name="Grants" />
              <Bar dataKey="leases" fill="#818cf8" name="Leases" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-900">20:1</div>
          <div className="text-red-700 text-sm">Claims to Reality Ratio</div>
          <div className="text-red-600 text-xs mt-1">$110B claimed vs ~$5.5B realistic</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-900">95%</div>
          <div className="text-yellow-700 text-sm">Claimed Savings Inflated</div>
          <div className="text-yellow-600 text-xs mt-1">Based on POLITICO investigation</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-900">29,591</div>
          <div className="text-blue-700 text-sm">Total Actions Taken</div>
          <div className="text-blue-600 text-xs mt-1">But concentrated savings in top 100</div>
        </div>
      </div>
    </div>
  );
}