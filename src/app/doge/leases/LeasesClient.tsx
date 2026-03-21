'use client';

import { useState, useMemo } from 'react';
import { StatCard } from '@/components/StatCard';
import { SimpleBarChart, SimplePieChart } from '@/components/Charts';
import { formatNumber, formatSalary } from '@/lib/format';

interface LeaseData {
  summary: {
    totalLeases: number;
    totalSavings: number;
    totalSqFt: number;
    avgSavingsPerLease: number;
    costPerSqFt: number;
  };
  byState: Array<{
    state: string;
    count: number;
    totalSavings: number;
    totalSqFt: number;
  }>;
  byAgency: Array<{
    agency: string;
    count: number;
    totalSavings: number;
    totalSqFt: number;
  }>;
  byType: Array<{
    type: string;
    count: number;
    savings: number;
  }>;
  allLeases: Array<{
    date: string;
    location: string;
    sq_ft: number;
    description: string;
    value: number;
    savings: number;
    agency: string;
  }>;
}

interface Props {
  data: LeaseData;
}

export function LeasesClient({ data }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [sortBy, setSortBy] = useState<'savings' | 'sqft' | 'date'>('savings');

  // Filter and sort leases
  const filteredLeases = useMemo(() => {
    let filtered = data.allLeases.filter(lease => {
      const searchMatch = searchQuery === '' ||
        lease.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lease.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lease.agency.toLowerCase().includes(searchQuery.toLowerCase());

      const agencyMatch = agencyFilter === '' || lease.agency === agencyFilter;
      
      // Extract state from location for filtering
      const leaseState = lease.location.split(',').pop()?.trim() || '';
      const stateMatch = stateFilter === '' || leaseState === stateFilter;

      return searchMatch && agencyMatch && stateMatch;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'savings':
          return b.savings - a.savings;
        case 'sqft':
          return b.sq_ft - a.sq_ft;
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [data.allLeases, searchQuery, agencyFilter, stateFilter, sortBy]);

  // Get unique agencies and states for filters
  const agencies = useMemo(() => {
    const agencySet = new Set(data.allLeases.map(l => l.agency));
    return Array.from(agencySet).sort();
  }, [data.allLeases]);

  const states = useMemo(() => {
    const stateSet = new Set(
      data.allLeases.map(l => l.location.split(',').pop()?.trim() || '').filter(Boolean)
    );
    return Array.from(stateSet).sort();
  }, [data.allLeases]);

  // Prepare chart data
  const stateChartData = data.byState
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)
    .map(item => ({
      name: item.state,
      value: item.count,
      savings: item.totalSavings,
      sqft: item.totalSqFt
    }));

  const agencyChartData = data.byAgency
    .sort((a, b) => b.totalSavings - a.totalSavings)
    .slice(0, 10)
    .map(item => ({
      name: item.agency.length > 30 ? item.agency.substring(0, 27) + '...' : item.agency,
      value: item.totalSavings,
      count: item.count,
      sqft: item.totalSqFt
    }));

  const typeChartData = data.byType.map(item => ({
    name: item.type.length > 40 ? item.type.substring(0, 37) + '...' : item.type,
    value: item.count,
    savings: item.savings
  }));

  return (
    <div className="space-y-8">
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Leases Terminated"
          value={formatNumber(data.summary.totalLeases)}
          sub="office leases eliminated"
        />
        <StatCard
          label="Total Savings"
          value={formatSalary(data.summary.totalSavings)}
          sub="annual rent savings"
        />
        <StatCard
          label="Square Footage"
          value={formatNumber(data.summary.totalSqFt)}
          sub="sq ft of office space"
        />
        <StatCard
          label="Avg per Lease"
          value={formatSalary(data.summary.avgSavingsPerLease)}
          sub={`$${data.summary.costPerSqFt}/sq ft`}
        />
      </div>

      {/* State Distribution Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6">
          Lease Terminations by State (Top 15)
        </h2>
        <SimpleBarChart
          data={stateChartData}
          nameKey="name"
          dataKey="value"
        />
      </div>

      {/* Agency and Type Analysis */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6">
            Savings by Agency (Top 10)
          </h2>
          <SimpleBarChart
            data={agencyChartData}
            nameKey="name"
            dataKey="value"
          />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6">
            Termination Types
          </h2>
          <SimplePieChart
            data={typeChartData}
            nameKey="name"
            dataKey="value"
          />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Search Leases
            </label>
            <input
              type="text"
              placeholder="Search location, agency, or description..."
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
              State
            </label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
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
              <option value="sqft">Square Feet (High to Low)</option>
              <option value="date">Date (Newest First)</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-400">
          Showing {formatNumber(filteredLeases.length)} of {formatNumber(data.allLeases.length)} leases
        </div>
      </div>

      {/* Lease Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
            All Terminated Leases ({formatNumber(filteredLeases.length)})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Agency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Square Feet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Annual Savings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filteredLeases.slice(0, 100).map((lease, index) => (
                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {lease.location}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">
                        {lease.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                    {lease.agency}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                    {formatNumber(lease.sq_ft)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">
                    {formatSalary(lease.savings)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {lease.date}
                  </td>
                </tr>
              ))}
              {filteredLeases.length > 100 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">
                    Showing first 100 results. Use filters to narrow down results.
                  </td>
                </tr>
              )}
              {filteredLeases.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No leases match your filters. Try adjusting your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-4">
          Key Insights: Why Lease Data Matters
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-400">
          <div className="space-y-3">
            <p>• <span className="font-medium">Most Verifiable:</span> Unlike contracts and grants, lease terminations are easily verifiable through public records</p>
            <p>• <span className="font-medium">Immediate Savings:</span> Rent savings start immediately, unlike workforce reductions</p>
            <p>• <span className="font-medium">Smallest Category:</span> Only $53.5M of DOGE's claimed savings, but the most concrete</p>
          </div>
          <div className="space-y-3">
            <p>• <span className="font-medium">Remote Work Impact:</span> Many terminations reflect post-COVID office space optimization</p>
            <p>• <span className="font-medium">Location Matters:</span> Higher savings in expensive markets like CA, NY, and DC metro</p>
            <p>• <span className="font-medium">Ongoing Process:</span> Federal agencies continue to evaluate and reduce office footprints</p>
          </div>
        </div>
      </div>
    </div>
  );
}