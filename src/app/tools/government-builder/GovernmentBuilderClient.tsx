'use client';

import { useState, useEffect, useMemo } from 'react';
import { StatCard } from '@/components/StatCard';
import { formatNumber, formatSalary } from '@/lib/format';

interface Agency {
  code: string;
  name: string;
  employees: number;
  avgSalary: number | null;
}

interface AgencyScorecard {
  agencyName: string;
  totalClaimedSavings: number;
  contractSavings: number;
  grantSavings: number;
  totalActions: number;
}

interface Props {
  agencies: Agency[];
  scorecards: AgencyScorecard[];
}

const PRESET_CUTS = {
  'DOGE Actual Cuts': [
    'Department of Education', 'Environmental Protection Agency', 'Nuclear Regulatory Commission',
    'Equal Employment Opportunity Commission', 'Consumer Product Safety Commission',
    'Federal Trade Commission', 'Securities and Exchange Commission'
  ],
  'Cut 25%': (agencies: Agency[]) => agencies.slice(Math.floor(agencies.length * 0.25)),
  'Cut 50%': (agencies: Agency[]) => agencies.slice(Math.floor(agencies.length * 0.5)),
  'Essential Only': [
    'Department of Defense', 'Department of Veterans Affairs', 'Department of Homeland Security',
    'Department of Justice', 'Department of Treasury', 'Social Security Administration',
    'Department of Health and Human Services', 'Department of Transportation',
    'National Aeronautics and Space Administration', 'Department of State'
  ]
};

export function GovernmentBuilderClient({ agencies, scorecards }: Props) {
  const [selectedAgencies, setSelectedAgencies] = useState<Set<string>>(
    new Set(agencies.map(a => a.code))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'employees' | 'cost'>('employees');
  const [shareHash, setShareHash] = useState('');

  // Calculate totals
  const totals = useMemo(() => {
    const currentEmployees = agencies
      .filter(a => selectedAgencies.has(a.code))
      .reduce((sum, a) => sum + a.employees, 0);
    
    const totalEmployees = agencies.reduce((sum, a) => sum + a.employees, 0);
    
    const currentCost = agencies
      .filter(a => selectedAgencies.has(a.code) && a.avgSalary)
      .reduce((sum, a) => sum + (a.employees * a.avgSalary!), 0);
    
    const totalCost = agencies
      .filter(a => a.avgSalary)
      .reduce((sum, a) => sum + (a.employees * a.avgSalary!), 0);

    const employeesCut = totalEmployees - currentEmployees;
    const costSavings = totalCost - currentCost;
    const percentReduction = ((employeesCut / totalEmployees) * 100);

    return {
      currentEmployees,
      totalEmployees,
      employeesCut,
      costSavings,
      percentReduction,
      agenciesRemaining: selectedAgencies.size,
      totalAgencies: agencies.length
    };
  }, [selectedAgencies, agencies]);

  // Filter and sort agencies
  const filteredAgencies = useMemo(() => {
    let filtered = agencies.filter(agency => 
      agency.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'employees':
          return b.employees - a.employees;
        case 'cost':
          const aCost = a.avgSalary ? a.employees * a.avgSalary : 0;
          const bCost = b.avgSalary ? b.employees * b.avgSalary : 0;
          return bCost - aCost;
        default:
          return 0;
      }
    });

    return filtered;
  }, [agencies, searchQuery, sortBy]);

  // Handle preset cuts
  const applyPreset = (presetName: keyof typeof PRESET_CUTS) => {
    const preset = PRESET_CUTS[presetName];
    
    if (typeof preset === 'function') {
      const sortedBySize = [...agencies].sort((a, b) => b.employees - a.employees);
      const remaining = preset(sortedBySize);
      setSelectedAgencies(new Set(remaining.map(a => a.code)));
    } else if (Array.isArray(preset)) {
      if (presetName === 'DOGE Actual Cuts') {
        // Remove these agencies from current selection
        const newSelection = new Set(selectedAgencies);
        agencies.forEach(agency => {
          if (preset.some(name => agency.name.includes(name))) {
            newSelection.delete(agency.code);
          }
        });
        setSelectedAgencies(newSelection);
      } else {
        // Keep only these agencies (Essential Only)
        const agenciesToKeep = agencies.filter(agency => 
          preset.some(name => agency.name.includes(name))
        );
        setSelectedAgencies(new Set(agenciesToKeep.map(a => a.code)));
      }
    }
  };

  // Generate share URL
  useEffect(() => {
    const selectedCodes = Array.from(selectedAgencies).sort().join(',');
    const hash = btoa(selectedCodes).replace(/[+/=]/g, '');
    setShareHash(hash);
  }, [selectedAgencies]);

  const toggleAgency = (code: string) => {
    const newSelection = new Set(selectedAgencies);
    if (newSelection.has(code)) {
      newSelection.delete(code);
    } else {
      newSelection.add(code);
    }
    setSelectedAgencies(newSelection);
  };

  const selectAll = () => setSelectedAgencies(new Set(agencies.map(a => a.code)));
  const clearAll = () => setSelectedAgencies(new Set());

  return (
    <div className="space-y-8">
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Agencies Remaining"
          value={`${totals.agenciesRemaining} / ${totals.totalAgencies}`}
          sub={`${Math.round((totals.agenciesRemaining / totals.totalAgencies) * 100)}% of government`}
        />
        <StatCard
          label="Employees Remaining"
          value={formatNumber(totals.currentEmployees)}
          sub={`${formatNumber(totals.employeesCut)} positions cut`}
        />
        <StatCard
          label="Workforce Reduction"
          value={`${totals.percentReduction.toFixed(1)}%`}
          sub={`${totals.percentReduction > 25 ? 'Major' : totals.percentReduction > 10 ? 'Significant' : 'Moderate'} reduction`}
        />
        <StatCard
          label="Annual Savings"
          value={formatSalary(totals.costSavings)}
          sub={`${formatSalary(totals.costSavings / 330000000)} per American`}
        />
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={selectAll}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Select All
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear All
          </button>
          {Object.keys(PRESET_CUTS).map(presetName => (
            <button
              key={presetName}
              onClick={() => applyPreset(presetName as keyof typeof PRESET_CUTS)}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              {presetName}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search agencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'employees' | 'cost')}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="employees">Sort by Size</option>
            <option value="cost">Sort by Cost</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {shareHash && (
          <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Share your government design:</p>
            <code className="text-sm font-mono bg-white dark:bg-slate-800 px-2 py-1 rounded">
              {window.location.origin}/tools/government-builder#{shareHash}
            </code>
          </div>
        )}
      </div>

      {/* Agency List */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
            Federal Agencies ({filteredAgencies.length})
          </h2>
        </div>
        
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {filteredAgencies.map(agency => {
            const isSelected = selectedAgencies.has(agency.code);
            const totalCost = agency.avgSalary ? agency.employees * agency.avgSalary : 0;
            
            return (
              <div
                key={agency.code}
                className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                  isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleAgency(agency.code)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {agency.name}
                    </h3>
                    <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                      <span>{formatNumber(agency.employees)} employees</span>
                      {agency.avgSalary && (
                        <>
                          <span>Avg: {formatSalary(agency.avgSalary)}</span>
                          <span>Total: {formatSalary(totalCost)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}