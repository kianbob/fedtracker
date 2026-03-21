"use client";

import { useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { StatCard } from "@/components/StatCard";
import { TrendAreaChart, SimpleBarChart, SimplePieChart } from "@/components/Charts";
import { formatNumber, formatSalary } from "@/lib/format";

interface DashboardData {
  totalClaimedSavings: number;
  breakdown: {
    contracts: { count: number; savings: number };
    grants: { count: number; savings: number };
    leases: { count: number; savings: number };
  };
  totalActions: number;
  contractVerification: {
    verified: number;
    notInFPDS: number;
    noLink: number;
  };
  monthly: Array<{
    month: string;
    contracts: number;
    grants: number;
    contractSavings: number;
    grantSavings: number;
  }>;
  topAgencies: Array<{
    agency: string;
    totalSavings: number;
    contractSavings: number;
    grantSavings: number;
    totalActions: number;
  }>;
  grantCategories: Array<{
    category: string;
    count: number;
    totalSavings: number;
  }>;
}

interface ContractsData {
  summary: {
    totalContracts: number;
    totalValue: number;
    totalClaimedSavings: number;
    savingsToValueRatio: number;
    notInFPDS: number;
    notInFPDSPct: number;
    inflatedCount: number;
    avgSavingsPerContract: number;
    medianSavings: number;
  };
  sizeBuckets: Array<{
    label: string;
    count: number;
    savings: number;
  }>;
  topContracts: Array<{
    piid: string;
    agency: string;
    vendor: string;
    value: number;
    savings: number;
    description: string;
    date: string;
    fpdsStatus: string;
  }>;
}

export default function SavingsClient({ 
  dashboardData, 
  contractsData 
}: { 
  dashboardData: DashboardData; 
  contractsData: ContractsData;
}) {
  const [selectedTab, setSelectedTab] = useState<"contracts" | "grants">("contracts");

  // Prepare monthly cumulative chart data
  const cumulativeData = dashboardData.monthly.map((item, index) => {
    const prevItems = dashboardData.monthly.slice(0, index + 1);
    const cumulativeContractSavings = prevItems.reduce((sum, i) => sum + (i.contractSavings || 0), 0);
    const cumulativeGrantSavings = prevItems.reduce((sum, i) => sum + (i.grantSavings || 0), 0);
    
    return {
      label: item.month,
      Contracts: cumulativeContractSavings / 1000000000,
      Grants: cumulativeGrantSavings / 1000000000,
    };
  });

  // Agency data for chart
  const agencyChartData = dashboardData.topAgencies.slice(0, 15).map(agency => ({
    name: agency.agency.length > 40 ? agency.agency.substring(0, 40) + "..." : agency.agency,
    value: agency.totalSavings / 1000000000,
  }));

  // Contract size data
  const sizeChartData = contractsData.sizeBuckets.map(bucket => ({
    name: bucket.label,
    count: bucket.count,
    savings: bucket.savings / 1000000000,
  }));

  // Grant categories for pie chart
  const categoryLabels: Record<string, string> = {
    university: "Universities",
    hospital: "Hospitals", 
    state_local: "State & Local Gov",
    international: "International",
    ngo: "NGOs & Nonprofits",
    tribal: "Tribal Organizations",
    other: "Other"
  };

  const grantCategoryData = dashboardData.grantCategories.map(cat => ({
    name: categoryLabels[cat.category] || cat.category,
    value: cat.count,
    savings: cat.totalSavings / 1000000000,
  }));

  // Verification data
  const verificationData = [
    { 
      name: "Verified in FPDS", 
      value: contractsData.summary.totalContracts - contractsData.summary.notInFPDS,
      percentage: ((contractsData.summary.totalContracts - contractsData.summary.notInFPDS) / contractsData.summary.totalContracts * 100).toFixed(1)
    },
    { 
      name: "Not Found in FPDS", 
      value: contractsData.summary.notInFPDS,
      percentage: (contractsData.summary.notInFPDS / contractsData.summary.totalContracts * 100).toFixed(1)
    },
  ];

  // Top claims for table
  const topClaims = [
    ...contractsData.topContracts.slice(0, 10).map(c => ({
      type: "Contract",
      description: c.description || c.vendor || "No description",
      agency: c.agency,
      amount: c.savings,
      status: c.fpdsStatus === "verified" ? "Verified" : "Unverified"
    })),
    // Add some grant examples (these would come from grants data in a real implementation)
  ].sort((a, b) => b.amount - a.amount).slice(0, 20);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Breadcrumb items={[
        { label: 'Analysis', href: '/analysis' },
        { label: 'DOGE', href: '/doge' },
        { label: 'Savings Dashboard' }
      ]} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-2xl p-12 mb-12">
        <div className="max-w-4xl">
          <h1 className="font-serif text-4xl sm:text-6xl font-bold mb-6 leading-tight">
            DOGE Claims {formatSalary(dashboardData.totalClaimedSavings)} Saved
          </h1>
          <p className="text-xl text-indigo-100 leading-relaxed max-w-3xl mb-6">
            The Department of Government Efficiency claims massive savings from terminated contracts, 
            canceled grants, and closed leases. But how much is real? Here's what the data actually shows.
          </p>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-sm">
            <p className="text-indigo-200">
              <strong>Reality Check:</strong> Independent analysis by POLITICO found that actual savings 
              were less than 5% of DOGE's claims. Many "terminated" contracts were simply rebid or restructured.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          label="Total Claimed Savings"
          value={formatSalary(dashboardData.totalClaimedSavings)}
          sub="DOGE's official number"
        />
        <StatCard 
          label="Total Actions"
          value={formatNumber(dashboardData.totalActions)}
          sub="Contracts + grants + leases"
        />
        <StatCard 
          label="Contracts Terminated"
          value={formatNumber(dashboardData.breakdown.contracts.count)}
          sub={formatSalary(dashboardData.breakdown.contracts.savings) + " claimed"}
        />
        <StatCard 
          label="Grants Canceled"
          value={formatNumber(dashboardData.breakdown.grants.count)}
          sub={formatSalary(dashboardData.breakdown.grants.savings) + " claimed"}
        />
      </div>

      {/* Breakdown Cards */}
      <section className="mb-12">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
          <span className="mr-3">📊</span>Where the Money Is
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-blue-900">Contract Terminations</h3>
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-3xl font-bold text-blue-900 mb-2">
              {formatSalary(dashboardData.breakdown.contracts.savings)}
            </p>
            <p className="text-blue-700 text-sm">
              {formatNumber(dashboardData.breakdown.contracts.count)} contracts • 
              {(dashboardData.breakdown.contracts.savings / dashboardData.totalClaimedSavings * 100).toFixed(1)}% of total
            </p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-purple-900">Grant Cancellations</h3>
              <span className="text-2xl">🎓</span>
            </div>
            <p className="text-3xl font-bold text-purple-900 mb-2">
              {formatSalary(dashboardData.breakdown.grants.savings)}
            </p>
            <p className="text-purple-700 text-sm">
              {formatNumber(dashboardData.breakdown.grants.count)} grants • 
              {(dashboardData.breakdown.grants.savings / dashboardData.totalClaimedSavings * 100).toFixed(1)}% of total
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-green-900">Lease Terminations</h3>
              <span className="text-2xl">🏢</span>
            </div>
            <p className="text-3xl font-bold text-green-900 mb-2">
              {formatSalary(dashboardData.breakdown.leases.savings)}
            </p>
            <p className="text-green-700 text-sm">
              {formatNumber(dashboardData.breakdown.leases.count)} leases • 
              {(dashboardData.breakdown.leases.savings / dashboardData.totalClaimedSavings * 100).toFixed(1)}% of total
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly Cumulative Savings (Claimed)</h3>
          <TrendAreaChart
            data={cumulativeData}
            lines={[
              { key: "Contracts", color: "#3730a3", name: "Contracts ($B)" },
              { key: "Grants", color: "#7c3aed", name: "Grants ($B)" },
            ]}
          />
        </div>
      </section>

      {/* Agency Breakdown */}
      <section className="mb-12">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
          <span className="mr-3">🏛️</span>Which Agencies Hit Hardest
        </h2>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top 15 Agencies by Claimed Savings (Billions)</h3>
          <SimpleBarChart
            data={agencyChartData}
            dataKey="value"
            nameKey="name"
            color="#3730a3"
          />
        </div>
      </section>

      {/* Contract Size Distribution */}
      <section className="mb-12">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
          <span className="mr-3">📏</span>Contract Size Distribution
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Count by Size</h3>
            <SimpleBarChart
              data={sizeChartData}
              dataKey="count"
              nameKey="name"
              color="#3730a3"
            />
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Savings by Size (Billions)</h3>
            <SimpleBarChart
              data={sizeChartData}
              dataKey="savings"
              nameKey="name"
              color="#6366f1"
            />
          </div>
        </div>
      </section>

      {/* Grant Categories */}
      <section className="mb-12">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
          <span className="mr-3">🎯</span>Grant Recipients by Category
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Grants Terminated by Recipient Type</h3>
            <SimplePieChart
              data={grantCategoryData}
              dataKey="value"
              nameKey="name"
            />
          </div>
          
          <div className="space-y-3 pt-6">
            {grantCategoryData.map((cat, i) => (
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

      {/* Verification Status */}
      <section className="mb-12">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
          <span className="mr-3">🔍</span>Contract Verification Status
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">FPDS Database Verification</h3>
            <p className="text-gray-600 text-sm mb-6">
              Can we find these contracts in the federal contract database (FPDS)?
            </p>
            
            <div className="space-y-4">
              {verificationData.map((item) => (
                <div key={item.name} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <div className="text-sm text-gray-500">{formatNumber(item.value)} contracts</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Verification Issues</h4>
              <p className="text-yellow-800 text-sm">
                {contractsData.summary.notInFPDSPct.toFixed(1)}% of claimed contract terminations cannot be found in FPDS, 
                the authoritative federal contract database.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-blue-900 mb-2">📊 The Numbers</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div>Avg savings per contract: {formatSalary(contractsData.summary.avgSavingsPerContract)}</div>
                <div>Median savings: {formatSalary(contractsData.summary.medianSavings)}</div>
                <div>Savings-to-value ratio: {(contractsData.summary.savingsToValueRatio * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biggest Claims Table */}
      <section className="mb-12">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
          <span className="mr-3">🏆</span>Biggest Claims
        </h2>
        
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Top 20 Contract Terminations by Claimed Savings</h3>
            <p className="text-sm text-gray-500">The largest individual savings claims from DOGE</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Agency</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Claimed Savings</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topClaims.slice(0, 20).map((claim, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        claim.type === 'Contract' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {claim.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="truncate" title={claim.description}>
                        {claim.description}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs">
                      <div className="truncate">{claim.agency}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">
                      {formatSalary(claim.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        claim.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-8 text-center">
        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Explore More DOGE Data</h3>
        <p className="text-gray-600 mb-6">Deep dive into grants, contracts, and workforce impacts.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/doge/grants" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700">
            Grant Tracker →
          </Link>
          <Link href="/doge/contracts" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
            Contract Tracker →
          </Link>
          <Link href="/doge" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
            DOGE Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}