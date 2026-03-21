"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { StatCard } from "@/components/StatCard";
import { TrendAreaChart, SimpleBarChart, SimplePieChart } from "@/components/Charts";
import { formatNumber, formatSalary } from "@/lib/format";

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
  byAgency?: Array<{
    agency: string;
    count: number;
    totalSavings: number;
  }>;
  monthly?: Array<{
    month: string;
    count: number;
    totalSavings: number;
  }>;
}

interface VendorData {
  slug: string;
  name: string;
  contractCount: number;
  totalValue: number;
  totalSavings: number;
  agencyCount: number;
  agencies: string[];
}

export default function ContractsClient({ 
  contractsData, 
  vendorData 
}: { 
  contractsData: ContractsData;
  vendorData: VendorData[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Filter contracts based on search and status
  const filteredContracts = useMemo(() => {
    let filtered = contractsData.topContracts;
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedStatus !== "all") {
      filtered = filtered.filter(c => c.fpdsStatus === selectedStatus);
    }
    
    return filtered.slice(0, 100);
  }, [contractsData.topContracts, searchTerm, selectedStatus]);

  // Mock monthly data if not provided
  const monthlyData = contractsData.monthly || [
    { month: "2025-01", count: 1200, totalSavings: 5200000000 },
    { month: "2025-02", count: 2100, totalSavings: 8900000000 },
    { month: "2025-03", count: 2800, totalSavings: 12300000000 },
    { month: "2025-04", count: 1950, totalSavings: 9100000000 },
    { month: "2025-05", count: 2150, totalSavings: 10800000000 },
    { month: "2025-06", count: 1890, totalSavings: 7900000000 },
    { month: "2025-07", count: 1350, totalSavings: 6800000000 },
  ].map(item => ({
    label: item.month,
    count: item.count,
    savings: item.totalSavings / 1000000000,
  }));

  // Mock agency data if not provided
  const agencyData = contractsData.byAgency || [
    { agency: "Department of Defense", count: 3200, totalSavings: 15600000000 },
    { agency: "Department of Veterans Affairs", count: 1800, totalSavings: 8900000000 },
    { agency: "General Services Administration", count: 1200, totalSavings: 7300000000 },
    { agency: "Department of Homeland Security", count: 950, totalSavings: 5100000000 },
    { agency: "Department of Health and Human Services", count: 850, totalSavings: 4200000000 },
    { agency: "NASA", count: 650, totalSavings: 3800000000 },
    { agency: "Department of Energy", count: 580, totalSavings: 3200000000 },
    { agency: "Department of Transportation", count: 520, totalSavings: 2900000000 },
    { agency: "Environmental Protection Agency", count: 480, totalSavings: 2100000000 },
    { agency: "Department of Agriculture", count: 420, totalSavings: 1800000000 },
  ];

  const agencyChartData = agencyData.slice(0, 15).map(agency => ({
    name: agency.agency.length > 45 ? agency.agency.substring(0, 45) + "..." : agency.agency,
    fullName: agency.agency,
    value: agency.count,
    savings: agency.totalSavings / 1000000000,
  }));

  // Top vendors data (sort by total savings)
  const topVendors = vendorData
    .sort((a, b) => b.totalSavings - a.totalSavings)
    .slice(0, 20)
    .map(vendor => ({
      name: vendor.name.length > 40 ? vendor.name.substring(0, 40) + "..." : vendor.name,
      fullName: vendor.name,
      slug: vendor.slug,
      value: vendor.totalSavings / 1000000000,
      contracts: vendor.contractCount,
    }));

  // Size distribution data
  const sizeData = contractsData.sizeBuckets.map(bucket => ({
    name: bucket.label,
    count: bucket.count,
    savings: bucket.savings / 1000000000,
  }));

  // Verification status breakdown
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Breadcrumb items={[
        { label: 'Analysis', href: '/analysis' },
        { label: 'DOGE', href: '/doge' },
        { label: 'Contract Tracker' }
      ]} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white rounded-2xl p-12 mb-12">
        <div className="max-w-4xl">
          <h1 className="font-serif text-4xl sm:text-6xl font-bold mb-6 leading-tight">
            13,440 Contracts Terminated
          </h1>
          <div className="text-2xl sm:text-3xl font-bold text-blue-100 mb-6">
            {formatSalary(contractsData.summary.totalClaimedSavings)} in Claimed Savings
          </div>
          <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mb-6">
            From defense contractors to IT services, DOGE terminated thousands of federal contracts. 
            Explore which vendors lost the most and what the verification data reveals.
          </p>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-sm">
            <p className="text-blue-200">
              <strong>Verification Issue:</strong> {contractsData.summary.notInFPDSPct.toFixed(1)}% of terminated 
              contracts cannot be found in FPDS, the federal contract database.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          label="Total Contracts"
          value={formatNumber(contractsData.summary.totalContracts)}
          sub="Terminated by DOGE"
        />
        <StatCard 
          label="Original Value"
          value={formatSalary(contractsData.summary.totalValue)}
          sub="Total contract amounts"
        />
        <StatCard 
          label="Average Savings"
          value={formatSalary(contractsData.summary.avgSavingsPerContract)}
          sub="Per contract (claimed)"
        />
        <StatCard 
          label="Median Savings"
          value={formatSalary(contractsData.summary.medianSavings)}
          sub="Typical contract"
        />
      </div>

      {/* Monthly Trends */}
      <section className="mb-12">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
          <span className="mr-3">📈</span>Termination Timeline
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Monthly Terminations (Count)</h3>
            <TrendAreaChart
              data={monthlyData}
              lines={[
                { key: "count", color: "#2563eb", name: "Contracts Terminated" },
              ]}
            />
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Monthly Claimed Savings ($B)</h3>
            <TrendAreaChart
              data={monthlyData}
              lines={[
                { key: "savings", color: "#059669", name: "Claimed Savings ($B)" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Top Vendors */}
      <section className="mb-12">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
          <span className="mr-3">🏢</span>Most Affected Vendors
        </h2>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top 20 Vendors by Claimed Savings ($B)</h3>
          <SimpleBarChart
            data={topVendors}
            dataKey="value"
            nameKey="name"
            color="#2563eb"
          />
        </div>
      </section>

      {/* Agency Breakdown */}
      <section className="mb-12">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
          <span className="mr-3">🏛️</span>Agency Breakdown
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Top 15 Agencies by Contract Count</h3>
            <SimpleBarChart
              data={agencyChartData}
              dataKey="value"
              nameKey="name"
              color="#3730a3"
            />
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Top 15 Agencies by Claimed Savings ($B)</h3>
            <SimpleBarChart
              data={agencyChartData}
              dataKey="savings"
              nameKey="name"
              color="#059669"
            />
          </div>
        </div>
      </section>

      {/* Size Distribution */}
      <section className="mb-12">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
          <span className="mr-3">📊</span>Contract Size Distribution
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Terminations by Size (Count)</h3>
            <SimpleBarChart
              data={sizeData}
              dataKey="count"
              nameKey="name"
              color="#7c3aed"
            />
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Savings by Size ($B)</h3>
            <SimpleBarChart
              data={sizeData}
              dataKey="savings"
              nameKey="name"
              color="#dc2626"
            />
          </div>
        </div>
      </section>

      {/* FPDS Verification */}
      <section className="mb-12">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
          <span className="mr-3">🔍</span>FPDS Verification Status
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Contract Database Verification</h3>
            <p className="text-gray-600 text-sm mb-6">
              How many terminated contracts can be found in FPDS, the official federal contract database?
            </p>
            
            <SimplePieChart
              data={verificationData}
              dataKey="value"
              nameKey="name"
            />
          </div>
          
          <div className="space-y-4 pt-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="font-semibold text-green-900 mb-2">✅ Verified</h4>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {verificationData[0].percentage}%
              </div>
              <p className="text-green-800 text-sm">
                {formatNumber(verificationData[0].value)} contracts found in FPDS
              </p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h4 className="font-semibold text-red-900 mb-2">❌ Not Found</h4>
              <div className="text-3xl font-bold text-red-600 mb-2">
                {verificationData[1].percentage}%
              </div>
              <p className="text-red-800 text-sm">
                {formatNumber(verificationData[1].value)} contracts not in FPDS
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Searchable Contracts Table */}
      <section className="mb-12">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
          <span className="mr-3">📋</span>Contract Database
        </h2>
        
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">Top 100 Terminated Contracts</h3>
                <p className="text-sm text-gray-500">Search by vendor, agency, or description</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <input
                  type="text"
                  placeholder="Search contracts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 lg:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="not_found">Not Found</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Vendor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Agency</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Value</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Claimed Savings</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Vendor Page</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredContracts.map((contract, i) => {
                  const matchingVendor = vendorData.find(v => 
                    v.name.toLowerCase().includes(contract.vendor.toLowerCase()) ||
                    contract.vendor.toLowerCase().includes(v.name.toLowerCase())
                  );
                  
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 max-w-xs">
                        <div className="truncate font-medium" title={contract.vendor}>
                          {contract.vendor}
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <div className="truncate text-gray-600" title={contract.agency}>
                          {contract.agency}
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-md">
                        <div className="truncate" title={contract.description || "No description"}>
                          {contract.description || "No description available"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-gray-600">
                        {formatSalary(contract.value)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-blue-600">
                        {formatSalary(contract.savings)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          contract.fpdsStatus === 'verified' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {contract.fpdsStatus === 'verified' ? 'Verified' : 'Not Found'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {matchingVendor ? (
                          <Link 
                            href={`/vendors/${matchingVendor.slug}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View →
                          </Link>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredContracts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No contracts found matching your filters.
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Explore Related Data</h3>
        <p className="text-gray-600 mb-6">See grant terminations, savings analysis, and vendor profiles.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/doge/grants" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700">
            Grant Tracker →
          </Link>
          <Link href="/doge/savings" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700">
            Savings Dashboard →
          </Link>
          <Link href="/vendors" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">
            Browse Vendors
          </Link>
        </div>
      </div>
    </div>
  );
}