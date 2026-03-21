'use client';

import { useState, useMemo } from 'react';
import { StatCard } from '@/components/StatCard';
import { formatSalary, formatNumber } from '@/lib/format';

interface Contract {
  vendor: string;
  agency: string;
  value: number;
  savings: number;
  date: string;
  description: string;
  fpdsStatus: 'verified' | 'unverified' | 'disputed';
}

interface Vendor {
  name: string;
  totalContracts: number;
  totalValue: number;
  totalSavings: number;
}

interface Props {
  contracts: Contract[];
  vendors: Vendor[];
}

export function ContractSearchClient({ contracts, vendors }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('');
  const [savingsRange, setSavingsRange] = useState<[number, number]>([0, 100000000]);
  const [dateRange, setDateRange] = useState<[string, string]>(['', '']);
  const [sortBy, setSortBy] = useState<'savings' | 'value' | 'date'>('savings');
  const [fpdsFilter, setFpdsFilter] = useState<'all' | 'verified' | 'unverified' | 'disputed'>('all');

  // Get unique agencies for filter
  const agencies = useMemo(() => {
    const agencySet = new Set(contracts.map(c => c.agency));
    return Array.from(agencySet).sort();
  }, [contracts]);

  // Filter and sort contracts
  const filteredContracts = useMemo(() => {
    let filtered = contracts.filter(contract => {
      // Text search
      const searchMatch = searchQuery === '' || 
        contract.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.agency.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Agency filter
      const agencyMatch = agencyFilter === '' || contract.agency === agencyFilter;
      
      // Savings range filter
      const savingsMatch = contract.savings >= savingsRange[0] && contract.savings <= savingsRange[1];
      
      // Date range filter
      const dateMatch = (dateRange[0] === '' || contract.date >= dateRange[0]) &&
                        (dateRange[1] === '' || contract.date <= dateRange[1]);
      
      // FPDS status filter
      const fpdsMatch = fpdsFilter === 'all' || contract.fpdsStatus === fpdsFilter;

      return searchMatch && agencyMatch && savingsMatch && dateMatch && fpdsMatch;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'savings':
          return b.savings - a.savings;
        case 'value':
          return b.value - a.value;
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [contracts, searchQuery, agencyFilter, savingsRange, dateRange, sortBy, fpdsFilter]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalContracts = filteredContracts.length;
    const totalValue = filteredContracts.reduce((sum, c) => sum + c.value, 0);
    const totalSavings = filteredContracts.reduce((sum, c) => sum + c.savings, 0);
    const verifiedCount = filteredContracts.filter(c => c.fpdsStatus === 'verified').length;
    
    return {
      totalContracts,
      totalValue,
      totalSavings,
      verificationRate: totalContracts > 0 ? (verifiedCount / totalContracts) * 100 : 0
    };
  }, [filteredContracts]);

  // Export to CSV
  const exportCSV = () => {
    const headers = ['Vendor', 'Agency', 'Value', 'Savings', 'Date', 'Description', 'FPDS Status'];
    const csvData = [
      headers.join(','),
      ...filteredContracts.map(contract => [
        `"${contract.vendor}"`,
        `"${contract.agency}"`,
        contract.value,
        contract.savings,
        contract.date,
        `"${contract.description.replace(/"/g, '""')}"`,
        contract.fpdsStatus
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `doge-contracts-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setAgencyFilter('');
    setSavingsRange([0, 100000000]);
    setDateRange(['', '']);
    setFpdsFilter('all');
  };

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Contracts Found"
          value={formatNumber(summaryStats.totalContracts)}
          sub={`of ${formatNumber(contracts.length)} total`}
        />
        <StatCard
          label="Total Value"
          value={formatSalary(summaryStats.totalValue)}
          sub="contract values"
        />
        <StatCard
          label="Claimed Savings"
          value={formatSalary(summaryStats.totalSavings)}
          sub="DOGE estimates"
        />
        <StatCard
          label="FPDS Verified"
          value={`${summaryStats.verificationRate.toFixed(1)}%`}
          sub={`${summaryStats.verificationRate > 60 ? 'High' : summaryStats.verificationRate > 30 ? 'Medium' : 'Low'} confidence`}
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Search Contracts
            </label>
            <input
              type="text"
              placeholder="Search vendor, agency, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Agency
            </label>
            <select
              value={agencyFilter}
              onChange={(e) => setAgencyFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
            >
              <option value="">All Agencies</option>
              {agencies.map(agency => (
                <option key={agency} value={agency}>{agency}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              FPDS Status
            </label>
            <select
              value={fpdsFilter}
              onChange={(e) => setFpdsFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
              <option value="disputed">Disputed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Min Savings ($)
            </label>
            <input
              type="number"
              value={savingsRange[0]}
              onChange={(e) => setSavingsRange([Number(e.target.value), savingsRange[1]])}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Max Savings ($)
            </label>
            <input
              type="number"
              value={savingsRange[1]}
              onChange={(e) => setSavingsRange([savingsRange[0], Number(e.target.value)])}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
            >
              <option value="savings">Savings (High to Low)</option>
              <option value="value">Value (High to Low)</option>
              <option value="date">Date (Newest First)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Export CSV ({formatNumber(summaryStats.totalContracts)})
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
            Contract Results ({formatNumber(filteredContracts.length)})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Agency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Savings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filteredContracts.map((contract, index) => (
                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {contract.vendor}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">
                        {contract.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                    {contract.agency}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                    {formatSalary(contract.value)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">
                    {formatSalary(contract.savings)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {contract.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      contract.fpdsStatus === 'verified' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : contract.fpdsStatus === 'disputed'
                        ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                    }`}>
                      {contract.fpdsStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredContracts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No contracts match your filters. Try adjusting your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* About FPDS Verification */}
      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-4">
          About FPDS Verification
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <p>• <span className="font-medium">Verified:</span> Contract exists in Federal Procurement Data System with matching details</p>
          <p>• <span className="font-medium">Unverified:</span> Contract not found in FPDS or details don't match</p>
          <p>• <span className="font-medium">Disputed:</span> Contract exists but savings calculation is questionable</p>
          <p>• FPDS is the official government database of federal contracts over $25,000</p>
        </div>
      </div>
    </div>
  );
}