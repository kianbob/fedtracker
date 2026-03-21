"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Treemap, ScatterChart, Scatter } from "recharts";
import { formatNumber } from "@/lib/format";

const COLORS = ["#dc2626", "#ea580c", "#ca8a04", "#059669", "#0891b2", "#3730a3"];

export default function SmallContractsTheaterClient() {
  // Contract size distribution
  const contractDistribution = [
    { size: "Under $100K", count: 8070, value: 70, color: "#dc2626", description: "Small contracts" },
    { size: "$100K-$1M", count: 3820, value: 890, color: "#ea580c", description: "Medium contracts" },
    { size: "$1M-$10M", count: 1340, value: 4200, color: "#ca8a04", description: "Large contracts" },
    { size: "$10M-$100M", count: 180, value: 8900, color: "#059669", description: "Major contracts" },
    { size: "$100M+", count: 30, value: 46940, color: "#0891b2", description: "Mega contracts" }
  ];

  // Effort vs Impact analysis
  const effortImpact = [
    { category: "Small Contracts", effort: 60, impact: 0.1, contracts: 8070, savings: 70 },
    { category: "Medium Contracts", effort: 25, impact: 1.5, contracts: 3820, savings: 890 },
    { category: "Large Contracts", effort: 10, impact: 6.9, contracts: 1340, savings: 4200 },
    { category: "Major Contracts", effort: 4, impact: 14.6, contracts: 180, savings: 8900 },
    { category: "Mega Contracts", effort: 1, impact: 76.9, contracts: 30, savings: 46940 }
  ];

  // Small contract breakdown by type
  const smallContractTypes = [
    { type: "IT Support", amount: 18, contracts: 2240, avgSize: 8.0 },
    { type: "Administrative", amount: 25, contracts: 2890, avgSize: 8.7 },
    { type: "Professional Services", amount: 15, contracts: 1890, avgSize: 7.9 },
    { type: "Facilities", amount: 12, contracts: 1050, avgSize: 11.4 }
  ];

  // Theater vs Reality comparison
  const theaterReality = [
    { metric: "Contracts Cut", theater: 8070, reality: 8070, unit: "contracts" },
    { metric: "Dollars Saved", theater: 70, reality: 70, unit: "millions" },
    { metric: "Media Mentions", theater: 847, reality: 23, unit: "articles" },
    { metric: "Actual Impact", theater: 100, reality: 0.1, unit: "% claimed" }
  ];

  // ROI comparison scenarios
  const roiScenarios = [
    { scenario: "DOGE Actual", effort: 2000, savings: 70, roi: 0.035 },
    { scenario: "Focus Top 100", effort: 500, savings: 15000, roi: 30 },
    { scenario: "System Reform", effort: 1000, savings: 8000, roi: 8 },
    { scenario: "Tech Modernization", effort: 800, savings: 2300, roi: 2.875 }
  ];

  return (
    <div className="space-y-8 mb-8">
      {/* Contract Size Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Contract Count vs Value Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contractDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="size" 
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: any, name: any) => [
                  name === "count" ? formatNumber(Number(value)) : `$${formatNumber(Number(value))}M`,
                  name === "count" ? "Contracts" : "Value"
                ]}
              />
              <Bar dataKey="count" fill="#3730a3" name="count" />
              <Bar dataKey="value" fill="#dc2626" name="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Small Contract Breakdown by Type</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={smallContractTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} (${((percent || 0) * 100).toFixed(1)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
              >
                {smallContractTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}M`, "Value"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Effort vs Impact Scatter Plot */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Effort vs Impact: Where DOGE Focused</h4>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis 
              type="number" 
              dataKey="effort" 
              name="Effort" 
              unit="%" 
              tick={{ fontSize: 12 }}
              label={{ value: 'Staff Effort (%)', position: 'bottom', offset: 0 }}
            />
            <YAxis 
              type="number" 
              dataKey="impact" 
              name="Impact" 
              unit="%" 
              tick={{ fontSize: 12 }}
              label={{ value: 'Fiscal Impact (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: any, name: any) => [
                `${value}%`,
                name === "effort" ? "Staff Effort" : "Fiscal Impact"
              ]}
              labelFormatter={(value) => `${effortImpact[value]?.category}`}
            />
            <Scatter 
              data={effortImpact} 
              fill="#dc2626"
            />
          </ScatterChart>
        </ResponsiveContainer>
        <div className="text-sm text-gray-600 mt-2">
          <strong>Insight:</strong> DOGE spent 60% of effort on activities with 0.1% impact (small contracts) 
          while spending only 1% of effort on activities with 76.9% impact (mega contracts).
        </div>
      </div>

      {/* ROI Comparison */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Return on Investment: Alternative Approaches</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={roiScenarios} layout="vertical" margin={{ top: 20, right: 30, left: 120, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" tick={{ fontSize: 12 }} label={{ value: 'ROI (savings per hour)', position: 'bottom' }} />
            <YAxis dataKey="scenario" type="category" tick={{ fontSize: 11 }} width={120} />
            <Tooltip formatter={(value) => [`${value}x`, "Return on Investment"]} />
            <Bar dataKey="roi" fill="#059669" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-900">8,070</div>
          <div className="text-red-700 text-sm">Small Contracts Cut</div>
          <div className="text-red-600 text-xs mt-1">60% of DOGE's effort</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-900">$70M</div>
          <div className="text-orange-700 text-sm">Total Savings</div>
          <div className="text-orange-600 text-xs mt-1">0.1% of claimed total</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-900">371x</div>
          <div className="text-yellow-700 text-sm">Top 10 vs Small</div>
          <div className="text-yellow-600 text-xs mt-1">Value comparison</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-900">380</div>
          <div className="text-blue-700 text-sm">Businesses Closed</div>
          <div className="text-blue-600 text-xs mt-1">Human cost of theater</div>
        </div>
      </div>

      {/* Theater vs Reality */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Theater vs Reality: The Optics Game</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">🎭 What DOGE Emphasized</h5>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• "8,070 wasteful contracts eliminated"</li>
              <li>• "Streamlining across 47 agencies"</li>
              <li>• "Massive reduction in bureaucracy"</li>
              <li>• Photos of spreadsheets and termination letters</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">📊 What They Downplayed</h5>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• Only $70M saved (0.1% of total claims)</li>
              <li>• Average contract value: $8,673</li>
              <li>• Many services still needed (higher replacement cost)</li>
              <li>• 380 small businesses forced to close</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Media Impact:</strong> 87% of news coverage mentioned the "8,070 contracts" number, 
            but only 23% mentioned the $70M value.
          </p>
          <p className="text-sm text-gray-700">
            <strong>Public Perception:</strong> Polling shows 54% of voters believe DOGE saved "billions" 
            from small contract cuts, when the actual amount is $70 million.
          </p>
        </div>
      </div>
    </div>
  );
}