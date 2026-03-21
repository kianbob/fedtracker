'use client';

import { useState, useMemo } from 'react';
import { StatCard } from '@/components/StatCard';
import { SimpleBarChart } from '@/components/Charts';
import { formatSalary, formatNumber } from '@/lib/format';

interface StateData {
  state: string;
  abbr: string;
  pop: number;
  taxpayers: number;
  fedEmployees: number;
}

// Hardcoded 2024 estimates for all 50 states + DC
const stateData: StateData[] = [
  { state: "California", abbr: "CA", pop: 39538223, taxpayers: 18200000, fedEmployees: 257000 },
  { state: "Texas", abbr: "TX", pop: 29145505, taxpayers: 13100000, fedEmployees: 176000 },
  { state: "Florida", abbr: "FL", pop: 21538187, taxpayers: 9800000, fedEmployees: 89000 },
  { state: "New York", abbr: "NY", pop: 20201249, taxpayers: 9200000, fedEmployees: 128000 },
  { state: "Pennsylvania", abbr: "PA", pop: 13002700, taxpayers: 6100000, fedEmployees: 67000 },
  { state: "Illinois", abbr: "IL", pop: 12812508, taxpayers: 5900000, fedEmployees: 52000 },
  { state: "Ohio", abbr: "OH", pop: 11799448, taxpayers: 5400000, fedEmployees: 42000 },
  { state: "Georgia", abbr: "GA", pop: 10711908, taxpayers: 4800000, fedEmployees: 78000 },
  { state: "North Carolina", abbr: "NC", pop: 10439388, taxpayers: 4700000, fedEmployees: 34000 },
  { state: "Michigan", abbr: "MI", pop: 10037261, taxpayers: 4600000, fedEmployees: 29000 },
  { state: "New Jersey", abbr: "NJ", pop: 9288994, taxpayers: 4300000, fedEmployees: 23000 },
  { state: "Virginia", abbr: "VA", pop: 8631393, taxpayers: 4100000, fedEmployees: 176000 },
  { state: "Washington", abbr: "WA", pop: 7705281, taxpayers: 3600000, fedEmployees: 62000 },
  { state: "Arizona", abbr: "AZ", pop: 7151502, taxpayers: 3200000, fedEmployees: 45000 },
  { state: "Tennessee", abbr: "TN", pop: 6910840, taxpayers: 3100000, fedEmployees: 23000 },
  { state: "Indiana", abbr: "IN", pop: 6785528, taxpayers: 3100000, fedEmployees: 18000 },
  { state: "Massachusetts", abbr: "MA", pop: 7001399, taxpayers: 3400000, fedEmployees: 18000 },
  { state: "Maryland", abbr: "MD", pop: 6164660, taxpayers: 3000000, fedEmployees: 145000 },
  { state: "Colorado", abbr: "CO", pop: 5773714, taxpayers: 2700000, fedEmployees: 32000 },
  { state: "Minnesota", abbr: "MN", pop: 5742363, taxpayers: 2700000, fedEmployees: 16000 },
  { state: "Wisconsin", abbr: "WI", pop: 5893718, taxpayers: 2700000, fedEmployees: 12000 },
  { state: "South Carolina", abbr: "SC", pop: 5118425, taxpayers: 2300000, fedEmployees: 23000 },
  { state: "Alabama", abbr: "AL", pop: 5024279, taxpayers: 2200000, fedEmployees: 45000 },
  { state: "Louisiana", abbr: "LA", pop: 4657757, taxpayers: 2000000, fedEmployees: 18000 },
  { state: "Kentucky", abbr: "KY", pop: 4505836, taxpayers: 2000000, fedEmployees: 15000 },
  { state: "Oregon", abbr: "OR", pop: 4237256, taxpayers: 2000000, fedEmployees: 14000 },
  { state: "Oklahoma", abbr: "OK", pop: 3959353, taxpayers: 1700000, fedEmployees: 32000 },
  { state: "Connecticut", abbr: "CT", pop: 3605944, taxpayers: 1800000, fedEmployees: 8000 },
  { state: "Utah", abbr: "UT", pop: 3271616, taxpayers: 1400000, fedEmployees: 22000 },
  { state: "Iowa", abbr: "IA", pop: 3193079, taxpayers: 1500000, fedEmployees: 8000 },
  { state: "Nevada", abbr: "NV", pop: 3104614, taxpayers: 1400000, fedEmployees: 12000 },
  { state: "Arkansas", abbr: "AR", pop: 3011524, taxpayers: 1300000, fedEmployees: 12000 },
  { state: "Mississippi", abbr: "MS", pop: 2961279, taxpayers: 1200000, fedEmployees: 18000 },
  { state: "Kansas", abbr: "KS", pop: 2937880, taxpayers: 1300000, fedEmployees: 11000 },
  { state: "New Mexico", abbr: "NM", pop: 2117522, taxpayers: 900000, fedEmployees: 23000 },
  { state: "Nebraska", abbr: "NE", pop: 1961504, taxpayers: 900000, fedEmployees: 6000 },
  { state: "West Virginia", abbr: "WV", pop: 1793716, taxpayers: 750000, fedEmployees: 8000 },
  { state: "Idaho", abbr: "ID", pop: 1839106, taxpayers: 800000, fedEmployees: 6000 },
  { state: "Hawaii", abbr: "HI", pop: 1455271, taxpayers: 650000, fedEmployees: 29000 },
  { state: "New Hampshire", abbr: "NH", pop: 1377529, taxpayers: 700000, fedEmployees: 3000 },
  { state: "Maine", abbr: "ME", pop: 1395722, taxpayers: 650000, fedEmployees: 4000 },
  { state: "Montana", abbr: "MT", pop: 1084225, taxpayers: 500000, fedEmployees: 8000 },
  { state: "Rhode Island", abbr: "RI", pop: 1097379, taxpayers: 520000, fedEmployees: 3000 },
  { state: "Delaware", abbr: "DE", pop: 989948, taxpayers: 470000, fedEmployees: 3000 },
  { state: "South Dakota", abbr: "SD", pop: 886667, taxpayers: 400000, fedEmployees: 4000 },
  { state: "North Dakota", abbr: "ND", pop: 779094, taxpayers: 370000, fedEmployees: 3000 },
  { state: "Alaska", abbr: "AK", pop: 733391, taxpayers: 350000, fedEmployees: 14000 },
  { state: "Vermont", abbr: "VT", pop: 643077, taxpayers: 320000, fedEmployees: 2000 },
  { state: "Wyoming", abbr: "WY", pop: 576851, taxpayers: 280000, fedEmployees: 6000 },
  { state: "Washington DC", abbr: "DC", pop: 689545, taxpayers: 400000, fedEmployees: 189000 }
];

const DOGE_CLAIMED_SAVINGS = 2000000000000; // $2 trillion
const TOTAL_US_TAXPAYERS = 157000000;
const AVERAGE_HOUSEHOLD_SIZE = 2.5;

export function TaxpayerImpactClient() {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [realismSlider, setRealismSlider] = useState(10); // % of claimed savings that's real

  const calculations = useMemo(() => {
    if (!selectedState) return null;

    const claimedSavingsPerTaxpayer = DOGE_CLAIMED_SAVINGS / TOTAL_US_TAXPAYERS;
    const claimedSavingsPerHousehold = claimedSavingsPerTaxpayer * AVERAGE_HOUSEHOLD_SIZE;
    
    const realSavingsPerTaxpayer = claimedSavingsPerTaxpayer * (realismSlider / 100);
    const realSavingsPerHousehold = claimedSavingsPerHousehold * (realismSlider / 100);

    // State-specific calculations
    const stateSavingsPerTaxpayer = (DOGE_CLAIMED_SAVINGS * (realismSlider / 100)) / selectedState.taxpayers;
    const fedEmployeeDensity = (selectedState.fedEmployees / selectedState.pop) * 1000; // per 1000 residents

    return {
      claimedSavingsPerTaxpayer,
      claimedSavingsPerHousehold,
      realSavingsPerTaxpayer,
      realSavingsPerHousehold,
      stateSavingsPerTaxpayer,
      fedEmployeeDensity
    };
  }, [selectedState, realismSlider]);

  // Chart data for comparison across states
  const chartData = useMemo(() => {
    return stateData
      .map(state => ({
        name: state.abbr,
        value: Math.round((DOGE_CLAIMED_SAVINGS * (realismSlider / 100)) / state.taxpayers),
        fullName: state.state,
        taxpayers: state.taxpayers
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15); // Top 15 states
  }, [realismSlider]);

  return (
    <div className="space-y-8">
      {/* State Selector */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-4">
          Select Your State
        </h2>
        <select
          value={selectedState?.abbr || ''}
          onChange={(e) => {
            const state = stateData.find(s => s.abbr === e.target.value);
            setSelectedState(state || null);
          }}
          className="w-full max-w-md px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        >
          <option value="">Choose a state...</option>
          {stateData.map(state => (
            <option key={state.abbr} value={state.abbr}>
              {state.state}
            </option>
          ))}
        </select>
      </div>

      {/* Realism Slider */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-4">
          Reality Check: What % of DOGE claims will actually happen?
        </h2>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="100"
            value={realismSlider}
            onChange={(e) => setRealismSlider(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>0% (Pure politics)</span>
            <span className="font-medium text-lg text-slate-900 dark:text-white">
              {realismSlider}%
            </span>
            <span>100% (Total belief)</span>
          </div>
        </div>
      </div>

      {/* Results */}
      {selectedState && calculations && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="DOGE Claims"
              value={formatSalary(calculations.claimedSavingsPerTaxpayer)}
              sub="per taxpayer annually"
            />
            <StatCard
              label="Realistic Estimate"
              value={formatSalary(calculations.realSavingsPerTaxpayer)}
              sub={`at ${realismSlider}% realization`}
            />
            <StatCard
              label="Per Household"
              value={formatSalary(calculations.realSavingsPerHousehold)}
              sub={`${AVERAGE_HOUSEHOLD_SIZE} taxpayers avg`}
            />
            <StatCard
              label="Fed Employee Density"
              value={calculations.fedEmployeeDensity.toFixed(1)}
              sub={`per 1,000 ${selectedState.state} residents`}
            />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-4">
              {selectedState.state} Impact Analysis
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">If DOGE Delivers 100%:</h4>
                  <p className="text-2xl font-bold text-green-600">{formatSalary(calculations.claimedSavingsPerTaxpayer)}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">per taxpayer per year</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">More Realistic ({realismSlider}%):</h4>
                  <p className="text-2xl font-bold text-indigo-600">{formatSalary(calculations.realSavingsPerTaxpayer)}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">per taxpayer per year</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <p><span className="font-medium">Population:</span> {formatNumber(selectedState.pop)}</p>
                <p><span className="font-medium">Taxpayers:</span> {formatNumber(selectedState.taxpayers)}</p>
                <p><span className="font-medium">Federal Employees:</span> {formatNumber(selectedState.fedEmployees)}</p>
                <p><span className="font-medium">Fed Employee %:</span> {((selectedState.fedEmployees / selectedState.pop) * 100).toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* State Comparison Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-4">
          Taxpayer Savings by State (Top 15)
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          At {realismSlider}% of DOGE's claimed savings
        </p>
        <SimpleBarChart 
          data={chartData}
          nameKey="name"
          dataKey="value"
        />
      </div>

      {/* Methodology */}
      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-4">
          How We Calculate This
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <p>• DOGE claims $2 trillion in savings over time</p>
          <p>• Divided by ~157 million U.S. taxpayers</p>
          <p>• State data includes 2024 population and federal employee estimates</p>
          <p>• "Reality slider" adjusts for political feasibility and implementation challenges</p>
          <p>• Historical context: Most government efficiency efforts achieve 10-20% of claimed savings</p>
        </div>
      </div>
    </div>
  );
}