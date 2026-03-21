"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { StatCard } from "@/components/StatCard";
import { TrendAreaChart, SimpleBarChart, SimplePieChart } from "@/components/Charts";
import { formatNumber, formatSalary } from "@/lib/format";

interface GrantsData {
  summary: {
    totalGrants: number;
    totalValue: number;
    totalClaimedSavings: number;
    avgSavingsPerGrant: number;
    medianSavings: number;
  };
  byAgency: Array<{
    agency: string;
    count: number;
    totalValue: number;
    totalSavings: number;
  }>;
  topRecipients: Array<{
    recipient: string;
    count: number;
    totalValue: number;
    totalSavings: number;
    agencies: string[];
    agencyCount: number;
  }>;
  recipientCategories: Array<{
    category: string;
    count: number;
    totalSavings: number;
  }>;
  monthly: Array<{
    month: string;
    count: number;
    totalSavings: number;
  }>;
  topGrants: Array<{
    agency: string;
    recipient: string;
    value: number;
    savings: number;
    description: string;
    date: string;
  }>;
}

export default function GrantsClient({ grantsData }: { grantsData: GrantsData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter recipients based on search and category
  const filteredRecipients = useMemo(() => {
    let filtered = grantsData.topRecipients;
    
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.recipient.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.slice(0, 50);
  }, [grantsData.topRecipients, searchTerm]);

  // Monthly trend data
  const monthlyData = grantsData.monthly.map(item => ({
    label: item.month,
    count: item.count,
    savings: item.totalSavings / 1000000000,
  }));

  // Agency data for chart (top 20)
  const agencyChartData = grantsData.byAgency.slice(0, 20).map(agency => ({
    name: agency.agency.length > 45 ? agency.agency.substring(0, 45) + "..." : agency.agency,
    fullName: agency.agency,
    value: agency.count,
    savings: agency.totalSavings / 1000000000,
  }));

  // Category labels mapping
  const categoryLabels: Record<string, string> = {
    university: "Universities",
    hospital: "Hospitals",
    state_local: "State & Local Gov",
    international: "International",
    ngo: "NGOs & Nonprofits", 
    tribal: "Tribal Organizations",
    other: "Other"
  };

  const categoryData = grantsData.recipientCategories.map(cat => ({
    name: categoryLabels[cat.category] || cat.category,
    value: cat.count,
    savings: cat.totalSavings / 1000000000,
  }));

  // Find USAID data for spotlight
  const usaidData = grantsData.byAgency.find(a => 
    a.agency.toLowerCase().includes('usaid') || 
    a.agency.toLowerCase().includes('agency for international development')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Breadcrumb items={[
        { label: 'Analysis', href: '/analysis' },
        { label: 'DOGE', href: '/doge' },
        { label: 'Grant Tracker' }
      ]} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-2xl p-12 mb-12">
        <div className="max-w-4xl">
          <h1 className="font-serif text-4xl sm:text-6xl font-bold mb-6 leading-tight">
            15,887 Grants Terminated
          </h1>
          <div className="text-2xl sm:text-3xl font-bold text-purple-100 mb-6">
            {formatSalary(grantsData.summary.totalClaimedSavings)} in Claimed Savings
          </div>
          <p className="text-xl text-purple-100 leading-relaxed max-w-3xl mb-6">
            From university research to international aid, DOGE terminated thousands of federal grants. 
            See who lost funding and which programs were cut.
          </p>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-sm">
            <p className="text-purple-200">
              <strong>Universities hit hardest:</strong> Over 6,000 research grants terminated, 
              affecting science funding from NASA to NIH to NSF.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          label="Total Grants Terminated"
          value={formatNumber(grantsData.summary.totalGrants)}
          sub="Across all agencies"
        />
        <StatCard 
          label="Total Value"
          value={formatSalary(grantsData.summary.totalValue)}
          sub="Original grant amounts"
        />
        <StatCard 
          label="Average Savings"
          value={formatSalary(grantsData.summary.avgSavingsPerGrant)}
          sub="Per grant (claimed)"
        />
        <StatCard 
          label="Median Savings" 
          value={formatSalary(grantsData.summary.medianSavings)}
          sub="Typical grant size"
        />
      </div>

      {/* Monthly Trend */}
      <section className="mb-12">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
          <span className="mr-3">📈</span>Grant Termination Timeline
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Monthly Terminations (Count)</h3>
            <TrendAreaChart
              data={monthlyData}
              lines={[
                { key: "count", color: "#7c3aed", name: "Grants Terminated" },
              ]}
            />
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Monthly Claimed Savings ($B)</h3>
            <TrendAreaChart
              data={monthlyData}
              lines={[
                { key: "savings", color: "#dc2626", name: "Claimed Savings ($B)" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Agency Breakdown */}
      <section className="mb-12">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
          <span className="mr-3">🏛️</span>Which Agencies Terminated the Most
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Top 20 Agencies by Grant Count</h3>
            <SimpleBarChart
              data={agencyChartData}
              dataKey="value"
              nameKey="name"
              color="#7c3aed"
            />
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Top 20 Agencies by Claimed Savings ($B)</h3>
            <SimpleBarChart
              data={agencyChartData}
              dataKey="savings"
              nameKey="name"
              color="#dc2626"
            />
          </div>
        </div>
      </section>

      {/* USAID Spotlight */}
      {usaidData && (
        <section className="mb-12">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
            <span className="mr-3">🌍</span>USAID Spotlight
          </h2>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600">
                  {formatNumber(usaidData.count)}
                </div>
                <div className="text-red-800 font-medium">Grants Terminated</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600">
                  {formatSalary(usaidData.totalSavings)}
                </div>
                <div className="text-red-800 font-medium">Claimed Savings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600">
                  {((usaidData.count / grantsData.summary.totalGrants) * 100).toFixed(1)}%
                </div>
                <div className="text-red-800 font-medium">Of All Terminations</div>
              </div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-6">
              <h4 className="font-semibold text-red-900 mb-3">The USAID Story</h4>
              <p className="text-red-800 leading-relaxed">
                USAID bore the brunt of DOGE's grant terminations, with international development, 
                humanitarian aid, and democracy promotion programs hit especially hard. This represents 
                a dramatic shift in U.S. foreign aid policy, with ripple effects for global health, 
                education, and development programs worldwide.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Recipient Categories */}
      <section className="mb-12">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
          <span className="mr-3">🎯</span>Who Lost Funding
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Terminated Grants by Recipient Type</h3>
            <SimplePieChart
              data={categoryData}
              dataKey="value"
              nameKey="name"
            />
          </div>
          
          <div className="space-y-3 pt-6">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">{cat.name}</span>
                <div className="text-right">
                  <div className="font-bold">{formatNumber(cat.value)} grants</div>
                  <div className="text-sm text-gray-500">{formatSalary(cat.savings * 1000000000)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Recipients Table */}
      <section className="mb-12">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
          <span className="mr-3">🔍</span>Top 50 Affected Recipients
        </h2>
        
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">Recipients with Most Terminated Grants</h3>
                <p className="text-sm text-gray-500">Search and filter the most affected organizations</p>
              </div>
              <div className="w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search recipients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Recipient</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Grants Lost</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total Value</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Claimed Savings</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Agencies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRecipients.map((recipient, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 max-w-sm">
                      <div className="font-medium truncate" title={recipient.recipient}>
                        {recipient.recipient}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-purple-600">
                      {formatNumber(recipient.count)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatSalary(recipient.totalValue)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">
                      {formatSalary(recipient.totalSavings)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {recipient.agencyCount} agencies
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredRecipients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No recipients found matching your search.
            </div>
          )}
        </div>
      </section>

      {/* Top Individual Grants */}
      <section className="mb-12">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
          <span className="mr-3">💰</span>Largest Individual Grant Terminations
        </h2>
        
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Top 20 Grants by Claimed Savings</h3>
            <p className="text-sm text-gray-500">The biggest individual grant terminations</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Agency</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Recipient</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Original Value</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Claimed Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {grantsData.topGrants.slice(0, 20).map((grant, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 max-w-xs">
                      <div className="truncate text-gray-600" title={grant.agency}>
                        {grant.agency}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="truncate font-medium" title={grant.recipient}>
                        {grant.recipient}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-md">
                      <div className="truncate" title={grant.description}>
                        {grant.description || "No description available"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-600">
                      {formatSalary(grant.value)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-purple-600">
                      {formatSalary(grant.savings)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-8 text-center">
        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Explore More DOGE Impact</h3>
        <p className="text-gray-600 mb-6">See contract terminations, workforce cuts, and savings analysis.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/doge/contracts" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
            Contract Tracker →
          </Link>
          <Link href="/doge/savings" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700">
            Savings Dashboard →
          </Link>
          <Link href="/doge" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
            DOGE Hub
          </Link>
        </div>
      </div>
    </div>
  );
}